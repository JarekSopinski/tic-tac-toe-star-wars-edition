const $settingsScreen = $("#js-settings-screen");
const $chooseCross = $("#js-choose-cross");
const $chooseCircle = $("#js-choose-circle");

const $gameScreen = $("#js-game-screen");
const $turnQuote = $("#js-turn-quote");
const $turnHint = $("#js-turn-hint");

const $a1 = $("#js-a1");
const $a2 = $("#js-a2");
const $a3 = $("#js-a3");

const $b1 = $("#js-b1");
const $b2 = $("#js-b2");
const $b3 = $("#js-b3");

const $c1 = $("#js-c1");
const $c2 = $("#js-c2");
const $c3 = $("#js-c3");

let gameState = {};
let boardState = {};

const initialGameState = {

    playerSign: null,
    computerSign: null,
    turn: null,

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

const victoryCombinations = [

    // horizontal:
    [boardState.a1, boardState.a2, boardState.a3],
    [boardState.b1, boardState.b2, boardState.b3],
    [boardState.c1, boardState.c2, boardState.c3],

    // vertical:
    [boardState.a1, boardState.b1, boardState.c1],
    [boardState.a2, boardState.b2, boardState.c2],
    [boardState.a3, boardState.b3, boardState.c3],

    // slant:
    [boardState.a1, boardState.b2, boardState.c3],
    [boardState.a3, boardState.b2, boardState.c1]

];


const playerTurnQuote = "Do or do not, there is no try";
const playerTurnHint = "(it's your turn!)";
const computerTurnQuote = "Patience you must have, my young padawan";
const computerTurnHint = "(it's computer's turn!)";


// ************** GAME FLOW ****************** //


const startGame = playerSign => {

    gameState = $.extend(true, {}, initialGameState);
    // TODO: after restarting keep signs settings from previous game;
    boardState = $.extend(true, {}, initialBoardState);

    // set signs for player and computer
    gameState.playerSign = playerSign;
    gameState.playerSign === "cross" ? gameState.computerSign = "circle" : gameState.computerSign = "cross";

    // setting turn as a player's turn and displaying turn status:
    gameState.turn = "player"; // TODO: deciding who starts the game should be varied
    renderTurnMessage()

    // TODO: add a callback for removing all signs from board after restart

};

const startNewTurn = () => {
    // toggles turn and displays new turn status; in case of computer also runs move function

    switch (gameState.turn) {

        case "player":
            gameState.turn = "computer";
            renderTurnMessage();
            handleComputerMove();
            break;

        case "computer":
            gameState.turn = "player";
            renderTurnMessage();
            // opposing to first case, we don't run handle(...)Move from here
            // in case of player, it's an event listener callback!

    }

};

const handlePlayerMove = field => {
    // runs as a callback from handleFieldClick() event listener

    const playerSign = gameState.playerSign;

    boardState[field] = playerSign; // checking field as marked by player
    appendSignToField(playerSign, field); // rendering image inside field

    // after player has made a move, game checks if he won. If not, computer's turn starts:
    checkForVictory() ? stopGame() : startNewTurn()

};

const handleComputerMove = () => {
    // computer's game logic happens here

};

const checkForVictory = () => {
    // runs at the end of each turn, after move by player or computer has been made

    let isVictory = false;

    victoryCombinations.forEach(combination => {

        if (combination[0] === gameState.turn
            && combination[1] === gameState.turn
            && combination[2] === gameState.turn) {
            isVictory = true
        } else { console.log("no victory") } // TODO: else cond. only for development

        // for example in horizontal combo: combination[0] = boardState.a1, combination[1] = boardState.a2...
        // gameState.turn = "player" || "computer", so this checks if field is marked as of them

    });

    return isVictory

};

const stopGame = () => {
    // runs if checkForVictory returns true or in case of a draw

    console.log("Game has ended");

};


// ************** HELPER FUNCTIONS ****************** //


const appendSignToField = (sign, field) => {

    switch (field) {

        case "a1":
            renderSign(sign, $a1);
            break;
        case "a2":
            renderSign(sign, $a2);
            break;
        case "a3":
            renderSign(sign, $a3);
            break;
        case "b1":
            renderSign(sign, $b1);
            break;
        case "b2":
            renderSign(sign, $b2);
            break;
        case "b3":
            renderSign(sign, $b3);
            break;
        case "c1":
            renderSign(sign, $c1);
            break;
        case "c2":
            renderSign(sign, $c2);
            break;
        case "c3":
            renderSign(sign, $c3);

    }

};

const renderSign = (sign, field) => {

    // Cross is always a first child and circle is always a second child

    sign === "cross" ?
        field.children(":first").toggleClass("hidden")
        :
        field.children(":last").toggleClass("hidden")

};

const renderTurnMessage = () => {

    if (gameState.turn === "player") {
        $turnQuote.text(playerTurnQuote);
        $turnHint.text(playerTurnHint)
    }

    else {
        $turnQuote.text(computerTurnQuote);
        $turnHint.text(computerTurnHint)
    }

};

const getRandomField = () => {
  const fields = Object.keys(boardState);
  return fields[Math.floor(Math.random() * fields.length)];
};


// ************** EVENT LISTENERS ****************** //


const handleSettingsClick = playerSign => {

    // hide settings screen and show game board:
    $settingsScreen.toggleClass("hidden");
    $gameScreen.toggleClass("hidden");

    startGame(playerSign);

};

const handleFieldClick = field => {
    // check if field is empty and if it's player's turn - if so, execute player's move:
    if (!boardState[field] && gameState.turn === "player") { handlePlayerMove(field) }
};

$(document).ready(() => {

    startGame("cross"); // TODO: this is for development only, remove it later! Normally game is started from handleSettingsClick()

    $chooseCross.on("click", () => handleSettingsClick("cross"));
    $chooseCircle.on("click", () => handleSettingsClick("circle"));

    $a1.on("click", () => handleFieldClick("a1"));
    $a2.on("click", () => handleFieldClick("a2"));
    $a3.on("click", () => handleFieldClick("a3"));

    $b1.on("click", () => handleFieldClick("b1"));
    $b2.on("click", () => handleFieldClick("b2"));
    $b3.on("click", () => handleFieldClick("b3"));

    $c1.on("click", () => handleFieldClick("c1"));
    $c2.on("click", () => handleFieldClick("c2"));
    $c3.on("click", () => handleFieldClick("c3"));

});

