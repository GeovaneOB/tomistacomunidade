import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
        const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

        const paymentId = body?.data?.id ?? url.searchParams.get("id");

        if (topic !== "payment" && body?.type !== "payment") {
            return new Response("ignored", { status: 200 });
        }
        if (!paymentId) {
            return new Response("no payment id", { status: 200 });
        }

        // Busca os dados reais e confiáveis do pagamento na API do Mercado Pago
        const paymentResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
        });
        const payment = await paymentResp.json();

        if (!paymentResp.ok) {
            console.error("Erro ao consultar pagamento:", payment);
            return new Response("error fetching payment", { status: 200 });
        }

        const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        await sb
            .from("contributions")
            .update({
                status: payment.status, // approved | pending | rejected | ...
                mp_payment_id: String(payment.id),
                raw_payload: payment,
            })
            .eq("id", payment.external_reference);

        return new Response("ok", { status: 200 });
    } catch (err) {
        console.error(err);
        // Sempre responder 200 para o Mercado Pago não ficar reenviando em loop
        return new Response("error handled", { status: 200 });
    }
});