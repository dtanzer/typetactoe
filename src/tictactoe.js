class Columns {
	constructor(LEFT, CENTER, RIGHT) {
		this.LEFT = LEFT;
		this.CENTER = CENTER;
		this.RIGHT = RIGHT;
	}
}

class Rows {
	constructor(TOP, MIDDLE, BOTTOM) {
		this.TOP = TOP;
		this.MIDDLE = MIDDLE;
		this.BOTTOM = BOTTOM;
	}
}

export class Board {
	constructor() {
		this.rows = new Rows(new Columns(' ', ' ', ' '), new Columns(' ', ' ', ' '), new Columns(' ', ' ', ' '))
		this.nextPlayer = 'X';
	}
	
	set(row, column, playerCharacter) {
		if(!(playerCharacter === 'X' || playerCharacter === 'O')) {
			throw 'Illegal player character: "'+playerCharacter+'"';
		}
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
}
