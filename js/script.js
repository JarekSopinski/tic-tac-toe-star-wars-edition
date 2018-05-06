const settings = $("#js-settings");
const chooseCross = $("#js-choose-cross");
const chooseCircle = $("#js-choose-circle");

const gameScreen = $("#js-game-screen");

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

const startGame = (playerSign) => {

    gameState = $.extend(true, {}, initialGameState);
    // TODO: after restarting keep signs settings from previous game;
    boardState = $.extend(true, {}, initialBoardState);

    // set signs for player and computer
    gameState.playerSign = playerSign;
    gameState.playerSign === "cross" ? gameState.computerSign = "circle" : gameState.computerSign = "cross";

    // TODO: deciding who starts the game also should be handled here
    // TODO: add a callback for setting hidden class for all items after restart

};

// ************** EVENT LISTENERS ****************** //

const handleSettingsClick = (playerSign) => {

    // hide settings screen and show game board
    settings.toggleClass("hidden");
    gameScreen.toggleClass("hidden");

    startGame(playerSign);

};

$(document).ready(() => {

    startGame("cross"); // TODO: this is for development only, remove it later! Normally game is started from handleSettingsClick()

    chooseCross.on("click", () => handleSettingsClick("cross"));
    chooseCircle.on("click", () => handleSettingsClick("circle"));

});

