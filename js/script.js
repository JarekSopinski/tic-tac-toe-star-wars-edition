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

const endPopupCrossWinTitle = "Light side prevails!";
const endPopupCircleWinTitle = "Dark side prevails!";
const endPopupTieTitle = "The force remains in a balance.";
const endPopupContinueAsCross = "Try again as a Jedi...";
const endPopupContinueAsCircle = "Try again as a Sith...";
const endPopupSwitchToCircle = "...turn to the Dark Side!";
const endPopupSwitchToCross = "...turn to the Light Side!";
const endPopupSwitchToEasy = "Change difficulty to easy?";
const endPopupSwitchToHard = "Change difficulty to hard?";
const endPopupSwitchedToHard = "Impressive. Most impressive. (set to hard!)";
const endPopupSwitchedToEasy = "Han my boy, you disappoint me. (set to easy!)";

const crossBlueColor = "rgba(7,110,176,0.7)";
const circleRedColor = "rgba(157,43,33,0.7)";


// ************** GAME FLOW ****************** //


const prepareGame = () => {

    console.log("Started preparing new game");

    // saving values from initial settings and, in case of restart, previous game, before clearing state:

    const playerSign = gameState.playerSign;
    const difficulty = gameState.difficulty;

    // saving winner of previous game - value will be used in chooseWhoPlaysFirst() callback:

    let winnerOfLastGame;

    counter.gameCounter === 0 || gameState.winner === "tie" ?
        winnerOfLastGame = "noWinner"
        :
        winnerOfLastGame = gameState.winner;

    // clearing state:

    if (counter.gameCounter > 0) { clearBoardBeforeNewGame() }  // needs to run BEFORE clearing state, because it requires data from old state!
    gameState = $.extend(true, {}, initialGameState);
    boardState = $.extend(true, {}, initialBoardState);

    // restoring saved values to state:

    gameState.playerSign = playerSign;
    gameState.difficulty = difficulty;

    // setting computer sign:
    gameState.playerSign === "cross" ? gameState.computerSign = "circle" : gameState.computerSign = "cross";

    // deciding who plays first:
    chooseWhoPlaysFirst(winnerOfLastGame);

    // starting first move, depending on turn decided in chooseWhoPlaysFirst():
    startGame()

};

const chooseWhoPlaysFirst = (winnerOfLastGame) => {

    // In case there is no winner, first players is chosen randomly.
    // Otherwise, first player is the winner of previous game:

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
          renderMessage();
          $resultsGameCounter.text(`Round: ${counter.gameCounter + 1}`);
          break;
      case "computer":
          gameState.signInCurrentTurn = gameState.computerSign;
          renderMessage();
          $resultsGameCounter.text(`Round: ${counter.gameCounter + 1}`);
          setTimeout(executeComputerMove, 1000);
  }

};


const startNewTurn = () => {
    // toggles turn and displays new turn status; in case of computer also runs move function

    switch (gameState.turn) {

        case "player":
            gameState.turn = "computer";
            gameState.signInCurrentTurn = gameState.computerSign;
            renderMessage();
            setTimeout(executeComputerMove, 1000); // timeOut to simulate that computer "thinks" about the move
            break;

        case "computer":
            gameState.turn = "player";
            gameState.signInCurrentTurn = gameState.playerSign;
            renderMessage();
            // opposing to first case, we don't run handle(...)Move from here
            // in case of player, it's an event listener callback!

    }

};

const executePlayerMove = field => {
    // runs as a callback from handleFieldClick() event listener

    const playerSign = gameState.playerSign;

    boardState[field] = playerSign; // checking field as marked by player
    renderSignInSelectedField(playerSign, field); // rendering image inside field

    // After player has made a move, game checks if he won.
    // If not, game checks for a tie.
    // If both checks fail, game continues.

    if (checkForVictory()) { stopGame() }
    else if (checkForTie()) { stopGame() }
    else { startNewTurn() }

};

const executeComputerMove = () => {
    // find field to mark, mark it, then victory or new turn

    console.log("computer turn starts");

    const computerSign = gameState.computerSign;

    // In hard difficulty, computer executes all moves. In easy, it always chooses random field:
    let field;
    gameState.difficulty === "hard" ? field = findFieldToMark() : field = getRandomField();

    boardState[field] = computerSign; // checking field as marked by computer
    renderSignInSelectedField(computerSign, field); // rendering image inside field

    console.log("computer turn ends");

    // After computer has made a move, game checks if he won.
    // If not, game checks for a tie.
    // If both checks fail, game continues.

    if (checkForVictory()) { stopGame() }
    else if (checkForTie()) { stopGame() }
    else { startNewTurn() }

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
            isVictory = true;
            gameState.winner = gameState.turn; // the "owner" of final turn is the winner
            gameState.winnerSign = gameState.signInCurrentTurn;
            gameState.victoryFields.push(...[comboFieldA, comboFieldB, comboFieldC]) // will be used by fillVictoryCombinationWithColor()

        } else { console.log("no victory") } // TODO: else cond. only for development

    });

    return isVictory

};

const checkForTie = () => {

    let isTie;
    const fieldValues = [];

    fieldIDs.forEach(fieldID => {
        boardState[fieldID] ? fieldValues.push("marked") : fieldValues.push("empty")
    });

    // if every field is marked, function returns true - a tie has occurred:
    isTie = fieldValues.every(field => field === "marked");
    console.log("Is a tie? " + isTie);
    if (isTie) {
        gameState.winner = "tie";
        gameState.winnerSign = "tie"
    }

    return isTie

};

const stopGame = () => {
    // runs if checkForVictory returns true or in case of a draw

    console.log("Game has ended");
    gameState.turn = "gameOver"; // this will prevent any further moves by the player
    updateCounter();

    fillVictoryCombinationWithColor();
    renderMessage();
    displayResults();
    setTimeout(displayEndPopup, 2000);

};

const updateCounter = () => {

    counter.gameCounter++;

    if (gameState.winner === "player") { counter.playerWins++ }
    else if (gameState.winner === "computer") { counter.computerWins++ }

    if (gameState.winnerSign === "cross") { counter.crossWins++ }
    else if (gameState.winnerSign === "circle") { counter.circleWins++ }

    // These conditionals can't be simplified to ternary because of possibility of a tie

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
    } else if ( markSecondField() ) {
        fieldToMark = markSecondField()
    }
    else {
        fieldToMark = getRandomField();
    }

    console.log("decided to mark: " + fieldToMark);
    return fieldToMark

};

const tryToWinOrToBlock = (actionType) => {

    const fieldsToMark = [];
    let sign;

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
            fieldsToMark.push(C)
        } else if (boardState[A] === sign && boardState[C] === sign) {
            fieldsToMark.push(B)
        } else if (boardState[B] === sign && boardState[C] === sign) {
            fieldsToMark.push(A)
        }

    }); // end of iteration

    console.log("fields to mark: " + fieldsToMark);

    /*
    There are rare cases when computer will get two fields for winning or blocking. If we didn't save fields
    to an array, we would only get the last field. Then, this field could be dismissed at the final check below,
    because it could be already marked. Then the first, potentially correct field would not be marked and computer
    would lose an opportunity for a correct move!

    To prevent this mistake we need to save fields to an array and then run a check for marked fields by filtering
    this array. Than we return first index. If there was no correct result, this will be undefined, and the function will
    evaluate to false, as it should. If there were two correct results (very rare, but possible), than it doesn't matter,
    if we choose first or second. The final case of one correct result is obvious.
     */

    const freeFieldsToMark = fieldsToMark.filter(field => { return !boardState[field] });

    console.log("free fields to mark: " + freeFieldsToMark);

    return freeFieldsToMark[0]


    // If all checks failed, function will return false, and findFieldToMarkByComputer() can execute next check based on this.
    // Otherwise, correct field is returned and passed to findFieldToMarkByComputer(), which returns this as its own result.
};

const markSecondField = () => {

    // This move is executed if there is a row or a column with one field marked by computer and two empty fields.
    // In that case computer will try to add 2nd field and continue building 3-field win combo.

    const fieldsToMark = [];
    const sign = gameState.computerSign;

    console.log("Trying markSecondField move");

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

    }); // end of iteration

    console.log("Empty fields: " + fieldsToMark);

    // Computer can choose random field from the results. It could always choose first index, but this is better for game variation:
    return fieldsToMark[Math.floor(Math.random() * fieldsToMark.length)];

};

const getRandomField = () => {

    console.log("Trying to get random field");

    const randomField = fieldIDs[Math.floor(Math.random() * fieldIDs.length)];

    console.log("random field: " + randomField);

    // if field was already marked, recursion is used - function calls itself back, until if finds an empty field:
    return boardState[randomField] ? getRandomField() : randomField

};


// ************** RENDERING ****************** //


const renderSignInSelectedField = (sign, field) => {

    // Cross is always a first child and circle is always a second child

    sign === "cross" ?
        $fields[field].children(":first").toggleClass("hidden")
        :
        $fields[field].children(":last").toggleClass("hidden")

};

const renderMessage = () => {

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
            $endPopupTitle.text(endPopupCrossWinTitle);
            break;
        case "circle":
            $endPopupTitle.text(endPopupCircleWinTitle);
            break;
        case "tie":
            $endPopupTitle.text(endPopupTieTitle)
    }

    switch (playerSign) {
        case "cross":
            $simpleRestartText.text(endPopupContinueAsCross);
            $switchRestartText.text(endPopupSwitchToCircle);
            $simpleRestartBtn.css('background-color', crossBlueColor);
            $switchRestartBtn.css('background-color', circleRedColor);
            break;
        case "circle":
            $simpleRestartText.text(endPopupContinueAsCircle);
            $switchRestartText.text(endPopupSwitchToCross);
            $simpleRestartBtn.css('background-color', circleRedColor);
            $switchRestartBtn.css('background-color', crossBlueColor);
    }

    difficulty === "easy" ? $toggleDifficultyText.text(endPopupSwitchToHard) : $toggleDifficultyText.text(endPopupSwitchToEasy);

    $endPopup.toggleClass("hidden")

};

const clearBoardBeforeNewGame = () => {
    // restoring hidden class to all signs before starting a new game

    const fields = Object.keys(boardState);
    fields.forEach(field => {
        // hide sign in field is already marked:
        if (boardState[field]) { hideSignInMarkedField(field) }
    });

    // also, if last game didn't end in a tie, winning bg colors have to be cleared:

    if (gameState.winner !== "tie") { removeFieldsBgColors() }

};

const hideSignInMarkedField = (field) => {

    // Cross is always a first child and circle is always a second child

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
    // check if field is empty and if it's player's turn - if so, execute player's move:
    if (!boardState[field] && gameState.turn === "player") { executePlayerMove(field) }
};

const toggleDifficulty = () => {

    switch (gameState.difficulty) {
        case "easy":
            gameState.difficulty = "hard";
            $toggleDifficultyText.empty();
            $toggleDifficultyText.text(endPopupSwitchedToHard);
            break;
        case "hard":
            gameState.difficulty = "easy";
            $toggleDifficultyText.empty();
            $toggleDifficultyText.text(endPopupSwitchedToEasy)
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

    // initial settings actions:

    $chooseCross.on("click", () => setInitialSign("cross"));
    $chooseCircle.on("click", () => setInitialSign("circle"));

    $chooseHard.on("click", () => setInitialDifficulty("hard"));
    $chooseEasy.on("click", () => setInitialDifficulty("easy"));

    // in-game actions:

    fieldIDs.forEach( fieldID => $fields[fieldID].on("click", () => handleFieldClick(fieldID)) );

    // after-game (restart) actions:

    $simpleRestartBtn.on("click", () => handleRestartBtn("playerDidNotSwitchSign"));
    $switchRestartBtn.on("click", () => handleRestartBtn("playerSwitchedSign"));
    $toggleDifficultyBtn.on("click", toggleDifficulty);

});

