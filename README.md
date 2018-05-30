## [Tic tac toe: Star Wars Edition](https://jareksopinski.github.io/tic-tac-toe-star-wars-edition)

A classic game of tic tac toe with Star Wars added to the mix. Features following functionalities:

1. Play against computer as a cross (Jedi: crossed ligthsabers) or as a circle (Sith: Death Star). No player vs player yet;
2. Toggle between "wise" computer (reacts to player's moves and tries to build winning combos) and "dumb" computer (only random moves);
3. Keep track of wins, loses and ties;
4. Change settings (cross/circle, wise/dumb) after each game.

---

### Algorithm

In every turn computer tries to execute following moves:

1. If there are two fields marked by a computer in a three-field combination, try to win by marking third field.
2. Otherwise, if there are two fields marked by a player in a three-field combination, mark third field to prevent player's victory in a next turn.
3. Otherwise, if there is any combination with two empty fields and one field marked by a computer, mark a second field in that combination.
4. Otherwise, mark a random empty field.

In a "dumb" mode computer always goes straight to the fourth step.

This algorithm does not make computer a "perfect" player and it's still possible to beat it, although it's quite hard and requires a little luck.

---

### About

This project was created during FreeCodeCamp front-end course. It's a [task from Advanced Front End Development Projects section](https://www.freecodecamp.org/challenges/build-a-tic-tac-toe-game).

Tools: JavaScript, jQuery, SCSS, CSS, CSS Reset, HTML.

Stylesheet is written according to BEM convention.

---

#### License

&copy; 2018 Jarosław Sopiński

This repository is licensed under the MIT license.
