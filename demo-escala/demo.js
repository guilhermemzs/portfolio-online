/* ============================================================
   DEMONSTRAÇÃO — Help School · Sistema de Gestão
   Todos os dados abaixo são FICTÍCIOS, criados apenas para
   ilustrar a interface. Nenhuma informação real da escola,
   de alunos ou de professores está presente neste código.
============================================================ */

// Aulas fictícias do dia (espelham a estrutura usada no sistema real)
const LESSONS = [
  { time: "08:00", end: "09:00", code: "ING-A1", students: "Aluno Exemplo 1", teacher: "Prof. Fictício A", modality: "ONLINE", status: "CONFIRMADA", fixed: true },
  { time: "09:00", end: "10:00", code: "ING-B2", students: "Aluno Exemplo 2 e Aluno Exemplo 3", teacher: "Prof. Fictício B", modality: "PRESENCIAL", status: "CONFIRMADA", fixed: true },
  { time: "10:00", end: "11:00", code: "ING-A2", students: "Aluno Exemplo 4", teacher: "Prof. Fictício A", modality: "PRESENCIAL", status: "PENDENTE", fixed: false },
  { time: "11:00", end: "12:00", code: "EXP-01", students: "Aluno Experimental", teacher: "Prof. Fictício C", modality: "ONLINE", status: "CONFIRMADA", fixed: false },
  { time: "14:00", end: "15:00", code: "ING-C1", students: "Aluno Exemplo 5", teacher: null, modality: "PRESENCIAL", status: "PENDENTE", fixed: true },
  { time: "15:00", end: "16:00", code: "ING-B1", students: "Aluno Exemplo 6", teacher: "Prof. Fictício B", modality: "DOMICILIO", status: "CONFIRMADA", fixed: false },
  { time: "17:30", end: "18:30", code: "ING-A1", students: "Aluno Exemplo 7", teacher: "Prof. Fictício D", modality: "ONLINE", status: "CANCELADA", fixed: true },
  { time: "18:30", end: "19:30", code: "ING-C2", students: "Aluno Exemplo 8", teacher: "Prof. Fictício C", modality: "PRESENCIAL", status: "CONFIRMADA", fixed: true },
];

const MODALITY_BADGE = {
  ONLINE: '<span class="badge badge--online">Online</span>',
  PRESENCIAL: '<span class="badge badge--presencial">Presencial</span>',
  DOMICILIO: '<span class="badge badge--domicilio">Domicílio</span>',
};

const STATUS_BADGE = {
  CONFIRMADA: '<span class="badge badge--confirmada">Confirmada</span>',
  PENDENTE: '<span class="badge badge--pendente">Pendente</span>',
  CANCELADA: '<span class="badge badge--cancelada">Cancelada</span>',
};

/* ---------- Datas exibidas ---------- */
const now = new Date();
const longDate = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
const shortDate = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

document.getElementById("topbarDate").textContent = shortDate;
document.getElementById("dashGreeting").textContent = `Olá, Usuário Demo! Hoje é ${longDate}.`;
document.getElementById("escalaDate").textContent = `Aulas de inglês — ${longDate}`;

/* ---------- Login fictício ---------- */
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("screenLogin").classList.remove("is-active");
  document.getElementById("screenApp").classList.add("is-active");
});

/* ---------- Navegação entre Dashboard e Escala ---------- */
function showView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("is-active", v.id === `view-${name}`));
  document.querySelectorAll(".sidebar__link[data-view]").forEach((l) => l.classList.toggle("is-active", l.dataset.view === name));
  document.getElementById("sidebar").classList.remove("is-open");
}

document.querySelectorAll("[data-view]").forEach((link) => {
  link.addEventListener("click", (e) => { e.preventDefault(); showView(link.dataset.view); });
});

document.querySelectorAll("[data-goto]").forEach((el) => {
  el.addEventListener("click", (e) => { e.preventDefault(); showView(el.dataset.goto); });
});

/* ---------- Sidebar mobile ---------- */
document.getElementById("sidebarOpen").addEventListener("click", () => document.getElementById("sidebar").classList.add("is-open"));
document.getElementById("sidebarClose").addEventListener("click", () => document.getElementById("sidebar").classList.remove("is-open"));

/* ---------- Tabela do dashboard ---------- */
document.querySelector("#dashTable tbody").innerHTML = LESSONS.map((l) => `
  <tr class="${l.status === "CANCELADA" ? "is-cancelled" : ""}">
    <td class="mono">${l.time}</td>
    <td><strong>${l.code}</strong> <span class="student">${l.students}</span></td>
    <td>${l.teacher || '<span style="color:#b91c1c;font-weight:700;font-size:12px">⚠ Sem prof.</span>'}</td>
    <td>${MODALITY_BADGE[l.modality]}</td>
    <td>${STATUS_BADGE[l.status]}</td>
  </tr>
`).join("");

/* ---------- Lista de aulas da escala ---------- */
document.getElementById("lessonsList").innerHTML = LESSONS.map((l) => `
  <div class="lesson ${l.status === "CANCELADA" ? "is-cancelled" : ""}">
    <div class="lesson__time">${l.time}<small> – ${l.end}</small></div>
    <div class="lesson__main">
      <div class="lesson__line">
        <strong>${l.code}</strong>
        <span class="student">${l.students}</span>
        ${MODALITY_BADGE[l.modality]}
        ${STATUS_BADGE[l.status]}
        ${l.fixed ? '<span class="badge badge--fixa">• Fixa</span>' : ""}
      </div>
      <p class="lesson__teacher ${l.teacher ? "" : "no-teacher"}">${l.teacher || "⚠ Sem professor"}</p>
    </div>
    <div class="lesson__actions">
      <button class="is-disabled" title="Confirmar">✓</button>
      <button class="is-disabled" title="Editar">✎</button>
      <button class="is-disabled" title="Cancelar">✕</button>
    </div>
  </div>
`).join("");

/* ---------- Resumo estilo WhatsApp ---------- */
const waLines = LESSONS.filter((l) => l.status !== "CANCELADA")
  .map((l) => `${l.time} — ${l.code} (${l.students}) — ${l.teacher || "SEM PROFESSOR"} — ${l.modality === "ONLINE" ? "Online" : l.modality === "DOMICILIO" ? "Domicílio" : "Presencial"}`)
  .join("\n");

document.getElementById("waSummary").textContent =
  `📚 HELP SCHOOL — ESCALA DO INGLÊS — ${longDate.toUpperCase()}\n\n${waLines}\n\n(Dados fictícios para demonstração)`;
