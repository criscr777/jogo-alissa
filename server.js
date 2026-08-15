const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve todos os arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// Estado global do jogo
let gameState = {
  scene: "inicio",
  turn: "alissa",
  players: [], // Rastreia os jogadores conectados
};

io.on("connection", (socket) => {
  console.log("✓ Usuário conectado:", socket.id);

  // Rastreia jogador conectado
  if (gameState.players.length < 2) {
    gameState.players.push(socket.id);
    console.log("  Jogadores conectados:", gameState.players.length);
  }

  // Envia o estado atual do jogo assim que conecta
  socket.emit("update-game", gameState);

  // Ouve quando um jogador faz uma escolha
  socket.on("make-choice", (data) => {
    console.log("→ Escolha recebida:", data.nextScene);
    gameState.scene = data.nextScene;
    gameState.turn = data.nextTurn;

    // Atualiza a tela de ambos os celulares instantaneamente
    io.emit("update-game", gameState);
  });

  socket.on("disconnect", () => {
    console.log("✗ Usuário desconectado:", socket.id);
    gameState.players = gameState.players.filter((id) => id !== socket.id);
    console.log("  Jogadores restantes:", gameState.players.length);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 Servidor rodando na porta ${PORT}`);
  console.log(
    `📱 Abra http://localhost:${PORT} em dois navegadores/dispositivos`,
  );
});
