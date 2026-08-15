const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Expõe a pasta 'public' para o navegador acessar os arquivos do jogo
app.use(express.static('public'));

// Estado atual do jogo compartilhado
let gameState = {
    scene: 'inicio',
    turn: 'alissa' // Define de quem é a vez de escolher
};

io.on('connection', (socket) => {
    console.log('Um usuário se conectou:', socket.id);

    // Envia o estado atual assim que alguém entra
    socket.emit('update-game', gameState);

    // Ouve quando alguém faz uma escolha
    socket.on('make-choice', (data) => {
        gameState.scene = data.nextScene;
        gameState.turn = data.nextTurn;
        
        // Atualiza a tela de ambos os celulares instantaneamente
        io.emit('update-game', gameState);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});