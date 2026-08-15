# 🎮 O Mistério das Marés - Jogo Multiplayer Casal

Um jogo interativo de escolhas para dois jogadores (Alissa e Santiago) que devem trabalhar juntos para desvendar um mistério em uma caverna mística.

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
npm start
```

O servidor rodará em `http://localhost:3000`

### 3. Abrir em Dois Dispositivos

- **Navegador 1 (Alissa)**: `http://localhost:3000` → Clique "Entrar como Alissa"
- **Navegador 2 (Santiago)**: `http://localhost:3000` → Clique "Entrar como Santiago"

## 📱 Como Jogar

- **Cada cena** tem um narrador que fala
- **Apenas um personagem pode fazer escolhas por vez**
- O outro dispositivo **aguarda a decisão** do parceiro
- Conforme avançam, desbloqueiam **cenas especiais com efeitos visuais**
- O jogo termina com um **final romântico** 💕

## 🎨 Estrutura do Projeto

```
jogo-alissa/
├── server.js              # Servidor Node.js com Socket.io
├── public/
│   ├── index.html         # Tela de seleção de personagem
│   ├── alissa.html        # Jogo como Alissa
│   ├── santiago.html      # Jogo como Santiago
│   ├── script.js          # Lógica do jogo
│   ├── style.css          # Estilos visuais
│   ├── alissa.png         # Sprite de Alissa
│   ├── santiago.png       # Sprite de Santiago
│   └── praia_noite.png    # Fundo da caverna
└── package.json           # Dependências do projeto
```

## 🔧 Tecnologias

- **Node.js** - Servidor
- **Express** - Framework web
- **Socket.io** - Comunicação em tempo real entre dispositivos
- **HTML5/CSS3** - Interface e animações
- **JavaScript** - Lógica do jogo

## 🎯 Fluxo do Jogo

1. Usuários acessam o site
2. Cada um escolhe seu personagem (Alissa ou Santiago)
3. O jogo começa na cena "inicio"
4. Alternadamente, cada jogador faz escolhas que afetam a história
5. A história tem múltiplos caminhos possíveis
6. Ao final, os dois chegam juntos ao altar e compartilham um beijo

## 📝 Notas

- O socket.io sincroniza automaticamente o estado do jogo entre os dois dispositivos
- Se um jogador desconectar, o servidor registra isso no console
- As cenas estão definidas no arquivo `script.js` com toda a narrativa

Aproveitem a jornada! 🌊✨
