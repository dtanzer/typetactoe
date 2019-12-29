export type Player = 'X' | 'O';
export type ColumnContent = Player | ' ';

export type ColumnCoordinate = 'LEFT' | 'CENTER' | 'RIGHT';
export type RowCoordinate = 'TOP' | 'MIDDLE' | 'BOTTOM';

class Columns {
	LEFT: ColumnContent;
	CENTER: ColumnContent;
	RIGHT: ColumnContent;

	constructor(LEFT: ColumnContent, CENTER: ColumnContent, RIGHT: ColumnContent) {
		this.LEFT = LEFT;
		this.CENTER = CENTER;
		this.RIGHT = RIGHT;
	}

	render() {
		return ' ' + this.LEFT + ' | ' + this.CENTER + ' | ' + this.RIGHT;
	}
}

class Rows {
	TOP: Columns;
	MIDDLE: Columns;
	BOTTOM: Columns;

	constructor(TOP: Columns, MIDDLE: Columns, BOTTOM: Columns) {
		this.TOP = TOP;
		this.MIDDLE = MIDDLE;
		this.BOTTOM = BOTTOM;
	}

	render() {
		return this.TOP.render() + '\n---+---+---\n' + this.MIDDLE.render() + '\n---+---+---\n' + this.BOTTOM.render();
	}
}

const rowCoordinates: RowCoordinate[] = ['TOP', 'MIDDLE', 'BOTTOM'];
const colCoordinates: ColumnCoordinate[] = ['LEFT', 'CENTER', 'RIGHT'];

export class Board {
	rows: Rows;
	nextPlayer: any;

	constructor() {
		this.rows = new Rows(new Columns(' ', ' ', ' '), new Columns(' ', ' ', ' '), new Columns(' ', ' ', ' '))
		this.nextPlayer = 'X';
	}
	
	set(row: RowCoordinate, column: ColumnCoordinate, playerCharacter: Player) {
		if(this._hasWon('X')) throw 'Illegal move by player "'+this.nextPlayer+'": "X" has already won.';
		if(this._hasWon('O')) throw 'Illegal move by player "'+this.nextPlayer+'": "O" has already won.';

		if(this.rows[row][column] !== ' ') {
			throw 'Illegal move: '+row+'-'+column+' is already occupied by "'+this.rows[row][column]+'"';
		}
		const otherPlayer = { X: 'O', O: 'X' }[playerCharacter];
		if(playerCharacter !== this.nextPlayer) {
			throw 'Illegal move by '+playerCharacter+': It is '+otherPlayer+'\'s move';
		}

		this.rows[row][column] = playerCharacter;
		this.nextPlayer = otherPlayer;
	}

	status() {
		const isFull = rowCoordinates.reduce((prev, row) => 
			prev && colCoordinates.reduce((prev, col)=> prev && this.rows[row][col]!==' ', true), true);

		if(isFull) return 'Game over, nobody has won.';
		if(this._hasWon('X')) return 'Player "X" has won.';
		if(this._hasWon('O')) return 'Player "O" has won.';
		return 'Your move, player "'+this.nextPlayer+'"...';
	}

	render() {
		return this.rows.render();
	}

	_hasWon(player: Player) {
		type Coord = [RowCoordinate, ColumnCoordinate];
		const winningCombinations: [Coord, Coord, Coord][] = [
			[['TOP', 'LEFT'], ['TOP', 'CENTER'], ['TOP', 'RIGHT']],
			[['MIDDLE', 'LEFT'], ['MIDDLE', 'CENTER'], ['MIDDLE', 'RIGHT']],
			[['BOTTOM', 'LEFT'], ['BOTTOM', 'CENTER'], ['BOTTOM', 'RIGHT']],
			
			[['TOP', 'LEFT'], ['MIDDLE', 'LEFT'], ['BOTTOM', 'LEFT']],
			[['TOP', 'CENTER'], ['MIDDLE', 'CENTER'], ['BOTTOM', 'CENTER']],
			[['TOP', 'RIGHT'], ['MIDDLE', 'RIGHT'], ['BOTTOM', 'RIGHT']],

			[['TOP', 'LEFT'], ['MIDDLE', 'CENTER'], ['BOTTOM', 'RIGHT']],
			[['TOP', 'RIGHT'], ['MIDDLE', 'CENTER'], ['BOTTOM', 'LEFT']]
		];

		const hasWonCombination = (c: [Coord, Coord, Coord]) => {
			return this.rows[c[0][0]][c[0][1]] === player &&
				this.rows[c[1][0]][c[1][1]] === player &&
				this.rows[c[2][0]][c[2][1]] === player;
		}
		return winningCombinations.reduce((hasWon, c) => hasWon || hasWonCombination(c), false)
	}
}

