import {expect} from 'chai';
import {Board} from './tictactoe'

describe('typetactoe', () => {
	['TOP', 'MIDDLE', 'BOTTOM'].forEach(row => ['LEFT', 'CENTER', 'RIGHT'].forEach(column => {
		it('sets the the value at ['+row+'-'+column+'] to X', () => {
			const board = new Board();

			board.set(row, column, 'X');

			expect(board.rows[row][column]).to.equal('X');
		});
	}));

	[' ', 'A', 'Y', 'Z', 'N', 'Q'].forEach(value => it('throws an exception when value to set is neither X nor O, but "'+value+'"', () => {
		const board = new Board();

		expect(() => board.set('TOP', 'LEFT', value)).to.throw('Illegal player character: "'+value+'"');
	}));

	it('does not throw an exception when player character is valid ("O")', () => {
		const board = new Board();

		board.set('TOP', 'LEFT', 'X');
		board.set('TOP', 'CENTER', 'O');
	});

	it('throws an exception when the field is already occupied', () => {
		const board = new Board();
		board.set('TOP', 'LEFT', 'X');

		expect(() => board.set('TOP', 'LEFT', 'O')).to.throw('Illegal move: TOP-LEFT is already occupied by "X"');
	});

	[['O'], ['X', 'X'], ['X', 'O', 'O'], ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'O']].forEach(seq => 
		it('throws and exception when it is not player\'s turn (turn '+seq.length+', player'+seq[seq.length-1]+')', () => {
			const rows = ['TOP', 'MIDDLE', 'BOTTOM'];
			const cols = ['LEFT', 'CENTER', 'RIGHT'];

			const board = new Board();
			var turn = 0;
			for(var r = 0; r<rows.length; r++) {
				for(var c=0; c<cols.length; c++) {
					if(turn < seq.length-1) {
						board.set(rows[r], cols[c], seq[turn]);
						turn++;
					}
				}
			}

			const player = seq[seq.length-1];
			const otherPlayer = { X: 'O', O: 'X' }[player];
			expect(() => board.set('BOTTOM', 'RIGHT', seq[turn])).to.throw('Illegal move by '+player+': It is '+otherPlayer+'\'s move');
	}));
});
