# Steps in Refactoring Towards Types

The refactoring towards types started with completely un-typed but well tested code: 58 tests passing.

Still those tests cannot prove the absence of defects: You **can** find ways to break the production code without breaking the tests.

Also, the tests are probably over-specified, making refactoring of the production code hard. But that's not the point of this exercise :)

## Step 1: Type for Player and ColumnContent

    type Player = 'X' | 'O';
    type ColumnContent = Player | ' ';

Tests for Player do not compile anymore / are redundant:

    [' ', 'A', 'Y', 'Z', 'N', 'Q'].forEach(value => it('throws an exception when value to set is neither X nor O, but "'+value+'"', () => {
        const board = new Board();

        expect(() => board.set('TOP', 'LEFT', value)).to.throw('Illegal player character: "'+value+'"');
    }));

    it('does not throw an exception when player character is valid ("O")', () => {
        const board = new Board();

        board.set('TOP', 'LEFT', 'X');
        board.set('TOP', 'CENTER', 'O');
    });

Now the check for the player character can be removed from the production code:

    if(!(playerCharacter === 'X' || playerCharacter === 'O')) {
        throw 'Illegal player character: "'+playerCharacter+'"';
    }

7 Tests removed - 51 passing. Two boolean sub-expressions and one exception removed from production code.

## Step 2: Type for RowCoordinate and ColumnCoordinate

    export type ColumnCoordinate = 'LEFT' | 'CENTER' | 'RIGHT';
    export type RowCoordinate = 'TOP' | 'MIDDLE' | 'BOTTOM';

Tests for illegal row coordinate cannot be written anymore:

    [['X', 'LEFT'], ['TOP', 'X'], ['X', 'Y']].forEach(pair => it('throws an exception for illegal coordinates '+pair[0]+'-'+pair[1], ()=>{
        const board = new Board();

        expect(() => board.set(pair[0], pair[1], 'X')).to.throw('Illegal coordinates '+pair[0]+'-'+pair[1]);
    }));

Now the checks for illegal coordinates in the production code can be removed too:

    if(!(isValidRow(row) && isValidColumn(column))) {
        throw 'Illegal coordinates '+row+'-'+column;
    }

    function isValidRow(row) {
        return row === 'TOP' || row === 'MIDDLE' || row === 'BOTTOM';
    }

    function isValidColumn(column) {
        return column === 'LEFT' || column === 'CENTER' || column === 'RIGHT';
    }

3 Tests removed - 48 passing. Two boolean sub-expression, one exception and two helper functions removed from production code.

## Step 3: Enabled Strict Type Checking

...this required me to add some more type annotations; Otherwise, everything is still the same as after Step 2.

## Step 4: Refactor to Immutable State Transisions

For the next steps, we need immutable state transitions, so I refactored towards them in this step.

    export const playX = (row: RowCoordinate, col: ColumnCoordinate) => (board: Board): Board => board._set(row, col, 'X');
    export const playO = (row: RowCoordinate, col: ColumnCoordinate) => (board: Board): Board => board._set(row, col, 'O');

Where ```board.set``` was changed to return

    return new Board(this.rows.with(row, column, playerCharacter), playerCharacter==='X'? 'O' : 'X');

It can be used as:

    const board1 = playX('TOP', 'LEFT')(board);
    console.log(board1.render());
    console.log(board1.status());

Also, I can already rely on exhaustive switch-checking here because I enabled strict type checking in the previous step.

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
