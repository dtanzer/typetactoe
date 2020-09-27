type PlayerX = 'X';
type PlayerO = 'O';
export type Player = PlayerX | PlayerO;
export type OtherPlayer<P extends Player> = P extends PlayerX? PlayerO : PlayerX;
export type ColumnContent = Player | ' ';

export type ColumnCoordinate = 'LEFT' | 'CENTER' | 'RIGHT';
export type RowCoordinate = 'TOP' | 'MIDDLE' | 'BOTTOM';

export type Columns = { readonly [key in ColumnCoordinate]: ColumnContent };
export type EmptyColumns = { readonly [key in ColumnCoordinate]: ' ' };
export type SetColumn<CD extends Columns, C extends ColumnCoordinate, P extends Player> = {
	readonly [key in keyof Columns]: key extends C? P : CD[key]
};

const withLeft = <CD extends Columns, P extends Player>(cols: CD, playerCharacter: P): SetColumn<CD, 'LEFT', P> => {
	return { ...cols, LEFT: playerCharacter };
}
const withCenter = <CD extends Columns, P extends Player>(cols: CD, playerCharacter: P): SetColumn<CD, 'CENTER', P> => {
	return { ...cols, CENTER: playerCharacter };
}
const withRight = <CD extends Columns, P extends Player>(cols: CD, playerCharacter: P): SetColumn<CD, 'RIGHT', P> => {
	return { ...cols, RIGHT: playerCharacter };
}

export type WithColumnFunctions = {
	readonly [key in ColumnCoordinate]: 
		<CD extends Columns, P extends Player>(cols: CD, playerCharacter: P) => SetColumn<CD, key, P>
}
export const withColumnFunctions : WithColumnFunctions = {
	LEFT: withLeft,
	CENTER: withCenter,
	RIGHT: withRight,
};

export type Rows = { readonly [key in RowCoordinate]: Columns };
export type SetRow<RD extends Rows, R extends RowCoordinate, C extends Columns> = {
	readonly [key in keyof Rows]: key extends R? C : RD[key]
};

const withTop = <RD extends Rows, P extends Player, CD extends Columns>
		(rows: RD, withCol: (c: RD['TOP'], p: P)=>CD, playerCharacter: P): SetRow<RD, 'TOP', CD> => {
	return { ...rows, TOP: withCol(rows.TOP, playerCharacter) };
}
const withMiddle = <RD extends Rows, P extends Player, CD extends Columns>
		(rows: RD, withCol: (c: RD['MIDDLE'], p: P)=>CD, playerCharacter: P): SetRow<RD, 'MIDDLE', CD> => {
	return { ...rows, MIDDLE: withCol(rows.MIDDLE, playerCharacter) };
}
const withBottom = <RD extends Rows, P extends Player, CD extends Columns>
		(rows: RD, withCol: (c: RD['BOTTOM'], p: P)=>CD, playerCharacter: P): SetRow<RD, 'BOTTOM', CD> => {
	return { ...rows, BOTTOM: withCol(rows.BOTTOM, playerCharacter) };
}

export type WithRowFunctions = {
	readonly [key in RowCoordinate]: 
		<RD extends Rows, C extends ColumnCoordinate, P extends Player, CD extends Columns>
			(rows: RD, withCol: (c: RD['TOP'], p: P)=>CD, playerCharacter: P) => SetRow<RD, key, CD>
};
export const withRowFunctions : WithRowFunctions = {
	TOP: withTop,
	MIDDLE: withMiddle,
	BOTTOM: withBottom,
};

const rowCoordinates: RowCoordinate[] = ['TOP', 'MIDDLE', 'BOTTOM'];
const colCoordinates: ColumnCoordinate[] = ['LEFT', 'CENTER', 'RIGHT'];

interface EmptyGame {
	isEmpty: 'T'
	R: never
	C: never
	P: never
	PrevMove: never
};

interface MoveSequence<R extends RowCoordinate, C extends ColumnCoordinate, P extends Player, Game extends OngoingGame<any>> {
	isEmpty: 'F'
	R: R
	C: C
	P: P
	PrevMove: Game
};

type OngoingGame<CurrentPlayer extends Player> = EmptyGame | MoveSequence<any, any, CurrentPlayer, any>;

type Bool = 'T' | 'F'

type If<B extends Bool, Then, Else> = {
	T: Then
	F: Else
}[B]

type Not<B extends Bool> = If<B, 'F', 'T'>

type And<B1 extends Bool, B2 extends Bool> = If<B1, B2, 'F'>
type Or<B1 extends Bool, B2 extends Bool> = If<Not<B1>, B2, 'T'>
type Eq<A extends string, B extends string> = ({ [K in A]: 'T' } & {
	[key: string]: 'F'
})[B]

type IsPlayed<R extends RowCoordinate, C extends ColumnCoordinate, G extends OngoingGame<any>> = {
	T: 'F'
	F: If<
		And<Eq<G['R'], R>, Eq<G['C'], C>>, 
		'T', 
		IsPlayed<R, C, G['PrevMove']>
	>
}[G['isEmpty']]

type IsPlayer<G extends OngoingGame<any>, R extends RowCoordinate, C extends ColumnCoordinate, P extends Player> = {
	T: 'F'
	F: If<
		And<Eq<G['R'], R>, Eq<G['C'], C>>, 
		Eq<G['P'], P>, 
		IsPlayer<G['PrevMove'], R, C, P>
	>
}[G['isEmpty']]

type HasWon<G extends OngoingGame<any>, P extends Player> = {
	T: 'F'
	F: Or<
		And<IsPlayer<G, 'TOP', 'LEFT', P>, And<IsPlayer<G, 'TOP', 'CENTER', P>, IsPlayer<G, 'TOP', 'RIGHT', P>>>,
		Or<And<IsPlayer<G, 'MIDDLE', 'LEFT', P>, And<IsPlayer<G, 'MIDDLE', 'CENTER', P>, IsPlayer<G, 'MIDDLE', 'RIGHT', P>>>,
		Or<And<IsPlayer<G, 'BOTTOM', 'LEFT', P>, And<IsPlayer<G, 'BOTTOM', 'CENTER', P>, IsPlayer<G, 'BOTTOM', 'RIGHT', P>>>,
		
		Or<And<IsPlayer<G, 'TOP', 'LEFT', P>, And<IsPlayer<G, 'MIDDLE', 'LEFT', P>, IsPlayer<G, 'BOTTOM', 'LEFT', P>>>,
		Or<And<IsPlayer<G, 'TOP', 'CENTER', P>, And<IsPlayer<G, 'MIDDLE', 'CENTER', P>, IsPlayer<G, 'BOTTOM', 'CENTER', P>>>,
		Or<And<IsPlayer<G, 'TOP', 'RIGHT', P>, And<IsPlayer<G, 'MIDDLE', 'RIGHT', P>, IsPlayer<G, 'BOTTOM', 'RIGHT', P>>>,
		
		Or<And<IsPlayer<G, 'TOP', 'LEFT', P>, And<IsPlayer<G, 'MIDDLE', 'CENTER', P>, IsPlayer<G, 'BOTTOM', 'RIGHT', P>>>,
		And<IsPlayer<G, 'TOP', 'RIGHT', P>, And<IsPlayer<G, 'MIDDLE', 'CENTER', P>, IsPlayer<G, 'BOTTOM', 'LEFT', P>>>>>>>>>
	>
}[G['isEmpty']]

export const playX = <R extends RowCoordinate, C extends ColumnCoordinate>(row: R, col: C) => 
	<
		Game extends EmptyGame | MoveSequence<any, any, PlayerO, any>,
		IsFreeField extends Not<IsPlayed<R, C, Game>>,
		IsGameOver extends Or<HasWon<Game, 'X'>, HasWon<Game, 'O'>>
	>
	(board: Board<PlayerX, Game>, isFreeField: IsFreeField & 'T', isGameOver: IsGameOver & 'F'): Board<PlayerO, MoveSequence<R, C, PlayerX, Game>> => 
	board._setX(row, col);
export const playO = <R extends RowCoordinate, C extends ColumnCoordinate>(row: R, col: C) => 
	<
		Game extends MoveSequence<any, any, PlayerX, any>,
		IsFreeField extends Not<IsPlayed<R, C, Game>>,
		IsGameOver extends Or<HasWon<Game, 'X'>, HasWon<Game, 'O'>>
	>(board: Board<PlayerO, Game>, isFreeField: IsFreeField & 'T', isGameOver: IsGameOver & 'F'): Board<PlayerX, MoveSequence<R, C, PlayerO, Game>> => 
	board._setO(row, col);

export const emptyColumns: Columns = { LEFT: ' ', CENTER: ' ', RIGHT: ' ' };

export class Board<NextPlayer extends Player, Game extends OngoingGame<OtherPlayer<NextPlayer>>> {
	_compiler_should_keep_and_check_Game?: Game;
	rows: Rows;
	nextPlayer: NextPlayer;

	constructor(nextPlayer: NextPlayer, rows: Rows = { TOP: emptyColumns, MIDDLE: emptyColumns, BOTTOM: emptyColumns }) {
		this.rows = rows;
		this.nextPlayer = nextPlayer;
	}

	_setX<R extends RowCoordinate, C extends ColumnCoordinate>(row: R, column: C): Board<PlayerO, MoveSequence<R, C, PlayerX, Game>> {
		const playerCharacter = 'X';

		type WithAnyCol = <CD extends Columns, P extends Player, C extends ColumnCoordinate>(cols: CD, playerCharacter: P) => SetColumn<CD, any, P>;
		const withCol: WithAnyCol = withColumnFunctions[column];
		type WithAnyRow = <RD extends Rows, P extends Player, CD extends Columns> (rows: RD, withCol: (c: Columns, p: P)=>CD, playerCharacter: P) => SetRow<RD, any, CD>;
		const withRow: WithAnyRow = withRowFunctions[row];
		
		return new Board('O', withRow(this.rows, withCol, playerCharacter));
	}

	_setO<R extends RowCoordinate, C extends ColumnCoordinate>(row: R, column: C): Board<PlayerX, MoveSequence<R, C, PlayerO, Game>> {
		const playerCharacter = 'O';

		type WithAnyCol = <CD extends Columns, P extends Player, C extends ColumnCoordinate>(cols: CD, playerCharacter: P) => SetColumn<CD, any, P>;
		const withCol: WithAnyCol = withColumnFunctions[column];
		type WithAnyRow = <RD extends Rows, P extends Player, CD extends Columns> (rows: RD, withCol: (c: Columns, p: P)=>CD, playerCharacter: P) => SetRow<RD, any, CD>;
		const withRow: WithAnyRow = withRowFunctions[row];
		
		return new Board('X', withRow(this.rows, withCol, playerCharacter));
	}

	status() {
		const isFull = rowCoordinates.reduce((prev, row) => 
			prev && colCoordinates.reduce((prev, col)=> prev && this.rows[row][col]!==' ', true), true);

		if(isFull) return 'Game over, nobody has won.';
		if(this._hasWon('X')) return 'Player "X" has won.';
		if(this._hasWon('O')) return 'Player "O" has won.';
		return 'Your move, player "'+this.nextPlayer+'"...';
	}

	status2() {
		return 'Your move, player X...'
	}

	render() {
		return this._renderCols(this.rows.TOP) + '\n---+---+---\n' + this._renderCols(this.rows.MIDDLE) + '\n---+---+---\n' + this._renderCols(this.rows.BOTTOM);
	}

	_renderCols(cols: Columns): string {
		return ' ' + cols.LEFT + ' | ' + cols.CENTER + ' | ' + cols.RIGHT;
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

