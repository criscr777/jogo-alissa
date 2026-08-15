const socket = io();

/*
 * ============================================================
 * A MARÉ DE VIDRO
 * História interativa multiplayer
 *
 * Santiago + Alissa
 *
 * Cada jogador:
 * - recebe 2 escolhas;
 * - escolhe simultaneamente;
 * - espera o outro jogador;
 * - a combinação das duas escolhas determina a próxima cena.
 * ============================================================
 */

const story = {

    // ========================================================
    // CAPÍTULO 1 — A CONCHA
    // ========================================================

    inicio: {
        chapter: "CAPÍTULO 1 — A CONCHA",
        speaker: "Narrador",

        text:
            "A maré baixou mais do que deveria naquela noite. " +
            "Entre pedras molhadas e areia escura, uma concha de cristal " +
            "apareceu onde, poucas horas antes, só havia água.",

        animAlissa: "appear-alissa",
        animSantiago: "appear-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Vou pegar a concha antes que você invente alguma coisa."',

                    effects: {
                        confianca: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Santiago: "Nem encosta. Isso tem uma cara enorme de problema."',

                    effects: {
                        prudencia: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu vou pegar. Se der ruim, a culpa é minha."',

                    effects: {
                        coragem: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Espera. Quero descobrir por que ela apareceu agora."',

                    effects: {
                        curiosidade: 1,
                        prudencia: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "concha_toque",
            "0-1": "concha_espera",
            "1-0": "concha_impulso",
            "1-1": "concha_espera"
        }
    },


    // ========================================================
    // CONCHA
    // ========================================================

    concha_toque: {
        chapter: "CAPÍTULO 1 — A CONCHA",
        speaker: "Alissa",

        text:
            "No instante em que Santiago toca a concha, uma luz azul " +
            "percorre seus dedos. Alissa chega mais perto. Por um segundo, " +
            "os dois ouvem a mesma voz: \"A guardiã voltou.\"",

        animAlissa: "step-forward-alissa",
        animSantiago: "shocked-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Você ouviu isso também, né?"',

                    effects: {
                        confianca: 1,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Santiago: "Legal. Agora eu oficialmente odeio essa praia."',

                    effects: {
                        humor: 1,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Ouvi. E não gostei nem um pouco."',

                    effects: {
                        confianca: 1,
                        medo: 1
                    }
                },

                {
                    text:
                        'Alissa: "Finge que não ouviu. Quero ver até onde isso vai."',

                    effects: {
                        coragem: 1,
                        curiosidade: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "primeira_pista",
            "0-1": "primeira_pista",
            "1-0": "primeira_pista",
            "1-1": "primeira_pista"
        }
    },


    concha_espera: {
        chapter: "CAPÍTULO 1 — A CONCHA",
        speaker: "Santiago",

        text:
            "Vocês observam a concha. A luz dentro dela pulsa três vezes. " +
            "Na quarta, uma linha brilhante surge na areia e aponta para " +
            "uma trilha entre as pedras.",

        animAlissa: "look-at-santiago",
        animSantiago: "look-at-alissa",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "A gente segue a linha. Mas sem tocar em mais nada."',

                    effects: {
                        prudencia: 1,
                        confianca: 1
                    }
                },

                {
                    text:
                        'Santiago: "Eu vou na frente. Se alguma coisa explodir, você corre."',

                    effects: {
                        coragem: 1,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Vou seguir. Mas se você mandar em mim, eu volto."',

                    effects: {
                        humor: 1,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Alissa: "Primeiro vou procurar pegadas. Alguém pode ter passado por aqui."',

                    effects: {
                        prudencia: 1,
                        curiosidade: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "primeira_pista",
            "0-1": "primeira_pista",
            "1-0": "primeira_pista",
            "1-1": "primeira_pista"
        }
    },


    concha_impulso: {
        chapter: "CAPÍTULO 1 — A CONCHA",
        speaker: "Narrador",

        text:
            "Alissa toca a concha. A luz explode pelo chão e desaparece. " +
            "Quando vocês olham para trás, há uma pegada humana na areia — " +
            "fresca, apesar de a praia estar vazia.",

        animAlissa: "shocked-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Ótimo. Agora temos alguém seguindo a gente."',

                    effects: {
                        prudencia: 1,
                        confianca: 1
                    }
                },

                {
                    text:
                        'Santiago: "Se esse cara quiser a concha, vai ter que falar comigo primeiro."',

                    effects: {
                        coragem: 1,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Não fica atrás de mim. Eu sei me defender."',

                    effects: {
                        coragem: 1,
                        humor: 1
                    }
                },

                {
                    text:
                        'Alissa: "Tá. Isso foi culpa minha. Vamos sair daqui."',

                    effects: {
                        confianca: 1,
                        medo: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "primeira_pista",
            "0-1": "primeira_pista",
            "1-0": "primeira_pista",
            "1-1": "primeira_pista"
        }
    },


    // ========================================================
    // PRIMEIRA PISTA
    // ========================================================

    primeira_pista: {
        chapter: "CAPÍTULO 1 — A CONCHA",
        speaker: "Narrador",

        text:
            "A trilha leva a uma velha torre de observação. Dentro dela há " +
            "um mapa marítimo coberto de símbolos. No canto, alguém escreveu " +
            "recentemente: \"NÃO DEIXEM A CONCHA CHEGAR AO FAROL.\"",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-dark",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Vamos descobrir quem escreveu isso antes de ir ao farol."',

                    effects: {
                        prudencia: 1,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Santiago: "Vamos ao farol. Se estão tentando assustar a gente, funcionou ao contrário."',

                    effects: {
                        coragem: 1,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu quero entender os símbolos antes."',

                    effects: {
                        curiosidade: 2
                    }
                },

                {
                    text:
                        'Alissa: "Farol. Se alguém quer impedir, provavelmente é lá que está a resposta."',

                    effects: {
                        coragem: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "mapa_decifrar",
            "0-1": "farol_chegada",
            "1-0": "farol_chegada",
            "1-1": "farol_chegada"
        }
    },


    // ========================================================
    // MAPA
    // ========================================================

    mapa_decifrar: {
        chapter: "CAPÍTULO 1 — A CONCHA",
        speaker: "Alissa",

        text:
            "Alissa passa os dedos pelo mapa. Três pontos brilham: a torre, " +
            "o farol e uma ilha que não aparece em nenhum mapa moderno.",

        animAlissa: "step-forward-alissa",
        animSantiago: "look-at-alissa",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Ilha fantasma. Perfeito. Exatamente o que faltava."',

                    effects: {
                        humor: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Santiago: "Marca as coordenadas. Vamos preparados."',

                    effects: {
                        prudencia: 1,
                        confianca: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Você está reclamando, mas ainda está aqui."',

                    effects: {
                        humor: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "A ilha não está no mapa porque não deveria existir."',

                    effects: {
                        curiosidade: 1,
                        medo: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "farol_chegada",
            "0-1": "farol_chegada",
            "1-0": "farol_chegada",
            "1-1": "farol_chegada"
        }
    },


    // ========================================================
    // FAROL
    // ========================================================

    farol_chegada: {
        chapter: "CAPÍTULO 1 — O FAROL",
        speaker: "Narrador",

        text:
            "O farol está abandonado. A porta está aberta. Lá dentro, há " +
            "uma mochila que não pertence a nenhum de vocês — e dentro dela, " +
            "uma fotografia de Alissa.",

        animAlissa: "shocked-alissa",
        animSantiago: "shocked-santiago",
        vfx: "vfx-dark",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Alissa... por que tem uma foto sua aqui?"',

                    effects: {
                        confianca: 1,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Santiago: "Não toca em nada. Primeiro vamos descobrir quem deixou isso."',

                    effects: {
                        prudencia: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu não faço ideia. E para de olhar pra mim assim."',

                    effects: {
                        medo: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Vou pegar a foto. Preciso saber quando ela foi tirada."',

                    effects: {
                        coragem: 1,
                        curiosidade: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "foto_antiga",
            "0-1": "foto_antiga",
            "1-0": "foto_antiga",
            "1-1": "foto_antiga"
        }
    },


    // ========================================================
    // FOTO
    // ========================================================

    foto_antiga: {
        chapter: "CAPÍTULO 1 — O FAROL",
        speaker: "Narrador",

        text:
            "A fotografia mostra Alissa diante da mesma torre, mas a data no " +
            "verso é de vinte e oito anos atrás. Antes que alguém diga qualquer " +
            "coisa, passos ecoam no andar de cima.",

        animAlissa: "step-back-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-dark",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Fica atrás de mim. Só dessa vez, não discute."',

                    effects: {
                        coragem: 1,
                        romance: 2
                    }
                },

                {
                    text:
                        'Santiago: "Você vai comigo. Separa a gente e fica pior."',

                    effects: {
                        confianca: 2,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Tá. Mas se você me mandar ficar parada, eu te dou um murro."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Eu vou com você. Não vou deixar você bancar o herói sozinho."',

                    effects: {
                        confianca: 2,
                        romance: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "primeiro_encontro",
            "0-1": "primeiro_encontro",
            "1-0": "primeiro_encontro",
            "1-1": "primeiro_encontro"
        }
    },


    // ========================================================
    // ESTRANHO
    // ========================================================

    primeiro_encontro: {
        chapter: "CAPÍTULO 1 — O FAROL",
        speaker: "Estranho",

        text:
            "Um homem aparece no topo da escada. Ele olha para a concha " +
            "e depois para Alissa. \"Vocês chegaram cedo demais.\"",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-dark",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Quem é você e por que tem uma foto dela?"',

                    effects: {
                        coragem: 1,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Santiago: "Alissa, pega a saída. Eu distraio ele."',

                    effects: {
                        coragem: 2,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Quero saber o que você sabe sobre a minha família."',

                    effects: {
                        curiosidade: 2,
                        coragem: 1
                    }
                },

                {
                    text:
                        'Alissa: "Não interessa quem você é. A gente vai embora."',

                    effects: {
                        prudencia: 1,
                        coragem: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "fuga_farol",
            "0-1": "fuga_farol",
            "1-0": "fuga_farol",
            "1-1": "fuga_farol"
        }
    },


    // ========================================================
    // FUGA
    // ========================================================

    fuga_farol: {
        chapter: "FIM DO CAPÍTULO 1",
        speaker: "Narrador",

        text:
            "Um estrondo sacode o farol. A escada começa a desabar. Vocês " +
            "correm juntos pela porta dos fundos enquanto o estranho desaparece " +
            "na fumaça. No bolso de Alissa, a concha pulsa uma última vez.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Depois você me explica essa história da foto."',

                    effects: {
                        curiosidade: 1,
                        confianca: 1
                    }
                },

                {
                    text:
                        'Santiago: "Primeiro vamos sair daqui. Depois eu te cobro respostas."',

                    effects: {
                        prudencia: 1,
                        confianca: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu vou explicar. Só não agora."',

                    effects: {
                        confianca: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Eu também tenho perguntas, então estamos quites."',

                    effects: {
                        humor: 1,
                        romance: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "acampamento",
            "0-1": "acampamento",
            "1-0": "acampamento",
            "1-1": "acampamento"
        }
    },


    // ========================================================
    // CAPÍTULO 2
    // ========================================================

    acampamento: {
        chapter: "CAPÍTULO 2 — A TRAVESSIA",
        speaker: "Narrador",

        text:
            "Horas depois, vocês montam um pequeno acampamento perto das " +
            "falésias. O mar está calmo demais. Alissa observa a fogueira " +
            "enquanto Santiago tenta decifrar as coordenadas.",

        animAlissa: "idle-alissa",
        animSantiago: "idle-santiago",
        vfx: "vfx-night",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Você vai me contar o que está escondendo?"',

                    effects: {
                        curiosidade: 1,
                        confianca: 1
                    }
                },

                {
                    text:
                        'Santiago: "Não precisa falar. Mas não tenta fazer nada sozinha."',

                    effects: {
                        romance: 2,
                        confianca: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Vou contar. Mas sem fazer drama."',

                    effects: {
                        confianca: 2
                    }
                },

                {
                    text:
                        'Alissa: "Se eu te contar, você promete não fazer besteira?"',

                    effects: {
                        humor: 1,
                        romance: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "confissao_parcial",
            "0-1": "confissao_parcial",
            "1-0": "confissao_parcial",
            "1-1": "confissao_parcial"
        }
    },


    confissao_parcial: {
        chapter: "CAPÍTULO 2 — A TRAVESSIA",
        speaker: "Alissa",

        text:
            "Alissa admite que sua família conhece a lenda da ilha. " +
            "Ela não sabe por que a fotografia existe, mas sabe de uma coisa: " +
            "o farol é uma das três portas para chegar ao Coração do Mar.",

        animAlissa: "look-at-santiago",
        animSantiago: "look-at-alissa",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Então você sabia mais do que contou desde o começo."',

                    effects: {
                        desconfianca: 1,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Santiago: "Tudo bem. Só não esconde mais nada de mim."',

                    effects: {
                        confianca: 2,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu não confiei em você no começo. Agora estou tentando."',

                    effects: {
                        confianca: 2
                    }
                },

                {
                    text:
                        'Alissa: "Se eu soubesse de tudo, acha que eu teria vindo?"',

                    effects: {
                        humor: 1,
                        confianca: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "ciumes_acampamento",
            "0-1": "ciumes_acampamento",
            "1-0": "ciumes_acampamento",
            "1-1": "ciumes_acampamento"
        }
    },


    // ========================================================
    // AGONIA
    // ========================================================

    ciumes_acampamento: {
        chapter: "CAPÍTULO 2 — A TRAVESSIA",
        speaker: "Narrador",

        text:
            "O silêncio dura alguns segundos. Alissa mexe na mochila. " +
            "Santiago olha para a estrada e percebe uma segunda pessoa " +
            "perto dos veículos abandonados.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-night",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Vou ver quem é. Se for uma garota bonita, talvez eu vá embora com ela."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Santiago: "Fica aqui. Eu vou verificar sozinho."',

                    effects: {
                        coragem: 1,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Vai. Aproveita e leva sua nova namorada."',

                    effects: {
                        humor: 2,
                        romance: 2
                    }
                },

                {
                    text:
                        'Alissa: "Você não vai sozinho. Eu vou junto."',

                    effects: {
                        coragem: 1,
                        romance: 2
                    }
                }
            ]
        },

        next: {
            "0-0": "agonia_1",
            "0-1": "agonia_1",
            "1-0": "agonia_1",
            "1-1": "agonia_1"
        }
    },


    agonia_1: {
        chapter: "CAPÍTULO 2 — A TRAVESSIA",
        speaker: "Santiago",

        text:
            "A pessoa desaparece antes que vocês cheguem perto. " +
            "Alissa cruza os braços. \"Você faz isso de propósito.\" " +
            "Santiago dá um sorriso. \"O quê?\" Ela responde: \"Me dar agonia.\"",

        animAlissa: "step-forward-alissa",
        animSantiago: "look-at-alissa",
        vfx: "vfx-night",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Se você admite que sente, então está funcionando."',

                    effects: {
                        romance: 2,
                        humor: 1
                    }
                },

                {
                    text:
                        'Santiago: "Eu? Nunca. Você que fica estranha quando menciono outra pessoa."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu vou te dar uma agonia de verdade se continuar."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Você gosta de provocar. Depois não reclama quando eu retribuir."',

                    effects: {
                        romance: 2,
                        confianca: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "barco",
            "0-1": "barco",
            "1-0": "barco",
            "1-1": "barco"
        }
    },


    // ========================================================
    // BARCO
    // ========================================================

    barco: {
        chapter: "CAPÍTULO 2 — A TRAVESSIA",
        speaker: "Narrador",

        text:
            "Ao amanhecer, vocês encontram um barco velho capaz de alcançar " +
            "as coordenadas da ilha. O motor funciona por alguns minutos " +
            "antes de morrer.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-sea",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Eu conserto o motor. Você segura a lanterna."',

                    effects: {
                        coragem: 1,
                        confianca: 1
                    }
                },

                {
                    text:
                        'Santiago: "Empurramos até pegar no tranco. Se der errado, a culpa é sua."',

                    effects: {
                        humor: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu ajudo. E não, você não vai fazer tudo sozinho."',

                    effects: {
                        confianca: 2
                    }
                },

                {
                    text:
                        'Alissa: "Se afundar, eu vou te lembrar disso pelo resto da vida."',

                    effects: {
                        humor: 1,
                        coragem: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "ilha_chegada",
            "0-1": "ilha_chegada",
            "1-0": "ilha_chegada",
            "1-1": "ilha_chegada"
        }
    },


    // ========================================================
    // ILHA
    // ========================================================

    ilha_chegada: {
        chapter: "CAPÍTULO 3 — A ILHA",
        speaker: "Narrador",

        text:
            "A ilha surge da névoa. No centro dela há uma enorme estrutura " +
            "de pedra, coberta por vegetação. A concha começa a vibrar.",

        animAlissa: "shocked-alissa",
        animSantiago: "shocked-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Agora sim. Isso definitivamente não é uma viagem normal."',

                    effects: {
                        humor: 1,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Santiago: "Fica perto de mim. Tem alguma coisa errada aqui."',

                    effects: {
                        romance: 2,
                        prudencia: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Você está com medo?"',

                    effects: {
                        humor: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Não se afasta. Essa ilha está reagindo à concha."',

                    effects: {
                        confianca: 1,
                        prudencia: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "porta_ruinas",
            "0-1": "porta_ruinas",
            "1-0": "porta_ruinas",
            "1-1": "porta_ruinas"
        }
    },


    // ========================================================
    // PORTA DAS RUÍNAS
    // ========================================================

    porta_ruinas: {
        chapter: "CAPÍTULO 3 — A ILHA",
        speaker: "Narrador",

        text:
            "A entrada das ruínas possui duas portas. Uma tem o símbolo " +
            "de uma onda. A outra, o de uma lua. Ao tocar a parede, " +
            "Alissa sente uma dor forte na mão.",

        animAlissa: "step-back-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Chega. Você não vai tocar em mais nada."',

                    effects: {
                        prudencia: 1,
                        romance: 2
                    }
                },

                {
                    text:
                        'Santiago: "Me mostra a mão. Se estiver machucada, a gente para."',

                    effects: {
                        confianca: 2,
                        romance: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "É só uma dorzinha. Para de se preocupar."',

                    effects: {
                        coragem: 1,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Tá bom. Mas não precisa fazer essa cara."',

                    effects: {
                        confianca: 1,
                        romance: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "duas_portas",
            "0-1": "duas_portas",
            "1-0": "duas_portas",
            "1-1": "duas_portas"
        }
    },


    duas_portas: {
        chapter: "CAPÍTULO 3 — A ILHA",
        speaker: "Alissa",

        text:
            "Os símbolos começam a se mover. Uma inscrição aparece: " +
            "\"Somente quando duas vontades discordarem, o caminho será aberto.\"",

        animAlissa: "look-at-santiago",
        animSantiago: "look-at-alissa",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Então escolhe a lua. Eu vou na onda."',

                    effects: {
                        confianca: 2
                    }
                },

                {
                    text:
                        'Santiago: "Não. Vamos juntos pela mesma porta."',

                    effects: {
                        romance: 2,
                        confianca: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Lua. E não tenta me convencer do contrário."',

                    effects: {
                        coragem: 1,
                        humor: 1
                    }
                },

                {
                    text:
                        'Alissa: "Onda. Quero ver se você vai me acompanhar."',

                    effects: {
                        romance: 2,
                        humor: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "porta_aberta",
            "0-1": "porta_aberta",
            "1-0": "porta_aberta",
            "1-1": "porta_aberta"
        }
    },


    porta_aberta: {
        chapter: "CAPÍTULO 3 — A ILHA",
        speaker: "Narrador",

        text:
            "As duas escolhas, mesmo diferentes, fazem os mecanismos responderem. " +
            "Uma passagem subterrânea se abre. No chão há dezenas de fotografias " +
            "antigas — todas de pessoas que carregaram a concha.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Isso não é uma missão. É uma história que alguém tentou apagar."',

                    effects: {
                        curiosidade: 2
                    }
                },

                {
                    text:
                        'Santiago: "A gente pega a resposta e sai daqui."',

                    effects: {
                        prudencia: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Uma delas é parecida comigo."',

                    effects: {
                        medo: 1,
                        curiosidade: 2
                    }
                },

                {
                    text:
                        'Alissa: "Tem alguém manipulando tudo isso há muito tempo."',

                    effects: {
                        curiosidade: 2,
                        coragem: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "guardiao",
            "0-1": "guardiao",
            "1-0": "guardiao",
            "1-1": "guardiao"
        }
    },


    // ========================================================
    // GUARDIÃO
    // ========================================================

    guardiao: {
        chapter: "CAPÍTULO 4 — O GUARDIÃO",
        speaker: "Narrador",

        text:
            "Um enorme guardião de pedra desperta. Seus olhos azuis se acendem. " +
            "Ele não ataca. Apenas aponta para Alissa e diz: \"Escolha.\"",

        animAlissa: "shocked-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Eu fico aqui com ela. O que acontecer, acontece com nós dois."',

                    effects: {
                        romance: 2,
                        confianca: 2
                    }
                },

                {
                    text:
                        'Santiago: "Eu distraio o guardião. Você procura uma saída."',

                    effects: {
                        coragem: 2,
                        romance: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu vou descobrir o que ele quer."',

                    effects: {
                        coragem: 2,
                        curiosidade: 1
                    }
                },

                {
                    text:
                        'Alissa: "Não vou escolher nada até entender as regras."',

                    effects: {
                        prudencia: 2,
                        curiosidade: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "prova_guardiao",
            "0-1": "prova_guardiao",
            "1-0": "prova_guardiao",
            "1-1": "prova_guardiao"
        }
    },


    prova_guardiao: {
        chapter: "CAPÍTULO 4 — O GUARDIÃO",
        speaker: "Guardião",

        text:
            "\"Aquele que carrega a concha não deve caminhar sozinho. " +
            "Aquele que a acompanha deve decidir se confia.\"",

        animAlissa: "look-at-santiago",
        animSantiago: "look-at-alissa",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Eu confio nela. Mesmo quando ela me irrita pra caralho."',

                    effects: {
                        confianca: 2,
                        romance: 2,
                        humor: 1
                    }
                },

                {
                    text:
                        'Santiago: "Confio, mas ainda quero respostas."',

                    effects: {
                        confianca: 1,
                        curiosidade: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu confio nele. Infelizmente."',

                    effects: {
                        confianca: 2,
                        romance: 2,
                        humor: 1
                    }
                },

                {
                    text:
                        'Alissa: "Ainda não sei se confio totalmente."',

                    effects: {
                        desconfianca: 1,
                        curiosidade: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "passagem_secreta",
            "0-1": "passagem_secreta",
            "1-0": "passagem_secreta",
            "1-1": "passagem_secreta"
        }
    },


    passagem_secreta: {
        chapter: "CAPÍTULO 4 — O GUARDIÃO",
        speaker: "Narrador",

        text:
            "O guardião desaparece. Uma passagem se abre para uma câmara " +
            "com dezenas de espelhos. Em cada espelho, vocês veem uma " +
            "possibilidade diferente do futuro.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Não olha para os espelhos. Isso está tentando manipular a gente."',

                    effects: {
                        prudencia: 2
                    }
                },

                {
                    text:
                        'Santiago: "Olha. Talvez tenha alguma pista sobre o final."',

                    effects: {
                        curiosidade: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Vou olhar. Preciso saber o que eles mostram."',

                    effects: {
                        coragem: 1,
                        curiosidade: 2
                    }
                },

                {
                    text:
                        'Alissa: "Não. Isso está mexendo com a nossa cabeça."',

                    effects: {
                        prudencia: 2
                    }
                }
            ]
        },

        next: {
            "0-0": "espelho",
            "0-1": "espelho",
            "1-0": "espelho",
            "1-1": "espelho"
        }
    },


    espelho: {
        chapter: "CAPÍTULO 5 — A VERDADE",
        speaker: "Narrador",

        text:
            "Em um dos espelhos, Santiago vê Alissa sozinha diante do mar. " +
            "Em outro, Alissa vê Santiago indo embora. Ambos percebem que os " +
            "espelhos não mostram fatos — mostram medos.",

        animAlissa: "look-at-santiago",
        animSantiago: "look-at-alissa",
        vfx: "vfx-dark",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Eu não vou embora. Então pode parar de inventar merda."',

                    effects: {
                        romance: 2,
                        confianca: 2
                    }
                },

                {
                    text:
                        'Santiago: "Se isso é uma ameaça, vai precisar de algo melhor."',

                    effects: {
                        coragem: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu também não vou deixar você sozinho."',

                    effects: {
                        romance: 2,
                        confianca: 2
                    }
                },

                {
                    text:
                        'Alissa: "Isso só está tentando assustar a gente."',

                    effects: {
                        prudencia: 1,
                        coragem: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "verdade_alissa",
            "0-1": "verdade_alissa",
            "1-0": "verdade_alissa",
            "1-1": "verdade_alissa"
        }
    },


    // ========================================================
    // VERDADE
    // ========================================================

    verdade_alissa: {
        chapter: "CAPÍTULO 5 — A VERDADE",
        speaker: "Alissa",

        text:
            "Alissa finalmente conta tudo: sua família protegeu o segredo da " +
            "ilha por gerações. A concha escolhe alguém para abrir o Coração " +
            "do Mar. Mas ninguém sabe o que existe dentro.",

        animAlissa: "step-back-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-magic",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Você devia ter contado isso antes."',

                    effects: {
                        desconfianca: 2
                    }
                },

                {
                    text:
                        'Santiago: "Tá. Então descobrimos juntos o que tem lá."',

                    effects: {
                        confianca: 2,
                        romance: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu sei. Eu estava com medo de você ir embora."',

                    effects: {
                        confianca: 2,
                        romance: 2
                    }
                },

                {
                    text:
                        'Alissa: "Eu não sabia em quem confiar."',

                    effects: {
                        confianca: 1,
                        medo: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "briga",
            "0-1": "briga",
            "1-0": "briga",
            "1-1": "briga"
        }
    },


    // ========================================================
    // BRIGA
    // ========================================================

    briga: {
        chapter: "CAPÍTULO 5 — A VERDADE",
        speaker: "Narrador",

        text:
            "Um ruído ecoa pelos corredores. O estranho do farol aparece " +
            "novamente. Ele quer a concha e sabe como abrir o Coração do Mar.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-dark",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Fica atrás de mim."',

                    effects: {
                        coragem: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Santiago: "Alissa, nós dois. Sem bancar o herói."',

                    effects: {
                        confianca: 2,
                        coragem: 1
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Se você falar isso de novo, eu te dou um murro e vou junto."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Nós dois. Já que você finalmente entendeu."',

                    effects: {
                        confianca: 2,
                        romance: 2
                    }
                }
            ]
        },

        next: {
            "0-0": "confronto",
            "0-1": "confronto",
            "1-0": "confronto",
            "1-1": "confronto"
        }
    },


    // ========================================================
    // CONFRONTO FINAL
    // ========================================================

    confronto: {
        chapter: "CAPÍTULO 6 — O CORAÇÃO DO MAR",
        speaker: "Narrador",

        text:
            "O estranho tenta tomar a concha. Uma onda gigantesca invade " +
            "a câmara. A estrutura começa a desabar. A única saída é ativar " +
            "o Coração do Mar.",

        animAlissa: "shocked-alissa",
        animSantiago: "shocked-santiago",
        vfx: "vfx-storm",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Eu seguro a passagem. Você ativa o mecanismo."',

                    effects: {
                        coragem: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Santiago: "Não. Fazemos juntos. Não vou deixar você carregar isso sozinha."',

                    effects: {
                        romance: 3,
                        confianca: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Eu vou ativar. Confia em mim."',

                    effects: {
                        coragem: 2,
                        confianca: 1
                    }
                },

                {
                    text:
                        'Alissa: "Só se você ficar comigo até o fim."',

                    effects: {
                        romance: 3,
                        confianca: 2
                    }
                }
            ]
        },

        next: {
            "0-0": "coracao",
            "0-1": "coracao",
            "1-0": "coracao",
            "1-1": "coracao"
        }
    },


    // ========================================================
    // CORAÇÃO DO MAR
    // ========================================================

    coracao: {
        chapter: "CAPÍTULO 6 — O CORAÇÃO DO MAR",
        speaker: "Narrador",

        text:
            "A concha se desfaz em luz. O Coração do Mar desperta, mas em vez " +
            "de destruir a ilha, ele estabiliza o oceano. O estranho foge. " +
            "A tempestade termina.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-romance",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Então era isso. Quase morremos por uma concha."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Santiago: "Valeu a pena. Principalmente porque você está bem."',

                    effects: {
                        romance: 3
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Você quase morreu. Eu vou te lembrar disso."',

                    effects: {
                        humor: 2,
                        romance: 2
                    }
                },

                {
                    text:
                        'Alissa: "Ainda bem que você ficou."',

                    effects: {
                        romance: 3,
                        confianca: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "praia_final",
            "0-1": "praia_final",
            "1-0": "praia_final",
            "1-1": "praia_final"
        }
    },


    // ========================================================
    // PRAIA FINAL
    // ========================================================

    praia_final: {
        chapter: "EPÍLOGO — DEPOIS DA TEMPESTADE",
        speaker: "Narrador",

        text:
            "De volta à praia, o sol nasce sobre o mar. A ilha desapareceu " +
            "da linha do horizonte. A concha não existe mais. Só restaram " +
            "as coordenadas e a certeza de que aquilo não terminou ali.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-sunset",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Se aparecer outra missão dessas, eu vou sozinho."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Santiago: "Na próxima, você não esconde metade da história de mim."',

                    effects: {
                        confianca: 2,
                        romance: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Na próxima eu escolho a equipe."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Na próxima, você vem comigo. E não adianta reclamar."',

                    effects: {
                        confianca: 2,
                        romance: 2
                    }
                }
            ]
        },

        next: {
            "0-0": "final_calmo",
            "0-1": "final_calmo",
            "1-0": "final_calmo",
            "1-1": "final_calmo"
        }
    },


    // ========================================================
    // FINAL
    // ========================================================

    final_calmo: {
        chapter: "EPÍLOGO",
        speaker: "Narrador",

        text:
            "Vocês caminham pela areia em silêncio. Depois de alguns passos, " +
            "Alissa olha para Santiago e sorri. \"Você está com agonia?\" " +
            "Ele responde: \"Talvez.\" Ela ri. O mar permanece quieto. Por enquanto.",

        animAlissa: "look-at-santiago",
        animSantiago: "look-at-alissa",
        vfx: "vfx-romance",

        choices: {

            santiago: [
                {
                    text:
                        'Santiago: "Só um pouco. Mas não conta pra ninguém."',

                    effects: {
                        romance: 2
                    }
                },

                {
                    text:
                        'Santiago: "Eu? Agonia nenhuma. Você que é ciumenta."',

                    effects: {
                        humor: 2,
                        romance: 2
                    }
                }
            ],

            alissa: [
                {
                    text:
                        'Alissa: "Ciumenta é a tua— esquece."',

                    effects: {
                        humor: 2,
                        romance: 1
                    }
                },

                {
                    text:
                        'Alissa: "Você é insuportável. Vamos embora."',

                    effects: {
                        romance: 2,
                        confianca: 1
                    }
                }
            ]
        },

        next: {
            "0-0": "fim",
            "0-1": "fim",
            "1-0": "fim",
            "1-1": "fim"
        }
    },


    fim: {
        chapter: "FIM",
        speaker: "Narrador",

        text:
            "FIM DA PRIMEIRA AVENTURA. A ilha sumiu, o mistério ficou maior " +
            "e, em algum lugar no fundo do mar, algo continua esperando. " +
            "Talvez essa tenha sido apenas a primeira maré.",

        animAlissa: "step-forward-alissa",
        animSantiago: "step-forward-santiago",
        vfx: "vfx-romance",

        choices: {

            santiago: [
                {
                    text: 'Santiago: "Continuar a história."',
                    effects: {}
                },

                {
                    text: 'Santiago: "Voltar para o começo."',
                    effects: {}
                }
            ],

            alissa: [
                {
                    text: 'Alissa: "Continuar."',
                    effects: {}
                },

                {
                    text: 'Alissa: "Voltar."',
                    effects: {}
                }
            ]
        },

        next: {
            "0-0": "inicio",
            "0-1": "inicio",
            "1-0": "inicio",
            "1-1": "inicio"
        }
    }
};


// ============================================================
// ESTADO DO JOGO
// ============================================================

const gameState = {

    scene: "inicio",

    selected: {
        santiago: null,
        alissa: null
    },

    stats: {
        romance: 0,
        confianca: 0,
        curiosidade: 0,
        coragem: 0,
        prudencia: 0,
        humor: 0,
        medo: 0,
        desconfianca: 0
    }
};

let typeInterval = null;
let choiceLocked = false;


// ============================================================
// ELEMENTOS DA INTERFACE
// ============================================================

const dialogText =
    document.getElementById("dialog-text");

const speakerName =
    document.getElementById("speaker-name");

const choicesContainer =
    document.getElementById("choices-container");

const waitingMsg =
    document.getElementById("waiting-msg");

const charAlissa =
    document.getElementById("char-alissa");

const charSantiago =
    document.getElementById("char-santiago");

const vfxOverlay =
    document.getElementById("vfx-overlay");


// ============================================================
// PAPEL DO JOGADOR
// ============================================================

function getMyRole() {

    if (typeof myRole !== "undefined") {
        return String(myRole).toLowerCase();
    }

    return "santiago";
}


function getOtherRole() {

    return getMyRole() === "santiago"
        ? "alissa"
        : "santiago";
}


// ============================================================
// CONEXÃO
// ============================================================

socket.on("connect", () => {

    console.log(
        "✓ Conectado ao servidor como:",
        getMyRole()
    );

    socket.emit("join-game", {
        role: getMyRole()
    });

    const transitionMap = {};

    Object.keys(story).forEach(sceneId => {

        if (story[sceneId].next) {
            transitionMap[sceneId] =
                story[sceneId].next;
        }

    });

    socket.emit("story-ready", {
        transitions: transitionMap
    });

});


// ============================================================
// RECEBER ESTADO DO SERVIDOR
// ============================================================

socket.on("update-game", state => {

    if (!state) return;

    if (
        state.scene &&
        story[state.scene]
    ) {
        gameState.scene =
            state.scene;
    }

    if (state.stats) {

        gameState.stats = {
            ...gameState.stats,
            ...state.stats
        };

    }

    gameState.selected = {

        santiago:
            state.choices &&
            state.choices.santiago !== undefined
                ? state.choices.santiago
                : null,

        alissa:
            state.choices &&
            state.choices.alissa !== undefined
                ? state.choices.alissa
                : null
    };

    choiceLocked =
        gameState.selected[getMyRole()] !== null;

    renderScene(
        gameState.scene
    );

});


// ============================================================
// STATUS DAS ESCOLHAS
// ============================================================

socket.on("choice-status", state => {

    if (!state) return;

    gameState.selected = {
        ...gameState.selected,
        ...state.choices
    };

    updateWaitingStatus();

});


// ============================================================
// ERROS
// ============================================================

socket.on("error-message", message => {

    console.error(message);

    if (waitingMsg) {

        waitingMsg.classList.remove(
            "hidden-block"
        );

        waitingMsg.innerText =
            message;
    }

});


// ============================================================
// RENDERIZAR CENA
// ============================================================

function renderScene(sceneId) {

    const scene =
        story[sceneId];

    if (!scene) {

        console.error(
            `Cena não encontrada: ${sceneId}`
        );

        return;
    }

    clearInterval(typeInterval);

    if (dialogText) {
        dialogText.innerHTML = "";
    }

    if (choicesContainer) {
        choicesContainer.innerHTML = "";
    }

    gameState.selected = {
        santiago: null,
        alissa: null
    };

    choiceLocked = false;


    // ALISSA

    if (charAlissa) {

        charAlissa.className =
            `sprite ${scene.animAlissa || ""}`;

        charAlissa.classList.remove(
            "hide"
        );
    }


    // SANTIAGO

    if (charSantiago) {

        charSantiago.className =
            `sprite ${scene.animSantiago || ""}`;

        charSantiago.classList.remove(
            "hide"
        );
    }


    // EFEITO

    if (vfxOverlay) {

        vfxOverlay.className =
            scene.vfx || "";
    }


    // NOME DO PERSONAGEM

    if (speakerName) {

        speakerName.innerText =
            scene.speaker;

        if (scene.speaker === "Alissa") {

            speakerName.style.color =
                "#ff79c6";

        } else if (
            scene.speaker === "Santiago"
        ) {

            speakerName.style.color =
                "#8be9fd";

        } else {

            speakerName.style.color =
                "#f1fa8c";
        }
    }


    typeText(
        scene.text,
        () => {

            prepareChoiceUI();

            showMyChoices(scene);

            updateWaitingStatus();
        }
    );
}


// ============================================================
// EFEITO DE TEXTO
// ============================================================

function typeText(text, onComplete) {

    let charIndex = 0;

    typeInterval = setInterval(() => {

        if (!dialogText) {

            clearInterval(
                typeInterval
            );

            return;
        }

        if (charIndex < text.length) {

            dialogText.innerHTML +=
                escapeHTML(
                    text.charAt(charIndex)
                );

            charIndex++;

        } else {

            clearInterval(
                typeInterval
            );

            if (
                typeof onComplete ===
                "function"
            ) {
                onComplete();
            }
        }

    }, 18);
}


// ============================================================
// INTERFACE DE ESCOLHAS
// ============================================================

function prepareChoiceUI() {

    if (!choicesContainer) {
        return;
    }

    choicesContainer.innerHTML = "";

    const wrapper =
        document.createElement("div");

    wrapper.id =
        "simultaneous-choices";

    wrapper.className =
        "simultaneous-choices";


    const title =
        document.createElement("div");

    title.className =
        "choices-title";

    title.innerText =
        "Sua decisão";

    wrapper.appendChild(title);


    const buttons =
        document.createElement("div");

    buttons.id =
        "my-choice-buttons";

    buttons.className =
        "my-choice-buttons";

    wrapper.appendChild(buttons);


    choicesContainer.appendChild(
        wrapper
    );
}


// ============================================================
// MOSTRAR AS DUAS ESCOLHAS
// ============================================================

function showMyChoices(scene) {

    const role =
        getMyRole();

    const choices =
        scene.choices[role];


    if (
        !choices ||
        choices.length !== 2
    ) {

        console.error(
            `A cena ${gameState.scene} não possui exatamente 2 escolhas para ${role}.`
        );

        return;
    }


    const buttonsContainer =
        document.getElementById(
            "my-choice-buttons"
        );


    if (!buttonsContainer) {
        return;
    }


    buttonsContainer.innerHTML = "";


    choices.forEach(
        (choice, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "choice-btn";

            button.innerText =
                choice.text;

            button.dataset.choice =
                String(index);

            button.style.animationDelay =
                `${index * 0.12}s`;


            if (choiceLocked) {
                button.disabled = true;
            }


            button.onclick = () => {

                makeChoice(index);

            };


            buttonsContainer.appendChild(
                button
            );

        }
    );
}


// ============================================================
// FAZER ESCOLHA
// ============================================================

function makeChoice(index) {

    if (choiceLocked) {
        return;
    }


    const scene =
        story[gameState.scene];

    const role =
        getMyRole();


    if (
        !scene ||
        !scene.choices[role] ||
        !scene.choices[role][index]
    ) {
        return;
    }


    choiceLocked = true;

    gameState.selected[role] =
        index;


    const buttons =
        document.querySelectorAll(
            ".choice-btn"
        );


    buttons.forEach(
        (button, buttonIndex) => {

            button.disabled = true;

            if (
                buttonIndex === index
            ) {

                button.classList.add(
                    "selected-choice"
                );

            } else {

                button.classList.add(
                    "unselected-choice"
                );
            }

        }
    );


    if (waitingMsg) {

        waitingMsg.classList.remove(
            "hidden-block"
        );

        waitingMsg.innerText =
            `Você escolheu. Aguardando ${
                role === "santiago"
                    ? "Alissa"
                    : "Santiago"
            }...`;
    }


    socket.emit(
        "make-choice",
        {
            sceneId:
                gameState.scene,

            player:
                role,

            choiceIndex:
                index
        }
    );
}


// ============================================================
// STATUS
// ============================================================

function updateWaitingStatus() {

    if (!waitingMsg) {
        return;
    }


    const mine =
        gameState.selected[
            getMyRole()
        ];

    const other =
        gameState.selected[
            getOtherRole()
        ];


    if (
        mine === null ||
        mine === undefined
    ) {

        waitingMsg.classList.remove(
            "hidden-block"
        );

        waitingMsg.innerText =
            "Escolha uma das duas opções.";

        return;
    }


    if (
        other === null ||
        other === undefined
    ) {

        waitingMsg.classList.remove(
            "hidden-block"
        );

        waitingMsg.innerText =
            `Sua escolha foi registrada. Aguardando ${
                getOtherRole() === "santiago"
                    ? "Santiago"
                    : "Alissa"
            }...`;

        return;
    }


    waitingMsg.classList.remove(
        "hidden-block"
    );

    waitingMsg.innerText =
        "Os dois escolheram. Revelando o resultado...";
}


// ============================================================
// UTILIDADES
// ============================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;
}


function calculateCombination(
    sceneId,
    santiagoChoice,
    alissaChoice
) {

    const scene =
        story[sceneId];


    if (
        !scene ||
        !scene.next
    ) {
        return null;
    }


    return (
        scene.next[
            `${santiagoChoice}-${alissaChoice}`
        ] || null
    );
}


// ============================================================
// DEBUG
// ============================================================

window.story =
    story;

window.gameState =
    gameState;

window.calculateCombination =
    calculateCombination;


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderScene(
            gameState.scene
        );

    }
);