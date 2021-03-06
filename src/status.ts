import { Columns, ColumnCoordinate, ColumnContent, Rows, RowCoordinate, Player, rowCoordinates, colCoordinates } from './tictactoe'

type HasSetColumn<C extends ColumnCoordinate> = { [key in ColumnCoordinate]: key extends C? Player : ColumnContent }
type HasAllSet = HasSetColumn<'LEFT'> & HasSetColumn<'CENTER'> & HasSetColumn<'RIGHT'>
type HasAllFieldsSet = { [key in RowCoordinate]: HasAllSet }

function getDrawText(board: HasAllFieldsSet): 'Game over, nobody has won.' {
	return 'Game over, nobody has won.';
}

function isFull(board: Rows): board is HasAllFieldsSet {
	return rowCoordinates.reduce((prev: boolean, row: RowCoordinate) => {
		return prev && colCoordinates.reduce((prev, col)=> prev && board[row][col]!==' ', true)
	}, true)
}

function printStatus(board: Rows) {
	if(isFull(board)) console.log(getDrawText(board));
}

/*********
type HasCol<C extends ColumnCoordinate, P extends Player> = { [key in ColumnCoordinate]: key extends C? P : ColumnContent };

function hasColumn<P extends Player, C extends ColumnCoordinate>(cols: Columns, coord: C, player: P): cols is HasCol<C, P> {
	if(cols['LEFT'] === player) {
		return true;
	}
	return false
}

type HasRow<P extends Player> = HasCol<'LEFT', P> & HasCol<'CENTER', P> & HasCol<'RIGHT', P>

function hasRow<P extends Player>(cols: Columns, player: P): cols is HasRow<P> {
	if(hasColumn(cols, 'LEFT', player) && hasColumn(cols, 'CENTER', player) && hasColumn(cols, 'RIGHT', player)) {
		return true;
	}
	return false;
}

function printXHasWon<C extends HasRow<'X'>>(cols: C): 'Player X has won' {
	return 'Player X has won'
}

function printWinner<C extends Columns>(cols: C) {
	if(hasRow(cols, 'X'))
	printXHasWon(cols)
}
*********/
