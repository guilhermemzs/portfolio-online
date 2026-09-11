/* Fictional records only. Changes are kept on this device, shared by both languages. */
(() => {
  "use strict";
  const en = document.documentElement.lang === "en";
  const L = (pt, english) => (en ? english : pt);
  const locale = en ? "en-US" : "pt-BR";
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const dayKey = (date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  const today = dayKey(new Date());
  const shift = (date, count) => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + count);
    return dayKey(d);
  };
  const validDate = (value) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value + "T12:00:00").getTime()) &&
    dayKey(new Date(value + "T12:00:00")) === value;
  const fmtDate = (date) =>
    new Date(date + "T12:00:00").toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const timeToMinutes = (value) =>
    Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
  const teachers = [
    {
      id: "t1",
      name: "Clara Oliveira",
      initials: "CO",
      area: L("Inglês • conversação", "English • conversation"),
      color: "sage",
    },
    {
      id: "t2",
      name: "Rafael Costa",
      initials: "RC",
      area: L("Inglês • preparação para exames", "English • exam preparation"),
      color: "blue",
    },
    {
      id: "t3",
      name: "Marina Alves",
      initials: "MA",
      area: L("Inglês • crianças e adolescentes", "English • young learners"),
      color: "rose",
    },
    {
      id: "t4",
      name: "Pedro Lima",
      initials: "PL",
      area: L("Inglês • negócios", "English • business"),
      color: "amber",
    },
  ];
  const groups = [
    {
      id: "g1",
      code: "ENG-A1",
      name: "English Foundations",
      level: "A1",
      students: ["Ana Souza", "Lucas Dias"],
      type: "fixed",
    },
    {
      id: "g2",
      code: "ENG-A2",
      name: "Everyday English",
      level: "A2",
      students: ["Beatriz Rocha"],
      type: "flexible",
    },
    {
      id: "g3",
      code: "ENG-B1",
      name: "Conversation Club",
      level: "B1",
      students: ["Gabriel Melo", "Julia Santos", "Bruno Reis"],
      type: "fixed",
    },
    {
      id: "g4",
      code: "ENG-B2",
      name: "Exam Preparation",
      level: "B2",
      students: ["Laura Nunes", "Felipe Gomes"],
      type: "fixed",
    },
    {
      id: "g5",
      code: "ENG-C1",
      name: "Business English",
      level: "C1",
      students: ["Camila Lopes"],
      type: "flexible",
    },
    {
      id: "g6",
      code: "EXP-A1",
      name: "First Steps",
      level: "A1",
      students: ["Diego Martins"],
      type: "trial",
    },
  ];
  const statuses = {
    confirmed: L("Confirmada", "Confirmed"),
    pending: L("Pendente", "Pending"),
    cancelled: L("Cancelada", "Cancelled"),
  };
  const modes = {
    inperson: L("Presencial", "In person"),
    online: "Online",
    home: L("Domicílio", "At home"),
  };
  const types = {
    fixed: L("Fixa", "Fixed"),
    flexible: L("Flexível", "Flexible"),
    trial: L("Experimental", "Trial"),
  };
  const views = {
    dashboard: L("Visão geral", "Overview"),
    escala: L("Agenda de aulas", "Lesson schedule"),
    turmas: L("Turmas", "Classes"),
    professores: L("Professores", "Teachers"),
    indicadores: L("Indicadores", "Insights"),
  };
  const descriptions = {
    dashboard: L(
      "Um dia bem organizado começa por aqui.",
      "A well-organized day starts here.",
    ),
    escala: L(
      "Organize horários, acompanhe confirmações e cuide de cada aula.",
      "Organize times, follow confirmations, and keep every lesson on track.",
    ),
    turmas: L(
      "Níveis, alunos e formatos em um só lugar.",
      "Levels, students, and lesson formats in one place.",
    ),
    professores: L(
      "Conheça a equipe e acompanhe a distribuição das aulas.",
      "Meet the team and explore their lesson schedules.",
    ),
    indicadores: L(
      "Uma leitura clara da operação, baseada nas aulas da demonstração.",
      "A clear view of operations, based on the demo lessons.",
    ),
  };
  const app = document.getElementById("app");
  const dialog = document.getElementById("editor");
  const storageKey = "help-school-demo-v3";
  let storageAvailable = true;
  let selectedDate = new URLSearchParams(location.search).get("date");
  if (!validDate(selectedDate || "")) selectedDate = today;
  let view = Object.hasOwn(views, location.hash.slice(1))
    ? location.hash.slice(1)
    : "dashboard";
  let filters = {
    search: "",
    status: "all",
    mode: "all",
    teacher: "all",
    group: "all",
  };
  let toastTimer;
  let dialogTrigger;
  function seed() {
    const sample = [
      ["08:00", "09:00", "g1", "t3", "inperson", "confirmed"],
      ["09:00", "10:00", "g2", "t1", "online", "confirmed"],
      ["10:00", "11:00", "g3", "t1", "inperson", "pending"],
      ["11:00", "12:00", "g6", "t3", "online", "confirmed"],
      ["14:00", "15:00", "g4", "", "inperson", "pending"],
      ["15:00", "16:00", "g5", "t4", "home", "confirmed"],
      ["17:30", "18:30", "g1", "t3", "online", "cancelled"],
      ["18:30", "19:30", "g4", "t2", "inperson", "confirmed"],
    ];
    return [-1, 0, 1].flatMap((offset) =>
      sample.slice(0, offset === 0 ? 8 : 5).map((r, i) => ({
        id: "sample-" + offset + "-" + i,
        date: shift(today, offset),
        start: r[0],
        end: r[1],
        group: r[2],
        teacher: r[3],
        mode: r[4],
        status: r[5],
        note: "",
      })),
    );
  }
  function validLesson(row) {
    return (
      row &&
      typeof row.id === "string" &&
      row.id.length < 100 &&
      validDate(row.date) &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(row.start) &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(row.end) &&
      row.end > row.start &&
      groups.some((g) => g.id === row.group) &&
      (row.teacher === "" || teachers.some((t) => t.id === row.teacher)) &&
      Object.hasOwn(statuses, row.status) &&
      Object.hasOwn(modes, row.mode) &&
      typeof row.note === "string" &&
      row.note.length <= 300
    );
  }
  let lessons = seed();
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const data = JSON.parse(raw);
      if (
        data.version === 3 &&
        Array.isArray(data.lessons) &&
        data.lessons.every(validLesson) &&
        new Set(data.lessons.map((r) => r.id)).size === data.lessons.length
      )
        lessons = data.lessons;
    }
  } catch {
    storageAvailable = false;
  }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 3, lessons }));
    } catch {
      storageAvailable = false;
    }
  }
  const groupOf = (row) => groups.find((g) => g.id === row.group);
  const teacherOf = (row) => teachers.find((t) => t.id === row.teacher);
  const dayLessons = () =>
    lessons
      .filter((r) => r.date === selectedDate)
      .sort((a, b) => a.start.localeCompare(b.start));
  const badge = (status) =>
    '<span class="badge ' + status + '"><i></i>' + statuses[status] + "</span>";
  function button(action, label, className = "button", attrs = "") {
    return (
      '<button type="button" class="' +
      className +
      '" data-action="' +
      action +
      '" ' +
      attrs +
      ">" +
      label +
      "</button>"
    );
  }
  function toast(text) {
    const el = document.getElementById("toast");
    el.textContent = text;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("visible"), 4500);
  }
  function go(name, overrides = {}) {
    view = name;
    filters = {
      search: "",
      status: "all",
      mode: "all",
      teacher: "all",
      group: "all",
      ...overrides,
    };
    render();
    document.getElementById("pageTitle").focus();
  }
  function syncURL() {
    history.replaceState(null, "", "?date=" + selectedDate + "#" + view);
  }
  function dateControls() {
    return (
      '<div class="date-controls">' +
      button(
        "prev",
        "‹",
        "icon-button",
        'aria-label="' + L("Dia anterior", "Previous day") + '"',
      ) +
      '<label class="date-input"><span class="sr-only">' +
      L("Data da agenda", "Schedule date") +
      '</span><input id="scheduleDate" type="date" value="' +
      selectedDate +
      '" required></label>' +
      button(
        "next",
        "›",
        "icon-button",
        'aria-label="' + L("Próximo dia", "Next day") + '"',
      ) +
      button("today", L("Hoje", "Today"), "button quiet") +
      "</div>"
    );
  }
  function metric(label, value, detail, color, number) {
    return (
      '<div class="metric"><div class="metric-label">' +
      label +
      '<span class="metric-mark ' +
      color +
      '" aria-hidden="true">' +
      number +
      "</span></div><strong>" +
      value +
      "</strong><small>" +
      detail +
      "</small></div>"
    );
  }
  function lessonTable(rows) {
    if (!rows.length) return empty();
    return (
      '<div class="table-wrap"><table><caption class="sr-only">' +
      L("Aulas da data selecionada", "Lessons for the selected date") +
      "</caption><thead><tr>" +
      [
        L("Horário", "Time"),
        L("Turma / alunos", "Class / students"),
        L("Professor", "Teacher"),
        L("Modalidade", "Format"),
        "Status",
        L("Ação", "Action"),
      ]
        .map((s) => '<th scope="col">' + s + "</th>")
        .join("") +
      "</tr></thead><tbody>" +
      rows
        .map((r) => {
          const g = groupOf(r),
            t = teacherOf(r);
          return (
            '<tr class="' +
            (r.status === "cancelled" ? "row-cancelled" : "") +
            '"><td class="time">' +
            r.start +
            "<small>" +
            r.end +
            "</small></td><td><strong>" +
            esc(g.name) +
            "</strong><small>" +
            esc(g.code) +
            " · " +
            esc(g.students.join(", ")) +
            "</small></td>" +
            "<td>" +
            (t
              ? '<span class="person"><span class="avatar small ' +
                t.color +
                '">' +
                t.initials +
                "</span>" +
                esc(t.name) +
                "</span>"
              : '<span class="unassigned">' +
                L("A definir", "Unassigned") +
                "</span>") +
            '</td><td><span class="mode ' +
            r.mode +
            '">' +
            modes[r.mode] +
            "</span></td><td>" +
            badge(r.status) +
            "</td><td>" +
            button(
              "edit",
              L("Gerenciar", "Manage"),
              "text-button",
              'data-id="' +
                r.id +
                '" aria-label="' +
                L("Gerenciar aula", "Manage lesson") +
                " " +
                esc(g.code) +
                " " +
                r.start +
                '"',
            ) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }
  function empty() {
    return (
      '<div class="empty"><span aria-hidden="true">—</span><h3>' +
      L("Nenhuma aula por aqui", "No lessons here") +
      "</h3><p>" +
      L(
        "Escolha outra data, ajuste os filtros ou agende uma nova aula.",
        "Choose another date, adjust the filters, or schedule a new lesson.",
      ) +
      "</p>" +
      button("new", "+ " + L("Agendar aula", "Schedule lesson")) +
      "</div>"
    );
  }
  function dashboard() {
    const rows = dayLessons(),
      active = rows.filter((r) => r.status !== "cancelled"),
      confirmed = rows.filter((r) => r.status === "confirmed"),
      pending = rows.filter((r) => r.status === "pending");
    const countTeachers = new Set(active.map((r) => r.teacher).filter(Boolean))
      .size;
    const rate = active.length
      ? Math.round((confirmed.length / active.length) * 100)
      : 0;
    return (
      '<section class="welcome"><div><span class="eyebrow">' +
      L("COORDENAÇÃO EM SINTONIA", "COORDINATION IN SYNC") +
      "</span><h2>" +
      L(
        "Mais clareza para cuidar<br>de cada aula.",
        "More clarity to care<br>for every lesson.",
      ) +
      "</h2><p>" +
      L(
        "Horários, equipe e confirmações. Tudo conectado à sua rotina.",
        "Schedules, people, and confirmations. All connected to your day.",
      ) +
      "</p>" +
      button(
        "agenda",
        L("Explorar agenda", "Explore schedule") +
          ' <span aria-hidden="true">↗</span>',
        "button light",
      ) +
      '</div><div class="welcome-aside"><div class="orbit" aria-hidden="true"><span>H</span></div><span class="welcome-tag"><i></i>' +
      L("Gestão de aulas • Help School", "Lesson management • Help School") +
      "</span></div></section>" +
      '<div class="section-heading"><div><h2>' +
      L("O dia em números", "Your day at a glance") +
      "</h2><p>" +
      fmtDate(selectedDate) +
      "</p></div>" +
      dateControls() +
      "</div>" +
      '<div class="metrics">' +
      metric(
        L("Aulas na agenda", "Scheduled lessons"),
        rows.length,
        L("Inclui aulas canceladas", "Includes cancelled lessons"),
        "blue",
        "01",
      ) +
      metric(
        L("Confirmadas", "Confirmed"),
        confirmed.length,
        rate + "% " + L("das aulas não canceladas", "of non-cancelled lessons"),
        "sage",
        "02",
      ) +
      metric(
        L("Aguardando confirmação", "Awaiting confirmation"),
        pending.length,
        L("Pendências para acompanhar", "Follow-up needed"),
        "amber",
        "03",
      ) +
      metric(
        L("Professores no dia", "Teachers scheduled"),
        countTeachers,
        L("Com aulas não canceladas", "With non-cancelled lessons"),
        "rose",
        "04",
      ) +
      "</div>" +
      '<div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><span class="eyebrow">' +
      L("PROGRAMAÇÃO", "SCHEDULE") +
      "</span><h2>" +
      L("Agenda do dia", "Daily agenda") +
      "</h2></div>" +
      button("agenda", L("Ver agenda", "View schedule") + " ↗", "text-button") +
      "</div>" +
      lessonTable(rows.slice(0, 5)) +
      (rows.length > 5
        ? '<div class="panel-footer">' +
          button(
            "agenda",
            L("Ver todas as", "View all") +
              " " +
              rows.length +
              " " +
              L("aulas", "lessons"),
            "text-button",
          ) +
          "</div>"
        : "") +
      "</section>" +
      '<aside class="side-stack"><section class="panel attention"><span class="eyebrow">' +
      L("PRECISA DE ATENÇÃO", "NEEDS ATTENTION") +
      "</span><h2>" +
      L("Vamos organizar?", "Let’s get organized") +
      "</h2><p>" +
      L(
        "Pequenas ações que fazem o dia fluir.",
        "Small actions that keep the day moving.",
      ) +
      '</p><div class="attention-number">' +
      pending.length +
      "<span>" +
      L("aulas pendentes", "pending lessons") +
      "</span></div>" +
      "<p>" +
      active.filter((r) => !r.teacher).length +
      " " +
      L(
        "aula(s) sem professor definido.",
        "lesson(s) without an assigned teacher.",
      ) +
      "</p>" +
      button(
        "pending",
        L("Revisar pendências", "Review pending lessons") + " →",
        "button",
      ) +
      "</section>" +
      '<section class="panel demo-tip"><span class="eyebrow">' +
      L("EXPERIMENTE NA PRÁTICA", "TRY IT YOURSELF") +
      "</span><h3>" +
      L("A agenda é sua para explorar.", "Make this schedule your own.") +
      "</h3><p>" +
      L(
        "Adicione uma aula, altere o professor e veja os indicadores se atualizarem.",
        "Add a lesson, change the teacher, and watch the metrics update.",
      ) +
      "</p>" +
      button(
        "new",
        "+ " + L("Criar primeira aula", "Create a lesson"),
        "text-button",
      ) +
      "</section></aside></div>"
    );
  }
  function options(object, selected) {
    return Object.entries(object)
      .map(
        ([value, label]) =>
          '<option value="' +
          esc(value) +
          '"' +
          (selected === value ? " selected" : "") +
          ">" +
          esc(label) +
          "</option>",
      )
      .join("");
  }
  function filterSelect(id, label, object, value) {
    return (
      "<label><span>" +
      label +
      '</span><select id="' +
      id +
      '">' +
      options({ all: L("Todos", "All"), ...object }, value) +
      "</select></label>"
    );
  }
  function agenda() {
    return (
      '<section class="panel"><div class="panel-head"><div><h2>' +
      fmtDate(selectedDate) +
      "</h2><p>" +
      L(
        "A escala completa, com espaço para ajustes.",
        "The complete schedule, with room for adjustments.",
      ) +
      "</p></div>" +
      dateControls() +
      "</div>" +
      '<div class="filters"><label class="search-label"><span>' +
      L("Buscar", "Search") +
      '</span><input id="search" type="search" placeholder="' +
      L("Turma, aluno ou professor", "Class, student, or teacher") +
      '" value="' +
      esc(filters.search) +
      '"></label>' +
      filterSelect("statusFilter", "Status", statuses, filters.status) +
      filterSelect(
        "modeFilter",
        L("Modalidade", "Format"),
        modes,
        filters.mode,
      ) +
      filterSelect(
        "teacherFilter",
        L("Professor", "Teacher"),
        Object.fromEntries(teachers.map((t) => [t.id, t.name])),
        filters.teacher,
      ) +
      button("clear", L("Limpar filtros", "Clear filters"), "text-button") +
      "</div>" +
      '<div id="agendaResults"></div><div class="panel-footer export-actions">' +
      button(
        "summary",
        L("Copiar resumo do dia", "Copy daily summary"),
        "button secondary",
      ) +
      button(
        "export",
        L("Baixar CSV do dia", "Download daily CSV"),
        "button secondary",
      ) +
      "<span>" +
      L(
        "Exportações incluem todas as aulas da data.",
        "Exports include all lessons on this date.",
      ) +
      "</span></div></section>"
    );
  }
  function filteredLessons() {
    const term = filters.search.trim().toLocaleLowerCase(locale);
    return dayLessons().filter((r) => {
      const g = groupOf(r),
        t = teacherOf(r);
      return (
        (filters.status === "all" || r.status === filters.status) &&
        (filters.mode === "all" || r.mode === filters.mode) &&
        (filters.teacher === "all" || r.teacher === filters.teacher) &&
        (filters.group === "all" || r.group === filters.group) &&
        (!term ||
          [g.name, g.code, ...g.students, t?.name || ""]
            .join(" ")
            .toLocaleLowerCase(locale)
            .includes(term))
      );
    });
  }
  function renderResults() {
    const rows = filteredLessons();
    document.getElementById("agendaResults").innerHTML =
      '<p class="results-count">' +
      rows.length +
      " " +
      L("aula(s) encontrada(s)", "lesson(s) found") +
      (filters.group !== "all"
        ? " · " + esc(groups.find((g) => g.id === filters.group)?.name)
        : "") +
      "</p>" +
      lessonTable(rows);
  }
  function classesView() {
    return (
      '<div class="section-heading"><p>' +
      groups.length +
      " " +
      L(
        "turmas demonstrativas • todos os nomes são fictícios",
        "demo classes • all names are fictional",
      ) +
      "</p>" +
      dateControls() +
      '</div><div class="directory">' +
      groups
        .map((g) => {
          const count = dayLessons().filter(
            (r) => r.group === g.id && r.status !== "cancelled",
          ).length;
          return (
            '<article class="panel directory-card"><div class="card-top"><span class="level">' +
            g.level +
            '</span><span class="mode">' +
            types[g.type] +
            '</span></div><p class="eyebrow">' +
            g.code +
            "</p><h2>" +
            esc(g.name) +
            "</h2><p>" +
            g.students.length +
            " " +
            L("aluno(s)", "student(s)") +
            '</p><ul class="student-list">' +
            g.students.map((s) => "<li>" + esc(s) + "</li>").join("") +
            '</ul><div class="card-bottom"><span>' +
            count +
            " " +
            L("aula(s) no dia", "lesson(s) on this date") +
            "</span>" +
            button(
              "group",
              L("Ver aulas", "View lessons") + " ↗",
              "text-button",
              'data-id="' + g.id + '"',
            ) +
            "</div></article>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  function teachersView() {
    return (
      '<div class="section-heading"><p>' +
      L(
        "Equipe fictícia para explorar a demonstração",
        "Fictional team for exploring the demo",
      ) +
      "</p>" +
      dateControls() +
      '</div><div class="directory teachers">' +
      teachers
        .map((t) => {
          const rows = dayLessons().filter(
            (r) => r.teacher === t.id && r.status !== "cancelled",
          );
          const minutes = rows.reduce(
            (sum, r) => sum + timeToMinutes(r.end) - timeToMinutes(r.start),
            0,
          );
          return (
            '<article class="panel directory-card"><div class="avatar large ' +
            t.color +
            '">' +
            t.initials +
            "</div><h2>" +
            t.name +
            "</h2><p>" +
            t.area +
            '</p><div class="teacher-stats"><div><strong>' +
            rows.length +
            "</strong><span>" +
            L("aulas no dia", "lessons today") +
            "</span></div><div><strong>" +
            new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
              minutes / 60,
            ) +
            "h</strong><span>" +
            L("carga prevista", "planned time") +
            "</span></div></div>" +
            button(
              "teacher",
              L("Consultar agenda", "View schedule") + " ↗",
              "button secondary",
              'data-id="' + t.id + '"',
            ) +
            "</article>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  function insightsView() {
    const rows = dayLessons(),
      active = rows.filter((r) => r.status !== "cancelled");
    const total = active.reduce(
      (s, r) => s + timeToMinutes(r.end) - timeToMinutes(r.start),
      0,
    );
    return (
      '<div class="section-heading"><p>' +
      L(
        "Dados calculados a partir da agenda selecionada",
        "Metrics calculated from the selected schedule",
      ) +
      "</p>" +
      dateControls() +
      "</div>" +
      '<div class="metrics">' +
      metric(
        L("Aulas no dia", "Daily lessons"),
        rows.length,
        fmtDate(selectedDate),
        "blue",
        "01",
      ) +
      metric(
        L("Horas previstas", "Planned hours"),
        new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
          total / 60,
        ) + "h",
        L("Sem aulas canceladas", "Excludes cancelled lessons"),
        "sage",
        "02",
      ) +
      metric(
        L("Turmas atendidas", "Classes scheduled"),
        new Set(active.map((r) => r.group)).size,
        L("Com aulas não canceladas", "With non-cancelled lessons"),
        "rose",
        "03",
      ) +
      metric(
        L("Cancelamentos", "Cancellations"),
        rows.filter((r) => r.status === "cancelled").length,
        L("Na data selecionada", "On the selected date"),
        "amber",
        "04",
      ) +
      "</div>" +
      '<div class="insights-grid"><section class="panel chart"><span class="eyebrow">' +
      L("ACOMPANHAMENTO", "FOLLOW-UP") +
      "</span><h2>" +
      L("Status das aulas", "Lesson status") +
      "</h2>" +
      Object.entries(statuses)
        .map(([key, label]) => {
          const count = rows.filter((r) => r.status === key).length;
          return (
            '<div class="bar-row"><div><span>' +
            label +
            "</span><strong>" +
            count +
            '</strong></div><div class="bar-track"><div class="bar ' +
            key +
            '" style="width:' +
            (rows.length ? (count / rows.length) * 100 : 0) +
            '%"></div></div></div>'
          );
        })
        .join("") +
      "<p>" +
      L(
        "Inclui todas as aulas da data selecionada.",
        "Includes all lessons on the selected date.",
      ) +
      "</p></section>" +
      '<section class="panel chart"><span class="eyebrow">' +
      L("DISTRIBUIÇÃO", "DISTRIBUTION") +
      "</span><h2>" +
      L("Formato das aulas", "Lesson formats") +
      "</h2>" +
      Object.entries(modes)
        .map(([key, label]) => {
          const count = active.filter((r) => r.mode === key).length;
          return (
            '<div class="bar-row"><div><span>' +
            label +
            "</span><strong>" +
            count +
            '</strong></div><div class="bar-track"><div class="bar ' +
            key +
            '" style="width:' +
            (active.length ? (count / active.length) * 100 : 0) +
            '%"></div></div></div>'
          );
        })
        .join("") +
      "<p>" +
      L(
        "Considera apenas aulas não canceladas.",
        "Includes only non-cancelled lessons.",
      ) +
      "</p></section></div>"
    );
  }
  function render() {
    syncURL();
    app.innerHTML =
      '<a class="skip-link" href="#pageTitle">' +
      L("Ir para o conteúdo", "Skip to content") +
      "</a>" +
      '<div class="demo-banner"><span><i></i><strong>' +
      L("DEMO INTERATIVA", "INTERACTIVE DEMO") +
      '</strong><span class="banner-detail"> · ' +
      L("Explore com dados fictícios", "Explore with fictional data") +
      '</span></span><a href="' +
      (en ? "/en/" : "/") +
      '#projetos">' +
      L("Voltar ao portfólio", "Back to portfolio") +
      ' <span aria-hidden="true">↗</span></a></div>' +
      '<aside class="sidebar" id="sidebar"><a class="brand" href="#dashboard" data-view="dashboard"><span class="brand-image"><img src="/assets/images/logo-help-school.png" alt="Help School"></span><span><strong>Help School</strong><small>' +
      L("Gestão de aulas", "Lesson management") +
      '</small></span></a><p class="nav-label">' +
      L("ESPAÇO DE TRABALHO", "WORKSPACE") +
      '</p><nav aria-label="' +
      L("Navegação principal", "Main navigation") +
      '">' +
      Object.entries(views)
        .map(
          ([key, label], i) =>
            '<a class="nav-link ' +
            (key === view ? "active" : "") +
            '" href="#' +
            key +
            '" data-view="' +
            key +
            '" ' +
            (key === view ? 'aria-current="page"' : "") +
            '><span class="nav-symbol" aria-hidden="true">' +
            ["▦", "▤", "▱", "◎", "▥"][i] +
            "</span>" +
            label +
            (key === "escala"
              ? '<span class="nav-count">' + dayLessons().length + "</span>"
              : "") +
            "</a>",
        )
        .join("") +
      "</nav>" +
      '<div class="sidebar-bottom"><div class="sandbox"><span class="eyebrow">' +
      L("SEU AMBIENTE DE TESTE", "YOUR SANDBOX") +
      "</span><p>" +
      L(
        "Teste à vontade.<br>Os dados são demonstrativos.",
        "Make yourself at home.<br>All records are fictional.",
      ) +
      "</p>" +
      button(
        "reset",
        L("Restaurar exemplos", "Reset sample data"),
        "reset-button",
      ) +
      '</div><div class="sidebar-author"><span class="avatar">GM</span><span><strong>Guilherme Menezes</strong><small>' +
      L("Desenvolvimento do projeto", "Project developer") +
      "</small></span></div></div></aside>" +
      '<button class="sidebar-scrim" data-action="close-menu" aria-label="' +
      L("Fechar menu", "Close menu") +
      '" hidden></button>' +
      '<div class="workspace"><header class="topbar">' +
      button(
        "menu",
        "☰",
        "icon-button menu-button",
        'aria-label="' +
          L("Abrir menu", "Open menu") +
          '" aria-controls="sidebar" aria-expanded="false"',
      ) +
      '<div class="breadcrumb">Help School <span>/</span> <strong>' +
      views[view] +
      '</strong></div><div class="topbar-right"><nav class="language-switcher" aria-label="' +
      L("Selecionar idioma", "Select language") +
      '"><a href="/demo-escala/?date=' +
      selectedDate +
      "#" +
      view +
      '" lang="pt-BR" ' +
      (!en ? 'aria-current="page"' : "") +
      '>PT</a><a href="/en/schedule-demo/?date=' +
      selectedDate +
      "#" +
      view +
      '" lang="en" ' +
      (en ? 'aria-current="page"' : "") +
      '>EN</a></nav><span class="avatar user-avatar">CO</span><span class="user-label">' +
      L("Coordenação", "Coordination") +
      "<small>" +
      L("Acesso demonstrativo", "Demo access") +
      "</small></span></div></header>" +
      '<main class="content"><div class="page-heading"><div><span class="eyebrow">' +
      L("HELP SCHOOL / GESTÃO", "HELP SCHOOL / MANAGEMENT") +
      '</span><h1 id="pageTitle" tabindex="-1">' +
      views[view] +
      "</h1><p>" +
      descriptions[view] +
      "</p></div>" +
      button(
        "new",
        '<span aria-hidden="true">+</span> ' + L("Nova aula", "New lesson"),
        "button primary",
      ) +
      "</div>" +
      {
        dashboard,
        escala: agenda,
        turmas: classesView,
        professores: teachersView,
        indicadores: insightsView,
      }[view]() +
      '<footer class="app-footer"><span><i></i>' +
      (storageAvailable
        ? L(
            "Alterações salvas somente neste navegador.",
            "Changes saved only in this browser.",
          )
        : L(
            "Armazenamento indisponível: alterações válidas nesta sessão.",
            "Storage unavailable: changes last for this session.",
          )) +
      "</span><span>" +
      L(
        "Portfólio • Guilherme Menezes Pereira",
        "Portfolio • Guilherme Menezes Pereira",
      ) +
      "</span></footer></main></div>";
    if (view === "escala") renderResults();
    setMenu(false);
  }
  function field(name, label, type, value, extra = "") {
    return (
      "<label><span>" +
      label +
      '</span><input name="' +
      name +
      '" type="' +
      type +
      '" value="' +
      esc(value) +
      '" ' +
      extra +
      "></label>"
    );
  }
  function selectField(name, label, object, value) {
    return (
      "<label><span>" +
      label +
      '</span><select name="' +
      name +
      '">' +
      options(object, value) +
      "</select></label>"
    );
  }
  function openEditor(id) {
    dialogTrigger = document.activeElement;
    const row = lessons.find((r) => r.id === id);
    const r = row || {
      date: selectedDate,
      start: "16:00",
      end: "17:00",
      group: "g2",
      teacher: "t1",
      mode: "online",
      status: "pending",
      note: "",
    };
    dialog.innerHTML =
      '<form id="lessonForm"><div class="dialog-head"><div><span class="eyebrow">' +
      L("AGENDA DE AULAS", "LESSON SCHEDULE") +
      '</span><h2 id="dialogTitle">' +
      (row
        ? L("Gerenciar aula", "Manage lesson")
        : L("Nova aula", "New lesson")) +
      "</h2></div>" +
      button(
        "close-dialog",
        "×",
        "icon-button",
        'aria-label="' + L("Fechar", "Close") + '"',
      ) +
      "</div>" +
      '<p class="dialog-intro">' +
      L(
        "Experimente com informações fictícias. As alterações afetam apenas esta demonstração.",
        "Use fictional information. Changes only affect this demonstration.",
      ) +
      "</p>" +
      '<div class="form-grid">' +
      field("date", L("Data", "Date"), "date", r.date, "required") +
      selectField(
        "group",
        L("Turma", "Class"),
        Object.fromEntries(groups.map((g) => [g.id, g.code + " · " + g.name])),
        r.group,
      ) +
      field("start", L("Início", "Start"), "time", r.start, "required") +
      field("end", L("Término", "End"), "time", r.end, "required") +
      selectField(
        "teacher",
        L("Professor", "Teacher"),
        {
          "": L("A definir", "Unassigned"),
          ...Object.fromEntries(teachers.map((t) => [t.id, t.name])),
        },
        r.teacher,
      ) +
      selectField("mode", L("Modalidade", "Format"), modes, r.mode) +
      selectField("status", "Status", statuses, r.status) +
      '<label class="full"><span>' +
      L("Observações", "Notes") +
      '</span><textarea name="note" maxlength="300" rows="2" placeholder="' +
      L(
        "Ex.: revisar exercícios de conversação",
        "E.g. review conversation exercises",
      ) +
      '">' +
      esc(r.note) +
      "</textarea></label></div>" +
      '<p id="formError" class="form-error" role="alert"></p><div class="dialog-actions">' +
      (row && r.status !== "cancelled"
        ? button(
            "cancel-lesson",
            L("Cancelar aula", "Cancel lesson"),
            "text-button danger",
            'data-id="' + r.id + '"',
          )
        : "") +
      button("close-dialog", L("Voltar", "Back"), "button secondary") +
      '<button class="button primary" type="submit">' +
      L("Salvar aula", "Save lesson") +
      "</button></div></form>";
    dialog.showModal();
    document.getElementById("lessonForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = Object.fromEntries(new FormData(e.target));
      const candidate = {
        ...fields,
        id: row?.id || crypto.randomUUID(),
        note: fields.note.trim(),
      };
      const error = document.getElementById("formError");
      if (!validLesson(candidate)) {
        error.textContent = L(
          "Confira os campos. O término deve ser depois do início.",
          "Check the fields. The end time must be after the start.",
        );
        return;
      }
      if (candidate.status === "confirmed" && !candidate.teacher) {
        error.textContent = L(
          "Selecione um professor antes de confirmar a aula.",
          "Assign a teacher before confirming the lesson.",
        );
        return;
      }
      const conflict = lessons.find(
        (l) =>
          l.id !== candidate.id &&
          l.date === candidate.date &&
          l.status !== "cancelled" &&
          candidate.status !== "cancelled" &&
          ((candidate.teacher && l.teacher === candidate.teacher) ||
            l.group === candidate.group) &&
          l.start < candidate.end &&
          l.end > candidate.start,
      );
      if (conflict) {
        error.textContent = L(
          "Conflito de horário: o professor ou a turma já tem aula nesse intervalo.",
          "Scheduling conflict: this teacher or class already has a lesson at that time.",
        );
        return;
      }
      if (row) lessons = lessons.map((l) => (l.id === row.id ? candidate : l));
      else lessons.push(candidate);
      selectedDate = candidate.date;
      save();
      closeDialog();
      render();
      toast(
        L(
          "Aula salva. Agenda e indicadores atualizados.",
          "Lesson saved. Schedule and metrics updated.",
        ),
      );
    });
  }
  function closeDialog() {
    dialog.close();
    if (dialogTrigger?.isConnected) dialogTrigger.focus();
  }
  function daySummary() {
    return (
      "HELP SCHOOL · " +
      fmtDate(selectedDate) +
      "\n" +
      L("DADOS FICTÍCIOS", "FICTIONAL DATA") +
      "\n\n" +
      dayLessons()
        .map(
          (r) =>
            r.start +
            "–" +
            r.end +
            " | " +
            groupOf(r).code +
            " | " +
            (teacherOf(r)?.name || L("A definir", "Unassigned")) +
            " | " +
            modes[r.mode] +
            " | " +
            statuses[r.status],
        )
        .join("\n")
    );
  }
  async function copySummary() {
    if (!dayLessons().length) {
      toast(
        L(
          "Não há aulas nesta data para copiar.",
          "No lessons on this date to copy.",
        ),
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(daySummary());
      toast(L("Resumo do dia copiado.", "Daily summary copied."));
    } catch {
      dialogTrigger = document.activeElement;
      dialog.innerHTML =
        '<div class="dialog-head"><h2 id="dialogTitle">' +
        L("Resumo do dia", "Daily summary") +
        "</h2>" +
        button(
          "close-dialog",
          "×",
          "icon-button",
          'aria-label="' + L("Fechar", "Close") + '"',
        ) +
        "</div><p>" +
        L("Copie o texto abaixo.", "Copy the text below.") +
        '</p><textarea class="summary-text" readonly aria-label="' +
        L("Resumo", "Summary") +
        '">' +
        esc(daySummary()) +
        "</textarea>";
      dialog.showModal();
      dialog.querySelector("textarea").select();
    }
  }
  function exportCSV() {
    if (!dayLessons().length) {
      toast(
        L(
          "Não há aulas nesta data para exportar.",
          "No lessons on this date to export.",
        ),
      );
      return;
    }
    const rows = [
      [
        L("Data", "Date"),
        L("Início", "Start"),
        L("Término", "End"),
        L("Turma", "Class"),
        L("Professor", "Teacher"),
        L("Modalidade", "Format"),
        "Status",
      ],
    ];
    dayLessons().forEach((r) =>
      rows.push([
        r.date,
        r.start,
        r.end,
        groupOf(r).code,
        teacherOf(r)?.name || "",
        modes[r.mode],
        statuses[r.status],
      ]),
    );
    const csv =
      "\uFEFF" +
      rows
        .map((r) =>
          r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(","),
        )
        .join("\r\n");
    const url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8" }),
      ),
      link = document.createElement("a");
    link.href = url;
    link.download = "help-school-demo-" + selectedDate + ".csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(L("CSV do dia exportado.", "Daily CSV exported."));
  }
  function resetDialog() {
    dialogTrigger = document.activeElement;
    dialog.innerHTML =
      '<div class="dialog-head"><h2 id="dialogTitle">' +
      L("Restaurar os exemplos?", "Reset sample data?") +
      "</h2>" +
      button(
        "close-dialog",
        "×",
        "icon-button",
        'aria-label="' + L("Fechar", "Close") + '"',
      ) +
      "</div><p>" +
      L(
        "As alterações feitas nesta demo serão substituídas pelos exemplos de hoje, ontem e amanhã.",
        "Your demo changes will be replaced by sample lessons for today, yesterday, and tomorrow.",
      ) +
      '</p><div class="dialog-actions">' +
      button("close-dialog", L("Voltar", "Back"), "button secondary") +
      button(
        "reset-confirm",
        L("Restaurar exemplos", "Reset sample data"),
        "button primary",
      ) +
      "</div>";
    dialog.showModal();
  }
  const mobileMenu = window.matchMedia("(max-width:760px)");
  function setMenu(open) {
    const isOpen = mobileMenu.matches && open;
    document.body.classList.toggle("menu-open", isOpen);
    document.querySelector(".sidebar-scrim").hidden = !isOpen;
    document.getElementById("sidebar").inert = mobileMenu.matches && !isOpen;
    document.querySelector(".workspace").inert = isOpen;
    document
      .querySelector(".menu-button")
      .setAttribute("aria-expanded", String(isOpen));
  }
  function closeMenu() {
    setMenu(false);
    document.querySelector(".menu-button").focus();
  }
  document.addEventListener("click", (e) => {
    const nav = e.target.closest("[data-view]");
    if (nav) {
      e.preventDefault();
      document.body.classList.remove("menu-open");
      go(nav.dataset.view);
      return;
    }
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const id = el.dataset.id;
    switch (el.dataset.action) {
      case "agenda":
        go("escala");
        break;
      case "pending":
        go("escala", { status: "pending" });
        break;
      case "group":
        go("escala", { group: id });
        break;
      case "teacher":
        go("escala", { teacher: id });
        break;
      case "new":
        openEditor();
        break;
      case "edit":
        openEditor(id);
        break;
      case "close-dialog":
        closeDialog();
        break;
      case "cancel-lesson": {
        lessons = lessons.map((r) =>
          r.id === id ? { ...r, status: "cancelled" } : r,
        );
        save();
        closeDialog();
        render();
        toast(
          L(
            "Aula cancelada. Você pode reativá-la em Gerenciar.",
            "Lesson cancelled. You can restore it through Manage.",
          ),
        );
        break;
      }
      case "clear":
        filters = {
          search: "",
          status: "all",
          mode: "all",
          teacher: "all",
          group: "all",
        };
        render();
        break;
      case "prev":
        selectedDate = shift(selectedDate, -1);
        render();
        break;
      case "next":
        selectedDate = shift(selectedDate, 1);
        render();
        break;
      case "today":
        selectedDate = today;
        render();
        break;
      case "summary":
        copySummary();
        break;
      case "export":
        exportCSV();
        break;
      case "reset":
        resetDialog();
        break;
      case "reset-confirm":
        lessons = seed();
        selectedDate = today;
        save();
        closeDialog();
        go("dashboard");
        toast(L("Exemplos restaurados.", "Sample data restored."));
        break;
      case "menu":
        setMenu(true);
        document.querySelector(".sidebar .brand").focus();
        break;
      case "close-menu":
        closeMenu();
        break;
    }
  });
  app.addEventListener("input", (e) => {
    if (e.target.id === "search") {
      filters.search = e.target.value;
      renderResults();
    }
  });
  app.addEventListener("change", (e) => {
    if (e.target.id === "scheduleDate") {
      if (validDate(e.target.value)) {
        selectedDate = e.target.value;
        render();
      } else e.target.value = selectedDate;
    }
    const key = {
      statusFilter: "status",
      modeFilter: "mode",
      teacherFilter: "teacher",
    }[e.target.id];
    if (key) {
      filters[key] = e.target.value;
      renderResults();
    }
  });
  window.addEventListener("hashchange", () => {
    const name = location.hash.slice(1);
    if (Object.hasOwn(views, name)) {
      view = name;
      render();
    }
  });
  mobileMenu.addEventListener("change", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (dialog.open || !document.body.classList.contains("menu-open")) return;
    if (e.key === "Escape") closeMenu();
    if (e.key === "Tab") {
      const items = [
        ...document.querySelectorAll(".sidebar a, .sidebar button"),
      ];
      if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault();
        items.at(-1).focus();
      } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
        e.preventDefault();
        items[0].focus();
      }
    }
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        closeDialog();
    }
  });
  render();
})();
