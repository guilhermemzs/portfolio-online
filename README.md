# Portfólio — Guilherme Menezes Pereira

Site portfólio profissional, moderno e responsivo, apresentando trajetória acadêmica,
profissional e pessoal — Engenharia Civil (FUMEC), ensino de inglês e coordenação
pedagógica/logística (Help School) e formação técnica em Informática (COTEMIG).

## Estrutura

```
index.html          → Página única com todas as seções
css/style.css       → Estilos, temas claro/escuro e responsividade
js/script.js        → Tema, menu mobile, animações, formulário e links sociais
assets/images/      → Fotos do site (ver LEIA-ME.md dentro da pasta)
```

## Seções

Início (hero) · Sobre · Experiência (linha do tempo) · Formação · Projetos ·
Habilidades · Diferenciais · Contato (com formulário).

## Como usar

1. **Abrir localmente:** basta abrir `index.html` no navegador — não há build.
2. **Publicar no GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.

## Personalização

- **Fotos:** coloque os arquivos em `assets/images/` com os nomes indicados em
  [`assets/images/LEIA-ME.md`](assets/images/LEIA-ME.md). O site exibe um fallback
  elegante enquanto as fotos não existirem.
- **Links sociais (LinkedIn, GitHub, WhatsApp):** edite as URLs na constante
  `SOCIAL_LINKS`, no início de `js/script.js`.
- **Currículo em PDF (futuro):** adicione o arquivo em `assets/` e crie um botão no
  hero, por exemplo: `<a href="assets/curriculo.pdf" class="btn btn--outline" download>Baixar currículo</a>`.

## Tecnologias

HTML5, CSS3 (variáveis, grid, `color-mix`) e JavaScript puro (IntersectionObserver
para animações ao rolar). Modo claro/escuro com preferência salva no navegador.
