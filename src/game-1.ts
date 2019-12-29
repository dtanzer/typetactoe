import { Board } from './tictactoe';

const board = new Board();

board.set('TOP', 'LEFT', 'X');
console.log(board.render());
console.log(board.status());

board.set('MIDDLE', 'LEFT', 'O');
console.log(board.render());
console.log(board.status());

board.set('TOP', 'CENTER', 'X');
console.log(board.render());
console.log(board.status());

board.set('MIDDLE', 'CENTER', 'O');
console.log(board.render());
console.log(board.status());

board.set('TOP', 'RIGHT', 'X');
console.log(board.render());
console.log(board.status());

board.set('MIDDLE', 'RIGHT', 'O');
console.log(board.render());
console.log(board.status());
