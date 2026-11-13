# Portfólio de Guilherme Menezes Pereira

Portfólio estático em português e inglês. Projetos reúne o sistema de escala de aulas da Help School, a apresentação sobre acessibilidade e a visita à usina da BR-040. Sobre apresenta trajetória, formação e experiência.

## Prévia local

No Windows, execute na pasta do projeto:

```powershell
.\iniciar-previa.ps1
```

Abra [a prévia local](http://127.0.0.1:4173/). O script usa o Python do Codex ou uma instalação local do Python 3. Em outros sistemas, execute `python3 -m http.server 4173 --bind 127.0.0.1`. Sirva o projeto pela raiz para que os links absolutos e o aplicativo de demonstração funcionem.

## Páginas e arquivos

- A página inicial e `en/` apresentam os projetos. Cada trabalho tem uma página em `projetos/` e outra em `en/projects/`.
- `sobre/` e `en/about/` contêm experiência, formação, competências e contato.
- `artigos/` e `en/articles/` mantêm os textos e as referências. Os nove textos acrescentados ao acervo inglês são edições condensadas com acesso ao original integral.
- `certificados/` e `en/certificates/` reúnem PDFs, insígnias e links de verificação.
- `demo-escala/` contém a demonstração com dados fictícios locais. O acesso inglês passa por `en/schedule-demo/`.
- O visual compartilhado está em `css/portfolio.css`, os comportamentos em `js/portfolio.js` e as imagens e fontes em `assets/`.

## Recuperar a versão anterior

Na pasta deste repositório, o comando abaixo abre a versão anterior em uma pasta irmã independente.

```powershell
git worktree add --detach ../portfolio-anterior portfolio-antes-perry
```

## Autor

Guilherme Menezes Pereira, estudante de Engenharia Civil na FUMEC, professor de inglês e coordenador pedagógico na Help School, com formação técnica em Informática pelo COTEMIG.

## Licença

Este projeto é de uso pessoal e profissional. Caso deseje reutilizar alguma parte da estrutura, recomenda-se dar os devidos créditos ao autor. As licenças das fontes estão em `assets/fonts/`.
