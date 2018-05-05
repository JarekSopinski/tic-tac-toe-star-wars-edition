const settings = $("#js-settings");
const chooseCross = $("#js-choose-cross");
const chooseCircle = $("#js-choose-circle");

const gameScreen = $("#js-game-screen");

let state = {};

const initialState = {

};

// ************** EVENT LISTENERS ****************** //

const handleSettingsClick = (crossOrCircle) => {
    console.log(crossOrCircle);
    settings.toggleClass("hidden");
    gameScreen.toggleClass("hidden")
};

chooseCross.on("click", () => handleSettingsClick("cross"));
chooseCircle.on("click", () => handleSettingsClick("circle"));

