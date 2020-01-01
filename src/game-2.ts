import { Board, playX, playO } from './tictactoe';

const board = new Board();
const isFreeField = 'T';
const isGameOver = 'F';

const board1 = playX('TOP', 'LEFT')(board, isFreeField, isGameOver);
console.log(board1.render());
console.log(board1.status());

const board2 = playO('MIDDLE', 'LEFT')(board1, isFreeField, isGameOver);
console.log(board2.render());
console.log(board2.status());

const board3 = playX('TOP', 'CENTER')(board2, isFreeField, isGameOver);
console.log(board3.render());
console.log(board3.status());

const board4 = playO('MIDDLE', 'CENTER')(board3, isFreeField, isGameOver);
console.log(board4.render());
console.log(board4.status());

const board5 = playX('TOP', 'RIGHT')(board4, isFreeField, isGameOver);
console.log(board5.render());
console.log(board5.status());

const board6 = playO('MIDDLE', 'RIGHT')(board5, isFreeField, isGameOver);
console.log(board6.render());
console.log(board6.status());
