type PlayerX = 'X';
type PlayerO = 'O';
export type Player = PlayerX | PlayerO;
export type ColumnContent = Player | ' ';

export type ColumnCoordinate = 'LEFT' | 'CENTER' | 'RIGHT';
export type RowCoordinate = 'TOP' | 'MIDDLE' | 'BOTTOM';

export class Columns {
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

	with(column: ColumnCoordinate, playerCharacter: Player): Columns {
		switch(column) {
			case 'LEFT':
				return new Columns(playerCharacter, this.CENTER, this.RIGHT);
			case 'CENTER':
				return new Columns(this.LEFT, playerCharacter, this.RIGHT);
			case 'RIGHT':
				return new Columns(this.LEFT, this.CENTER, playerCharacter);
		}
	}
}

export class Rows {
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

	with(row: RowCoordinate, column: ColumnCoordinate, playerCharacter: Player): Rows {
		switch(row) {
			case 'TOP':
				return new Rows(this.TOP.with(column, playerCharacter), this.MIDDLE, this.BOTTOM);
			case 'MIDDLE':
				return new Rows(this.TOP, this.MIDDLE.with(column, playerCharacter), this.BOTTOM);
			case 'BOTTOM':
				return new Rows(this.TOP, this.MIDDLE, this.BOTTOM.with(column, playerCharacter));
		}
	}
}

const rowCoordinates: RowCoordinate[] = ['TOP', 'MIDDLE', 'BOTTOM'];
const colCoordinates: ColumnCoordinate[] = ['LEFT', 'CENTER', 'RIGHT'];

interface EmptyGame {
	isEmpty: 'T'
	R: never
	C: never
	P: never
	PrevGame: never
};

interface MoveSequence<R extends RowCoordinate, C extends ColumnCoordinate, P extends Player, Game extends OngoingGame> {
	isEmpty: 'F'
	R: R
	C: C
	P: P
	PrevGame: Game
};

type OngoingGame = EmptyGame | MoveSequence<any, any, any, any>;

export const playX = <R extends RowCoordinate, C extends ColumnCoordinate>(row: R, col: C) => 
	<Game extends EmptyGame | MoveSequence<any, any, PlayerO, any>>(board: Board<Game>): Board<MoveSequence<R, C, PlayerX, Game>> => 
	board._setX(row, col);
export const playO = <R extends RowCoordinate, C extends ColumnCoordinate>(row: R, col: C) => 
	<Game extends MoveSequence<any, any, PlayerX, any>>(board: Board<Game>): Board<MoveSequence<R, C, PlayerO, Game>> => 
	board._setO(row, col);

export class Board<Game extends OngoingGame> {
	_compiler_should_keep_and_check_Game?: Game;
	rows: Rows;
	nextPlayer: Player;

	constructor(rows: Rows = new Rows(new Columns(' ', ' ', ' '), new Columns(' ', ' ', ' '), new Columns(' ', ' ', ' ')), nextPlayer: Player = 'X') {
		this.rows = rows;
		this.nextPlayer = nextPlayer;
	}
	
	_setX<R extends RowCoordinate, C extends ColumnCoordinate>(row: R, column: C): Board<MoveSequence<R, C, PlayerX, Game>> {
		if(this._hasWon('X')) throw 'Illegal move by player "'+this.nextPlayer+'": "X" has already won.';
		if(this._hasWon('O')) throw 'Illegal move by player "'+this.nextPlayer+'": "O" has already won.';

		if(this.rows[row][column] !== ' ') {
			throw 'Illegal move: '+row+'-'+column+' is already occupied by "'+this.rows[row][column]+'"';
		}
		const playerCharacter = 'X';

		return new Board(this.rows.with(row, column, playerCharacter), 'O');
	}

	_setO<R extends RowCoordinate, C extends ColumnCoordinate>(row: R, column: C): Board<MoveSequence<R, C, PlayerO, Game>> {
		if(this._hasWon('X')) throw 'Illegal move by player "'+this.nextPlayer+'": "X" has already won.';
		if(this._hasWon('O')) throw 'Illegal move by player "'+this.nextPlayer+'": "O" has already won.';

		if(this.rows[row][column] !== ' ') {
			throw 'Illegal move: '+row+'-'+column+' is already occupied by "'+this.rows[row][column]+'"';
		}
		const playerCharacter = 'O';

		return new Board(this.rows.with(row, column, playerCharacter), 'X');
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

