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
  revision: 0,
  lastChoice: null,
  stats: initialStats(),
  players: { santiago: null, alissa: null },
};

// O servidor valida a sequência da história. O navegador nunca pode decidir sozinho
// qual será a próxima cena ou de quem é a vez.
const transitions = {
  inicio: ["carta1", "carta1"], carta1: ["marca", "marca"], marca: ["rio", "rio"],
  rio: ["diario", "diario"], diario: ["mirante", "mirante"], mirante: ["revelacao", "revelacao"],
  revelacao: ["sentimento", "sentimento"], sentimento: ["final", "final"], final: ["fim", "fim"]
};
const turns = { inicio:"santiago", carta1:"alissa", marca:"santiago", rio:"alissa", diario:"santiago", mirante:"alissa", revelacao:"santiago", sentimento:"alissa", final:"santiago", fim:"alissa" };

function state() {
  return { phase: game.phase, scene: game.scene, turn: game.turn, revision: game.revision, lastChoice: game.lastChoice, stats: { ...game.stats }, players: { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) } };
}
function broadcast() { io.emit("game-state", state()); }
function broadcastPlayers() { io.emit("players-update", { santiago: Boolean(game.players.santiago), alissa: Boolean(game.players.alissa) }); }
function resetGame() { game.phase="lobby"; game.scene="inicio"; game.turn="santiago"; game.revision=0; game.lastChoice=null; game.stats=initialStats(); }

io.on("connection", (socket) => {
  socket.emit("game-state", state());

  socket.on("join-game", (data = {}) => {
    const requested = String(data.role || "").toLowerCase();
    let role = requested === "santiago" || requested === "alissa" ? requested : null;
    if (role && game.players[role]) role = null;
    if (!role && !game.players.santiago) role = "santiago";
    else if (!role && !game.players.alissa) role = "alissa";
    if (!role) return socket.emit("game-error", "A sala já está com os dois jogadores conectados.");
    game.players[role] = socket.id;
    socket.data.role = role;
    socket.emit("role-assigned", { role });
    broadcastPlayers();
    socket.emit("game-state", state());
  });

  socket.on("start-game", () => {
    if (!socket.data.role) return socket.emit("game-error", "Entre na sala antes de iniciar.");
    if (!game.players.santiago || !game.players.alissa) return socket.emit("game-error", "A história só pode começar quando os dois estiverem online.");
    if (game.phase !== "lobby") return;
    game.phase="playing"; game.scene="inicio"; game.turn="santiago"; game.revision=1; game.lastChoice=null;
    broadcast();
  });

  socket.on("make-choice", (data = {}) => {
    const role = socket.data.role;
    if (!role || game.phase !== "playing") return;
    if (role !== game.turn) return socket.emit("game-sync-error", { message:"Essa escolha já não pertence a você.", state:state() });
    if (Number(data.revision) !== game.revision || data.scene !== game.scene) return socket.emit("game-sync-error", { message:"A cena mudou antes da escolha chegar.", state:state() });

    const index = Number(data.choiceIndex);
    const allowed = transitions[game.scene];
    if (!allowed || !Number.isInteger(index) || index < 0 || index >= allowed.length) return socket.emit("game-sync-error", { message:"Escolha inválida.", state:state() });

    const nextScene = allowed[index];
    const nextTurn = turns[nextScene];
    const effects = data.effects && typeof data.effects === "object" ? data.effects : {};
    for (const [key,value] of Object.entries(effects)) if (Object.prototype.hasOwnProperty.call(game.stats,key) && Number.isFinite(Number(value))) game.stats[key] += Number(value);

    game.lastChoice = { role, choiceIndex:index, text:typeof data.choiceText === "string" ? data.choiceText : "" };
    game.scene = nextScene;
    game.turn = nextTurn;
    game.revision += 1;
    broadcast();

    if (nextScene === "fim") finishGame();
  });

  socket.on("restart-game", () => { resetGame(); io.emit("game-restarted"); broadcast(); broadcastPlayers(); });

  socket.on("disconnect", () => {
    const role=socket.data.role;
    if (role && game.players[role]===socket.id) game.players[role]=null;
    broadcastPlayers();
  });
});

function finishGame() { if (game.phase === "finished") return; game.phase="finished"; broadcast(); io.emit("game-finished"); }
app.get("/", (req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.get("/health", (req,res)=>res.status(200).json({status:"ok",phase:game.phase,scene:game.scene,turn:game.turn,revision:game.revision,players:game.players}));
server.listen(PORT,()=>console.log(`A MARÉ DE VIDRO — servidor na porta ${PORT}`));
