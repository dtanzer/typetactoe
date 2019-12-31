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

## Step 5: Add Type for Who is Next Player

Added types that remember all past moves of players:

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

With this sequence of all moves, available in the type system, I can re-write ```playX``` and ```playO``` to type-check whether it is _really_ the current player's move:

    export const playX = <R extends RowCoordinate, C extends ColumnCoordinate>(row: R, col: C) => 
        <Game extends EmptyGame | MoveSequence<any, any, PlayerO, any>>(board: Board<Game>): Board<MoveSequence<R, C, PlayerX, Game>> => 
        board._setX(row, col);

Now, a move by the wrong player is not possible anymore (see ```game-4.ts```):

    const board1 = playX('TOP', 'LEFT')(board);
    console.log(board1.render());
    console.log(board1.status());

    const board1a = playO('TOP', 'LEFT')(board); //compile error: playO is not possible for an empty game
    const board2 = playX('MIDDLE', 'LEFT')(board1); //compile error: playX is not possible after playX

This means I can also remove the tests

    [['O'], ['X', 'X'], ['X', 'O', 'O'], ['X', 'O', 'X', 'O', 'X', 'O', 'O']].forEach(seq => 
        it('throws and exception when it is not player\'s turn (turn '+seq.length+', player'+seq[seq.length-1]+')', () => {
            //...
        });
    );

and the checks for the next player. 4 tests removed - 44 passing.

## Step 6: Add Type to Check Whether Correct Field is Set

Instead of using classes for rows and columns, I now use simple mapped types:

    export type Columns = { readonly [key in ColumnCoordinate]: ColumnContent };
    export type EmptyColumns = { readonly [key in ColumnCoordinate]: ' ' };

Now I can create a type that ensures that a certain field was set:

    export type SetColumn<CD extends Columns, C extends ColumnCoordinate, P extends Player> = {
        readonly [key in keyof Columns]: key extends C? P : CD[key]
    };

And I can write type-safe functions that set the field. The compiler will tell me when I implement the function incorrectly, e.g. when I do not set the "LEFT" property.

    const withLeft = <CD extends Columns, P extends Player>(cols: CD, playerCharacter: P): SetColumn<CD, 'LEFT', P> => {
        return { ...cols, LEFT: playerCharacter };
    }

I can even make sure that I have the correct functions for all coordinates:

    export type WithColumnFunctions = {
        readonly [key in ColumnCoordinate]: 
            <CD extends Columns, P extends Player>(cols: CD, playerCharacter: P) => SetColumn<CD, key, P>
    }
    export const withColumnFunctions : WithColumnFunctions = {
        LEFT: withLeft,
        CENTER: withCenter,
        RIGHT: withRight,
    };

And then I can use these functions to create the new board:

    type WithAnyCol = <CD extends Columns, P extends Player, C extends ColumnCoordinate>(cols: CD, playerCharacter: P) => SetColumn<CD, any, P>;
    const withCol: WithAnyCol = withColumnFunctions[column];
    type WithAnyRow = <RD extends Rows, P extends Player, CD extends Columns> (rows: RD, withCol: (c: Columns, p: P)=>CD, playerCharacter: P) => SetRow<RD, any, CD>;
    const withRow: WithAnyRow = withRowFunctions[row];
    
    return new Board(withRow(this.rows, withCol, playerCharacter), 'O');

This allowed me to remove the tests

    const rowCoordinates: RowCoordinate[] = ['TOP', 'MIDDLE', 'BOTTOM'];
    const colCoordinates: ColumnCoordinate[] = ['LEFT', 'CENTER', 'RIGHT'];

    rowCoordinates.forEach((row: RowCoordinate) => colCoordinates.forEach((column: ColumnCoordinate) => {
        it('sets the the value at ['+row+'-'+column+'] to X', () => {
            const board = new Board();

            const newBoard = playX(row, column)(board);

            expect(newBoard.rows[row][column]).to.equal('X');
        });
    }));

9 tests removed - 35 passing. Also, two classes removed from the production code, it now works on simple, readonly TypeScript objects.

## Aside: Check Whether Field is Occupied

I could theoretically also check whether a field is occupied using the same technique, by introducing a type ```FreeColumns``` (which is a union of column names that are still free):

    export type ColumnData = { readonly [key in ColumnCoordinate]: ColumnContent };
    export type EmptyColumnData = { readonly [key in keyof ColumnData]: ' ' };
    export type FreeColumns<CD extends ColumnData> = { [key in keyof CD]: CD[key] extends ' '? key : never }[keyof ColumnData];
    export type SetColumn<CD extends ColumnData, C extends ColumnCoordinate, P extends Player> = {
        readonly [key in keyof ColumnData]: key extends C? P : CD[key]
    };

    const withLeft = <CD extends ColumnData, C extends FreeColumns<CD> & 'LEFT', P extends Player>(columns: CD, player: P, col: C): SetColumn<CD, 'LEFT', P> => {
        return { ...columns, LEFT: player };
    };

Then the compiler will not even allow me to set a value that has already been set:

    const emptyCols : EmptyColumnData = { LEFT: ' ', CENTER: ' ', RIGHT: ' ' };
    const wl = withLeft(emptyCols, 'X', 'LEFT');
    //const wl2 = withLeft(wl, 'O', 'LEFT'); <-- compiler error: has already been set

But I didn't manage to implement the whole setting code (rows and columns) like that. And even if it was possible, it would become quite complicated. Fortunately, there's another way to achieve it (which is quite complicated in a different way)...

Also, the following is **not** possilbe:

    const withColumn = <CD extends ColumnData, C extends FreeColumns<CD>, P extends Player>(columns: CD, player: P, col: C): SetColumn<CD, C, P> => {
        return { ...columns, [col]: player };
    };

It would require [dependent types](https://en.wikipedia.org/wiki/Dependent_type) like e.g. [Idris](https://en.wikipedia.org/wiki/Idris_(programming_language) has, but those are not (yet?) available in TypeScript.

## Step 7: Add Type that Checks for Free Field

I already keep all previous moves in a list at the type level. So, I can check that list for whether a field was alread played. To do that, I need some helper types:

    type Bool = 'T' | 'F'

    type If<B extends Bool, Then, Else> = {
        T: Then
        F: Else
    }[B]

    type Not<B extends Bool> = If<B, 'F', 'T'>

    type And<B1 extends Bool, B2 extends Bool> = If<B1, B2, 'F'>

    type Eq<A extends string, B extends string> = ({ [K in A]: 'T' } & {
        [key: string]: 'F'
    })[B]

    type IsPlayed<R extends RowCoordinate, C extends ColumnCoordinate, G extends OngoingGame> = {
        T: 'F'
        F: If<
            And<Eq<G['R'], R>, Eq<G['C'], C>>, 
            'T', 
            IsPlayed<R, C, G['PrevMove']>
        >
    }[G['isEmpty']]

Now I can add a second parameter that has the type ```'T'``` when the field is still free and ```never``` when the field is occupied:

    export const playX = <R extends RowCoordinate, C extends ColumnCoordinate>(row: R, col: C) => 
        <
            Game extends EmptyGame | MoveSequence<any, any, PlayerO, any>,
            IsFreeField extends Not<IsPlayed<R, C, Game>>
        >
        (board: Board<Game>, isFreeField: IsFreeField & 'T'): Board<MoveSequence<R, C, PlayerX, Game>> => 
        board._setX(row, col);

Setting a field twice now results in a compiler error (see ```game-3.ts```):

    const board = new Board();
    const isFreeField = 'T';

    const board1 = playX('TOP', 'LEFT')(board, isFreeField);
    console.log(board1.render());
    console.log(board1.status());

    const board2 = playO('TOP', 'LEFT')(board1, isFreeField); //error: cannot assign 'T' to never

The following test does not compile anymore:

    it('throws an exception when the field is already occupied', () => {
        const board = new Board();
        const newBoard = playX('TOP', 'LEFT')(board, isFreeField);

        expect(() => playO('TOP', 'LEFT')(newBoard, isFreeField)).to.throw('Illegal move: TOP-LEFT is already occupied by "X"');
    });

And I can also remove the checks from the production code:

    if(this.rows[row][column] !== ' ') {
        throw 'Illegal move: '+row+'-'+column+' is already occupied by "'+this.rows[row][column]+'"';
    }

1 test removed - 34 passing.
