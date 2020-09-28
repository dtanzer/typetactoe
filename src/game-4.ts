import { Board, playX, playO } from './tictactoe';

const board = new Board('X');
const isFreeField = 'T';
const isGameOver = 'F';

const board1 = playX('TOP', 'LEFT')(board, isFreeField, isGameOver);
console.log(board1.render());
console.log(board1.status());

const board1a = playO('TOP', 'LEFT')(board, isFreeField, isGameOver);
console.log(board1.render());
console.log(board1.status());

const board2 = playX('MIDDLE', 'LEFT')(board1, isFreeField, isGameOver);
console.log(board2.render());
console.log(board2.status());
