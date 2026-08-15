const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const initialStats = () => ({ romance: 0, confianca: 0, curiosidade: 0, coragem: 0, prudencia: 0, humor: 0, medo: 0, desconfianca: 0 });

const game = {
  scene: "inicio",
  turn: "santiago",
  lastChoice: null,
  stats: initialStats(),
  players: { santiago: null, alissa: null },
};

function state() {
  return {
    scene: game.scene,
    turn: game.turn,
    lastChoice: game.lastChoice,
    stats: { ...game.stats },
    players: { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) },
  };
}

function broadcast() {
  io.emit("game-state", state());
}

function resetGame() {
  game.scene = "inicio";
  game.turn = "santiago";
  game.lastChoice = null;
  game.stats = initialStats();
}

io.on("connection", (socket) => {
  console.log("Novo jogador conectado:", socket.id);

  socket.on("join-game", (data) => {
    const requested = data && data.role ? String(data.role).toLowerCase() : null;
    let role = requested;

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
    socket.emit("role-assigned", { role });
    broadcast();
  });

  socket.on("make-choice", (data) => {
    const role = socket.data.role;
    if (!role || role !== game.turn) {
      socket.emit("error-message", "Agora é a vez do outro personagem.");
      return;
    }

    const choiceIndex = Number(data && data.choiceIndex);
    if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex > 1) {
      socket.emit("error-message", "Escolha inválida.");
      return;
    }

    game.lastChoice = { role, choiceIndex };
    io.emit("choice-made", game.lastChoice);

    if (data && data.nextScene) game.scene = String(data.nextScene);
    if (data && data.effects && typeof data.effects === "object") {
      for (const [key, value] of Object.entries(data.effects)) {
        if (Object.prototype.hasOwnProperty.call(game.stats, key) && Number.isFinite(Number(value))) {
          game.stats[key] += Number(value);
        }
      }
    }

    if (data && data.nextTurn) game.turn = data.nextTurn;
    game.lastChoice = { role, choiceIndex };
    broadcast();
  });

  socket.on("restart-game", () => {
    resetGame();
    broadcast();
  });

  socket.on("disconnect", () => {
    const role = socket.data.role;
    if (role && game.players[role] === socket.id) game.players[role] = null;
    io.emit("players-update", { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) });
  });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/health", (req, res) => res.status(200).json({ status: "ok", scene: game.scene, turn: game.turn }));

server.listen(PORT, () => {
  console.log("==========================================");
  console.log("   A MARÉ DE VIDRO — multiplayer");
  console.log(`   Porta: ${PORT}`);
  console.log("==========================================");
});
