"use strict";

import {
  atualizarSerie,
  excluirSerie,
  inserirSerie,
  listarRefeicoesNoPeriodo,
  listarRefeicoesPorData,
  listarSeriesNoPeriodo,
  listarSeriesPorData,
  upsertRefeicao
} from "./lib/data";

    const STORAGE_KEY = "coach-performance:v1";
    const DIVISIONS = ["push", "pull", "quadriceps", "posterior", "upper"];
    const LABELS = {
      push: "Push", pull: "Pull", quadriceps: "Quadríceps",
      posterior: "Posterior e glúteo", upper: "Upper", descanso: "Descanso"
    };
    const PLAN = {
      push: [
        { id: "push1", name: "Supino inclinado com halteres", target: "4 × 8–12", icon: "🏋️" },
        { id: "push2", name: "Crucifixo na máquina", target: "3 × 10–12", icon: "💪" },
        { id: "push3", name: "Supino na polia", target: "3 × 10–12", icon: "🏋️" },
        { id: "push4", name: "Elevação lateral", target: "3 × 12–15", icon: "🙆" },
        { id: "push5", name: "Tríceps na polia", target: "3 × 10–12", icon: "💪" }
      ],
      pull: [
        { id: "pull1", name: "Puxada na máquina", target: "4 × 8–12", icon: "🧗" },
        { id: "pull2", name: "Puxada fechada", target: "3 × 8–12", icon: "🧗" },
        { id: "pull3", name: "Remada", target: "3 × 8–12", icon: "🏋️" },
        { id: "pull4", name: "Crucifixo inverso", target: "3 × 12–15", icon: "🙆" },
        { id: "pull5", name: "Rosca bíceps", target: "3 × 10–12", icon: "💪" }
      ],
      quadriceps: [
        { id: "quad1", name: "Agachamento no hack", target: "4 × 8–12", icon: "🦵" },
        { id: "quad2", name: "Cadeira extensora", target: "3 × 10–12", icon: "🦵" },
        { id: "quad3", name: "Leg press", target: "3 × 10–12", icon: "🏋️" },
        { id: "quad4", name: "Panturrilha", target: "4 × 12–15", icon: "🦵" }
      ],
      posterior: [
        { id: "post1", name: "Levantamento terra romeno", target: "4 × 8–12", icon: "🏋️" },
        { id: "post2", name: "Mesa flexora", target: "3 × 10–12", icon: "🦵" },
        { id: "post3", name: "Elevação pélvica", target: "3 × 8–12", icon: "🍑" },
        { id: "post4", name: "Abdutora", target: "3 × 12–15", icon: "🦵" }
      ],
      upper: [
        { id: "upper1", name: "Supino reto", target: "3 × 8–12", icon: "🏋️" },
        { id: "upper2", name: "Remada baixa", target: "3 × 8–12", icon: "🧗" },
        { id: "upper3", name: "Desenvolvimento", target: "3 × 8–12", icon: "🙆" },
        { id: "upper4", name: "Puxada alta", target: "3 × 8–12", icon: "🧗" },
        { id: "upper5", name: "Braços", target: "3 × 10–12", icon: "💪" }
      ]
    };
    const MEALS = [
      { id: "cafe", name: "Café da manhã", icon: "☕" },
      { id: "almoco", name: "Almoço", icon: "🍛" },
      { id: "lanche", name: "Lanche", icon: "🍎" },
      { id: "jantar", name: "Jantar", icon: "🍽️" }
    ];
    const CARDIO_TYPES = ["Escada", "Esteira", "Bicicleta", "Futsal", "Outro"];
    const WEEKDAY_PLAN = { 1: "push", 2: "pull", 3: "quadriceps", 4: "upper", 5: "posterior" };

    let state = { days: {} };
    let currentView = "dashboard";
    let trainingTab = defaultDivision(todayKey()) === "descanso" ? "push" : defaultDivision(todayKey());
    let modal = null;
    let storageError = "";
    let dataError = "";
    let storageBlocked = false;
    let dataRevision = 0;
    let crudTestMessage = "";
    let crudTestRunning = false;

    const app = document.getElementById("app");
    const modalRoot = document.getElementById("modal-root");

    function escapeHtml(value) {
      return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
      });
    }

    function dateKey(date) {
      return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    }

    function dateFromKey(key) {
      const parts = key.split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    function offsetDate(key, amount) {
      const date = dateFromKey(key);
      date.setDate(date.getDate() + amount);
      return dateKey(date);
    }

    function todayKey() {
      return dateKey(new Date());
    }

    function dateLabel(key, options) {
      return dateFromKey(key).toLocaleDateString("pt-BR", options || { day: "2-digit", month: "2-digit" });
    }

    function defaultDivision(key) {
      const weekday = dateFromKey(key).getDay();
      return WEEKDAY_PLAN[weekday] || "descanso";
    }

    function emptyDay(key) {
      const meals = {};
      MEALS.forEach(function (meal) { meals[meal.id] = { status: "pending", text: "" }; });
      return {
        date: key,
        division: defaultDivision(key),
        workoutDone: false,
        sets: {},
        meals: meals,
        water: 0,
        sleepTime: "22:30",
        cardio: null
      };
    }

    function getDay(key) {
      if (!state.days[key]) state.days[key] = emptyDay(key);
      return state.days[key];
    }

    function existingDay(key) {
      return state.days[key] || emptyDay(key);
    }

    function appNotice() {
      const message = dataError || storageError;
      return message ? '<div class="notice" role="alert">' + escapeHtml(message) + "</div>" : "";
    }

    function applyRemoteData(key, series, meals) {
      const day = getDay(key);
      day.sets = {};
      day.meals = emptyDay(key).meals;

      series.forEach(function (serie) {
        day.sets[serie.exercicio_id] = day.sets[serie.exercicio_id] || [];
        day.sets[serie.exercicio_id].push({
          id: serie.id,
          weight: serie.carga_kg,
          reps: serie.repeticoes
        });
      });

      meals.forEach(function (refeicao) {
        if (day.meals[refeicao.refeicao]) {
          day.meals[refeicao.refeicao] = {
            status: refeicao.status,
            text: refeicao.descricao || ""
          };
        }
      });
    }

    async function loadRemoteDay(key) {
      const revision = dataRevision;
      try {
        const results = await Promise.all([
          listarSeriesPorData(key),
          listarRefeicoesPorData(key)
        ]);
        if (revision !== dataRevision) return;
        applyRemoteData(key, results[0], results[1]);
        dataError = "";
      } catch (error) {
        if (revision !== dataRevision) return;
        dataError = "Não foi possível carregar séries e refeições do banco. Confira sua conexão e as permissões e tente novamente.";
      }
      render();
    }

    async function loadRemoteHistory(start, end) {
      try {
        let revision;
        let results;
        do {
          revision = dataRevision;
          results = await Promise.all([
            listarSeriesNoPeriodo(start, end),
            listarRefeicoesNoPeriodo(start, end)
          ]);
        } while (revision !== dataRevision);
        Object.keys(state.days).forEach(function (key) {
          if (key >= start && key <= end) {
            state.days[key].sets = {};
            state.days[key].meals = emptyDay(key).meals;
          }
        });
        const byDate = {};
        results[0].forEach(function (serie) {
          byDate[serie.data] = byDate[serie.data] || { series: [], meals: [] };
          byDate[serie.data].series.push(serie);
        });
        results[1].forEach(function (refeicao) {
          byDate[refeicao.data] = byDate[refeicao.data] || { series: [], meals: [] };
          byDate[refeicao.data].meals.push(refeicao);
        });
        Object.keys(byDate).forEach(function (key) {
          applyRemoteData(key, byDate[key].series, byDate[key].meals);
        });
        dataError = "";
      } catch (error) {
        dataError = "Não foi possível carregar o histórico do banco. Confira sua conexão e tente novamente.";
      }
      render();
    }

    function showDatabaseError(message, preserveForm) {
      dataError = message;
      const form = preserveForm && modalRoot.querySelector("form[data-form]");
      if (form) {
        const modal = form.closest(".modal");
        const previousNotice = modal.querySelector(".notice");
        if (previousNotice) previousNotice.remove();
        const notice = document.createElement("div");
        notice.className = "notice";
        notice.setAttribute("role", "alert");
        notice.textContent = message;
        form.before(notice);
      } else {
        render();
      }
    }

    function persist() {
      if (storageBlocked) return false;
      try {
        const savedState = { days: {} };
        Object.keys(state.days).forEach(function (key) {
          const day = Object.assign({}, state.days[key]);
          delete day.sets;
          delete day.meals;
          savedState.days[key] = day;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
        storageError = "";
        return true;
      } catch (error) {
        storageError = "Não foi possível salvar neste navegador. Verifique o espaço disponível e as permissões de armazenamento.";
        return false;
      }
    }

    function loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (!parsed || typeof parsed !== "object" || !parsed.days || typeof parsed.days !== "object") {
          throw new Error("Formato de dados inválido.");
        }
        state = parsed;
        Object.keys(state.days).forEach(function (key) {
          const day = state.days[key] && typeof state.days[key] === "object" ? state.days[key] : {};
          const defaults = emptyDay(key);
          state.days[key] = Object.assign(defaults, day, {
            sets: {},
            meals: defaults.meals
          });
        });
      } catch (error) {
        storageError = "Os dados salvos não puderam ser lidos e não serão sobrescritos. Limpe os dados do site apenas se quiser recomeçar.";
        storageBlocked = true;
        state = { days: {} };
      }
    }

    function saveAndRender() {
      persist();
      render();
    }

    function nav(active) {
      const items = [
        ["dashboard", "🏠", "Início"],
        ["training", "🏋️", "Treino"],
        ["nutrition", "🍽️", "Nutrição"],
        ["history", "📅", "Histórico"]
      ];
      return '<nav class="nav" aria-label="Navegação">' + items.map(function (item) {
        return '<button type="button" aria-current="' + (active === item[0] ? "page" : "false") +
          '" class="' + (active === item[0] ? "active" : "") +
          '" data-action="navigate" data-view="' + item[0] + '"><span aria-hidden="true">' +
          item[1] + "</span>" + item[2] + "</button>";
      }).join("") + "</nav>";
    }

    function workoutExercises(day) {
      return PLAN[day.division] || [];
    }

    function mealCount(day) {
      return MEALS.filter(function (meal) { return day.meals[meal.id] && day.meals[meal.id].status === "done"; }).length;
    }

    function hasDayActivity(day) {
      return day.workoutDone ||
        Object.keys(day.sets || {}).some(function (id) { return day.sets[id] && day.sets[id].length > 0; }) ||
        MEALS.some(function (meal) { return day.meals[meal.id] && day.meals[meal.id].status !== "pending"; }) ||
        day.water > 0 || Boolean(day.cardio) || day.sleepTime !== "22:30";
    }

    function dashboard() {
      const key = todayKey();
      const day = getDay(key);
      const exercises = workoutExercises(day);
      const loggedExercises = exercises.filter(function (exercise) { return (day.sets[exercise.id] || []).length > 0; }).length;
      const hasWorkout = day.division !== "descanso";
      const waterGoal = 3500 + (day.cardio ? 500 : 0);
      const waterPercent = Math.min(100, Math.round(day.water / waterGoal * 100));
      const tomorrow = existingDay(offsetDate(key, 1));
      const yesterday = existingDay(offsetDate(key, -1));
      const workoutLabel = day.workoutDone ? "Treino concluído! Mandou bem." : hasWorkout ? "Seu treino de hoje está pronto." : "Dia de descanso. Recuperar também faz parte.";

      let html = nav("dashboard");
      html += appNotice();
      html += '<section class="card hero"><div class="hero-top"><div><p class="eyebrow">HOJE · ' +
        dateLabel(key, { weekday: "long", day: "numeric", month: "long" }) + "</p><h2>" +
        escapeHtml(LABELS[day.division]) + '</h2><p class="hero-copy">' + workoutLabel + "</p></div>" +
        (hasWorkout ? '<button class="ghost-light" data-action="toggle-workout">' +
          (day.workoutDone ? "Desmarcar" : "Concluir treino") + "</button>" : "") + "</div>";
      if (hasWorkout) {
        html += '<div class="progress"><i style="width:' + Math.round(loggedExercises / exercises.length * 100) + '%"></i></div>' +
          '<p class="progress-label">' + loggedExercises + " de " + exercises.length + " exercícios com séries registradas</p>";
      }
      html += "</section>";

      if (hasWorkout) {
        const first = exercises[0];
        html += '<section class="card"><h3 class="section-title">⚡ Comece por aqui</h3>' +
          '<div class="exercise-feature"><div class="exercise-icon">' + first.icon + "</div><div><strong>" +
          escapeHtml(first.name) + '</strong><span>Alvo: ' + escapeHtml(first.target) + "</span></div></div>" +
          '<button class="button button-wide" data-action="navigate" data-view="training">Ver treino do dia · ' +
          exercises.length + " exercícios</button></section>";
      }

      html += '<section class="card"><h3 class="section-title">🍽️ Refeições <span class="subtle">' +
        mealCount(day) + "/4 registradas</span></h3><div class=\"meal-list\">" +
        MEALS.map(function (meal) {
          const entry = day.meals[meal.id] || {};
          const done = entry.status === "done";
          return '<button class="meal-chip ' + (done ? "done" : "") + '" data-action="meal" data-id="' +
            meal.id + '">' + meal.icon + " " + meal.name + (done ? " ✓" : "") + "</button>";
        }).join("") + "</div></section>";

      html += '<section class="stats"><article class="card stat-card"><p class="stat-label">🌙 Dormir às</p>' +
        '<p class="stat-value">' + escapeHtml(day.sleepTime) + '</p><p class="stat-hint">Toque para alterar</p>' +
        '<button class="button button-quiet small-button" data-action="sleep">Alterar horário</button></article>' +
        '<article class="card stat-card"><p class="stat-label">🏃 Cardio</p><p class="stat-value">' +
        (day.cardio ? escapeHtml(day.cardio.minutes) + " min" : "Não fiz") +
        '</p><p class="stat-hint">' + (day.cardio ? escapeHtml(day.cardio.type) : "Registre sua atividade") +
        '</p><button class="button button-quiet small-button" data-action="cardio">' +
        (day.cardio ? "Editar cardio" : "Registrar cardio") + "</button></article></section>";

      html += '<section class="card"><div class="hero-top"><div><p class="stat-label">💧 Hidratação</p><p class="stat-value">' +
        (day.water / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " / " +
        (waterGoal / 1000).toLocaleString("pt-BR") + ' L</p></div><span class="subtle">' +
        waterPercent + "%</span></div><div class=\"water-bar\"><i style=\"width:" + waterPercent +
        '%"></i></div><div class="button-row"><button class="button button-quiet small-button" data-action="water" data-amount="-250">↩ 250</button>' +
        '<button class="button small-button" data-action="water" data-amount="250">+250 ml</button>' +
        '<button class="button small-button" data-action="water" data-amount="500">🥤 +500 ml</button></div></section>';

      html += '<section class="two-up"><article class="day-preview"><p class="subtle">⏮️ Ontem</p><p><strong>' +
        escapeHtml(LABELS[yesterday.division]) + "</strong></p><span class=\"pill " +
        (yesterday.workoutDone ? "pill-green" : "pill-orange") + '">' +
        (yesterday.workoutDone ? "Concluído" : yesterday.division === "descanso" ? "Descanso" : "Pendente") +
        '</span></article><article class="day-preview"><p class="subtle">⏭️ Amanhã</p><p><strong>' +
        escapeHtml(LABELS[tomorrow.division]) + '</strong></p><span class="subtle">' +
        escapeHtml(dateLabel(tomorrow.date, { day: "numeric", month: "short" })) + "</span></article></section>";
      html += '<section class="card"><h3 class="section-title">Teste CRUD</h3>' +
        '<p class="subtle">Cria três séries de teste, lista, atualiza uma e exclui outra no Supabase.</p>' +
        '<button class="button button-wide" data-action="crud-test"' + (crudTestRunning ? " disabled" : "") +
        '>Executar teste</button><p class="subtle" role="status" aria-live="polite">' +
        escapeHtml(crudTestMessage || "O teste deixa duas séries identificadas no banco para conferência.") +
        "</p></section>";
      return html;
    }

    function training() {
      const day = getDay(todayKey());
      let html = nav("training");
      html += appNotice();
      html += '<h2 class="section-title">Treino de ' + escapeHtml(LABELS[trainingTab]) + '</h2>' +
        '<div class="tabs" aria-label="Divisão do treino">' +
        DIVISIONS.map(function (division) {
          return '<button type="button" aria-pressed="' + (trainingTab === division) +
            '" class="tab ' + (trainingTab === division ? "active" : "") + '" data-action="training-tab" data-id="' +
            division + '">' + escapeHtml(LABELS[division]) + "</button>";
        }).join("") + "</div>";
      html += '<section class="exercise-list">';
      PLAN[trainingTab].forEach(function (exercise) {
        const sets = day.sets[exercise.id] || [];
        const last = sets.length ? "Última: " + sets[sets.length - 1].weight + " kg × " + sets[sets.length - 1].reps : exercise.target;
        html += '<button class="card exercise-row" data-action="exercise" data-id="' + exercise.id + '">' +
          '<span class="exercise-icon" aria-hidden="true">' + exercise.icon + '</span><span class="exercise-info"><strong>' +
          escapeHtml(exercise.name) + "</strong><span>" + escapeHtml(last) + "</span></span>" +
          (sets.length ? '<span class="set-count">' + sets.length + " séries ✓</span>" : '<span class="subtle">›</span>') + "</button>";
      });
      return html + "</section>";
    }

    function nutrition() {
      const day = getDay(todayKey());
      let html = nav("nutrition");
      html += appNotice();
      html += '<section class="card hero"><p class="eyebrow">REGISTRO DE HOJE</p><h2>Nutrição</h2>' +
        '<p class="hero-copy">' + mealCount(day) + " de " + MEALS.length + " refeições registradas</p>" +
        '<div class="progress"><i style="width:' + Math.round(mealCount(day) / MEALS.length * 100) + '%"></i></div></section>' +
        '<section class="stack">';
      MEALS.forEach(function (meal) {
        const entry = day.meals[meal.id] || {};
        const done = entry.status === "done";
        const skipped = entry.status === "skipped";
        const status = done ? "Registrada ✓" : skipped ? "Marquei que não comi" : "A registrar";
        html += '<button class="card meal-record" data-action="meal" data-id="' + meal.id + '">' +
          '<span class="meal-record-head"><strong>' + meal.icon + " " + meal.name + '</strong><span class="pill ' +
          (done ? "pill-green" : skipped ? "pill-muted" : "pill-orange") + '">' + status + "</span></span>" +
          (done && entry.text ? '<span class="meal-record-text">' + escapeHtml(entry.text) + "</span>" :
            '<span class="meal-record-text">' + (done ? "Refeição salva sem descrição." : "Toque para registrar.") + "</span>") +
          "</button>";
      });
      return html + "</section>";
    }

    function history() {
      const today = todayKey();
      const keys = Object.keys(state.days).filter(function (key) {
        return key <= today && hasDayActivity(state.days[key]);
      })
        .sort().reverse().slice(0, 30);
      const completed = keys.filter(function (key) { return state.days[key].workoutDone; }).length;
      const mealsLogged = keys.reduce(function (sum, key) { return sum + mealCount(state.days[key]); }, 0);
      let html = nav("history");
      html += appNotice();
      html += '<section class="card"><h2 class="section-title">📅 Últimos registros</h2>';
      if (!keys.length) return html + '<p class="empty">Sem registros ainda. Registre um treino, uma refeição ou outra atividade para começar seu histórico.</p></section>';
      html += '<p class="subtle">Nos últimos ' + (keys.length === 1 ? "1 dia registrado" : keys.length + " dias registrados") + ": " + completed +
        " treinos concluídos e " + mealsLogged + " refeições anotadas.</p>";
      keys.forEach(function (key) {
        const day = state.days[key];
        html += '<div class="history-row"><div><strong>' +
          escapeHtml(dateLabel(key, { weekday: "short", day: "numeric", month: "short" })) +
          '</strong><div class="subtle">' + escapeHtml(LABELS[day.division]) + " · " + mealCount(day) +
          " refeições</div></div><span class=\"pill " + (day.workoutDone ? "pill-green" : "pill-orange") + '">' +
          (day.workoutDone ? "Concluído" : day.division === "descanso" ? "Descanso" : "Pendente") +
          "</span></div>";
      });
      return html + "</section>";
    }

    function modalFrame(title, content) {
      return '<div class="overlay" data-action="overlay-close"><section class="modal" role="dialog" aria-modal="true" aria-label="' +
        escapeHtml(title) + '"><div class="modal-head"><h2>' + escapeHtml(title) +
        '</h2><button class="close-button" data-action="close-modal" aria-label="Fechar">×</button></div>' +
        content + "</section></div>";
    }

    function modalContent() {
      if (!modal) return "";
      const day = getDay(todayKey());
      if (modal.type === "meal") {
        const meal = MEALS.find(function (item) { return item.id === modal.id; });
        const entry = day.meals[meal.id] || {};
        return modalFrame(meal.icon + " " + meal.name,
          '<form data-form="meal" data-id="' + meal.id + '"><div class="field"><label for="meal-text">O que você comeu?</label>' +
          '<textarea id="meal-text" name="text" maxlength="1000" placeholder="Anote sua refeição">' +
          escapeHtml(entry.text || "") + '</textarea></div><div class="modal-actions"><button class="button" type="button" data-action="save-form">Salvar refeição</button>' +
          '<button class="button button-quiet" type="button" data-action="meal-skip" data-id="' + meal.id + '">Marcar como não comi</button>' +
          '<button class="button button-quiet" type="button" data-action="close-modal">Cancelar</button></div></form>');
      }
      if (modal.type === "sleep") {
        return modalFrame("Horário de dormir",
          '<form data-form="sleep"><div class="field"><label for="sleep-time">Horário previsto</label><input id="sleep-time" name="time" type="time" value="' +
          escapeHtml(day.sleepTime) + '" required></div><button class="button button-wide" type="button" data-action="save-form">Salvar horário</button></form>');
      }
      if (modal.type === "cardio") {
        const cardio = day.cardio || { type: CARDIO_TYPES[0], minutes: 30 };
        return modalFrame("Registrar cardio",
          '<form data-form="cardio"><div class="field"><label for="cardio-type">Atividade</label><select id="cardio-type" name="type">' +
          CARDIO_TYPES.map(function (type) { return '<option' + (type === cardio.type ? " selected" : "") + ">" + type + "</option>"; }).join("") +
          '</select></div><div class="field"><label for="cardio-minutes">Duração (minutos)</label><input id="cardio-minutes" name="minutes" type="number" min="1" max="600" value="' +
          escapeHtml(cardio.minutes) + '" required></div><div class="modal-actions"><button class="button" type="button" data-action="save-form">Salvar cardio</button>' +
          (day.cardio ? '<button class="button button-danger" type="button" data-action="remove-cardio">Remover cardio</button>' : "") +
          '<button class="button button-quiet" type="button" data-action="close-modal">Cancelar</button></div></form>');
      }
      if (modal.type === "exercise") {
        const exercise = PLAN[modal.division].find(function (item) { return item.id === modal.id; });
        const sets = day.sets[exercise.id] || [];
        const rows = sets.length ? sets.map(function (set, index) {
          return '<div class="set-row"><span>Série ' + (index + 1) + " · " + escapeHtml(set.weight) + " kg × " +
            escapeHtml(set.reps) + '</span><button class="button button-danger small-button" type="button" data-action="remove-set" data-id="' +
            exercise.id + '" data-index="' + index + '">Remover</button></div>';
        }).join("") : '<p class="subtle">Ainda não há séries registradas.</p>';
        return modalFrame(exercise.name,
          '<p class="subtle">Alvo: ' + escapeHtml(exercise.target) + "</p>" + rows +
          '<form data-form="set" data-id="' + exercise.id + '"><div class="section-title" style="margin-top:16px">Adicionar série</div>' +
          '<div class="two-up"><div class="field"><label for="set-weight">Carga (kg)</label><input id="set-weight" name="weight" type="number" min="0" step="0.5" required></div>' +
          '<div class="field"><label for="set-reps">Repetições</label><input id="set-reps" name="reps" type="number" min="1" max="999" step="1" required></div></div>' +
          '<div class="modal-actions"><button class="button" type="button" data-action="save-form">Salvar série</button>' +
          '<button class="button button-quiet" type="button" data-action="close-modal">Fechar</button></div></form>');
      }
      return "";
    }

    function render() {
      const screens = { dashboard: dashboard, training: training, nutrition: nutrition, history: history };
      app.innerHTML = screens[currentView]();
      modalRoot.innerHTML = modalContent();
      if (modal) {
        const firstField = modalRoot.querySelector("input, textarea, select") ||
          modalRoot.querySelector('[data-action="close-modal"]');
        if (firstField) firstField.focus();
      }
    }

    function openExercise(id) {
      modal = { type: "exercise", id: id, division: trainingTab };
      render();
    }

    async function saveForm(form) {
      if (!form.reportValidity()) return;
      const day = getDay(todayKey());
      const data = new FormData(form);
      if (form.dataset.form === "meal") {
        const text = String(data.get("text") || "").trim();
        await upsertRefeicao({
          data: todayKey(),
          refeicao: form.dataset.id,
          status: "done",
          descricao: text
        });
        dataRevision += 1;
        day.meals[form.dataset.id] = { status: "done", text: text };
        modal = null;
        dataError = "";
        render();
        return;
      } else if (form.dataset.form === "sleep") {
        day.sleepTime = String(data.get("time"));
      } else if (form.dataset.form === "cardio") {
        day.cardio = { type: String(data.get("type")), minutes: Number(data.get("minutes")) };
      } else if (form.dataset.form === "set") {
        const weight = Number(data.get("weight"));
        const reps = Number(data.get("reps"));
        if (!Number.isFinite(weight) || weight < 0 || !Number.isInteger(reps) || reps < 1) return;
        const exercise = PLAN[trainingTab].find(function (item) { return item.id === form.dataset.id; });
        if (!exercise) return;
        const serie = await inserirSerie({
          data: todayKey(),
          divisao: trainingTab,
          exercicio_id: exercise.id,
          exercicio_nome: exercise.name,
          carga_kg: weight,
          repeticoes: reps
        });
        dataRevision += 1;
        day.sets[form.dataset.id] = day.sets[form.dataset.id] || [];
        day.sets[form.dataset.id].push({
          id: serie.id,
          weight: serie.carga_kg,
          reps: serie.repeticoes
        });
        modal = { type: "exercise", id: form.dataset.id, division: trainingTab };
        dataError = "";
        render();
        return;
      }
      if (form.dataset.form !== "set") modal = null;
      saveAndRender();
    }

    async function runCrudTest() {
      const runId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const prefix = "crud-" + runId;
      const inserted = [];
      crudTestRunning = true;
      crudTestMessage = "Teste em andamento...";
      dataError = "";
      render();

      try {
        for (let index = 0; index < 3; index += 1) {
          inserted.push(await inserirSerie({
            data: todayKey(),
            divisao: "push",
            exercicio_id: prefix + "-" + (index + 1),
            exercicio_nome: "Teste CRUD " + runId + " #" + (index + 1),
            carga_kg: 20 + index,
            repeticoes: 8 + index
          }));
          dataRevision += 1;
        }
        const listed = (await listarSeriesPorData(todayKey())).filter(function (serie) {
          return serie.exercicio_id.indexOf(prefix + "-") === 0;
        });
        if (listed.length !== 3) throw new Error("Quantidade inesperada de séries no teste.");

        const updated = await atualizarSerie(inserted[0].id, { carga_kg: 99 });
        dataRevision += 1;
        await excluirSerie(inserted[2].id);
        dataRevision += 1;
        const remaining = (await listarSeriesPorData(todayKey())).filter(function (serie) {
          return serie.exercicio_id.indexOf(prefix + "-") === 0;
        });
        if (remaining.length !== 2) {
          crudTestMessage = "Operações executadas, mas a conferência encontrou " + remaining.length +
            " séries em vez de 2 (" + prefix + ").";
        } else {
          const listedValues = listed.map(function (serie) {
            return serie.carga_kg + " kg × " + serie.repeticoes;
          }).join(", ");
          crudTestMessage = "Concluído: 3 inseridas; listagem (" + listed.length + "): " + listedValues +
            "; 1 atualizada para " + updated.carga_kg + " kg; 1 excluída; restam 2 (" + prefix + ").";
        }
        dataError = "";
      } catch (error) {
        crudTestMessage = "Teste interrompido. Verifique as séries com identificador " + prefix + " no Table Editor.";
        dataError = "Não foi possível concluir o teste CRUD. Confira a conexão e as políticas RLS.";
      } finally {
        crudTestRunning = false;
        render();
      }
    }

    app.addEventListener("click", function (event) {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      const day = getDay(todayKey());

      if (action === "navigate") {
        currentView = button.dataset.view;
        modal = null;
        if (currentView === "history") {
          void loadRemoteHistory(offsetDate(todayKey(), -29), todayKey());
        }
      } else if (action === "training-tab") {
        trainingTab = button.dataset.id;
      } else if (action === "crud-test") {
        void runCrudTest();
        return;
      } else if (action === "toggle-workout") {
        day.workoutDone = !day.workoutDone;
        saveAndRender();
        return;
      } else if (action === "meal") {
        modal = { type: "meal", id: button.dataset.id };
      } else if (action === "sleep") {
        modal = { type: "sleep" };
      } else if (action === "cardio") {
        modal = { type: "cardio" };
      } else if (action === "water") {
        const amount = Number(button.dataset.amount);
        day.water = Math.max(0, Math.min(9999, day.water + amount));
        saveAndRender();
        return;
      } else if (action === "exercise") {
        openExercise(button.dataset.id);
        return;
      } else if (action === "close-modal") {
        modal = null;
      } else if (action === "overlay-close" && event.target === button) {
        modal = null;
      }
      render();
    });

    modalRoot.addEventListener("click", async function (event) {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      const day = getDay(todayKey());
      if (action === "save-form") {
        const form = button.closest("form[data-form]");
        if (form) {
          if (!form.reportValidity()) return;
          button.disabled = true;
          try {
            await saveForm(form);
          } catch (error) {
            const label = form.dataset.form === "meal" ? "a refeição" : "a série";
            showDatabaseError("Não foi possível salvar " + label +
              " no Supabase. Confira sua conexão; os dados preenchidos foram mantidos.", true);
            button.disabled = false;
          }
        }
        return;
      } else if (action === "close-modal" || (action === "overlay-close" && event.target === button)) {
        modal = null;
      } else if (action === "meal-skip") {
        button.disabled = true;
        try {
          await upsertRefeicao({
            data: todayKey(),
            refeicao: button.dataset.id,
            status: "skipped",
            descricao: ""
          });
          dataRevision += 1;
          day.meals[button.dataset.id] = { status: "skipped", text: "" };
          modal = null;
          dataError = "";
          render();
        } catch (error) {
          showDatabaseError("Não foi possível atualizar a refeição no Supabase. Confira sua conexão e tente novamente.", true);
          button.disabled = false;
        }
        return;
      } else if (action === "remove-cardio") {
        day.cardio = null;
        modal = null;
        saveAndRender();
        return;
      } else if (action === "remove-set") {
        const sets = day.sets[button.dataset.id] || [];
        const serie = sets[Number(button.dataset.index)];
        if (!serie || serie.id == null) {
          showDatabaseError("Não foi possível identificar a série para excluir. Atualize os dados e tente novamente.", true);
          return;
        }
        button.disabled = true;
        try {
          await excluirSerie(serie.id);
          dataRevision += 1;
        } catch (error) {
          showDatabaseError("Não foi possível excluir a série do Supabase. Confira sua conexão e tente novamente.", true);
          button.disabled = false;
          return;
        }
        sets.splice(Number(button.dataset.index), 1);
        if (!sets.length) delete day.sets[button.dataset.id];
        dataError = "";
        render();
        return;
      }
      render();
    });

    modalRoot.addEventListener("submit", async function (event) {
      const form = event.target.closest("form[data-form]");
      if (!form) return;
      event.preventDefault();
      try {
        await saveForm(form);
      } catch (error) {
        const label = form.dataset.form === "meal" ? "a refeição" : "a série";
        showDatabaseError("Não foi possível salvar " + label +
          " no Supabase. Confira sua conexão; os dados preenchidos foram mantidos.", true);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal) {
        modal = null;
        render();
      }
    });

    loadState();
    getDay(todayKey());
    render();
    void loadRemoteDay(todayKey());
