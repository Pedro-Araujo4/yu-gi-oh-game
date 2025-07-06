const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides:{
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions:{
        button: document.getElementById("next-duel"),
    },
}

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

async function drawSelectedCard(Index) {
    state.cardSprites.avatar.src = cardData[Index].img;
    state.cardSprites.name.textContent = cardData[Index].name;
    state.cardSprites.type.textContent = `Attribute : ${cardData[Index].type}`;
};

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
        drawSelectedCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }


    return cardImage;

};

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldImages(true);

    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId)

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } 
    if (value === false) {
       state.fieldCards.player.style.display = "none"
       state.fieldCards.computer.style.display = "none"
    }
    
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`;
};

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerId, computerCardId ) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "WIN";
        state.score.playerScore++;
    } 
    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "LOSE";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
};

async function removeAllCardsImages() {
    let {computerBox, player1Box} = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
};

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        console.log(fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage);

    }
};

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.computer.style.display = "none";
    state.fieldCards.player.style.display = "none";

    init();
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.textContent = ""
    state.cardSprites.type.textContent = "";
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    const audioMp3 = new Audio(`./src/assets/audios/${status}.mp3`)
    let volume = 0.1;
    audio.volume = volume
    audioMp3.volume = volume
    audioMp3.play();
    audio.play();
    
}

async function bgmAudioPlay() {
    const bgm = document.getElementById("bgm")
    bgm.volume = 0.2;
    bgm.play();
}

function init() {

    showHiddenCardFieldImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    bgmAudioPlay();
};

init();