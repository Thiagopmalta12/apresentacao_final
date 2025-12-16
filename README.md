# 🗂️ SGCPD – Sistema de Gerenciamento de Conteúdo Pessoal Dinâmico (Kanban de Tarefas)

## 📘 Descrição do Projeto
O **SGCPD (Sistema de Gerenciamento de Conteúdo Pessoal Dinâmico)** é uma aplicação web desenvolvida como **projeto final da disciplina de Desenvolvimento Front-End**, sob orientação do Prof. Msc. **Reinaldo de Souza Júnior**.

O sistema foi inspirado em ferramentas como **Trello** e **Monday**, com o objetivo de **organizar tarefas e acompanhar o andamento de cada atividade** de forma visual, prática e intuitiva.

A aplicação permite **criar tarefas, atribuir responsáveis, definir prazos e status de execução**, além de possibilitar a **adição de colunas personalizadas** conforme a necessidade do usuário.

---

## 🎯 Objetivo
Facilitar a **organização de tarefas pessoais ou de equipe**, permitindo ao usuário:
- Controlar o status de execução de cada atividade;
- Personalizar colunas e categorias;
- Acompanhar prazos e responsáveis;
- Manter um fluxo de trabalho visual e dinâmico.

---

## 🧩 Funcionalidades Principais
✅ **Adicionar novas tarefas** com título, descrição, responsável e data;  
✅ **Mover tarefas** entre colunas conforme o status:  
   - *Backlog* (A fazer)  
   - *Em Execução* (Em andamento)  
   - *Em QA* (Testes e validações)  
   - *Pronto para Deploy* (Finalizadas)  
✅ **Criar novas colunas personalizadas**, como “Hypercare” ou “Manutenção”;  
✅ **Editar ou excluir tarefas**;  
✅ **Limpar todas as tarefas de uma só vez**;  
✅ **Design responsivo e intuitivo**, adaptado para desktop e mobile;  
✅ **Armazenamento local (LocalStorage)**, garantindo que as tarefas permaneçam salvas no navegador.

---

## 🧠 Requisitos Funcionais (Do Edital)
- [x] CRUD de Usuário  
- [x] CRUD de Conteúdo (tarefas)  
- [x] Categorização / Tags  
- [x] Filtragem e Organização por Status  
- [x] Interface Amigável e Responsiva  

---

## ⚙️ Tecnologias Utilizadas
| Tecnologia | Descrição |
|-------------|------------|
| **HTML5** | Estrutura da aplicação e semântica do conteúdo |
| **CSS3** | Estilização e design responsivo (Mobile First) |
| **JavaScript (ES6+)** | Lógica do sistema, manipulação do DOM e armazenamento |
| **LocalStorage** | Persistência temporária dos dados do usuário |

---

## 📁 Estrutura de Pastas
📦 sgcpd-kanban/
┣ 📂 assets/
┃ ┣ 📂 css/
┃ ┃ ┗ 📄 style.css
┃ ┣ 📂 js/
┃ ┃ ┗ 📄 script.js
┃ ┗ 📂 img/
┣ 📄 index.html
┣ 📄 README.md
┗ 📄 LICENSE (opcional)

yaml
Copiar código

---

## 🚀 Como Executar o Projeto
1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/thiagomalta/sgcpd-kanban.git
Acessar a pasta do projeto:

bash
Copiar código
cd sgcpd-kanban
Executar a aplicação:

Abra o arquivo index.html diretamente no navegador, ou

Utilize uma extensão de servidor local, como Live Server (VS Code).

💻 Demonstração (Passos Sugeridos)
Criar uma nova tarefa preenchendo título, responsável e data;

Mover a tarefa entre colunas conforme o progresso;

Criar uma nova coluna chamada “Hypercare”;

Limpar todas as tarefas com o botão Limpar Tudo;

Visualizar o layout em diferentes tamanhos de tela (desktop e mobile).

🧮 Critérios de Avaliação (Edital)
Critério	Peso	Implementação
Funcionalidade	50%	CRUD completo e colunas dinâmicas
Design e Usabilidade (UX)	20%	Interface semelhante ao Trello
Responsividade	20%	Layout adaptável a diferentes dispositivos
Documentação (README)	10%	Instruções claras e detalhadas



Versão do Projeto: 1.0

📄 Licença
Este projeto é de uso educacional e foi desenvolvido exclusivamente para fins acadêmicos.
Sinta-se livre para reutilizar e aprimorar o código, dando os devidos créditos ao autor.







