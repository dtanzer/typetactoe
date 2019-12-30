import { Board, playX, playO } from './tictactoe';

const board = new Board();

const board1 = playX('TOP', 'LEFT')(board);
console.log(board1.render());
console.log(board1.status());

const board2 = playO('MIDDLE', 'CENTER')(board1);
console.log(board2.render());
console.log(board2.status());

const board3 = playX('TOP', 'RIGHT')(board2);
console.log(board3.render());
console.log(board3.status());

const board4 = playO('TOP', 'CENTER')(board3);
console.log(board4.render());
console.log(board4.status());

const board5 = playX('BOTTOM', 'CENTER')(board4);
console.log(board5.render());
console.log(board5.status());

const board6 = playO('MIDDLE', 'LEFT')(board5);
console.log(board6.render());
console.log(board6.status());

const board7 = playX('MIDDLE', 'RIGHT')(board6);
console.log(board7.render());
console.log(board7.status());

const board8 = playO('BOTTOM', 'RIGHT')(board7);
console.log(board8.render());
console.log(board8.status());

const board9 = playX('BOTTOM', 'LEFT')(board8);
console.log(board9.render());
console.log(board9.status());
