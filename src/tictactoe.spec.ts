import { Player, RowCoordinate, ColumnCoordinate } from './tictactoe';

import {expect} from 'chai';
import 'mocha';

import {Board} from './tictactoe'

describe('typetactoe', () => {
	const rowCoordinates: RowCoordinate[] = ['TOP', 'MIDDLE', 'BOTTOM'];
	const colCoordinates: ColumnCoordinate[] = ['LEFT', 'CENTER', 'RIGHT'];

	rowCoordinates.forEach((row: RowCoordinate) => colCoordinates.forEach((column: ColumnCoordinate) => {
		it('sets the the value at ['+row+'-'+column+'] to X', () => {
			const board = new Board();

			board.set(row, column, 'X');

			expect(board.rows[row][column]).to.equal('X');
		});
	}));

	it('throws an exception when the field is already occupied', () => {
		const board = new Board();
		board.set('TOP', 'LEFT', 'X');

		expect(() => board.set('TOP', 'LEFT', 'O')).to.throw('Illegal move: TOP-LEFT is already occupied by "X"');
	});

	[['O'], ['X', 'X'], ['X', 'O', 'O'], ['X', 'O', 'X', 'O', 'X', 'O', 'O']].forEach(seq => 
		it('throws and exception when it is not player\'s turn (turn '+seq.length+', player'+seq[seq.length-1]+')', () => {
			const board = new Board();
			var turn = 0;
			for(var r = 0; r<rowCoordinates.length; r++) {
				for(var c=0; c<colCoordinates.length; c++) {
					if(turn < seq.length-1) {
						board.set(rowCoordinates[r], colCoordinates[c], seq[turn]==='X'? 'X' : 'O');
						turn++;
					}
				}
			}

			const player: Player = seq[seq.length-1]==='X'? 'X' : 'O';
			const otherPlayer = player==='X'? 'O' : 'X';
			expect(() => board.set('BOTTOM', 'RIGHT', player)).to.throw('Illegal move by '+player+': It is '+otherPlayer+'\'s move');
	}));

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
		const board = new Board();
		let row=0, col=0;

		winningCombo.forEach((played, i) => {
			const cellPlayer = played===1? player : ' ';
			board.rows[rowCoordinates[row]][colCoordinates[col]]=cellPlayer;
			col++;
			if(col>2) {
				col=0; row++;
			}
		});

		it('prints player '+player+' has won when winning combo is '+winningCombo, () => {
			const status = board.status();

			expect(status).to.equal('Player "'+player+'" has won.');
		});

		it('does now allow another move when a player has won', () => {
			const col = winningCombo[3]===1? 'CENTER': 'LEFT';
			expect(() => board.set('MIDDLE', col, 'X')).to.throw('Illegal move by player "X": "'+player+'" has already won.');
		});
	}));

	it('Prints next player as status when game is running', () => {
		const board = new Board();

		const status = board.status();

		expect(status).to.equal('Your move, player "X"...');
	});

	it('Prints game is draw when all cells are filled and nobody has won', () => {
		const board = new Board();

		board.set('TOP', 'LEFT', 'X');
		board.set('MIDDLE', 'CENTER', 'O');
		board.set('MIDDLE', 'LEFT', 'X');
		board.set('BOTTOM', 'LEFT', 'O');
		board.set('TOP', 'RIGHT', 'X');
		board.set('TOP', 'CENTER', 'O');
		board.set('BOTTOM', 'CENTER', 'X');
		board.set('BOTTOM', 'RIGHT', 'O');
		board.set('MIDDLE', 'RIGHT', 'X');

		const status = board.status();
		
		expect(status).to.equal('Game over, nobody has won.');
	});
});
