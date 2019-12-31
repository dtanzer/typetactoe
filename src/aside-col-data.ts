type PlayerX = 'X';
type PlayerO = 'O';
export type Player = PlayerX | PlayerO;
export type ColumnContent = Player | ' ';

export type ColumnCoordinate = 'LEFT' | 'CENTER' | 'RIGHT';
export type RowCoordinate = 'TOP' | 'MIDDLE' | 'BOTTOM';

export type ColumnData = { readonly [key in ColumnCoordinate]: ColumnContent };
export type EmptyColumnData = { readonly [key in keyof ColumnData]: ' ' };
export type FreeColumns<CD extends ColumnData> = { [key in keyof CD]: CD[key] extends ' '? key : never }[keyof ColumnData];
export type SetColumn<CD extends ColumnData, C extends ColumnCoordinate, P extends Player> = {
	readonly [key in keyof ColumnData]: key extends C? P : CD[key]
};

const withLeft = <CD extends ColumnData, C extends FreeColumns<CD> & 'LEFT', P extends Player>(columns: CD, player: P, col: C): SetColumn<CD, 'LEFT', P> => {
	return { ...columns, LEFT: player };
};
const withCenter = <CD extends ColumnData, C extends FreeColumns<CD> & 'CENTER', P extends Player>(columns: CD, player: P, col: C): SetColumn<CD, 'CENTER', P> => {
	return { ...columns, CENTER: player };
};
const withRight = <CD extends ColumnData, C extends FreeColumns<CD> & 'RIGHT', P extends Player>(columns: CD, player: P, col: C): SetColumn<CD, 'RIGHT', P> => {
	return { ...columns, RIGHT: player };
};

//const withColumn = <CD extends ColumnData, C extends FreeColumns<CD>, P extends Player>(columns: CD, player: P, col: C): SetColumn<CD, C, P> => {
//	return { ...columns, [col]: player };
//};

const emptyCols : EmptyColumnData = { LEFT: ' ', CENTER: ' ', RIGHT: ' ' };
const wl = withLeft(emptyCols, 'X', 'LEFT');
//const wl2 = withLeft(wl, 'O', 'LEFT');
