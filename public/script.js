const socket = io();

const story = {
  inicio: {
    chapter: "CAPÍTULO 1 — A CONCHA",
    speaker: "Narrador",
    text: "A maré baixou de repente. Na areia molhada, uma concha de cristal pulsa com uma luz azul que nenhum dos dois já viu.",
    turn: "santiago",
    choices: [
      { text: "Vou pegar. Se isso for uma armadilha, a gente descobre juntos.", next: "concha", nextTurn: "alissa", effects: { coragem: 1, confianca: 1 } },
      { text: "Não toca. Primeiro precisamos entender o que é isso.", next: "concha", nextTurn: "alissa", effects: { prudencia: 1, curiosidade: 1 } }
    ]
  },
  concha: {
    chapter: "CAPÍTULO 1 — A CONCHA",
    speaker: "Alissa",
    text: "A concha reage ao toque de Santiago. Uma linha azul se desenha na areia e aponta para a velha torre de observação.",
    turn: "alissa",
    choices: [
      { text: "Vamos seguir. Eu quero descobrir o que ela está tentando mostrar.", next: "torre", nextTurn: "santiago", effects: { curiosidade: 1, coragem: 1 } },
      { text: "Talvez seja melhor ir embora antes que isso piore.", next: "torre", nextTurn: "santiago", effects: { prudencia: 1, medo: 1 } }
    ]
  },
  torre: {
    chapter: "CAPÍTULO 2 — A TORRE",
    speaker: "Santiago",
    text: "Dentro da torre existe um mapa antigo. Um símbolo no centro é idêntico ao desenho da concha. No canto alguém escreveu: ‘A resposta está no farol.’",
    turn: "santiago",
    choices: [
      { text: "Vamos ao farol. Mas fica perto de mim.", next: "caminho", nextTurn: "alissa", effects: { romance: 1, confianca: 1 } },
      { text: "Vamos investigar a torre antes. Não quero cair numa armadilha.", next: "caminho", nextTurn: "alissa", effects: { prudencia: 1, curiosidade: 1 } }
    ]
  },
  caminho: {
    chapter: "CAPÍTULO 2 — O CAMINHO",
    speaker: "Alissa",
    text: "No caminho para o farol, Alissa percebe que Santiago está inquieto. A luz da concha reflete no rosto dele.",
    turn: "alissa",
    choices: [
      { text: "Você está com medo? Pode falar comigo.", next: "farol", nextTurn: "santiago", effects: { romance: 1, confianca: 2 } },
      { text: "Se você continuar fazendo essa cara, vou começar a rir.", next: "farol", nextTurn: "santiago", effects: { humor: 2, romance: 1 } }
    ]
  },
  farol: {
    chapter: "CAPÍTULO 2 — O FAROL",
    speaker: "Santiago",
    text: "No alto do farol há uma fotografia de Alissa. No verso, uma data de vinte e oito anos atrás. O silêncio entre os dois pesa mais que o vento.",
    turn: "santiago",
    choices: [
      { text: "Eu não sei o que está acontecendo, mas acredito em você.", next: "verdade", nextTurn: "alissa", effects: { confianca: 2, romance: 2 } },
      { text: "Precisamos descobrir a verdade antes de confiar nessa história.", next: "verdade", nextTurn: "alissa", effects: { prudencia: 2, curiosidade: 1 } }
    ]
  },
  verdade: {
    chapter: "CAPÍTULO 3 — A VERDADE",
    speaker: "Alissa",
    text: "Alissa finalmente conta o que escondia: sua avó falava de uma ilha que surgia apenas quando a maré revelava a concha. A ilha guardava uma memória da família.",
    turn: "alissa",
    choices: [
      { text: "Então vamos descobrir isso juntos. Você não precisa carregar isso sozinha.", next: "ilha", nextTurn: "santiago", effects: { romance: 2, confianca: 2 } },
      { text: "Eu ainda tenho perguntas, mas não vou deixar você enfrentar isso sozinha.", next: "ilha", nextTurn: "santiago", effects: { confianca: 1, prudencia: 1, romance: 1 } }
    ]
  },
  ilha: {
    chapter: "CAPÍTULO 3 — A ILHA",
    speaker: "Santiago",
    text: "A concha abre um caminho sobre o mar. Os dois chegam a uma pequena ilha escondida pela névoa. No centro, uma pedra guarda uma inscrição: ‘Só se abre para quem escolhe ficar.’",
    turn: "santiago",
    choices: [
      { text: "Eu fico. Mesmo sem saber o que vem depois.", next: "coracao", nextTurn: "alissa", effects: { coragem: 2, romance: 2 } },
      { text: "Fico, mas quero que a gente saia daqui juntos, aconteça o que acontecer.", next: "coracao", nextTurn: "alissa", effects: { confianca: 2, prudencia: 1, romance: 1 } }
    ]
  },
  coracao: {
    chapter: "CAPÍTULO 3 — O CORAÇÃO DA MARÉ",
    speaker: "Alissa",
    text: "A pedra se ilumina. A concha começa a desaparecer, deixando no lugar uma pequena marca brilhante na mão de Alissa. A ilha não era uma armadilha: era uma despedida.",
    turn: "alissa",
    choices: [
      { text: "Então a aventura acaba aqui? Eu esperava que durasse mais.", next: "final", nextTurn: "santiago", effects: { romance: 2, humor: 1 } },
      { text: "Talvez a concha só tenha nos trazido até onde precisávamos chegar.", next: "final", nextTurn: "santiago", effects: { confianca: 1, curiosidade: 1, romance: 1 } }
    ]
  },
  final: {
    chapter: "EPÍLOGO — DEPOIS DA MARÉ",
    speaker: "Santiago",
    text: "De volta à praia, o céu começa a clarear. A concha se foi, mas a marca ainda brilha. Santiago olha para Alissa e sorri. O mistério terminou. O que começa agora é outra história.",
    turn: "santiago",
    choices: [
      { text: "Vamos voltar aqui amanhã? Sem mistérios. Só nós dois.", next: "fim", nextTurn: "alissa", effects: { romance: 2 } },
      { text: "Acho que essa noite merece um café e uma longa conversa.", next: "fim", nextTurn: "alissa", effects: { romance: 1, humor: 1 } }
    ]
  },
  fim: {
    chapter: "FIM — A MARÉ DE VIDRO",
    speaker: "Narrador",
    text: "Algumas histórias terminam quando o mistério é resolvido. Outras começam exatamente nesse momento. Santiago e Alissa deixam a praia lado a lado, sem saber o que virá depois — e, pela primeira vez, sem pressa de descobrir.",
    ending: true
  }
};

let currentState = null;
const $ = (id) => document.getElementById(id);

function renderSpeech(scene) {
  const speaker = scene.speaker || "Narrador";
  $("speaker-name").textContent = speaker;
  $("dialog-text").textContent = scene.text || "";
  $("chapter-title").textContent = scene.chapter || "";

  const alissa = $("char-alissa");
  const santiago = $("char-santiago");
  alissa.classList.remove("hide", "inactive-character");
  santiago.classList.remove("hide", "inactive-character");

  if (speaker === "Alissa") santiago.classList.add("inactive-character");
  if (speaker === "Santiago") alissa.classList.add("inactive-character");

  document.querySelectorAll(".character-bubble").forEach((el) => el.remove());
  if (speaker === "Alissa" || speaker === "Santiago") {
    const bubble = document.createElement("div");
    bubble.className = "character-bubble";
    bubble.dataset.speaker = speaker.toLowerCase();
    bubble.textContent = scene.text || "";
    $("characters-layer").appendChild(bubble);
  }
}

function showChoiceBubble(role, text) {
  document.querySelectorAll(".choice-bubble").forEach((el) => el.remove());
  const bubble = document.createElement("div");
  bubble.className = "choice-bubble";
  bubble.dataset.role = role;
  bubble.textContent = text;
  $("characters-layer").appendChild(bubble);
}

function renderChoices(state) {
  const container = $("choices-container");
  container.innerHTML = "";
  const scene = story[state.scene];
  if (!scene) return;

  if (scene.ending) {
    $("waiting-msg").textContent = "Fim da história 💙";
    $("waiting-msg").classList.remove("hidden-block");
    return;
  }

  if (state.turn !== myRole) {
    const name = state.turn === "santiago" ? "Santiago" : "Alissa";
    $("waiting-msg").textContent = `Agora é a vez de ${name}. Aguarde a escolha...`;
    $("waiting-msg").classList.remove("hidden-block");
    return;
  }

  $("waiting-msg").classList.add("hidden-block");
  scene.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "story-choice";
    button.textContent = choice.text;
    button.addEventListener("click", () => choose(index));
    container.appendChild(button);
  });
}

function choose(index) {
  if (!currentState || currentState.turn !== myRole) return;
  const scene = story[currentState.scene];
  const choice = scene?.choices?.[index];
  if (!choice) return;

  showChoiceBubble(myRole, choice.text);
  document.querySelectorAll(".story-choice").forEach((button) => {
    button.disabled = true;
  });

  socket.emit("make-choice", {
    choiceIndex: index,
    nextScene: choice.next,
    nextTurn: choice.nextTurn,
    effects: choice.effects || {}
  });
}

function render(state) {
  currentState = state;
  const scene = story[state.scene] || story.inicio;
  renderSpeech(scene);
  renderChoices(state);
}

socket.on("connect", () => socket.emit("join-game", { role: myRole }));
socket.on("game-state", render);
socket.on("choice-made", ({ role, choiceIndex }) => {
  const scene = currentState && story[currentState.scene];
  const text = scene?.choices?.[choiceIndex]?.text;
  if (text && role !== myRole) showChoiceBubble(role, text);
});
socket.on("error-message", (message) => alert(message));

window.restartGame = () => socket.emit("restart-game");
render({ scene: "inicio", turn: "santiago", lastChoice: null, stats: {}, players: {} });
