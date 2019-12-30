import { Board } from './tictactoe';

const board = new Board();

board.set('TOP', 'LEFT', 'X');
console.log(board.render());
console.log(board.status());

board.set('MIDDLE', 'LEFT', 'X');
console.log(board.render());
console.log(board.status());
