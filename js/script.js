const $settingsScreen = $("#js-settings-screen");
const $chooseCross = $("#js-choose-cross");
const $chooseCircle = $("#js-choose-circle");

const $difficultyScreen = $("#js-difficulty-screen");
const $chooseHard = $("#js-choose-hard");
const $chooseEasy = $("#js-choose-easy");

const $gameScreen = $("#js-game-screen");
const $turnQuote = $("#js-turn-quote");
const $turnHint = $("#js-turn-hint");

const $endPopup = $("#js-end-popup");
const $endPopupTitle = $("#js-end-popup_title");
const $simpleRestartBtn = $("#js-end-popup_simple-restart-btn");
const $simpleRestartText = $("#js-end-popup_simple-restart-text");
const $switchRestartBtn = $("#js-end-popup_switch-restart-btn");
const $switchRestartText = $("#js-end-popup_switch-restart-text");
const $toggleDifficultyBtn = $("#js-end-popup_toggle-difficulty-btn");
const $toggleDifficultyText = $("#js-end-popup_toggle-difficulty-text");

const $results = $("#js-results");
const $resultsGameCounter = $("#js-results-game-counter");
const $resultsJediWins = $("#js-results-jedi-wins");
const $resultsSithWins = $("#js-results-sith-wins");
const $resultsPlayerWins = $("#js-results-player-wins");
const $resultsComputerWins = $("#js-results-computer-wins");

const $fields = {

    a1: $("#js-a1"),
    a2: $("#js-a2"),
    a3: $("#js-a3"),

    b1: $("#js-b1"),
    b2: $("#js-b2"),
    b3: $("#js-b3"),

    c1: $("#js-c1"),
    c2: $("#js-c2"),
    c3: $("#js-c3"),

};

let gameState = {};
let boardState = {};

const initialGameState = {

    difficulty: null,
    playerSign: null,
    computerSign: null,
    turn: null,
    signInCurrentTurn: null,
    winner: null,
    winnerSign: null,
    victoryFields: []

};

const initialBoardState = {

    a1: null,
    a2: null,
    a3: null,

    b1: null,
    b2: null,
    b3: null,

    c1: null,
    c2: null,
    c3: null

};

const counter = {

    gameCounter: 0,
    crossWins: 0,
    circleWins: 0,
    playerWins: 0,
    computerWins: 0

};

const fieldIDs = Object.keys(initialBoardState);

const victoryCombinations = [

    // horizontal:
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3"],
    ["c1", "c2", "c3"],

    // vertical:
    ["a1", "b1", "c1"],
    ["a2", "b2", "c2"],
    ["a3", "b3", "c3"],

    // cross:
    ["a1", "b2", "c3"],
    ["a3", "b2", "c1"]

];


const playerTurnQuote = "Do or do not, there is no try";
const playerTurnHint = "(it's your turn!)";
const computerTurnQuote = "Patience you must have, my young padawan";
const computerTurnHint = "(it's computer's turn!)";

const victoryHint = "(you win!)";
const lossHint = "(you lose!)";
const tieHint = "(it's a tie [fighter?]...)";

const victoryQuotes = [
    "Everything is proceeding as I have foreseen.",
    "Great, kid. Don’t get cocky.",
    "The circle is now complete.",
    "You don’t have to do this to impress me.",
    "All too easy!",
    "Don't underestimate the Force."
];

const lossQuotes = [
    "…I think I just blasted it.",
    "Apology accepted, Captain Needa.",
    "You’ve failed, your highness.",
    "It's a trap!",
    "Now, young Skywalker, you will die."
];

const tieQuotes = [
    "We had a slight weapons malfunction.",
    "Unexpected, this is, and unfortunate.",
    "These aren’t the droids you’re looking for!"
];

const endPopupMessages = {

    crossWinTitle: "Light side prevails!",
    circleWinTitle: "Dark side prevails!",
    tieTitle: "The force remains in a balance.",
    continueAsCross: "Try again as a Jedi...",
    continueAsCircle: "Try again as a Sith...",
    switchToCircle: "...turn to the Dark Side!",
    switchToCross: "...turn to the Light Side!",
    switchToEasy: "Change difficulty to easy?",
    switchToHard: "Change difficulty to hard?",
    switchedToHard: "Impressive. Most impressive. (set to hard!)",
    switchedToEasy: "Han my boy, you disappoint me. (set to easy!)"

};

const crossBlueColor = "rgba(7,110,176,0.7)";
const circleRedColor = "rgba(157,43,33,0.7)";


// ************** GAME FLOW ****************** //


const prepareGame = () => {

    const playerSign = gameState.playerSign;
    const difficulty = gameState.difficulty;

    let winnerOfLastGame;

    counter.gameCounter === 0 || gameState.winner === "tie" ?
        winnerOfLastGame = "noWinner"
        :
        winnerOfLastGame = gameState.winner;

    if (counter.gameCounter > 0) { clearBoardBeforeNewGame() }
    gameState = $.extend(true, {}, initialGameState);
    boardState = $.extend(true, {}, initialBoardState);

    gameState.playerSign = playerSign;
    gameState.difficulty = difficulty;
    gameState.playerSign === "cross" ? gameState.computerSign = "circle" : gameState.computerSign = "cross";

    chooseWhoPlaysFirst(winnerOfLastGame);
    startGame()

};

const chooseWhoPlaysFirst = (winnerOfLastGame) => {

    switch (winnerOfLastGame) {
        case "noWinner":
            let randomNumber = Math.floor(Math.random() * 2);
            randomNumber === 0 ? gameState.turn = "player" : gameState.turn = "computer";
            break;
        case "player":
            gameState.turn = "player";
            break;
        case "computer":
            gameState.turn = "computer"
    }

};

const startGame = () => {

  switch (gameState.turn) {
      case "player":
          gameState.signInCurrentTurn = gameState.playerSign;
          displayTurnMessage();
          $resultsGameCounter.text(`Round: ${counter.gameCounter + 1}`);
          break;
      case "computer":
          gameState.signInCurrentTurn = gameState.computerSign;
          displayTurnMessage();
          $resultsGameCounter.text(`Round: ${counter.gameCounter + 1}`);
          setTimeout(executeComputerMove, 1000);
  }

};


const startNewTurn = () => {

    switch (gameState.turn) {

        case "player":
            gameState.turn = "computer";
            gameState.signInCurrentTurn = gameState.computerSign;
            displayTurnMessage();
            setTimeout(executeComputerMove, 1000);
            break;

        case "computer":
            gameState.turn = "player";
            gameState.signInCurrentTurn = gameState.playerSign;
            displayTurnMessage();

    }

};

const executePlayerMove = field => {

    const playerSign = gameState.playerSign;

    boardState[field] = playerSign;
    displaySignInSelectedField(playerSign, field);

    if (checkForVictory()) { stopGame() }
    else if (checkForTie()) { stopGame() }
    else { startNewTurn() }

};

const executeComputerMove = () => {

    const computerSign = gameState.computerSign;
    let field;
    gameState.difficulty === "hard" ? field = findFieldToMark() : field = getRandomField();

    boardState[field] = computerSign;
    displaySignInSelectedField(computerSign, field);

    if (checkForVictory()) { stopGame() }
    else if (checkForTie()) { stopGame() }
    else { startNewTurn() }

};

const checkForVictory = () => {

    let isVictory = false;

    victoryCombinations.forEach(combination => {

        const A = combination[0];
        const B = combination[1];
        const C = combination[2];

        if (boardState[A] === gameState.signInCurrentTurn
            && boardState[B] === gameState.signInCurrentTurn
            && boardState[C] === gameState.signInCurrentTurn) {

            isVictory = true;
            gameState.winner = gameState.turn;
            gameState.winnerSign = gameState.signInCurrentTurn;
            gameState.victoryFields.push(...[A, B, C])

        }

    });

    return isVictory

};

const checkForTie = () => {

    let isTie;
    const fieldValues = [];

    fieldIDs.forEach(fieldID => {
        boardState[fieldID] ? fieldValues.push("marked") : fieldValues.push("empty")
    });

    isTie = fieldValues.every(field => field === "marked");

    if (isTie) {
        gameState.winner = "tie";
        gameState.winnerSign = "tie"
    }

    return isTie

};

const stopGame = () => {

    gameState.turn = "gameOver";
    updateCounter();
    fillVictoryCombinationWithColor();
    displayTurnMessage();
    displayResults();
    setTimeout(displayEndPopup, 2000);

};

const updateCounter = () => {

    counter.gameCounter++;

    if (gameState.winner === "player") { counter.playerWins++ }
    else if (gameState.winner === "computer") { counter.computerWins++ }

    if (gameState.winnerSign === "cross") { counter.crossWins++ }
    else if (gameState.winnerSign === "circle") { counter.circleWins++ }

};


// ************** COMPUTER MOVES ****************** //


const findFieldToMark = () => {

    let fieldToMark;

    if ( tryToWinOrToBlock("win") ) {
        fieldToMark = tryToWinOrToBlock("win")
    } else if ( tryToWinOrToBlock("block") ) {
        fieldToMark = tryToWinOrToBlock("block")
    } else if ( markSecondField() ) {
        fieldToMark = markSecondField()
    }
    else {
        fieldToMark = getRandomField();
    }

    return fieldToMark

};

const tryToWinOrToBlock = (actionType) => {

    const fieldsToMark = [];
    let sign;

    actionType === "win" ? sign = gameState.computerSign : sign = gameState.playerSign;

    victoryCombinations.forEach(combination => {

        const A = combination[0];
        const B = combination[1];
        const C = combination[2];

        if (boardState[A] === sign && boardState[B] === sign) {
            fieldsToMark.push(C)
        } else if (boardState[A] === sign && boardState[C] === sign) {
            fieldsToMark.push(B)
        } else if (boardState[B] === sign && boardState[C] === sign) {
            fieldsToMark.push(A)
        }

    });

    const freeFieldsToMark = fieldsToMark.filter(field => { return !boardState[field] });
    return freeFieldsToMark[0]

};

const markSecondField = () => {

    const fieldsToMark = [];
    const sign = gameState.computerSign;

    victoryCombinations.forEach(combination => {

        const A = combination[0];
        const B = combination[1];
        const C = combination[2];

        if (boardState[A] === sign && !boardState[B] && !boardState[C]) {

            fieldsToMark.push(B);
            fieldsToMark.push(C)

        } else if (!boardState[A] && boardState[B] === sign && !boardState[C]) {

            fieldsToMark.push(A);
            fieldsToMark.push(C)

        } else if (!boardState[A] && !boardState[B] && boardState[C] === sign) {

            fieldsToMark.push(A);
            fieldsToMark.push(B)
        }

    });

    return fieldsToMark[Math.floor(Math.random() * fieldsToMark.length)];

};

const getRandomField = () => {

    const randomField = fieldIDs[Math.floor(Math.random() * fieldIDs.length)];
    return boardState[randomField] ? getRandomField() : randomField

};


// ************** RENDERING ****************** //


const displaySignInSelectedField = (sign, field) => {

    sign === "cross" ?
        $fields[field].children(":first").toggleClass("hidden")
        :
        $fields[field].children(":last").toggleClass("hidden")

};

const displayTurnMessage = () => {

    if (gameState.turn === "player") {
        $turnQuote.text(playerTurnQuote);
        $turnHint.text(playerTurnHint)
    }

    else if (gameState.turn === "computer") {
        $turnQuote.text(computerTurnQuote);
        $turnHint.text(computerTurnHint)
    }

    else if (gameState.turn === "gameOver" && gameState.winner === "player") {
        const randomVictoryQuote = victoryQuotes[Math.floor(Math.random() * victoryQuotes.length)];
        $turnQuote.text(randomVictoryQuote);
        $turnHint.text(victoryHint);

    }

    else if (gameState.turn === "gameOver" && gameState.winner === "computer") {
        const randomLossQuote = lossQuotes[Math.floor(Math.random() * lossQuotes.length)];
        $turnQuote.text(randomLossQuote);
        $turnHint.text(lossHint);
    }

    else if (gameState.turn === "gameOver" && gameState.winner === "tie") {
        const randomTieQuote = tieQuotes[Math.floor(Math.random() * tieQuotes.length)];
        $turnQuote.text(randomTieQuote);
        $turnHint.text(tieHint);
    }

};

const fillVictoryCombinationWithColor = () => {

    let color;
    gameState.signInCurrentTurn === "cross" ? color = crossBlueColor : color = circleRedColor;

    gameState.victoryFields.forEach(field => {
        $fields[field].css("background-color", color)
    })

};

const displayEndPopup = () => {

    const winnerSign = gameState.winnerSign;
    const playerSign = gameState.playerSign;
    const difficulty = gameState.difficulty;

    switch (winnerSign) {
        case "cross":
            $endPopupTitle.text(endPopupMessages.crossWinTitle);
            break;
        case "circle":
            $endPopupTitle.text(endPopupMessages.circleWinTitle);
            break;
        case "tie":
            $endPopupTitle.text(endPopupMessages.tieTitle)
    }

    switch (playerSign) {
        case "cross":
            $simpleRestartText.text(endPopupMessages.continueAsCross);
            $switchRestartText.text(endPopupMessages.switchToCircle);
            $simpleRestartBtn.css('background-color', crossBlueColor);
            $switchRestartBtn.css('background-color', circleRedColor);
            break;
        case "circle":
            $simpleRestartText.text(endPopupMessages.continueAsCircle);
            $switchRestartText.text(endPopupMessages.switchToCross);
            $simpleRestartBtn.css('background-color', circleRedColor);
            $switchRestartBtn.css('background-color', crossBlueColor);
    }

    difficulty === "easy" ?
        $toggleDifficultyText.text(endPopupMessages.switchToHard)
        :
        $toggleDifficultyText.text(endPopupMessages.switchToEasy);

    $endPopup.toggleClass("hidden")

};

const clearBoardBeforeNewGame = () => {

    const fields = Object.keys(boardState);
    fields.forEach(field => {
        if (boardState[field]) { hideSignInMarkedField(field) }
    });

    if (gameState.winner !== "tie") { removeFieldsBgColors() }

};

const hideSignInMarkedField = (field) => {

    boardState[field] === "cross" ?
        $fields[field].children(":first").toggleClass("hidden")
        :
        $fields[field].children(":last").toggleClass("hidden");

};

const removeFieldsBgColors = () => {

    const coloredFields = gameState.victoryFields;
    coloredFields.forEach(field => $fields[field].css("background-color", "inherit"))

};

const displayResults = () => {

    $resultsJediWins.text(`Jedi ${counter.crossWins} :`);
    $resultsSithWins.text(`${counter.circleWins} Sith`);
    $resultsPlayerWins.text(`Player ${counter.playerWins} :`);
    $resultsComputerWins.text(`${counter.computerWins} Computer`)

};


// ************** EVENT LISTENERS ****************** //


const setInitialSign = playerSign => {

    gameState.playerSign = playerSign;

    $settingsScreen.toggleClass("hidden");
    $difficultyScreen.toggleClass("hidden")

};

const setInitialDifficulty = difficulty => {

    $difficultyScreen.toggleClass("hidden");
    $gameScreen.toggleClass("hidden");
    $results.toggleClass("hidden");

    gameState.difficulty = difficulty;
    prepareGame()

};

const handleFieldClick = field => {
    if (!boardState[field] && gameState.turn === "player") { executePlayerMove(field) }
};

const toggleDifficulty = () => {

    switch (gameState.difficulty) {
        case "easy":
            gameState.difficulty = "hard";
            $toggleDifficultyText.empty();
            $toggleDifficultyText.text(endPopupMessages.switchedToHard);
            break;
        case "hard":
            gameState.difficulty = "easy";
            $toggleDifficultyText.empty();
            $toggleDifficultyText.text(endPopupMessages.switchedToEasy)
    }

};

const handleRestartBtn = (isSignSwitched) => {

    $endPopup.toggleClass("hidden");

    switch (isSignSwitched) {
        case "playerSwitchedSign":
            gameState.playerSign === "cross" ? gameState.playerSign = "circle" : gameState.playerSign = "cross";
            prepareGame();
            break;
        case "playerDidNotSwitchSign":
            prepareGame()
    }

};

$(document).ready(() => {

    $chooseCross.on("click", () => setInitialSign("cross"));
    $chooseCircle.on("click", () => setInitialSign("circle"));

    $chooseHard.on("click", () => setInitialDifficulty("hard"));
    $chooseEasy.on("click", () => setInitialDifficulty("easy"));

    fieldIDs.forEach( fieldID => $fields[fieldID].on("click", () => handleFieldClick(fieldID)) );

    $simpleRestartBtn.on("click", () => handleRestartBtn("playerDidNotSwitchSign"));
    $switchRestartBtn.on("click", () => handleRestartBtn("playerSwitchedSign"));
    $toggleDifficultyBtn.on("click", toggleDifficulty);

});