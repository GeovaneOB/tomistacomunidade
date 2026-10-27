# Comunidade Tomista — Guia de Estilo
### Redesign de UI/UX · paleta original 100% preservada

---

## 1. O que mudou e por quê

O site já tinha bons fundamentos (tokens de espaçamento, sombras suaves, paleta consistente). O trabalho aqui foi de **sistema e hierarquia**, não de reinvenção de marca:

| Antes | Depois | Motivo |
|---|---|---|
| `:root` duplicado em 4 arquivos CSS | `tokens.css` único, importado por todos | Uma mudança de marca agora se propaga para o site inteiro. Elimina ~600 linhas duplicadas. |
| Corpo em Montserrat | Corpo em **Inter** | Tipografia premium solicitada — Inter tem melhor renderização em telas de alta densidade e uma família de pesos mais consistente para produto/institucional. Cormorant Garamond permanece como face de destaque. |
| Hero centralizado | Hero **assimétrico**, alinhado à esquerda | Layout centralizado é o "padrão de template". Assimetria com respiro à direita cria uma composição mais editorial e deliberada. |
| Cartões de conteúdo genéricos | Cartões com **marginália dourada** (`data-mark`) | Assinatura visual do site: um traço e uma marca à esquerda do texto evocam a glosa marginal dos manuscritos escolásticos — prática real da tradição que a Comunidade estuda. Não é decoração aleatória; é uma referência ao próprio objeto de estudo. |
| Barra dourada sólida de 4px sob o menu | Traço de 2px com gradiente esmaecido nas pontas | O traço sólido lia como um sublinhado escolar. O gradiente tem o mesmo peso de marca, com mais refinamento. |
| Navbar opaca | Navbar com `backdrop-filter: blur()` | Sensação de vitrine/produto atual sem alterar a cor de fundo. |
| Ícones sem `alt` | `alt` descritivo em todos os ícones | Acessibilidade — leitores de tela. |
| Numeração ausente nos módulos de Educação/Sobre | Algarismos romanos (I, II, III…) | **Só foi adicionada onde a ordem é real**: o programa de Educação segue uma sequência pedagógica (crise → retorno ao método → Trivium → Quadrivium → princípio de Tomás → divisão das disciplinas). Numerar reforça essa lógica em vez de decorar. |

---

## 2. Paleta — inalterada

| Token | Hex | Papel |
|---|---|---|
| `--color-cream` | `#fffbef` | Superfície clara / texto sobre fundo escuro |
| `--color-gold` | `#C9A24D` | Assinatura da marca — CTAs, acentos, marginália |
| `--color-ink` | `#1C1C1C` | Superfície escura principal / texto primário |
| `--color-charcoal` | `#282828` | Superfície escura secundária (rodapé, faixas) |
| `--color-white` | `#ffffff` | Superfície de cartão |
| `--color-gray` | `#777777` | Texto auxiliar, placeholders |
| `--color-error` | `#b23b3b` | Validação e alertas |

Todos os tons derivados (`--gold-08`, `--ink-12` etc.) são os mesmos hex acima, apenas com opacidade — nenhuma cor nova foi introduzida.

## 3. Tipografia

- **Display** — Cormorant Garamond, 500–700, usada apenas em títulos e citações. Itálico reservado para autoridade (citações, rubrica de seção).
- **Corpo** — Inter, 400–700, usada em navegação, parágrafos, formulários e UI.
- **Escala** (base 8px, proporção ~1.25, com `clamp()` nos extremos para fluidez em qualquer viewport):
  `12 · 14 · 16 · 18 · 22 · 28–36 · 36–52 · 44–64`

## 4. Espaçamento, forma e elevação

- Escala de espaçamento em base 8px, de `--space-1` (8px) a `--space-16` (128px) — mantida do sistema original e estendida.
- Raios: `6 / 12 / 20px` + pílula.
- Sombras em 5 níveis (`xs → lg`) mais duas variantes douradas para elementos de destaque (CTAs, hover de ícones sociais).

## 5. Componentes reutilizáveis

- **`.button-link` / `.btn-ct`** — botão único do site, preenchido (dourado) ou contorno.
- **`.paragrafos[data-mark]`** — cartão de conteúdo com marginália dourada; o atributo `data-mark` injeta o algarismo romano via `content: attr(data-mark)`.
- **`.eyebrow`** — rótulo pequeno, dourado, versalete, usado no topo de cada hero/banner para dar contexto antes do título.
- **Navbar / rodapé** — únicos, compartilhados por todas as páginas via `tokens.css`.

## 6. Arquivos entregues

```
tokens.css        → sistema de design compartilhado (importar sempre primeiro)
style.css         → específico da Home
sobre.css         → específico de Sobre
educacao.css      → específico de Educação
index.html        → Home (hero assimétrico, acessos rápidos, newsletter)
sobre.html        → Sobre (4 cartões numerados + colaboradores)
educacao.html     → Educação (6 cartões numerados — Trivium/Quadrivium)
blog.html         → tokens tipográficos alinhados (Inter/Cormorant);
                    herda o restante do sistema via style.css
```

> **Sobre o blog.html:** é um arquivo mais complexo (painel de administrador, modais de login/cadastro, ~1200 linhas de JS/CSS embutido). Alinhei sua tipografia ao novo sistema — como ele já importa `style.css`, herda automaticamente a fonte Inter e os tokens de cor. Se quiser, posso fazer uma segunda passada dedicada só a essa página para aplicar a mesma linguagem de cartões e marginália aos posts e ao painel administrativo.

## 7. Como aplicar

1. Coloque `tokens.css` na mesma pasta dos outros CSS.
2. Os arquivos `style.css`, `sobre.css` e `educacao.css` já têm `@import url("tokens.css");` na primeira linha — nada mais a fazer.
3. HTML: `index.html`, `sobre.html` e `educacao.html` têm pequenas adições (`<span class="eyebrow">`, `data-mark="I"` etc.) — copie-os por cima dos originais.
