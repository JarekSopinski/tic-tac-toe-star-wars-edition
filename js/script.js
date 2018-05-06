const settings = $("#js-settings");
const chooseCross = $("#js-choose-cross");
const chooseCircle = $("#js-choose-circle");

const gameScreen = $("#js-game-screen");

let state = {};

const initialState = {

    playerSign: null,
    computerSign: null

};

// ************** GAME MECHANICS ****************** //

const startGame = (playerSign) => {

    state = $.extend(true, {}, initialState);
    // TODO: after restarting keep signs settings from previous game;

    // set signs for player and computer
    state.playerSign = playerSign;
    state.playerSign === "cross" ? state.computerSign = "circle" : state.computerSign = "cross";

    // TODO: deciding who starts the game also should be handled here

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

