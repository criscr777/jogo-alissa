const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));

const initialStats = () => ({ romance: 0, confianca: 0, curiosidade: 0, coragem: 0, prudencia: 0, humor: 0 });
const game = {
  phase: "lobby",
  scene: "inicio",
  turn: "santiago",
  lastChoice: null,
  stats: initialStats(),
  players: { santiago: null, alissa: null },
};

function state() {
  return {
    phase: game.phase,
    scene: game.scene,
    turn: game.turn,
    lastChoice: game.lastChoice,
    stats: { ...game.stats },
    players: { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) },
  };
}
function broadcast() { io.emit("game-state", state()); }
function broadcastPlayers() { io.emit("players-update", { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) }); }
function resetGame() {
  game.phase = "lobby";
  game.scene = "inicio";
  game.turn = "santiago";
  game.lastChoice = null;
  game.stats = initialStats();
}

io.on("connection", (socket) => {
  console.log("Novo jogador conectado:", socket.id);
  socket.emit("game-state", state());

  socket.on("join-game", (data = {}) => {
    const requested = String(data.role || "").toLowerCase();
    let role = requested === "santiago" || requested === "alissa" ? requested : null;
    if (role && game.players[role]) role = null;
    if (!role && !game.players.santiago) role = "santiago";
    else if (!role && !game.players.alissa) role = "alissa";
    if (!role) {
      socket.emit("game-error", "A sala já está com os dois jogadores conectados.");
      return;
    }
    game.players[role] = socket.id;
    socket.data.role = role;
    socket.emit("role-assigned", { role });
    socket.emit("game-state", state());
    broadcastPlayers();
  });

  socket.on("start-game", () => {
    if (!socket.data.role) return socket.emit("game-error", "Entre na sala antes de iniciar.");
    if (!game.players.santiago || !game.players.alissa) {
      return socket.emit("game-error", "A história só pode começar quando Santiago e Alissa estiverem online.");
    }
    if (game.phase !== "lobby") return;
    game.phase = "playing";
    game.scene = "inicio";
    game.turn = "santiago";
    game.lastChoice = null;
    broadcast();
    io.emit("game-started");
  });

  socket.on("make-choice", (data = {}) => {
    const role = socket.data.role;
    if (!role) return socket.emit("game-error", "Entre na partida antes de escolher.");
    if (game.phase !== "playing") return;
    if (role !== game.turn) return socket.emit("game-error", "Essa escolha pertence ao outro personagem.");

    const choiceIndex = Number(data.choiceIndex);
    if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex > 1) {
      return socket.emit("game-error", "Escolha inválida.");
    }
    if (typeof data.nextScene !== "string" || !data.nextScene || !["santiago", "alissa"].includes(data.nextTurn)) {
      return socket.emit("game-error", "Transição inválida.");
    }

    const effects = data.effects && typeof data.effects === "object" ? data.effects : {};
    for (const [key, value] of Object.entries(effects)) {
      if (Object.prototype.hasOwnProperty.call(game.stats, key) && Number.isFinite(Number(value))) {
        game.stats[key] += Number(value);
      }
    }

    game.lastChoice = {
      role,
      choiceIndex,
      text: typeof data.choiceText === "string" ? data.choiceText : "",
    };
    game.scene = data.nextScene;
    game.turn = data.nextTurn;
    io.emit("choice-made", game.lastChoice);
    broadcast();

    if (data.ending === true) finishGame();
  });

  socket.on("restart-game", () => {
    resetGame();
    io.emit("game-restarted");
    broadcast();
    broadcastPlayers();
  });

  socket.on("disconnect", () => {
    const role = socket.data.role;
    if (role && game.players[role] === socket.id) game.players[role] = null;
    if (game.phase === "playing") {
      // A saída durante a história não altera a cena; o outro jogador pode reconectar.
    }
    broadcastPlayers();
  });
});

function finishGame() {
  if (game.phase === "finished") return;
  game.phase = "finished";
  broadcast();
  io.emit("game-finished");
}

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/health", (req, res) => res.status(200).json({ status: "ok", phase: game.phase, scene: game.scene, turn: game.turn, players: game.players }));
server.listen(PORT, () => console.log(`A MARÉ DE VIDRO — servidor na porta ${PORT}`));
