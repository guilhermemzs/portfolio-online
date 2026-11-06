# Publicação de artigos

O portfólio é estático (HTML, CSS e JavaScript), sem CMS ou etapa de build. A produção usa o repositório `guilhermemzs/portfolio-online`, branch `main`, e o projeto Vercel `portfolio-online`. O domínio oficial é https://guilhermemenezespereira.com/.

## Regras editoriais

- Uma nova edição por domingo. Conferir o catálogo e evitar duplicidades antes de pesquisar.
- Texto original e desenvolvido, com fontes primárias verificadas, referências e links. Escolher extensão conforme a complexidade; a primeira série tem cerca de 1.500–1.650 palavras por artigo.
- Não inventar experiências, certificados, medições ou resultados do autor. Exemplos didáticos devem ser identificados como hipotéticos.
- Preservar as quatro publicações anteriores e o estilo existente. Usar os componentes de artigo em `css/style.css`, com navegação, sumário, corpo, referências e rodapé.
- Publicar conteúdos em português. Só anunciar uma tradução e definir `hreflang` equivalente se a página traduzida realmente existir.

## Datas e rastreabilidade

`editorialDate` é a referência da edição dominical. `publishedAt`, `datePublished`, `article:published_time` e a indicação visível “Publicado em” registram a publicação real. Nunca preencher esses campos com uma data retroativa apenas para ajustar o calendário. `dateModified` e o `lastmod` do sitemap refletem a alteração real. A primeira regularização cobre 06/09 a 01/11/2026 e identifica separadamente as duas datas em cada página e cartão.

Fontes usadas na regularização devem ter versões anteriores à data editorial. A pesquisa e redação foram realizadas na publicação real, como explicado nas páginas. Nas novas edições, conferir novamente normas e documentos sujeitos a atualização.

O arquivo `artigos/editorial-manifest.json` registra os nove artigos iniciais, seus metadados, referências, capas, datas e contagens. A leitura usa aproximadamente 210 palavras por minuto. O arquivo é um registro editorial, não um CMS; alterações nele não regeneram as páginas automaticamente.

## Fluxo de edição e publicação

1. Buscar o estado atual de `main`; não sobrescrever trabalho concorrente. Confirmar o domínio e o projeto Vercel.
2. Pesquisar, redigir e revisar o artigo. Incluir título, descrição, categoria, slug, fontes, data editorial e publicação real.
3. Criar `artigos/<slug>/index.html` usando um dos artigos da série como modelo. Manter o CSS e o JavaScript compartilhados. Incluir canonical, Open Graph, Twitter Card e BlogPosting JSON-LD com datas reais. Não usar metadados de tradução inexistente.
4. Adicionar a capa original em `assets/articles/images/`, com texto alternativo. As capas da série são diagramas conceituais próprios, não fotografias de experiências do autor.
5. Inserir o cartão em `artigos/index.html`, em ordem decrescente de data editorial; atualizar o total. Atualizar somente o destaque da seção `#artigos` na home. Acrescentar a URL ao sitemap com `lastmod` real e manter o manifesto consistente.
6. Verificar página e capa, âncoras do sumário, fontes, responsividade, menu móvel, tema escuro, canonical e datas estruturadas. Conferir que páginas anteriores e demais seções não foram alteradas.
7. Publicar pela integração GitHub–Vercel existente. Atualizar a branch com verificação do SHA anterior, preservando mudanças concorrentes. Aguardar READY e conferir cada nova URL no domínio oficial.
8. Registrar commit, implantação, data e resultado. Se faltar acesso, entregar o texto completo e identificar a pendência, sem afirmar que foi publicado.

## Próximas edições propostas

| Data | Tema |
|---|---|
| 08/11/2026 | Água em edificações: demanda, conservação e limites do reúso |
| 15/11/2026 | Resíduos de construção: prevenção, segregação e rastreabilidade |
| 22/11/2026 | Sensores na engenharia: calibração, incerteza e qualidade dos dados |
| 29/11/2026 | Orçamento de obras: quantitativos, premissas e análise de sensibilidade |
| 06/12/2026 | Inspeções e manutenção: organizar evidências antes de propor intervenções |
| 13/12/2026 | Coordenação de projetos: comunicar interfaces e administrar alterações |
| 20/12/2026 | Gestão do conhecimento: documentação e passagem de responsabilidades |
| 27/12/2026 | Revisão acadêmica do ano: avaliar aprendizados com evidências e planejar 2027 |

Os temas podem ser ajustados conforme o acervo, fontes disponíveis e novos fatos documentados. A edição de revisão anual não deve inventar atividades, notas ou conquistas.
