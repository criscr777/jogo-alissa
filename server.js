// Render deploy repair: server-only entrypoint. Browser code belongs in public/script.js.
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const game = {
  scene: "inicio",
  players: { santiago: null, alissa: null },
  choices: { santiago: null, alissa: null },
  stats: { romance: 0, confianca: 0, curiosidade: 0, coragem: 0, prudencia: 0, humor: 0, medo: 0, desconfianca: 0 },
  transitions: {},
};

function getPlayerCount() {
  return Number(Boolean(game.players.santiago)) + Number(Boolean(game.players.alissa));
}

function getPlayerRole(socketId) {
  if (game.players.santiago === socketId) return "santiago";
  if (game.players.alissa === socketId) return "alissa";
  return null;
}

function broadcastGameState() {
  io.emit("update-game", {
    scene: game.scene,
    choices: { ...game.choices },
    stats: { ...game.stats },
    players: { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) },
  });
}

function broadcastChoiceStatus() {
  io.emit("choice-status", { choices: { ...game.choices } });
}

function resetGame() {
  game.scene = "inicio";
  game.choices = { santiago: null, alissa: null };
  game.stats = { romance: 0, confianca: 0, curiosidade: 0, coragem: 0, prudencia: 0, humor: 0, medo: 0, desconfianca: 0 };
}

function resolveChoices() {
  const santiagoChoice = game.choices.santiago;
  const alissaChoice = game.choices.alissa;
  if (santiagoChoice === null || alissaChoice === null) return;

  const currentTransitions = game.transitions[game.scene];
  if (!currentTransitions) {
    console.error("Não existem transições para:", game.scene);
    return;
  }

  const combination = `${santiagoChoice}-${alissaChoice}`;
  const nextScene = currentTransitions[combination];
  if (!nextScene) {
    console.error("Combinação sem destino:", game.scene, combination);
    return;
  }

  console.log(`Cena: ${game.scene} | combinação: ${combination} | próxima: ${nextScene}`);
  game.scene = nextScene;
  game.choices = { santiago: null, alissa: null };
  io.emit("story-transition", { scene: nextScene, combination });
  broadcastGameState();
}

io.on("connection", (socket) => {
  console.log("Novo jogador conectado:", socket.id);

  socket.on("join-game", (data) => {
    const requestedRole = data && data.role ? String(data.role).toLowerCase() : null;
    let role = requestedRole;

    if (role === "santiago" && !game.players.santiago) {
      game.players.santiago = socket.id;
    } else if (role === "alissa" && !game.players.alissa) {
      game.players.alissa = socket.id;
    } else if (!game.players.santiago) {
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
    socket.emit("role-assigned", { role });
    socket.emit("update-game", {
      scene: game.scene,
      choices: { ...game.choices },
      stats: { ...game.stats },
      players: { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) },
    });
    io.emit("players-update", {
      santiago: Boolean(game.players.santiago),
      alissa: Boolean(game.players.alissa),
      count: getPlayerCount(),
    });
  });

  // A história fica no cliente; ele envia ao servidor somente as transições.
  socket.on("story-ready", (data) => {
    if (!data || !data.transitions || typeof data.transitions !== "object") return;
    game.transitions = data.transitions;
    console.log("Mapa da história recebido.");
  });

  socket.on("make-choice", (data) => {
    const player = socket.data.role || getPlayerRole(socket.id);
    if (!player) {
      socket.emit("error-message", "Você ainda não entrou na partida.");
      return;
    }
    if (!data || data.sceneId !== game.scene) {
      socket.emit("error-message", "A história já avançou. Aguarde a atualização.");
      return;
    }

    const choiceIndex = Number(data.choiceIndex);
    if (choiceIndex !== 0 && choiceIndex !== 1) {
      socket.emit("error-message", "Escolha inválida.");
      return;
    }
    if (game.choices[player] !== null) {
      socket.emit("error-message", "Você já fez sua escolha.");
      return;
    }

    game.choices[player] = choiceIndex;
    console.log(`${player} escolheu ${choiceIndex}`);
    broadcastChoiceStatus();
    if (game.choices.santiago !== null && game.choices.alissa !== null) resolveChoices();
  });

  socket.on("restart-game", () => {
    resetGame();
    broadcastGameState();
  });

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", scene: game.scene });
});

server.listen(PORT, () => {
  console.log("==========================================");
  console.log("   A MARÉ DE VIDRO");
  console.log("   Servidor multiplayer iniciado");
  console.log(`   Porta: ${PORT}`);
  console.log("==========================================");
});