
// === MOTOR DO JOGO MULTIPLAYER COM SOCKET.IO ===

const socket = io();

const story = {
    inicio: {
        speaker: "Narrador",
        text: "A noite caiu sobre a praia deserta. A areia parece brilhar com uma energia incomum. Alissa, com sua intuição sempre atenta, sente que há algo mágico aqui. Ao seu lado está Santiago, observando o mar com sua típica postura realista.",
        animAlissa: "", animSantiago: "", vfx: "",
        turnOwner: "alissa", // Vez da Alissa começar
        choices: [
            { text: "Olhar fascinada para a água brilhante.", target: "cena_agua", nextTurn: "santiago" },
            { text: "Puxar a manga da camisa preta do Santiago.", target: "cena_chamar_ele", nextTurn: "santiago" }
        ]
    },
    cena_agua: {
        speaker: "Alissa",
        text: "Santiago, olha isso! A água tá brilhando de um jeito diferente... Tem uma energia surreal nesse lugar, eu consigo sentir!",
        animAlissa: "move-center-alissa", animSantiago: "", vfx: "vfx-magic",
        turnOwner: "santiago", // Vez do Santiago reagir
        choices: [
            { text: "Santiago: 'Alissa... não viaja. É só plâncton.'", target: "cena_ceticismo", nextTurn: "alissa" }
        ]
    },
    cena_chamar_ele: {
        speaker: "Alissa",
        text: "Santi, vem cá! Você precisa sentir isso. Tem alguma coisa mística nessa praia hoje.",
        animAlissa: "move-center-alissa", animSantiago: "", vfx: "",
        turnOwner: "santiago",
        choices: [
            { text: "Santiago: 'Cê tá muito doida com essas paradas.'", target: "cena_ceticismo", nextTurn: "alissa" }
        ]
    },
    cena_ceticismo: {
        speaker: "Santiago",
        text: "Ciência básica, tá ligado? Magia não existe, é tudo coisa da sua cabeça.",
        animAlissa: "move-center-alissa", animSantiago: "move-center-santiago", vfx: "",
        turnOwner: "alissa",
        choices: [
            { text: "Revirar os olhos: 'Você é muito cético!'", target: "cena_concha", nextTurn: "santiago" },
            { text: "Dar um passo na direção dele, desafiadora.", target: "cena_concha", nextTurn: "santiago" }
        ]
    },
    cena_concha: {
        speaker: "Narrador",
        text: "De repente, uma concha de cristal enorme emerge da areia, pulsando com uma luz azul intensa e mágica.",
        animAlissa: "move-center-alissa", animSantiago: "move-center-santiago", vfx: "vfx-magic",
        turnOwner: "alissa",
        choices: [
            { text: "Tocar na concha sem medo.", target: "cena_tocar_concha", nextTurn: "santiago" },
            { text: "Segurar a mão do Santiago.", target: "cena_segurar_mao", nextTurn: "santiago" }
        ]
    },
    cena_tocar_concha: {
        speaker: "Narrador",
        text: "Ao tocar na concha, uma onda de luz explode. Santiago dá um passo para trás, visivelmente assustado.",
        animAlissa: "move-center-alissa", animSantiago: "shock", vfx: "vfx-magic",
        turnOwner: "santiago",
        choices: [
            { text: "Santiago: 'Que p*rra foi essa?! Beleza... talvez você tenha razão.'", target: "cena_clima_esquenta", nextTurn: "alissa" }
        ]
    },
    cena_segurar_mao: {
        speaker: "Narrador",
        text: "Você segura a mão dele. A mão dele é quente. Ele aperta sua mão de volta com força.",
        animAlissa: "move-center-alissa", animSantiago: "move-center-santiago", vfx: "vfx-magic",
        turnOwner: "santiago",
        choices: [
            { text: "Santiago: 'Tá bom, admito que isso é estranho pra caramba.'", target: "cena_clima_esquenta", nextTurn: "alissa" }
        ]
    },
    cena_clima_esquenta: {
        speaker: "Narrador",
        text: "A tensão entre o ceticismo dele e a sua fé mística de repente se transforma em romance. Ele olha diretamente para a sua boca.",
        animAlissa: "move-center-alissa", animSantiago: "move-center-santiago", vfx: "vfx-romance",
        turnOwner: "alissa",
        choices: [
            { text: "Puxar ele pela camisa e beijá-lo.", target: "cena_beijo", nextTurn: "santiago" },
            { text: "Esperar ele tomar a atitude.", target: "cena_ele_atitude", nextTurn: "santiago" }
        ]
    },
    cena_ele_atitude: {
        speaker: "Santiago",
        text: "Eu continuo achando que não existe magia no mundo... Mas não tenho como explicar o que você faz comigo.",
        animAlissa: "move-center-alissa", animSantiago: "kiss-santiago", vfx: "vfx-romance",
        turnOwner: "alissa",
        choices: [
            { text: "Beijar ele intensamente.", target: "cena_beijo", nextTurn: "santiago" }
        ]
    },
    cena_beijo: {
        speaker: "Narrador",
        text: "Vocês se beijam. O mundo místico ao redor desaparece. A sintonia entre vocês é a mágica mais real que existe.",
        animAlissa: "kiss-alissa", animSantiago: "kiss-santiago", vfx: "vfx-romance",
        turnOwner: "alissa",
        choices: [
            { text: "Recomeçar a aventura juntos.", target: "inicio", nextTurn: "alissa" }
        ]
    }
};

// Elementos do DOM
const dialogText = document.getElementById('dialog-text');
const speakerName = document.getElementById('speaker-name');
const choicesContainer = document.getElementById('choices-container');
const waitingMsg = document.getElementById('waiting-msg');
const charAlissa = document.getElementById('char-alissa');
const charSantiago = document.getElementById('char-santiago');
const vfxOverlay = document.getElementById('vfx-overlay');

let typeInterval;

// Ouve atualizações do servidor em tempo real via Socket.io
socket.on('update-game', (state) => {
    renderScene(state.scene, state.turn);
});

function renderScene(sceneId, currentTurn) {
    const scene = story[sceneId];
    if(!scene) return;

    clearInterval(typeInterval);
    dialogText.innerHTML = '';
    choicesContainer.innerHTML = '';
    
    charAlissa.className = `sprite ${scene.animAlissa || ''}`;
    charSantiago.className = `sprite ${scene.animSantiago || ''}`;
    
    if (sceneId === 'inicio') {
        charAlissa.classList.remove('hide');
        charSantiago.classList.remove('hide');
    }

    vfxOverlay.className = scene.vfx || '';

    speakerName.innerText = scene.speaker;
    if (scene.speaker === "Alissa") speakerName.style.color = "#ff79c6";
    else if (scene.speaker === "Santiago") speakerName.style.color = "#8be9fd";
    else speakerName.style.color = "#f1fa8c";

    // Efeito de Máquina de Escrever
    let charIndex = 0;
    typeInterval = setInterval(() => {
        if(charIndex < scene.text.length) {
            dialogText.innerHTML += scene.text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeInterval);
            
            // Verifica de quem é a vez neste dispositivo
            if (scene.turnOwner === currentTurn) {
                waitingMsg.classList.add('hidden-block');
                showChoices(scene.choices);
            } else {
                waitingMsg.classList.remove('hidden-block');
            }
        }
    }, 30);
}

function showChoices(choices) {
    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = choice.text;
        btn.style.animationDelay = `${index * 0.15}s`;
        
        btn.onclick = () => {
            choicesContainer.innerHTML = '';
            // Envia a escolha para o servidor sincronizar os dois celulares
            socket.emit('make-choice', {
                nextScene: choice.target,
                nextTurn: choice.nextTurn
            });
        };
        
        choicesContainer.appendChild(btn);
    });
}