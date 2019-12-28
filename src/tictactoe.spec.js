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

	[['O'], ['X', 'X'], ['X', 'O', 'O'], ['X', 'O', 'X', 'O', 'X', 'O', 'O']].forEach(seq => 
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

	[['X', 'LEFT'], ['TOP', 'X'], ['X', 'Y']].forEach(pair => it('throws an exception for illegal coordinates '+pair[0]+'-'+pair[1], ()=>{
		const board = new Board();

		expect(() => board.set(pair[0], pair[1], 'X')).to.throw('Illegal coordinates '+pair[0]+'-'+pair[1]);
	}));

	['X', 'O'].forEach(player => [
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
			board.rows[['TOP', 'MIDDLE', 'BOTTOM'][row]][['LEFT', 'CENTER', 'RIGHT'][col]]=cellPlayer;
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
