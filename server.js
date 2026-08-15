const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const PORT = process.env.PORT || 3000;

// ============================================================
// ARQUIVOS PÚBLICOS
// ============================================================

app.use(express.static(path.join(__dirname, "public")));

// ============================================================
// ESTADO DA HISTÓRIA
// ============================================================

const game = {
  scene: "inicio",

  players: {
    santiago: null,
    alissa: null,
  },

  choices: {
    santiago: null,
    alissa: null,
  },

  stats: {
    romance: 0,
    confianca: 0,
    curiosidade: 0,
    coragem: 0,
    prudencia: 0,
    humor: 0,
    medo: 0,
    desconfianca: 0,
  },

  transitions: {},
};

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function getPlayerCount() {
  let count = 0;

  if (game.players.santiago) {
    count++;
  }

  if (game.players.alissa) {
    count++;
  }

  return count;
}

function getPlayerRole(socketId) {
  if (game.players.santiago === socketId) {
    return "santiago";
  }

  if (game.players.alissa === socketId) {
    return "alissa";
  }

  return null;
}

function broadcastGameState() {
  io.emit("update-game", {
    scene: game.scene,

    choices: {
      santiago: game.choices.santiago,

      alissa: game.choices.alissa,
    },

    stats: {
      ...game.stats,
    },

    players: {
      santiago: Boolean(game.players.santiago),

      alissa: Boolean(game.players.alissa),
    },
  });
}

function broadcastChoiceStatus() {
  io.emit("choice-status", {
    choices: {
      santiago: game.choices.santiago,

      alissa: game.choices.alissa,
    },
  });
}

// ============================================================
// APLICAR EFEITOS DA ESCOLHA
// ============================================================

function applyChoiceEffects(sceneId, player, choiceIndex) {
  /*
   * O servidor recebe o mapa de escolhas do cliente.
   * Os efeitos reais da escolha ficam definidos pelo
   * próprio script da história.
   *
   * Para evitar que cada cliente tenha que decidir o
   * estado global sozinho, o servidor recebe os efeitos
   * junto da escolha quando necessário.
   */

  return;
}

// ============================================================
// REGISTRAR ESCOLHA
// ============================================================

function registerChoice(player, choiceIndex) {
  if (player !== "santiago" && player !== "alissa") {
    return false;
  }

  if (choiceIndex !== 0 && choiceIndex !== 1) {
    return false;
  }

  game.choices[player] = choiceIndex;

  return true;
}

// ============================================================
// AVANÇAR A HISTÓRIA
// ============================================================

function resolveChoices() {
  const santiagoChoice = game.choices.santiago;

  const alissaChoice = game.choices.alissa;

  if (santiagoChoice === null || santiagoChoice === undefined) {
    return;
  }

  if (alissaChoice === null || alissaChoice === undefined) {
    return;
  }

  /*
   * A chave é formada assim:
   *
   * Santiago 0 + Alissa 0
   *       ↓
   *       0-0
   *
   * Santiago 0 + Alissa 1
   *       ↓
   *       0-1
   *
   * Santiago 1 + Alissa 0
   *       ↓
   *       1-0
   *
   * Santiago 1 + Alissa 1
   *       ↓
   *       1-1
   */

  const combination = `${santiagoChoice}-${alissaChoice}`;

  const currentTransitions = game.transitions[game.scene];

  if (!currentTransitions) {
    console.error("Não existem transições para:", game.scene);

    return;
  }

  const nextScene = currentTransitions[combination];

  if (!nextScene) {
    console.error("Combinação sem destino:", game.scene, combination);

    return;
  }

  console.log(`Cena: ${game.scene}`);

  console.log(`Santiago escolheu: ${santiagoChoice}`);

  console.log(`Alissa escolheu: ${alissaChoice}`);

  console.log(`Combinação: ${combination}`);

  console.log(`Próxima cena: ${nextScene}`);

  // --------------------------------------------------------
  // AVANÇA
  // --------------------------------------------------------

  game.scene = nextScene;

  // --------------------------------------------------------
  // LIMPA AS ESCOLHAS
  // --------------------------------------------------------

  game.choices = {
    santiago: null,
    alissa: null,
  };

  // --------------------------------------------------------
  // AVISA OS CLIENTES
  // --------------------------------------------------------

  io.emit("story-transition", {
    scene: nextScene,
    combination,
  });

  broadcastGameState();
}

// ============================================================
// CONEXÃO SOCKET.IO
// ============================================================

io.on("connection", (socket) => {
  console.log("Novo jogador conectado:", socket.id);

  // ====================================================
  // ENTRAR NO JOGO
  // ====================================================

  socket.on("join-game", (data) => {
    const requestedRole =
      data && data.role ? String(data.role).toLowerCase() : null;

    let role = requestedRole;

    /*
     * Se o jogador pedir Santiago e
     * Santiago estiver livre, entra como Santiago.
     */

    if (role === "santiago" && !game.players.santiago) {
      game.players.santiago = socket.id;
    } else if (role === "alissa" && !game.players.alissa) {

    /*
     * Se pedir Alissa e estiver livre.
     */
      game.players.alissa = socket.id;
    } else if (!game.players.santiago) {

    /*
     * Caso a vaga solicitada já esteja ocupada,
     * tenta colocar automaticamente na outra.
     */
      role = "santiago";

      game.players.santiago = socket.id;
    } else if (!game.players.alissa) {
      role = "alissa";

      game.players.alissa = socket.id;
    } else {
      socket.emit("error-message", "A sala já está cheia.");

      return;
    }

    socket.data.role = role;

    console.log(`${role} entrou: ${socket.id}`);

    socket.emit("role-assigned", {
      role,
    });

    socket.emit("update-game", {
      scene: game.scene,

      choices: {
        santiago: game.choices.santiago,

        alissa: game.choices.alissa,
      },

      stats: {
        ...game.stats,
      },

      players: {
        santiago: Boolean(game.players.santiago),

        alissa: Boolean(game.players.alissa),
      },
    });

    io.emit("players-update", {
      santiago: Boolean(game.players.santiago),

      alissa: Boolean(game.players.alissa),

      count: getPlayerCount(),
    });
  });

  // ====================================================
  // RECEBER MAPA DE TRANSIÇÕES
  // ====================================================

  socket.on("story-ready", (data) => {
    if (data && data.transitions) {
      game.transitions = data.transitions;

      console.log("Mapa da história recebido.");
    }
  });

  // ====================================================
  // ESCOLHA
  // ====================================================

  socket.on("make-choice", (data) => {
    const player = socket.data.role || getPlayerRole(socket.id);

    if (!player) {
      socket.emit("error-message", "Você ainda não entrou na partida.");

      return;
    }

    if (!data) {
      return;
    }

    const sceneId = data.sceneId;

    const choiceIndex = Number(data.choiceIndex);

    // --------------------------------------------
    // CONFERE A CENA
    // --------------------------------------------

    if (sceneId !== game.scene) {
      socket.emit(
        "error-message",
        "A história já avançou. Aguarde a atualização.",
      );

      return;
    }

    // --------------------------------------------
    // CONFERE ESCOLHA
    // --------------------------------------------

    if (choiceIndex !== 0 && choiceIndex !== 1) {
      socket.emit("error-message", "Escolha inválida.");

      return;
    }

    // --------------------------------------------
    // NÃO PERMITE ESCOLHER DUAS VEZES
    // --------------------------------------------

    if (game.choices[player] !== null) {
      socket.emit("error-message", "Você já fez sua escolha.");

      return;
    }

    // --------------------------------------------
    // REGISTRA
    // --------------------------------------------

    registerChoice(player, choiceIndex);

    console.log(`${player} escolheu ${choiceIndex}`);

    // --------------------------------------------
    // AVISA O OUTRO JOGADOR
    // --------------------------------------------

    broadcastChoiceStatus();

    // --------------------------------------------
    // VERIFICA SE OS DOIS ESCOLHERAM
    // --------------------------------------------

    if (game.choices.santiago !== null && game.choices.alissa !== null) {
      resolveChoices();
    }
  });

  // ====================================================
  // RESET
  // ====================================================

  socket.on("restart-game", () => {
    game.scene = "inicio";

    game.choices = {
      santiago: null,
      alissa: null,
    };

    game.stats = {
      romance: 0,
      confianca: 0,
      curiosidade: 0,
      coragem: 0,
      prudencia: 0,
      humor: 0,
      medo: 0,
      desconfianca: 0,
    };

    broadcastGameState();
  });

  // ====================================================
  // DESCONEXÃO
  // ====================================================

  socket.on("disconnect", () => {
    const role = socket.data.role;

    console.log(`Jogador desconectou: ${socket.id}`);

    if (role === "santiago" && game.players.santiago === socket.id) {
      game.players.santiago = null;

      game.choices.santiago = null;
    }

    if (role === "alissa" && game.players.alissa === socket.id) {
      game.players.alissa = null;

      game.choices.alissa = null;
    }

    io.emit("players-update", {
      santiago: Boolean(game.players.santiago),

      alissa: Boolean(game.players.alissa),

      count: getPlayerCount(),
    });

    broadcastChoiceStatus();
  });
});

// ============================================================
// ROTA PRINCIPAL
// ============================================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

server.listen(PORT, () => {
  console.log("");
  console.log("==========================================");

  console.log("   A MARÉ DE VIDRO");

  console.log("   Servidor multiplayer iniciado");

  console.log(`   Porta: ${PORT}`);

  console.log("==========================================");

  console.log("");
});

// ============================================================
// HISTÓRIA
// ============================================================

const story = {
  // ========================================================
  // INÍCIO
  // ========================================================

  inicio: {
    title: "A Maré de Vidro",

    text: `
            A última aula terminou há alguns minutos.

            O corredor está quase vazio.

            Santiago está guardando as coisas quando percebe
            uma movimentação estranha do lado de fora.

            Alissa também percebe.

            Por alguns segundos, os dois ficam olhando para
            o mesmo lugar.

            No fim do corredor existe uma porta que deveria
            estar trancada.

            Ela está aberta.

            E há uma luz azul vindo de dentro.
        `,

    santiago: {
      choices: [
        {
          text: "Ir até a porta para descobrir o que está acontecendo.",
          effects: {
            curiosidade: 2,
            coragem: 1,
          },
        },

        {
          text: "Fingir que não viu e esperar para ver se Alissa vai primeiro.",
          effects: {
            humor: 1,
            prudencia: 1,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Ir até a porta antes que Santiago faça alguma besteira.",
          effects: {
            coragem: 1,
            curiosidade: 2,
          },
        },

        {
          text: "Ficar onde está e observar Santiago de longe.",
          effects: {
            prudencia: 2,
            curiosidade: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "corredor",
      "0-1": "porta",
      "1-0": "porta",
      "1-1": "corredor",
    },
  },

  // ========================================================
  // CORREDOR
  // ========================================================

  corredor: {
    title: "O corredor vazio",

    text: `
            Os dois acabam chegando perto da porta.

            O estranho é que, quanto mais perto chegam,
            mais silencioso fica o corredor.

            Nenhum professor.

            Nenhum aluno.

            Nem mesmo o barulho das salas.

            Santiago olha para Alissa.

            Ela percebe.

            — Que foi?

            A luz azul pulsa novamente atrás da porta.

            Por um instante, parece que alguma coisa se mexeu.
        `,

    santiago: {
      choices: [
        {
          text: "Fazer uma piada para provocar Alissa.",
          effects: {
            humor: 2,
            romance: 1,
          },
        },

        {
          text: "Ficar sério e perguntar se ela também viu aquilo.",
          effects: {
            confianca: 1,
            curiosidade: 1,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Mandar Santiago parar de graça e prestar atenção.",
          effects: {
            coragem: 1,
            humor: 1,
          },
        },

        {
          text: "Fingir que não está assustada e entrar mesmo assim.",
          effects: {
            coragem: 2,
            romance: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "brincadeira",
      "0-1": "entrada",
      "1-0": "entrada",
      "1-1": "entrada",
    },
  },

  // ========================================================
  // PORTA
  // ========================================================

  porta: {
    title: "A porta proibida",

    text: `
            A porta range quando é empurrada.

            Do outro lado existe uma pequena sala que nenhum
            dos dois lembra de ter visto antes.

            Sobre uma mesa existe um objeto estranho.

            Parece uma concha feita de vidro.

            Ela está brilhando.

            E, no centro dela, existe uma pequena inscrição:

            "QUANDO A MARÉ SUBIR, ESCOLHA EM QUEM CONFIAR."

            O brilho aumenta.

            Então vocês escutam passos no corredor.
        `,

    santiago: {
      choices: [
        {
          text: "Pegar a concha antes que alguém apareça.",
          effects: {
            coragem: 2,
            curiosidade: 2,
          },
        },

        {
          text: "Deixar a concha e descobrir quem está vindo.",
          effects: {
            prudencia: 2,
            desconfianca: 1,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Pegar a concha junto com Santiago.",
          effects: {
            confianca: 2,
            curiosidade: 1,
          },
        },

        {
          text: "Impedir Santiago de tocar nela.",
          effects: {
            prudencia: 2,
            coragem: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "concha",
      "0-1": "passos",
      "1-0": "passos",
      "1-1": "passos",
    },
  },

  // ========================================================
  // BRINCADEIRA
  // ========================================================

  brincadeira: {
    title: "Agonia",

    text: `
            Santiago solta uma provocação.

            Alissa olha para ele com aquela expressão que
            deixa bastante claro que ele está brincando com
            a pessoa errada.

            — Tá com agonia?

            Santiago dá de ombros.

            — Eu? Nenhuma.

            — Sei.

            Ela cruza os braços.

            — Então vai. Pode ir sozinho.

            A luz azul da sala pisca novamente.

            E, por algum motivo, nenhum dos dois realmente
            parece disposto a ir embora.
        `,

    santiago: {
      choices: [
        {
          text: "Continuar provocando: 'Relaxa, faço isso com outra pessoa.'",
          effects: {
            humor: 2,
            romance: 1,
          },
        },

        {
          text: "Parar de provocar e admitir que aquilo está estranho.",
          effects: {
            confianca: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Responder: 'Vai lá. Quero ver.'",
          effects: {
            humor: 2,
            desconfianca: 1,
          },
        },

        {
          text: "Dar um passo para perto e mandar Santiago parar.",
          effects: {
            romance: 2,
            coragem: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "tensao",
      "0-1": "entrada",
      "1-0": "entrada",
      "1-1": "tensao",
    },
  },

  // ========================================================
  // ENTRADA
  // ========================================================

  entrada: {
    title: "Dentro da sala",

    text: `
            A porta fecha sozinha.

            Os dois se viram ao mesmo tempo.

            — Você fechou?

            — Não.

            O silêncio volta.

            A concha começa a emitir uma luz mais forte.

            Então surge uma frase na parede:

            "DOIS ENTRAM."

            Uma segunda frase aparece logo abaixo:

            "APENAS UM SABERÁ A VERDADE."
        `,

    santiago: {
      choices: [
        {
          text: "Examinar a parede.",
          effects: {
            curiosidade: 2,
          },
        },

        {
          text: "Examinar a concha.",
          effects: {
            curiosidade: 2,
            coragem: 1,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Examinar a porta para procurar uma saída.",
          effects: {
            prudencia: 2,
          },
        },

        {
          text: "Examinar a mensagem na parede.",
          effects: {
            curiosidade: 2,
          },
        },
      ],
    },

    transitions: {
      "0-0": "investigacao",
      "0-1": "investigacao",
      "1-0": "concha",
      "1-1": "investigacao",
    },
  },

  // ========================================================
  // CONCHA
  // ========================================================

  concha: {
    title: "A concha de vidro",

    text: `
            Assim que alguém toca na concha, uma imagem aparece.

            É a escola.

            Mas não como ela é agora.

            A escola está completamente vazia.

            O céu está vermelho.

            E existe uma enorme maré cobrindo a cidade.

            Então a imagem muda.

            Agora aparece uma praia.

            No centro da praia existe uma segunda concha.

            Uma voz sussurra:

            "ENCONTREM A SEGUNDA ANTES DA PRÓXIMA MARÉ."

            A visão desaparece.

            A porta se abre novamente.
        `,

    santiago: {
      choices: [
        {
          text: "Guardar a concha escondida.",
          effects: {
            confianca: 1,
            prudencia: 1,
          },
        },

        {
          text: "Mostrar a concha imediatamente para alguém.",
          effects: {
            coragem: 1,
            desconfianca: -1,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Confiar em Santiago e deixar que ele guarde.",
          effects: {
            confianca: 2,
          },
        },

        {
          text: "Pegar a concha e guardar você mesma.",
          effects: {
            prudencia: 1,
            desconfianca: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "segredo",
      "0-1": "conflito",
      "1-0": "segredo",
      "1-1": "conflito",
    },
  },

  // ========================================================
  // PASSOS
  // ========================================================

  passos: {
    title: "Quem está aí?",

    text: `
            Os passos ficam mais próximos.

            Santiago olha para Alissa.

            Alissa olha para Santiago.

            Não existe tempo para discutir.

            Uma sombra passa pela fresta da porta.

            Alguém está vindo.

            E vocês ainda não sabem se aquela pessoa
            está procurando vocês ou a concha.
        `,

    santiago: {
      choices: [
        {
          text: "Apagar a luz e se esconder.",
          effects: {
            prudencia: 2,
            medo: 1,
          },
        },

        {
          text: "Ficar esperando para confrontar quem entrar.",
          effects: {
            coragem: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Se esconder e puxar Santiago junto.",
          effects: {
            confianca: 1,
            prudencia: 1,
          },
        },

        {
          text: "Ficar na frente e encarar a pessoa.",
          effects: {
            coragem: 2,
          },
        },
      ],
    },

    transitions: {
      "0-0": "esconderijo",
      "0-1": "confronto",
      "1-0": "confronto",
      "1-1": "confronto",
    },
  },

  // ========================================================
  // INVESTIGAÇÃO
  // ========================================================

  investigacao: {
    title: "A mensagem",

    text: `
            A inscrição parece antiga.

            Existem símbolos pequenos ao redor das palavras.

            Alissa encontra um detalhe.

            Santiago encontra outro.

            Quando os dois aproximam as descobertas,
            os símbolos formam um mapa.

            Um ponto aparece na direção da praia.
        `,

    santiago: {
      choices: [
        {
          text: "Fotografar o mapa.",
          effects: {
            prudencia: 1,
            curiosidade: 1,
          },
        },

        {
          text: "Memorizar o mapa e não deixar rastros.",
          effects: {
            prudencia: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Confiar que Santiago memorizou o caminho.",
          effects: {
            confianca: 2,
          },
        },

        {
          text: "Copiar o mapa para garantir.",
          effects: {
            prudencia: 1,
            curiosidade: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "praia",
      "0-1": "praia",
      "1-0": "praia",
      "1-1": "praia",
    },
  },

  // ========================================================
  // SEGREDO
  // ========================================================

  segredo: {
    title: "Um acordo",

    text: `
            A escola continua normal do lado de fora.

            Pelo menos aparentemente.

            Nenhum dos dois sabe explicar o que acabou
            de acontecer.

            Mas existe uma certeza:

            a praia da visão existe.

            E a segunda concha está lá.

            Santiago olha para Alissa.

            Alissa olha para Santiago.

            Não é exatamente uma boa ideia.

            O que significa que provavelmente vocês vão fazer.
        `,

    santiago: {
      choices: [
        {
          text: "Propor que os dois investiguem juntos.",
          effects: {
            confianca: 2,
            romance: 1,
          },
        },

        {
          text: "Dizer que vai sozinho para descobrir primeiro.",
          effects: {
            coragem: 1,
            humor: 1,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Aceitar investigar junto.",
          effects: {
            confianca: 2,
          },
        },

        {
          text: "Dizer que Santiago não vai sozinho nem ferrando.",
          effects: {
            confianca: 1,
            romance: 1,
            humor: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "praia",
      "0-1": "praia",
      "1-0": "praia",
      "1-1": "praia",
    },
  },

  // ========================================================
  // CONFLITO
  // ========================================================

  conflito: {
    title: "Agonia",

    text: `
            Por alguns segundos ninguém fala.

            A concha está entre vocês.

            — Você não confia em mim?

            — Não começa.

            — Eu nem falei nada.

            — Mas eu conheço essa sua cara.

            O silêncio volta.

            A luz da concha pulsa.

            Como se estivesse esperando vocês decidirem
            alguma coisa.
        `,

    santiago: {
      choices: [
        {
          text: "Fazer outra provocação só para irritar Alissa.",
          effects: {
            humor: 2,
            romance: 1,
          },
        },

        {
          text: "Entregar a concha para ela.",
          effects: {
            confianca: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Ameaçar dar um murro nele se continuar.",
          effects: {
            humor: 2,
            romance: 1,
          },
        },

        {
          text: "Respirar fundo e confiar nele.",
          effects: {
            confianca: 2,
          },
        },
      ],
    },

    transitions: {
      "0-0": "praia",
      "0-1": "praia",
      "1-0": "praia",
      "1-1": "praia",
    },
  },

  // ========================================================
  // TENSÃO
  // ========================================================

  tensao: {
    title: "Perto demais",

    text: `
            O espaço entre os dois diminui.

            Ninguém comenta.

            Talvez porque comentar tornaria tudo estranho.

            A luz azul da concha ilumina os dois.

            Então um barulho vem do corredor.

            Dessa vez, não parece humano.

            A brincadeira acaba.

            Agora existe um problema de verdade.
        `,

    santiago: {
      choices: [
        {
          text: "Ficar ao lado de Alissa.",
          effects: {
            romance: 2,
            coragem: 1,
          },
        },

        {
          text: "Ir na frente para descobrir o que fez o barulho.",
          effects: {
            coragem: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Segurar Santiago pelo braço e ir junto.",
          effects: {
            romance: 2,
            confianca: 1,
          },
        },

        {
          text: "Mandar Santiago ficar atrás dela.",
          effects: {
            coragem: 2,
            humor: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "criatura",
      "0-1": "criatura",
      "1-0": "criatura",
      "1-1": "criatura",
    },
  },

  // ========================================================
  // ESCONDERIJO
  // ========================================================

  esconderijo: {
    title: "Silêncio",

    text: `
            Os dois se escondem.

            A porta abre.

            Uma pessoa entra.

            Ela não parece ser um professor.

            É alguém usando um casaco escuro.

            A pessoa olha diretamente para a mesa.

            E diz:

            — A primeira concha já despertou.

            Santiago e Alissa se entreolham.

            A pessoa continua:

            — Então eles também foram escolhidos.
        `,

    santiago: {
      choices: [
        {
          text: "Continuar escondido e ouvir mais.",
          effects: {
            prudencia: 2,
            curiosidade: 1,
          },
        },

        {
          text: "Sair do esconderijo.",
          effects: {
            coragem: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Ficar escondida.",
          effects: {
            prudencia: 2,
          },
        },

        {
          text: "Sair junto com Santiago.",
          effects: {
            coragem: 2,
            confianca: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "observacao",
      "0-1": "confronto",
      "1-0": "confronto",
      "1-1": "confronto",
    },
  },

  // ========================================================
  // CONFRONTO
  // ========================================================

  confronto: {
    title: "O estranho",

    text: `
            A pessoa se vira.

            Por um instante, ninguém fala.

            Então ela sorri.

            — Vocês não deveriam estar aqui.

            A concha começa a brilhar.

            — Mas agora que estão...

            A pessoa dá um passo para trás.

            — A maré já começou.
        `,

    santiago: {
      choices: [
        {
          text: "Perguntar o que é a maré.",
          effects: {
            curiosidade: 2,
          },
        },

        {
          text: "Mandar a pessoa explicar tudo imediatamente.",
          effects: {
            coragem: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Perguntar quem ela é.",
          effects: {
            prudencia: 1,
            curiosidade: 2,
          },
        },

        {
          text: "Ficar preparada para fugir.",
          effects: {
            prudencia: 2,
          },
        },
      ],
    },

    transitions: {
      "0-0": "revelacao",
      "0-1": "fuga",
      "1-0": "revelacao",
      "1-1": "fuga",
    },
  },

  // ========================================================
  // PRAIA
  // ========================================================

  praia: {
    title: "A praia",

    text: `
            Algumas horas depois, vocês chegam à praia.

            Está escuro.

            O mar parece completamente parado.

            A areia brilha com pequenos pontos azuis.

            No centro da praia existe uma marca circular.

            Exatamente como na visão.

            Santiago olha para Alissa.

            Ela olha para Santiago.

            — Tá.

            — Tá o quê?

            — Isso definitivamente não é normal.
        `,

    santiago: {
      choices: [
        {
          text: "Entrar na área marcada.",
          effects: {
            coragem: 2,
            curiosidade: 1,
          },
        },

        {
          text: "Esperar e observar o mar.",
          effects: {
            prudencia: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Entrar na marca junto com Santiago.",
          effects: {
            confianca: 2,
            coragem: 1,
          },
        },

        {
          text: "Impedir Santiago de entrar sozinho.",
          effects: {
            confianca: 1,
            prudencia: 1,
          },
        },
      ],
    },

    transitions: {
      "0-0": "segundaConcha",
      "0-1": "mare",
      "1-0": "segundaConcha",
      "1-1": "mare",
    },
  },

  // ========================================================
  // CRIATURA
  // ========================================================

  criatura: {
    title: "A coisa no corredor",

    text: `
            A criatura aparece na ponta do corredor.

            Não é exatamente um animal.

            Também não parece humana.

            Seu corpo parece feito de água escura.

            Ela olha diretamente para a concha.

            Então corre.

            A única saída é a escada que leva ao terraço.
        `,

    santiago: {
      choices: [
        {
          text: "Correr para o terraço.",
          effects: {
            coragem: 2,
          },
        },

        {
          text: "Ficar e tentar proteger a concha.",
          effects: {
            coragem: 2,
            prudencia: -1,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Correr junto com Santiago.",
          effects: {
            confianca: 1,
            coragem: 1,
          },
        },

        {
          text: "Distrair a criatura.",
          effects: {
            coragem: 2,
          },
        },
      ],
    },

    transitions: {
      "0-0": "terraço",
      "0-1": "terraço",
      "1-0": "terraço",
      "1-1": "terraço",
    },
  },

  // ========================================================
  // FINAL TEMPORÁRIO
  // ========================================================

  segundaConcha: {
    title: "A segunda concha",

    text: `
            A areia começa a se mover.

            Algo surge lentamente.

            Uma segunda concha.

            Dessa vez ela não é azul.

            É vermelha.

            Quando Santiago e Alissa chegam perto,
            as duas conchas começam a vibrar.

            Uma voz surge do mar:

            "A PRIMEIRA ESCOLHA FOI FEITA."

            "A SEGUNDA SERÁ MAIS DIFÍCIL."

            O mar recua.

            Bem longe, no horizonte, alguma coisa enorme
            aparece por alguns segundos.

            Então desaparece.

            A verdadeira história acaba de começar.
        `,

    santiago: {
      choices: [
        {
          text: "Pegar a segunda concha.",
          effects: {
            coragem: 2,
            curiosidade: 2,
          },
        },

        {
          text: "Deixar a concha onde está.",
          effects: {
            prudencia: 2,
          },
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Pegar a concha junto.",
          effects: {
            confianca: 2,
            coragem: 1,
          },
        },

        {
          text: "Mandar Santiago não tocar nela.",
          effects: {
            prudencia: 2,
          },
        },
      ],
    },

    transitions: {
      "0-0": "fimCapitulo",
      "0-1": "fimCapitulo",
      "1-0": "fimCapitulo",
      "1-1": "fimCapitulo",
    },
  },

  fimCapitulo: {
    title: "CAPÍTULO 1 — FIM",

    text: `
            A noite termina sem respostas.

            Mas uma coisa ficou clara:

            vocês encontraram a primeira pista.

            E agora existe algo observando vocês.

            A maré está chegando.

            E da próxima vez...

            vocês não estarão sozinhos.
        `,

    santiago: {
      choices: [
        {
          text: "Continuar.",
          effects: {},
        },
        {
          text: "Continuar.",
          effects: {},
        },
      ],
    },

    alissa: {
      choices: [
        {
          text: "Continuar.",
          effects: {},
        },
        {
          text: "Continuar.",
          effects: {},
        },
      ],
    },

    transitions: {
      "0-0": "fimCapitulo",
      "0-1": "fimCapitulo",
      "1-0": "fimCapitulo",
      "1-1": "fimCapitulo",
    },
  },
};

// ============================================================
// ENVIAR TRANSIÇÕES AO SERVIDOR
// ============================================================

const transitions = {};

Object.keys(story).forEach((sceneId) => {
  if (story[sceneId].transitions) {
    transitions[sceneId] = story[sceneId].transitions;
  }
});

socket.emit("story-ready", {
  transitions,
});

// ============================================================
// ENTRAR NO JOGO
// ============================================================

function joinGame(role) {
  socket.emit("join-game", {
    role,
  });
}

// ============================================================
// RECEBER PERSONAGEM
// ============================================================

socket.on("role-assigned", (data) => {
  myRole = data.role;

  console.log("Você é:", myRole);

  renderScene();
});

// ============================================================
// ATUALIZAÇÃO DO JOGO
// ============================================================

socket.on("update-game", (data) => {
  currentScene = data.scene;

  myChoice = data.choices[myRole];

  gameState = data.stats;

  renderScene();
});

// ============================================================
// STATUS DAS ESCOLHAS
// ============================================================

socket.on("choice-status", (data) => {
  if (!myRole) {
    return;
  }

  myChoice = data.choices[myRole];

  renderScene();
});

// ============================================================
// MUDANÇA DE CENA
// ============================================================

socket.on("story-transition", (data) => {
  currentScene = data.scene;

  myChoice = null;

  renderScene();
});

// ============================================================
// ERRO
// ============================================================

socket.on("error-message", (message) => {
  console.warn(message);

  showMessage(message);
});

// ============================================================
// RENDERIZAR
// ============================================================

function renderScene() {
  if (!currentScene) {
    return;
  }

  const scene = story[currentScene];

  if (!scene) {
    return;
  }

  const title = $("scene-title");

  const text = $("scene-text");

  const choices = $("choices");

  if (title) {
    title.textContent = scene.title;
  }

  if (text) {
    text.innerHTML = formatText(scene.text);
  }

  if (!choices) {
    return;
  }

  choices.innerHTML = "";

  if (!myRole) {
    choices.innerHTML = `<p>Escolha seu personagem para começar.</p>`;

    return;
  }

  const playerData = scene[myRole];

  if (!playerData || !playerData.choices) {
    return;
  }

  playerData.choices.forEach((choice, index) => {
    const button = document.createElement("button");

    button.className = "choice-button";

    button.textContent = choice.text;

    button.dataset.index = index;

    if (myChoice !== null && myChoice !== undefined) {
      button.disabled = true;
    }

    button.addEventListener("click", () => {
      makeChoice(index);
    });

    choices.appendChild(button);
  });

  updateWaitingMessage();
}

// ============================================================
// FORMATAR TEXTO
// ============================================================

function formatText(text) {
  return text
    .trim()
    .replace(/\n\s*\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}

// ============================================================
// ESCOLHER
// ============================================================

function makeChoice(index) {
  if (!myRole) {
    showMessage("Escolha seu personagem primeiro.");

    return;
  }

  if (myChoice !== null && myChoice !== undefined) {
    return;
  }

  socket.emit("make-choice", {
    sceneId: currentScene,

    choiceIndex: index,
  });
}

// ============================================================
// MENSAGEM DE ESPERA
// ============================================================

function updateWaitingMessage() {
  const waiting = $("waiting-message");

  if (!waiting) {
    return;
  }

  if (myChoice !== null && myChoice !== undefined) {
    waiting.textContent = "Você escolheu. Aguardando a escolha de Alissa...";

    return;
  }

  waiting.textContent = "";
}

// ============================================================
// MENSAGEM TEMPORÁRIA
// ============================================================

function showMessage(message) {
  let box = $("game-message");

  if (!box) {
    box = document.createElement("div");

    box.id = "game-message";

    document.body.appendChild(box);
  }

  box.textContent = message;

  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2500);
}

// ============================================================
// MOSTRAR STATUS DOS JOGADORES
// ============================================================

socket.on("players-update", (data) => {
  const santiagoStatus = $("santiago-status");

  const alissaStatus = $("alissa-status");

  if (santiagoStatus) {
    santiagoStatus.textContent = data.santiago ? "● Online" : "○ Aguardando";
  }

  if (alissaStatus) {
    alissaStatus.textContent = data.alissa ? "● Online" : "○ Aguardando";
  }
});

// ============================================================
// BOTÃO DE RECOMEÇAR
// ============================================================

const restartButton = $("restart-button");

if (restartButton) {
  restartButton.addEventListener("click", () => {
    socket.emit("restart-game");
  });
}

// ============================================================
// EXPORTAR PARA O HTML, CASO NECESSÁRIO
// ============================================================

window.joinGame = joinGame;

window.makeChoice = makeChoice;

window.story = story;
