const socket = io();

// Roteiro estruturado onde absolutamente CADA cena possui exatamente 2 escolhas distintas
const story = {
    inicio: {
        speaker: "Narrador",
        text: "A maré recuou na praia mística, revelando uma fenda ancestral na rocha. Um vento gélido sopra de dentro, trazendo um som sussurrante.",
        turnOwner: "alissa",
        animAlissa: "", animSantiago: "", vfx: "",
        choices: [
            { text: "Alissa: 'Santiago, sente essa frequência! Tem uma câmara secreta ali embaixo.'", target: "fenda_analise", nextTurn: "santiago" },
            { text: "Alissa: 'Vou descer direto para investigar esse chamado, vem comigo!'", target: "fenda_direto", nextTurn: "santiago" }
        ]
    },
    
    // Ramo 1 de Alissa
    fenda_analise: {
        speaker: "Santiago",
        text: "Frequência no ar? Alissa, isso é só corrente de ar batendo no calcário. Mas que a entrada é esquisita, isso é.",
        turnOwner: "santiago",
        animAlissa: "step-forward-alissa", animSantiago: "", vfx: "",
        choices: [
            { text: "Santiago: 'Vou testar a estabilidade da rocha com meu equipamento antes de entrarmos.'", target: "santiago_teste_rocha", nextTurn: "alissa" },
            { text: "Santiago: 'Pega a minha lanterna tática, você vai precisar ver no escuro total.'", target: "santiago_da_lanterna", nextTurn: "alissa" }
        ]
    },
    
    // Ramo 2 de Alissa
    fenda_direto: {
        speaker: "Santiago",
        text: "Espera! O terreno é instável. Não vai pulando assim sem checar o chão.",
        turnOwner: "santiago",
        animAlissa: "step-forward-alissa", animSantiago: "step-forward-santiago", vfx: "",
        choices: [
            { text: "Santiago: 'Segura firme na minha mão, vamos descer juntos com cuidado.'", target: "santiago_mao_dada", nextTurn: "alissa" },
            { text: "Santiago: 'Deixa que eu vou na frente abrindo o caminho para te proteger.'", target: "santiago_frente", nextTurn: "alissa" }
        ]
    },

    // Respostas do Santiago (Ramo 1)
    santiago_teste_rocha: {
        speaker: "Alissa",
        text: "Estrutura firme! E veja essas marcas nas paredes... São runas de navegação de uma civilização antiga!",
        turnOwner: "alissa",
        animAlissa: "", animSantiago: "step-back-santiago", vfx: "vfx-magic",
        choices: [
            { text: "Alissa: 'As runas indicam que devemos seguir pelo corredor da esquerda.'", target: "tunel_esq", nextTurn: "santiago" },
            { text: "Alissa: 'Não, o fluxo de energia aponta para o salão central subterrâneo.'", target: "sala_central", nextTurn: "santiago" }
        ]
    },
    santiago_da_lanterna: {
        speaker: "Alissa",
        text: "Obrigada, Santi! Caramba, olhe o tamanho dessas pegadas fossilizadas na lama seca!",
        turnOwner: "alissa",
        animAlissa: "step-forward-alissa", animSantiago: "", vfx: "vfx-magic",
        choices: [
            { text: "Alissa: 'Isso confirma todas as lendas sobre os guardiões das marés!'", target: "tunel_esq", nextTurn: "santiago" },
            { text: "Alissa: 'Vamos analisar o solo com cautela para evitar desabamentos.'", target: "sala_central", nextTurn: "santiago" }
        ]
    },

    // Respostas do Santiago (Ramo 2)
    santiago_mao_dada: {
        speaker: "Alissa",
        text: "Sua mão está quente... Com você aqui embaixo, até o escuro dessa caverna parece fascinante.",
        turnOwner: "alissa",
        animAlissa: "step-forward-alissa", animSantiago: "step-forward-santiago", vfx: "vfx-romance",
        choices: [
            { text: "Alissa: 'Olhe para o teto da caverna, está refletindo constelações inteiras!'", target: "sala_central", nextTurn: "santiago" },
            { text: "Alissa: 'Vamos avançar juntos com cautela, sinto uma presença incomum.'", target: "tunel_esq", nextTurn: "santiago" }
        ]
    },
    santiago_frente: {
        speaker: "Alissa",
        text: "Cuidado, Santi! Tem um mecanismo antigo logo ali na entrada do salão principal.",
        turnOwner: "alissa",
        animAlissa: "step-back-alissa", animSantiago: "step-forward-santiago", vfx: "",
        choices: [
            { text: "Alissa: 'Deixa que eu decifro o painel místico de luzes.'", target: "sala_central", nextTurn: "santiago" },
            { text: "Alissa: 'Vamos procurar um caminho alternativo pelas pedras laterais.'", target: "tunel_esq", nextTurn: "santiago" }
        ]
    },

    // Caminhos intermediários com duas escolhas cada
    tunel_esq: {
        speaker: "Santiago",
        text: "O túnel estreitou e deu em uma porta de pedra com discos giratórios cheios de símbolos astronômicos.",
        turnOwner: "santiago",
        animAlissa: "", animSantiago: "step-forward-santiago", vfx: "",
        choices: [
            { text: "Santiago: 'Vou resolver isso usando lógica matemática pura e o alinhamento das luas.'", target: "final_caminho_1", nextTurn: "alissa" },
            { text: "Santiago: 'Alissa, sua intuição aponta qual símbolo devemos girar primeiro?'", target: "final_caminho_2", nextTurn: "alissa" }
        ]
    },
    sala_central: {
        speaker: "Santiago",
        text: "Chegamos ao núcleo do complexo. Tem um abismo na frente e uma ponte retrátil recolhida.",
        turnOwner: "santiago",
        animAlissa: "step-back-alissa", animSantiago: "", vfx: "vfx-magic",
        choices: [
            { text: "Santiago: 'Vou hackear o painel elétrico oxidado com minhas ferramentas.'", target: "final_caminho_1", nextTurn: "alissa" },
            { text: "Santiago: 'Alissa, canaliza sua energia naqueles orbes para energizar a ponte!'", target: "final_caminho_2", nextTurn: "alissa" }
        ]
    },

    // Finais dinâmicos baseados nas escolhas
    final_caminho_1: {
        speaker: "Alissa",
        text: "Incrível! Concluímos a exploração com perfeição. A ciência e o mistério unidos.",
        turnOwner: "alissa",
        animAlissa: "kiss-alissa", animSantiago: "kiss-santiago", vfx: "vfx-romance",
        choices: [
            { text: "Alissa: 'Você é o melhor parceiro de aventuras que alguém poderia ter. Beijar ele.'", target: "inicio", nextTurn: "santiago" },
            { text: "Alissa: 'Vamos guardar esse segredo para sempre e voltar para casa sorrindo.'", target: "inicio", nextTurn: "santiago" }
        ]
    },
    final_caminho_2: {
        speaker: "Santiago",
        text: "Eu continuo achando que o mundo tem regras lógicas... Mas explorar com você torna tudo mágico.",
        turnOwner: "santiago",
        animAlissa: "kiss-alissa", animSantiago: "kiss-santiago", vfx: "vfx-romance",
        turnOwner: "santiago",
        choices: [
            { text: "Santiago: 'Então aceita explorar o mundo comigo para sempre? Puxar ela para um beijo.'", target: "inicio", nextTurn: "alissa" },
            { text: "Santiago: 'Vamos comemorar essa descoberta incrível com um abraço bem apertado.'", target: "inicio", nextTurn: "alissa" }
        ]
    }
};

const dialogText = document.getElementById('dialog-text');
const speakerName = document.getElementById('speaker-name');
const choicesContainer = document.getElementById('choices-container');
const waitingMsg = document.getElementById('waiting-msg');
const charAlissa = document.getElementById('char-alissa');
const charSantiago = document.getElementById('char-santiago');
const vfxOverlay = document.getElementById('vfx-overlay');

let typeInterval;

socket.on('update-game', (state) => {
    renderScene(state.scene, state.turn);
});

function renderScene(sceneId, currentTurn) {
    const scene = story[sceneId];
    if(!scene) return;

    clearInterval(typeInterval);
    dialogText.innerHTML = '';
    choicesContainer.innerHTML = '';
    
    charAlissa.classList.remove('hide');
    charSantiago.classList.remove('hide');

    charAlissa.className = `sprite ${scene.animAlissa || ''}`;
    charSantiago.className = `sprite ${scene.animSantiago || ''}`;

    vfxOverlay.className = scene.vfx || '';

    speakerName.innerText = scene.speaker;
    if (scene.speaker === "Alissa") speakerName.style.color = "#ff79c6";
    else if (scene.speaker === "Santiago") speakerName.style.color = "#8be9fd";
    else speakerName.style.color = "#f1fa8c";

    let charIndex = 0;
    typeInterval = setInterval(() => {
        if(charIndex < scene.text.length) {
            dialogText.innerHTML += scene.text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeInterval);
            
            if (typeof myRole !== 'undefined' && scene.turnOwner === myRole) {
                waitingMsg.classList.add('hidden-block');
                showChoices(scene.choices);
            } else {
                waitingMsg.classList.remove('hidden-block');
                waitingMsg.innerText = `Aguardando a decisão de ${scene.turnOwner.toUpperCase()}...`;
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
            socket.emit('make-choice', {
                nextScene: choice.target,
                nextTurn: choice.nextTurn
            });
        };
        
        choicesContainer.appendChild(btn);
    });
}