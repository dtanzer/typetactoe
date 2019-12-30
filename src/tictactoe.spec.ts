import { Player, RowCoordinate, ColumnCoordinate, Columns, Rows, ColumnContent } from './tictactoe';

import {expect} from 'chai';
import 'mocha';

import {Board, playX, playO} from './tictactoe'

describe('typetactoe', () => {
	const rowCoordinates: RowCoordinate[] = ['TOP', 'MIDDLE', 'BOTTOM'];
	const colCoordinates: ColumnCoordinate[] = ['LEFT', 'CENTER', 'RIGHT'];

	rowCoordinates.forEach((row: RowCoordinate) => colCoordinates.forEach((column: ColumnCoordinate) => {
		it('sets the the value at ['+row+'-'+column+'] to X', () => {
			const board = new Board();

			const newBoard = playX(row, column)(board);

			expect(newBoard.rows[row][column]).to.equal('X');
		});
	}));

	it('throws an exception when the field is already occupied', () => {
		const board = new Board();
		const newBoard = playX('TOP', 'LEFT')(board);

		expect(() => playO('TOP', 'LEFT')(newBoard)).to.throw('Illegal move: TOP-LEFT is already occupied by "X"');
	});

	[['O'], ['X', 'X'], ['X', 'O', 'O'], ['X', 'O', 'X', 'O', 'X', 'O', 'O']].forEach(seq => 
		it('throws and exception when it is not player\'s turn (turn '+seq.length+', player'+seq[seq.length-1]+')', () => {
			let board = new Board();
			var turn = 0;
			for(var r = 0; r<rowCoordinates.length; r++) {
				for(var c=0; c<colCoordinates.length; c++) {
					if(turn < seq.length-1) {
						switch(seq[turn]) {
							case 'X': board = playX(rowCoordinates[r], colCoordinates[c])(board); break;
							case 'O': board = playO(rowCoordinates[r], colCoordinates[c])(board); break;
						}
						turn++;
					}
				}
			}

			const player: Player = seq[seq.length-1]==='X'? 'X' : 'O';
			const otherPlayer = player==='X'? 'O' : 'X';
			const playNext = () => {
				switch(player) {
					case 'X': board = playX('BOTTOM', 'RIGHT')(board); break;
					case 'O': board = playO('BOTTOM', 'RIGHT')(board); break;
				}
			}
			expect(playNext).to.throw('Illegal move by '+player+': It is '+otherPlayer+'\'s move');
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
		let col=0;

		const allCols : Columns[] = [];
		let allCells : ColumnContent[] = [];
		winningCombo.forEach((played, i) => {
			const cellPlayer = played===1? player : ' ';
			allCells.push(cellPlayer);
			col++;
			if(col>2) {
				allCols.push(new Columns(allCells[0], allCells[1], allCells[2]));
				allCells = [];
				col=0;
			}
		});
		const board = new Board(new Rows(allCols[0], allCols[1], allCols[2]));

		it('prints player '+player+' has won when winning combo is '+winningCombo, () => {
			const status = board.status();

			expect(status).to.equal('Player "'+player+'" has won.');
		});

		it('does now allow another move when a player has won', () => {
			const col = winningCombo[3]===1? 'CENTER': 'LEFT';
			expect(() => playX('MIDDLE', col)(board)).to.throw('Illegal move by player "X": "'+player+'" has already won.');
		});
	}));

	it('Prints next player as status when game is running', () => {
		const board = new Board();

		const status = board.status();

		expect(status).to.equal('Your move, player "X"...');
	});

	it('Prints game is draw when all cells are filled and nobody has won', () => {
		let board = new Board();

		board = playX('TOP', 'LEFT')(board);
		board = playO('MIDDLE', 'CENTER')(board);
		board = playX('MIDDLE', 'LEFT')(board);
		board = playO('BOTTOM', 'LEFT')(board);
		board = playX('TOP', 'RIGHT')(board);
		board = playO('TOP', 'CENTER')(board);
		board = playX('BOTTOM', 'CENTER')(board);
		board = playO('BOTTOM', 'RIGHT')(board);
		board = playX('MIDDLE', 'RIGHT')(board);

		const status = board.status();
		
		expect(status).to.equal('Game over, nobody has won.');
	});
});
