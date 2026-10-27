import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Domínio público do site — usado para montar as URLs de retorno.
const SITE_URL = "https://comunidadetomista.com";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { amount, donor_name, donor_email } = await req.json();

        const parsedAmount = Number(amount);
        if (!parsedAmount || parsedAmount < 5) {
            return new Response(
                JSON.stringify({ error: "Valor inválido." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 1) Registra a contribuição como "pending" antes de ir ao Mercado Pago
        const { data: contribution, error: insertError } = await sb
            .from("contributions")
            .insert({
                amount: parsedAmount,
                donor_name: donor_name ?? null,
                donor_email: donor_email ?? null,
                status: "pending",
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // 2) Cria a preferência no Mercado Pago (Checkout Pro)
            const preferenceBody = {
        items: [
            {
                title: "Contribuição para a Comunidade Tomista",
                quantity: 1,
                unit_price: parsedAmount,
                currency_id: "BRL",
            },
        ],
        payer: {
            name: donor_name ?? undefined,
            email: donor_email ?? undefined,
        },
        // Garante que Pix, cartão e boleto fiquem todos disponíveis no checkout
        payment_methods: {
            excluded_payment_types: [],
            excluded_payment_methods: [],
            installments: 1,
        },
        back_urls: {
            success: `${SITE_URL}/contribua.html?status=approved`,
            pending: `${SITE_URL}/contribua.html?status=pending`,
            failure: `${SITE_URL}/contribua.html?status=failure`,
        },
        auto_return: "approved",
        external_reference: contribution.id,
        notification_url: `${SUPABASE_URL}/functions/v1/mp-webhook`,
        };

        const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(preferenceBody),
        });

        const mpData = await mpResponse.json();

        if (!mpResponse.ok) {
            console.error("Erro Mercado Pago:", mpData);
            return new Response(
                JSON.stringify({ error: "Não foi possível criar o pagamento." }),
                { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // 3) Guarda o id da preferência para conciliar depois via webhook
        await sb
            .from("contributions")
            .update({ mp_preference_id: mpData.id })
            .eq("id", contribution.id);

        return new Response(
            JSON.stringify({ init_point: mpData.init_point, preference_id: mpData.id }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: "Erro inesperado ao criar o pagamento." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});