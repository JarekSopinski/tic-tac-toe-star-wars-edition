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
    signInCurrentTurn: null

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
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3"],
    ["c1", "c2", "c3"],

    // vertical:
    ["a1", "b1", "c1"],
    ["a2", "b2", "c2"],
    ["a3", "b3", "c3"],

    // slant:
    ["a1", "b2", "c3"],
    ["a3", "b2", "c1"]

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
    gameState.signInCurrentTurn = gameState.playerSign;
    renderTurnMessage()

    // TODO: add a callback for removing all signs from board after restart

};

const startNewTurn = () => {
    // toggles turn and displays new turn status; in case of computer also runs move function

    switch (gameState.turn) {

        case "player":
            gameState.turn = "computer";
            gameState.signInCurrentTurn = gameState.computerSign;
            renderTurnMessage();
            handleComputerMove(); // TODO: run this function after a short timeout to simulate computer "thinking"
            break;

        case "computer":
            gameState.turn = "player";
            gameState.signInCurrentTurn = gameState.playerSign;
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
    // find field to mark, mark it, then victory or new turn

    console.log("computer turn starts");

    // TODO: difficulty check should be handled here - wise mode: call findFieldToMark() / dumb mode: call getRandomField()
    const field = findFieldToMark();
    const computerSign = gameState.computerSign;

    boardState[field] = computerSign; // checking field as marked by computer
    appendSignToField(computerSign, field); // rendering image inside field

    console.log("computer turn ends");

    // after computer has made a move, game checks if it won. If not, player's turn starts:
    checkForVictory() ? stopGame() : startNewTurn()

};

const checkForVictory = () => {
    // runs at the end of each turn, after move by player or computer has been made

    let isVictory = false;

    victoryCombinations.forEach(combination => {

        // Each combo array has 3 fields. We have to check if all of them have the same mark.
        // For example, in horizontal combo: combination[0] = boardState.a1, combination[1] = boardState.a2...

        // Checks need to run on boardState, not on victoryCombinations array - this array is not modified during game!
        // Therefore we use values from combos array to check correct keys in boardState object:

        const comboFieldA = combination[0];
        const comboFieldB = combination[1];
        const comboFieldC = combination[2];

        if (boardState[comboFieldA] === gameState.signInCurrentTurn
            && boardState[comboFieldB] === gameState.signInCurrentTurn
            && boardState[comboFieldC] === gameState.signInCurrentTurn) {
            console.log("victory");
            isVictory = true
        } else { console.log("no victory") } // TODO: else cond. only for development

    });

    return isVictory

};

const stopGame = () => {
    // runs if checkForVictory returns true or in case of a draw

    console.log("Game has ended");

};


// ************** COMPUTER MOVES ****************** //


const findFieldToMark = () => {

    /*
    Computer runs 2 checks:
    1) If it can get a win in this turn;
    2) If enemy has to be blocked (or enemy will win next turn);
    If both failed, it marks a field in a column or row where it already has one mark and two other fields are empty;
    Otherwise, it marks random field.
     */

    let fieldToMark;

    if ( tryToWinOrToBlock("win") ) {
        fieldToMark = tryToWinOrToBlock("win")
    } else if ( tryToWinOrToBlock("block") ) {
        fieldToMark = tryToWinOrToBlock("block")
    } else if ( checkIfAnyFieldIsMarked() ) {
        fieldToMark = checkIfAnyFieldIsMarked()
    }
    else {
        fieldToMark = getRandomField();
    }

    console.log("decided to mark: " + fieldToMark);
    return fieldToMark

};

const tryToWinOrToBlock = (actionType) => {

    let sign;
    let fieldToMark = null;

    // actionType can be "win" (first step in computer's logic) - in that case function operates on computer sign
    // or "block" (second step) - in that case function operates on player's sign:

    actionType === "win" ? sign = gameState.computerSign : sign = gameState.playerSign;

    console.log(actionType + " " + sign);

    victoryCombinations.forEach(combination => {

        const A = combination[0];
        const B = combination[1];
        const C = combination[2];

        // Computer checks if there is a row or column in which there is only one missing field.
        // If so, this field is the function's result (field's name, taken from an array, not a value from state!).

        if (boardState[A] === sign && boardState[B] === sign) {
            fieldToMark = C
        } else if (boardState[A] === sign && boardState[C] === sign) {
            fieldToMark = B
        } else if (boardState[B] === sign && boardState[C] === sign) {
            fieldToMark = A
        }

    }); // end of loop

    // If check failed, function will return false, and findFieldToMarkByComputer() can execute next check based on this.
    // Otherwise, correct field is returned and passed to findFieldToMarkByComputer(), which returns this as its own result.

    console.log(`field to mark: ${fieldToMark}`);
    if (boardState[fieldToMark]) {console.log("field marked!") }

    // Preventing the case of choosing field which was already marked:
    return !boardState[fieldToMark] ? fieldToMark : null

};

const checkIfAnyFieldIsMarked = () => {


};

const getRandomField = () => {

    const fields = Object.keys(boardState);
    const randomField = fields[Math.floor(Math.random() * fields.length)];

    console.log("random field: " + randomField);

    // if field was already marked, recursion is used - function calls itself back, until if finds an empty field:
    return boardState[randomField] ? getRandomField() : randomField

};


// ************** RENDERING ****************** //


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

