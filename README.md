# MultiKids — Projeto de Extensão (Faculdade Descomplica)

**MultiKids** é um sistema web desenvolvido como projeto de extensão da **Faculdade Descomplica**. A aplicação foi criada para apoiar profissionais que trabalham com o desenvolvimento infantil (terapeutas, psicólogos, educadores) na Serviço de Terapia Ocupacional Andrielly SS LTDA, utilizando a aplicação do protocolo PORTAGE, registro de avaliações, acompanhamento histórico e geração de relatórios e planos de intervenção.

## Objetivo

- Fornecer uma ferramenta prática e acessível para registro e acompanhamento do desenvolvimento infantil.
- Permitir avaliações por categorias (ex.: Linguagem, Motor, Autocuidado, Social, Cognição) e por faixas etárias.
- Gerar relatórios comparativos com padrões PORTAGE e sugerir metas e ações de intervenção.

## Público-alvo

- Terapeutas ocupacionais, fonoaudiólogos, psicólogos, educadores e estudantes envolvidos em práticas de saúde e educação infantil.

## Principais funcionalidades

- Cadastro de crianças e armazenamento local das avaliações (localStorage).
- Realização de avaliações por categoria e faixa etária com codificação de respostas (Sim/Às vezes/Não).
- Dashboard com estatísticas e histórico de avaliações.
- Geração de relatórios (visão geral, progresso, detalhado e metas) e exportação para PDF.
- Visualizações gráficas para acompanhamento (barras, linhas, radar).

## Tecnologias

- Frontend: React (Create React App)
- Bibliotecas: Chart.js (via react-chartjs-2), jsPDF, react-router-dom, react-icons
- Armazenamento local: `localStorage`
- Build: webpack (via CRA)

## Como usar

- Na primeira execução, informe seu nome como terapeuta na tela inicial para acessar o painel.
- Cadastre as crianças com nome, idade e observações.
- Realize avaliações por categoria/faixa etária e salve as respostas.
- Acesse o relatório de cada criança para visualizar performance, gráficos e recomendações.

## Estrutura de dados (resumo)

- Criança: `{ id, name, age, notes, evaluations: [...] }`
- Avaliação: `{ id, date, category, ageRange, answers: { questionId: score } }`
- Score: `Sim` = 2, `Às vezes` = 1, `Não` = 0


## Personalização e identidade visual

- Projeto rebrandado como **MultiKids** para o escopo do trabalho de extensão.
- Cores, logo e background foram adicionados ao frontend (arquivo `public/logo_multikids.png` e `public/multikids-background.jpg`).

## Considerações éticas e privacidade

- Este protótipo armazena dados localmente. Ao utilizar dados reais de crianças, respeite as normas éticas da instituição, termos de consentimento dos responsáveis e legislações de proteção de dados aplicáveis.