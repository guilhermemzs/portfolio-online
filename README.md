# Portfólio — Guilherme Menezes Pereira

Site portfólio profissional, moderno e responsivo, desenvolvido para apresentar minha trajetória acadêmica, profissional e pessoal de forma clara, elegante e objetiva.

O projeto reúne informações sobre minha formação em **Engenharia Civil pela Universidade FUMEC**, minha atuação como **professor de inglês**, minhas experiências em **coordenação pedagógica e logística na Help School** e minha base técnica em **Informática pelo COTEMIG**.

## Visão geral

Este portfólio foi criado como uma página única, com navegação fluida entre seções, design responsivo, modo claro/escuro e foco em apresentar minhas experiências, habilidades e projetos de maneira profissional.

O site não utiliza frameworks ou ferramentas de build, sendo construído apenas com **HTML5**, **CSS3** e **JavaScript puro**, o que torna o projeto simples, leve e fácil de hospedar.

## Seções do site

O portfólio é dividido nas seguintes seções:

* **Início:** apresentação principal com chamada profissional.
* **Sobre:** resumo da minha trajetória e principais características.
* **Experiência:** linha do tempo com vivências profissionais relevantes.
* **Formação:** histórico acadêmico e técnico.
* **Projetos:** trabalhos, iniciativas e projetos desenvolvidos.
* **Habilidades:** competências técnicas, interpessoais e profissionais.
* **Diferenciais:** pontos que destacam minha atuação e perfil.
* **Contato:** formulário e links para redes profissionais.

## Estrutura do projeto

```bash
portfolio/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
│
└── assets/
    └── images/
        └── LEIA-ME.md
```

### Descrição dos arquivos

| Arquivo/Pasta              | Descrição                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `index.html`               | Página principal do portfólio, contendo todas as seções do site.                                 |
| `css/style.css`            | Arquivo de estilos, incluindo layout, responsividade e temas claro/escuro.                       |
| `js/script.js`             | Funcionalidades do site, como troca de tema, menu mobile, animações, formulário e links sociais. |
| `assets/images/`           | Pasta destinada às imagens utilizadas no portfólio.                                              |
| `assets/images/LEIA-ME.md` | Orientações sobre os nomes e formatos das imagens esperadas pelo site.                           |

## Funcionalidades

* Layout moderno e responsivo.
* Página única com navegação por seções.
* Modo claro e escuro.
* Preferência de tema salva no navegador.
* Menu adaptado para dispositivos móveis.
* Animações suaves ao rolar a página.
* Formulário de contato.
* Área para links sociais, como LinkedIn, GitHub e WhatsApp.
* Fallback visual para imagens ainda não adicionadas.
* Estrutura simples, sem necessidade de instalação ou build.

## Tecnologias utilizadas

* **HTML5**
* **CSS3**

  * Variáveis CSS
  * Grid Layout
  * Flexbox
  * `color-mix`
  * Responsividade
* **JavaScript puro**

  * Manipulação do DOM
  * Local Storage
  * IntersectionObserver

## Como executar localmente

Para visualizar o projeto localmente, basta abrir o arquivo `index.html` diretamente no navegador.

Também é possível utilizar uma extensão como **Live Server** no Visual Studio Code para uma experiência melhor durante a edição.

```bash
# Opção simples
Abra o arquivo index.html no navegador

# Opção recomendada no VS Code
Clique com o botão direito em index.html
Selecione "Open with Live Server"
```

## Como publicar no GitHub Pages

1. Envie os arquivos do projeto para um repositório no GitHub.
2. Acesse as configurações do repositório.
3. Vá até **Settings → Pages**.
4. Em **Source**, selecione **Deploy from a branch**.
5. Escolha a branch `main`.
6. Selecione a pasta `/root`.
7. Salve as alterações.
8. Aguarde alguns instantes até o GitHub gerar o link do site.

Após a publicação, o portfólio ficará disponível em um endereço semelhante a:

```text
https://seu-usuario.github.io/nome-do-repositorio/
```

## Personalização

### Alterar imagens

As imagens devem ser adicionadas na pasta:

```bash
assets/images/
```

Consulte o arquivo `assets/images/LEIA-ME.md` para verificar os nomes recomendados para cada imagem.

Enquanto as imagens não forem adicionadas, o site exibirá um fallback visual elegante.

### Alterar links sociais

Os links sociais podem ser editados no início do arquivo:

```bash
js/script.js
```

Procure pela constante:

```javascript
const SOCIAL_LINKS = {
  linkedin: "",
  github: "",
  whatsapp: ""
};
```

Substitua os valores vazios pelas URLs correspondentes.

### Adicionar currículo em PDF

Para adicionar um currículo em PDF ao site:

1. Coloque o arquivo dentro da pasta `assets/`.
2. Nomeie o arquivo como `curriculo.pdf`.
3. Adicione um botão no hero ou em outra seção desejada.

Exemplo:

```html
<a href="assets/curriculo.pdf" class="btn btn--outline" download>
  Baixar currículo
</a>
```

## Melhorias futuras

Algumas melhorias planejadas ou possíveis para versões futuras:

* Adicionar currículo em PDF para download.
* Incluir versão em inglês do portfólio.
* Criar uma página específica para projetos.
* Melhorar a integração do formulário de contato.
* Adicionar animações mais avançadas.
* Otimizar SEO para melhorar a presença em buscas pelo nome “Guilherme Menezes”.
* Incluir metatags para compartilhamento em redes sociais.
* Adicionar favicon personalizado.
* Publicar uma versão com domínio próprio.

## Objetivo do projeto

O principal objetivo deste portfólio é apresentar minha identidade profissional de forma acessível, moderna e organizada, conectando minhas experiências em educação, tecnologia, gestão e engenharia civil.

Além de servir como uma vitrine profissional, o projeto também demonstra minha capacidade de estruturar, personalizar e publicar uma aplicação web simples, funcional e responsiva.

## Autor

**Guilherme Menezes Pereira**

Estudante de Engenharia Civil na Universidade FUMEC, professor de inglês na Help School, coordenador pedagógico/logístico e técnico em Informática pelo COTEMIG.

## Licença

Este projeto é de uso pessoal e profissional.
Caso deseje reutilizar alguma parte da estrutura, recomenda-se dar os devidos créditos ao autor.
