/* ============================================================
   DEMONSTRAÇÃO — Help School · Sistema de Gestão
   Todos os dados abaixo são FICTÍCIOS, criados apenas para
   ilustrar a interface. Nenhuma informação real da escola,
   de alunos ou de professores está presente neste código.
============================================================ */

const DEMO_IS_ENGLISH = document.documentElement.lang.toLowerCase().startsWith("en");

const DEMO_COPY = DEMO_IS_ENGLISH ? {
  locale: "en-US",
  student: "Example Student",
  experimentalStudent: "Trial Student",
  teacher: "Fictional Teacher",
  online: "Online",
  inPerson: "In person",
  atHome: "At home",
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  greeting: "Hello, Demo User! Today is",
  lessonsDate: "English lessons",
  noTeacherShort: "No teacher",
  noTeacher: "No teacher assigned",
  fixed: "Fixed",
  confirm: "Confirm",
  edit: "Edit",
  cancel: "Cancel",
  scheduleTitle: "HELP SCHOOL - ENGLISH SCHEDULE",
  fictionalData: "Fictional data for demonstration",
} : {
  locale: "pt-BR",
  student: "Aluno Exemplo",
  experimentalStudent: "Aluno Experimental",
  teacher: "Prof. Fictício",
  online: "Online",
  inPerson: "Presencial",
  atHome: "Domicílio",
  confirmed: "Confirmada",
  pending: "Pendente",
  cancelled: "Cancelada",
  greeting: "Olá, Usuário Demo! Hoje é",
  lessonsDate: "Aulas de inglês",
  noTeacherShort: "Sem prof.",
  noTeacher: "Sem professor",
  fixed: "Fixa",
  confirm: "Confirmar",
  edit: "Editar",
  cancel: "Cancelar",
  scheduleTitle: "HELP SCHOOL - ESCALA DO INGLÊS",
  fictionalData: "Dados fictícios para demonstração",
};

// Aulas fictícias do dia (espelham a estrutura usada no sistema real)
const LESSONS = [
  { time: "08:00", end: "09:00", code: "ING-A1", students: `${DEMO_COPY.student} 1`, teacher: `${DEMO_COPY.teacher} A`, modality: "ONLINE", status: "CONFIRMADA", fixed: true },
  { time: "09:00", end: "10:00", code: "ING-B2", students: `${DEMO_COPY.student} 2 ${DEMO_IS_ENGLISH ? "and" : "e"} ${DEMO_COPY.student} 3`, teacher: `${DEMO_COPY.teacher} B`, modality: "PRESENCIAL", status: "CONFIRMADA", fixed: true },
  { time: "10:00", end: "11:00", code: "ING-A2", students: `${DEMO_COPY.student} 4`, teacher: `${DEMO_COPY.teacher} A`, modality: "PRESENCIAL", status: "PENDENTE", fixed: false },
  { time: "11:00", end: "12:00", code: "EXP-01", students: DEMO_COPY.experimentalStudent, teacher: `${DEMO_COPY.teacher} C`, modality: "ONLINE", status: "CONFIRMADA", fixed: false },
  { time: "14:00", end: "15:00", code: "ING-C1", students: `${DEMO_COPY.student} 5`, teacher: null, modality: "PRESENCIAL", status: "PENDENTE", fixed: true },
  { time: "15:00", end: "16:00", code: "ING-B1", students: `${DEMO_COPY.student} 6`, teacher: `${DEMO_COPY.teacher} B`, modality: "DOMICILIO", status: "CONFIRMADA", fixed: false },
  { time: "17:30", end: "18:30", code: "ING-A1", students: `${DEMO_COPY.student} 7`, teacher: `${DEMO_COPY.teacher} D`, modality: "ONLINE", status: "CANCELADA", fixed: true },
  { time: "18:30", end: "19:30", code: "ING-C2", students: `${DEMO_COPY.student} 8`, teacher: `${DEMO_COPY.teacher} C`, modality: "PRESENCIAL", status: "CONFIRMADA", fixed: true },
];

const MODALITY_BADGE = {
  ONLINE: `<span class="badge badge--online">${DEMO_COPY.online}</span>`,
  PRESENCIAL: `<span class="badge badge--presencial">${DEMO_COPY.inPerson}</span>`,
  DOMICILIO: `<span class="badge badge--domicilio">${DEMO_COPY.atHome}</span>`,
};

const STATUS_BADGE = {
  CONFIRMADA: `<span class="badge badge--confirmada">${DEMO_COPY.confirmed}</span>`,
  PENDENTE: `<span class="badge badge--pendente">${DEMO_COPY.pending}</span>`,
  CANCELADA: `<span class="badge badge--cancelada">${DEMO_COPY.cancelled}</span>`,
};

/* ---------- Datas exibidas ---------- */
const now = new Date();
const longDate = now.toLocaleDateString(DEMO_COPY.locale, { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
const shortDate = now.toLocaleDateString(DEMO_COPY.locale, { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

document.getElementById("topbarDate").textContent = shortDate;
document.getElementById("dashGreeting").textContent = `${DEMO_COPY.greeting} ${longDate}.`;
document.getElementById("escalaDate").textContent = `${DEMO_COPY.lessonsDate} - ${longDate}`;

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
    <td>${l.teacher || `<span style="color:#b91c1c;font-weight:700;font-size:12px">⚠ ${DEMO_COPY.noTeacherShort}</span>`}</td>
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
        ${l.fixed ? `<span class="badge badge--fixa">• ${DEMO_COPY.fixed}</span>` : ""}
      </div>
      <p class="lesson__teacher ${l.teacher ? "" : "no-teacher"}">${l.teacher || `⚠ ${DEMO_COPY.noTeacher}`}</p>
    </div>
    <div class="lesson__actions">
      <button class="is-disabled" title="${DEMO_COPY.confirm}">✓</button>
      <button class="is-disabled" title="${DEMO_COPY.edit}">✎</button>
      <button class="is-disabled" title="${DEMO_COPY.cancel}">✕</button>
    </div>
  </div>
`).join("");

/* ---------- Resumo estilo WhatsApp ---------- */
const waLines = LESSONS.filter((l) => l.status !== "CANCELADA")
  .map((l) => `${l.time} - ${l.code} (${l.students}) - ${l.teacher || DEMO_COPY.noTeacher.toUpperCase()} - ${l.modality === "ONLINE" ? DEMO_COPY.online : l.modality === "DOMICILIO" ? DEMO_COPY.atHome : DEMO_COPY.inPerson}`)
  .join("\n");

document.getElementById("waSummary").textContent =
  `📚 ${DEMO_COPY.scheduleTitle} - ${longDate.toUpperCase()}\n\n${waLines}\n\n(${DEMO_COPY.fictionalData})`;
