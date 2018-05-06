const settingsScreen = $("#js-settings-screen");
const gameScreen = $("#js-game-screen");

const chooseCross = $("#js-choose-cross");
const chooseCircle = $("#js-choose-circle");

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

// ************** GAME MECHANICS ****************** //

const startGame = playerSign => {

    gameState = $.extend(true, {}, initialGameState);
    // TODO: after restarting keep signs settings from previous game;
    boardState = $.extend(true, {}, initialBoardState);

    // set signs for player and computer
    gameState.playerSign = playerSign;
    gameState.playerSign === "cross" ? gameState.computerSign = "circle" : gameState.computerSign = "cross";

    // TODO: deciding who starts the game also should be handled here
    // TODO: add a callback for removing all signs from board after restart

};

const handlePlayerMove = field => {

    const playerSign = gameState.playerSign;

    boardState[field] = playerSign; // checking field as marked by player
    displaySign(playerSign, field); // rendering image inside field

};

// ************** HELPER FUNCTIONS ****************** //

const displaySign = (sign, field) => {

};

// ************** EVENT LISTENERS ****************** //

const handleSettingsClick = playerSign => {

    // hide settings screen and show game board:
    settingsScreen.toggleClass("hidden");
    gameScreen.toggleClass("hidden");

    startGame(playerSign);

};

const handleFieldClick = field => {
    // check if field is empty - if so, execute player's move:
    if (!boardState[field]) { handlePlayerMove(field) }
};

$(document).ready(() => {

    startGame("cross"); // TODO: this is for development only, remove it later! Normally game is started from handleSettingsClick()

    chooseCross.on("click", () => handleSettingsClick("cross"));
    chooseCircle.on("click", () => handleSettingsClick("circle"));

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

