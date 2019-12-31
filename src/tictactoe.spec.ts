import { Player, RowCoordinate, ColumnCoordinate, Columns, Rows, ColumnContent } from './tictactoe';

import {expect} from 'chai';
import 'mocha';

import {Board, playX, playO} from './tictactoe'

describe('typetactoe', () => {
	const isFreeField = 'T';

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
		const board = new Board({ TOP: allCols[0], MIDDLE: allCols[1], BOTTOM: allCols[2]});

		it('prints player '+player+' has won when winning combo is '+winningCombo, () => {
			const status = board.status();

			expect(status).to.equal('Player "'+player+'" has won.');
		});

		it('does now allow another move when a player has won', () => {
			const col = winningCombo[3]===1? 'CENTER': 'LEFT';
			expect(() => playX('MIDDLE', col)(board, isFreeField)).to.throw('Illegal move by player "X": "'+player+'" has already won.');
		});
	}));

	it('Prints next player as status when game is running', () => {
		const board = new Board();

		const status = board.status();

		expect(status).to.equal('Your move, player "X"...');
	});

	it('Prints game is draw when all cells are filled and nobody has won', () => {
		const board = new Board();

		const board1 = playX('TOP', 'LEFT')(board, isFreeField);
		const board2 = playO('MIDDLE', 'CENTER')(board1, isFreeField);
		const board3 = playX('MIDDLE', 'LEFT')(board2, isFreeField);
		const board4 = playO('BOTTOM', 'LEFT')(board3, isFreeField);
		const board5 = playX('TOP', 'RIGHT')(board4, isFreeField);
		const board6 = playO('TOP', 'CENTER')(board5, isFreeField);
		const board7 = playX('BOTTOM', 'CENTER')(board6, isFreeField);
		const board8 = playO('BOTTOM', 'RIGHT')(board7, isFreeField);
		const board9 = playX('MIDDLE', 'RIGHT')(board8, isFreeField);

		const status = board9.status();
		
		expect(status).to.equal('Game over, nobody has won.');
	});
});
