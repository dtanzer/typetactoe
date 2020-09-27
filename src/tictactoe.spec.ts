import { Player, RowCoordinate, ColumnCoordinate, Columns, Rows, ColumnContent } from './tictactoe';

import {expect} from 'chai';
import 'mocha';

import {Board, playX, playO} from './tictactoe'

describe('typetactoe', () => {
	const isFreeField = 'T';
	const isGameOver = 'F';

	const players: Player[] = ['X', 'O'];
	players.forEach(player => [
		[1,1,1,0,0,0,0,0,0],
		[0,0,0,1,1,1,0,0,0],
		[0,0,0,0,0,0,1,1,1],
		[1,0,0,1,0,0,1,0,0],
		[0,1,0,0,1,0,0,1,0],
		[0,0,1,0,0,1,0,0,1],
		[1,0,0,0,1,0,0,0,1],
		[0,0,1,0,1,0,1,0,0]
	].forEach(winningCombo => {
		let col=0;

		const allCols : Columns[] = [];
		let allCells : ColumnContent[] = [];
		winningCombo.forEach((played, i) => {
			const cellPlayer = played===1? player : ' ';
			allCells.push(cellPlayer);
			col++;
			if(col>2) {
				allCols.push({ LEFT: allCells[0], CENTER: allCells[1], RIGHT: allCells[2]});
				allCells = [];
				col=0;
			}
		});
		const board = new Board('X', { TOP: allCols[0], MIDDLE: allCols[1], BOTTOM: allCols[2]});

		it('prints player '+player+' has won when winning combo is '+winningCombo, () => {
			const status = board.status();

			expect(status).to.equal('Player "'+player+'" has won.');
		});
	}));

	it('Prints next player as status when game is running', () => {
		const board = new Board('X');

		const status = board.status();

		expect(status).to.equal('Your move, player "X"...');
	});

	it('Prints game is draw when all cells are filled and nobody has won', () => {
		const board = new Board('X');

		const board1 = playX('TOP', 'LEFT')(board, isFreeField, isGameOver);
		const board2 = playO('MIDDLE', 'CENTER')(board1, isFreeField, isGameOver);
		const board3 = playX('MIDDLE', 'LEFT')(board2, isFreeField, isGameOver);
		const board4 = playO('BOTTOM', 'LEFT')(board3, isFreeField, isGameOver);
		const board5 = playX('TOP', 'RIGHT')(board4, isFreeField, isGameOver);
		const board6 = playO('TOP', 'CENTER')(board5, isFreeField, isGameOver);
		const board7 = playX('BOTTOM', 'CENTER')(board6, isFreeField, isGameOver);
		const board8 = playO('BOTTOM', 'RIGHT')(board7, isFreeField, isGameOver);
		const board9 = playX('MIDDLE', 'RIGHT')(board8, isFreeField, isGameOver);

		const status = board9.status();
		
		expect(status).to.equal('Game over, nobody has won.');
	});
});
