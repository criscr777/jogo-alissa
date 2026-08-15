const socket = io();
// myRole é definido no HTML antes de carregar este script
// Verifica se myRole foi definido
if (typeof myRole === "undefined") {
  console.error(
    "❌ myRole não foi definido! Verifique se é definido antes de script.js",
  );
}

const story = {
  inicio: {
    speaker: "Narrador",
    text: "A maré recuou de forma anormal na praia mística, revelando uma fenda profunda na rocha costeira. Um vento gélido sai de dentro, trazendo um som sussurrante que parece chamar por nome.",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Santiago, sente essa frequência no ar! Há uma câmara secreta ancestral ali embaixo.'",
        target: "fenda_alissa_1",
        nextTurn: "santiago",
      },
      {
        text: "Alissa: 'Preciso descer imediatamente para investigar a origem desse chamado.'",
        target: "fenda_alissa_2",
        nextTurn: "santiago",
      },
    ],
  },
  fenda_alissa_1: {
    speaker: "Santiago",
    text: "Frequência no ar? Alissa, isso é só corrente de ar comprimido batendo nas paredes de calcário. Geologia pura. Mas que a entrada é esquisita, isso é.",
    turnOwner: "santiago",
    choices: [
      {
        text: "Santiago: 'Vou checar a estabilidade estrutural da rocha antes de qualquer passo falso.'",
        target: "santiago_checa_rocha",
        nextTurn: "alissa",
      },
      {
        text: "Santiago: 'Pega a minha lanterna tática de alta potência, você vai precisar ver no escuro.'",
        target: "santiago_da_lanterna",
        nextTurn: "alissa",
      },
    ],
  },
  fenda_alissa_2: {
    speaker: "Santiago",
    text: "Espera! Não vai pulando assim. O terreno é instável. Deixa eu ir na frente abrindo o caminho.",
    turnOwner: "santiago",
    choices: [
      {
        text: "Santiago: 'Segura na minha mão, vamos descer juntos com cuidado técnico.'",
        target: "santiago_descem_juntos",
        nextTurn: "alissa",
      },
      {
        text: "Santiago: 'Vou amarrar uma corda de segurança na rocha firme lá em cima.'",
        target: "santiago_usa_corda",
        nextTurn: "alissa",
      },
    ],
  },
  santiago_checa_rocha: {
    speaker: "Alissa",
    text: "A estrutura é antiga, mas veja essas marcas nas paredes... São runas de navegação marítima de uma civilização que mapeava correntes magnéticas!",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'As runas indicam que devemos seguir pelo corredor da esquerda, onde o ar é mais leve.'",
        target: "tunel_esquerda",
        nextTurn: "santiago",
      },
      {
        text: "Alissa: 'Não, o fluxo de energia aponta para o salão central subterrâneo.'",
        target: "sala_central",
        nextTurn: "santiago",
      },
    ],
  },
  santiago_da_lanterna: {
    speaker: "Alissa",
    text: "Obrigada, Santi. Com essa luz dá para ver... Caramba, olhe o tamanho dessas pegadas fossilizadas na lama seca!",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Isso confirma lendas antigas sobre guardiões das marés!'",
        target: "tunel_esquerda",
        nextTurn: "santiago",
      },
      {
        text: "Alissa: 'Vamos analisar o solo com cautela para ver se há risco de desabamento.'",
        target: "sala_central",
        nextTurn: "santiago",
      },
    ],
  },
  santiago_descem_juntos: {
    speaker: "Alissa",
    text: "Sua mão está firme... Com você aqui embaixo, até o escuro dessa caverna parece menos assustador.",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Olhe para o teto da caverna, está refletindo constelações inteiras!'",
        target: "sala_central",
        nextTurn: "santiago",
      },
      {
        text: "Alissa: 'Vamos avançar com cautela, sinto uma presença incomum logo adiante.'",
        target: "tunel_esquerda",
        nextTurn: "santiago",
      },
    ],
  },
  santiago_usa_corda: {
    speaker: "Alissa",
    text: "Perfeito! Com a corda estamos seguros. Descemos direto para um salão repleto de pilares de cristal resonante.",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Se tocarmos nos cristais na ordem certa, podemos ativar a frequência deles.'",
        target: "sala_central",
        nextTurn: "santiago",
      },
      {
        text: "Alissa: 'Vamos mapear o perímetro primeiro para evitar armadilhas mecânicas.'",
        target: "tunel_esquerda",
        nextTurn: "santiago",
      },
    ],
  },
  tunel_esquerda: {
    speaker: "Santiago",
    text: "O túnel da esquerda estreitou bastante. E olha só... tem uma porta de pedra com três discos giratórios cheios de símbolos matemáticos e astronômicos.",
    turnOwner: "santiago",
    choices: [
      {
        text: "Santiago: 'Deixa que eu resolvo isso usando lógica numérica e o alinhamento das luas.'",
        target: "santiago_resolve_math",
        nextTurn: "alissa",
      },
      {
        text: "Santiago: 'Alissa, sua intuição diz qual símbolo devemos girar primeiro?'",
        target: "alissa_guia_puzzle",
        nextTurn: "alissa",
      },
    ],
  },
  sala_central: {
    speaker: "Santiago",
    text: "Chegamos ao núcleo do complexo. Tem um abismo no meio e uma ponte de pedra retrátil que está recolhida. Precisamos achar o painel de controle.",
    turnOwner: "santiago",
    choices: [
      {
        text: "Santiago: 'Vou hackear o painel elétrico oxidado usando ferramentas improvisadas da minha mochila.'",
        target: "santiago_hackeia_painel",
        nextTurn: "alissa",
      },
      {
        text: "Santiago: 'Alissa, canaliza sua energia naqueles orbes para energizar a ponte!'",
        target: "alissa_energiza_orbes",
        nextTurn: "alissa",
      },
    ],
  },
  santiago_resolve_math: {
    speaker: "Alissa",
    text: "Impressionante! Sua lógica matemática combinada com os meus símbolos místicos destravou a porta perfeitamente.",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Viu só? Ciência e mistério caminham lado a lado.'",
        target: "climax_final",
        nextTurn: "santiago",
      },
    ],
  },
  alissa_guia_puzzle: {
    speaker: "Santiago",
    text: "Girei exatamente onde você apontou... E a porta se abriu com um som harmonioso de sinos antigos!",
    turnOwner: "santiago",
    choices: [
      {
        text: "Santiago: 'Ok, eu me rendo. Sua intuição acertou em cheio dessa vez.'",
        target: "climax_final",
        nextTurn: "alissa",
      },
    ],
  },
  santiago_hackeia_painel: {
    speaker: "Alissa",
    text: "A ponte de pedra começou a se mover e encaixou com precisão cirúrgica! Você é incrível com as mãos.",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Vamos atravessar correndo antes que o mecanismo feche de novo!'",
        target: "climax_final",
        nextTurn: "santiago",
      },
    ],
  },
  alissa_energiza_orbes: {
    speaker: "Santiago",
    text: "Os orbes responderam ao seu toque... A sala inteira iluminou-se com uma luz azul vibrante. A ponte desceu sozinha!",
    turnOwner: "santiago",
    choices: [
      {
        text: "Santiago: 'Isso foi surreal... Minha mente científica está bugada, mas foi lindo.'",
        target: "climax_final",
        nextTurn: "alissa",
      },
    ],
  },
  climax_final: {
    speaker: "Narrador",
    text: "Atravessando o último portal, vocês encontram o altar principal: uma nascente de água cristalina pura cercada por cristais que guardam o segredo de toda a costa. O perigo ficou para trás.",
    vfx: "vfx-romance",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Nós desvendamos o impossível juntos, Santi. Cético e mística, a dupla perfeita.'",
        target: "final_romance",
        nextTurn: "santiago",
      },
    ],
  },
  final_romance: {
    speaker: "Santiago",
    text: "Com certeza. O mundo pode ter milhares de explicações científicas, mas a única coisa que importa para mim agora é você.",
    animAlissa: "kiss-alissa",
    animSantiago: "kiss-santiago",
    vfx: "vfx-romance",
    turnOwner: "santiago",
    choices: [
      {
        text: "Santiago: Puxar ela para um beijo inesquecível.",
        target: "fim_reiniciar",
        nextTurn: "alissa",
      },
    ],
  },
  fim_reiniciar: {
    speaker: "Narrador",
    text: "FIM DA AVENTURA. Vocês desvendaram o mistério e a jornada está apenas começando!",
    animAlissa: "kiss-alissa",
    animSantiago: "kiss-santiago",
    vfx: "vfx-romance",
    turnOwner: "alissa",
    choices: [
      {
        text: "Alissa: 'Vamos explorar tudo de novo!'",
        target: "inicio",
        nextTurn: "santiago",
      },
    ],
  },
};

const dialogText = document.getElementById("dialog-text");
const speakerName = document.getElementById("speaker-name");
const choicesContainer = document.getElementById("choices-container");
const waitingMsg = document.getElementById("waiting-msg");
const charAlissa = document.getElementById("char-alissa");
const charSantiago = document.getElementById("char-santiago");
const vfxOverlay = document.getElementById("vfx-overlay");

let typeInterval;
let isInitialized = false;

// Atualiza quando o servidor envia o estado do jogo
socket.on("update-game", (state) => {
  console.log(`📖 Cena atualizada: ${state.scene} | Turno: ${state.turn}`);
  renderScene(state.scene, state.turn);
  isInitialized = true;
});

// Evento de conexão
socket.on("connect", () => {
  console.log(`✓ Conectado ao servidor como ${myRole}`);
});

// Evento de erro de conexão
socket.on("connect_error", (error) => {
  console.error("❌ Erro de conexão:", error);
});

function renderScene(sceneId, currentTurn) {
  const scene = story[sceneId];

  if (!scene) {
    console.error(`❌ Cena não encontrada: ${sceneId}`);
    return;
  }

  clearInterval(typeInterval);
  dialogText.innerHTML = "";
  choicesContainer.innerHTML = "";

  // Atualiza sprites com animações
  charAlissa.className = `sprite ${scene.animAlissa || ""}`;
  charSantiago.className = `sprite ${scene.animSantiago || ""}`;

  // Mostra personagens na cena inicial
  if (sceneId === "inicio") {
    charAlissa.classList.remove("hide");
    charSantiago.classList.remove("hide");
  } else {
    // Oculta quando não está na cena inicial
    if (!scene.animAlissa) charAlissa.classList.add("hide");
    if (!scene.animSantiago) charSantiago.classList.add("hide");
  }

  // Aplica efeitos visuais
  vfxOverlay.className = scene.vfx || "";

  // Configura nome do falante e cor
  speakerName.innerText = scene.speaker;
  if (scene.speaker === "Alissa") speakerName.style.color = "#ff79c6";
  else if (scene.speaker === "Santiago") speakerName.style.color = "#8be9fd";
  else speakerName.style.color = "#f1fa8c";

  // Anima o texto digitado
  let charIndex = 0;
  typeInterval = setInterval(() => {
    if (charIndex < scene.text.length) {
      dialogText.innerHTML += scene.text.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typeInterval);

      // Verifica se o myRole foi definido
      if (typeof myRole === "undefined") {
        console.error("❌ myRole não está definido!");
        return;
      }

      // Habilita botões apenas se for o turno do jogador
      if (scene.turnOwner === myRole) {
        waitingMsg.classList.add("hidden-block");
        showChoices(scene.choices);
      } else {
        waitingMsg.classList.remove("hidden-block");
        const otherPlayer = myRole === "alissa" ? "Santiago" : "Alissa";
        waitingMsg.innerText = `Aguardando a decisão de ${otherPlayer}...`;
      }
    }
  }, 30);
}

function showChoices(choices) {
  if (!choices || choices.length === 0) {
    console.warn("⚠️ Nenhuma escolha disponível");
    return;
  }

  choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;
    btn.style.animationDelay = `${index * 0.15}s`;

    btn.onclick = () => {
      console.log(`→ Escolha feita: ${choice.text}`);
      choicesContainer.innerHTML = "";
      socket.emit("make-choice", {
        nextScene: choice.target,
        nextTurn: choice.nextTurn,
      });
    };

    choicesContainer.appendChild(btn);
  });
}
