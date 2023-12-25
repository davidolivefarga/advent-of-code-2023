# Day 18: Lavaduct Lagoon

You can find the puzzles [here](https://adventofcode.com/2023/day/18).

## ✍🏼 Input

In these puzzles we have a list of instructions to dig a trench that forms a loop.

Each instruction indicates the amount of tiles to move in a given direction and the color of the trench tile.

The possible directions are up (`U`), down (`D`), left (`L`) and right (`R`).

Example:

```js
const input = [
    {
        direction: "U",
        amount: 6,
        color: "70c710",
    },
    {
        direction: "D",
        amount: 5,
        color: "0dc571",
    },
    // ...
];
```

## 🧩 First puzzle

### Objective

The instructions tell us how to dig the trench, and after that we dig out the interior of the trench.

Found the amount of dug tiles.

### Solution

Very similar to [Advent of Code 2022, Day 18, Part 2](https://github.com/davidolivefarga/advent-of-code-2022/tree/master/day18#-second-puzzle).

First of all we count the tiles that are part of the trench, and we keep track of its dimensions so that we can embed it in a rectangle that contains it but is expanded one tile on each side. Then, using a BFS, we can count the tiles that are outside the trench in that rectangle. The desired answer will be the area of the rectangle minus the tiles outside the trench.

```js
const input = require("./input");

function solve(digInstructions) {
    const visitedTiles = new Set();

    let currentTile = [0, 0];

    let tilesInTrenchCount = 0;

    let minRow = 0;
    let maxRow = 0;
    let minCol = 0;
    let maxCol = 0;

    for (const { direction, amount } of digInstructions) {
        for (let i = 1; i <= amount; i++) {
            currentTile = move(currentTile, direction);

            minRow = Math.min(minRow, currentTile[0]);
            maxRow = Math.max(maxRow, currentTile[0]);
            minCol = Math.min(minCol, currentTile[1]);
            maxCol = Math.max(maxCol, currentTile[1]);

            tilesInTrenchCount++;

            visitedTiles.add(encodeTile(currentTile));
        }
    }

    const trenchWidth = maxCol - minCol + 1;
    const trenchHeight = maxRow - minRow + 1;

    const tilesCount = (trenchWidth + 2) * (trenchHeight + 2);

    const tilesOutsideTrench = [[minRow - 1, minCol - 1]];

    let tilesOutisdeTrenchCount = 0;

    while (tilesOutsideTrench.length > 0) {
        const tile = tilesOutsideTrench.pop();

        if (
            tile[0] < minRow - 1 ||
            tile[0] > maxRow + 1 ||
            tile[1] < minCol - 1 ||
            tile[1] > maxCol + 1
        ) {
            continue;
        }

        const encodedTile = encodeTile(tile);

        if (visitedTiles.has(encodedTile)) {
            continue;
        }

        tilesOutisdeTrenchCount++;

        visitedTiles.add(encodeTile(tile));

        ["U", "D", "L", "R"].forEach((direction) => {
            const nextTile = move(tile, direction);

            tilesOutsideTrench.push(nextTile);
        });
    }

    return tilesCount - tilesOutisdeTrenchCount;
}

function encodeTile(tile) {
    return tile.join(";");
}

function move(tile, direction) {
    if (direction === "U") return [tile[0] - 1, tile[1]];
    if (direction === "D") return [tile[0] + 1, tile[1]];
    if (direction === "L") return [tile[0], tile[1] - 1];
    if (direction === "R") return [tile[0], tile[1] + 1];
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same objective, but this time numbers are much bigger.

The color code of each instruction will now determine the direction and the amount of tiles to move. The first five hexadecimal digits encode the amount as a five-digit hexadecimal number. The last hexadecimal digit encodes the direction to dig: `0` means `R`, `1` means `D`, `2` means `L`, and `3` means `U`.

### Solution

If we use the same approach as in the first puzzle we'll wait forever, because with the new instructions the rectangle that contains the trench will contain _a lot of tiles_ (we're talking trillions of tiles). In fact, the sets we used to count visited tiles will explode due to having too many entries.

This means that we can no longer tile by tile, so the only option left is to try to divide the trench in small rectangular pieces, because calculating the area of a rectangle is easy even if its width and height are very long.

To understand the solution, let's use a small trench as an example.

```
    0 1 2 3 4 5 6 7 8 9

0   # # # # # # # # . .
1   # # # # # # # # . .
2   # # . . . . # # . .
3   # # . . . . # # . .
4   # # . . . . # # . .
5   # # . . . . # # . .
6   # # # # . . # # . .
7   # # # # . . # # # #
8   . . # # . . . . # #
9   . . # # . . . . # #
10  . . # # # # # # # #
11  . . # # # # # # # #
```

The digger starts at `[0.5, 0.5]`, which means that it digs the square region from `[0, 0]` to `[1, 1]`. Then it moves to `[0.5, 6.5]`, then to `[4.5, 6.5]` and so on, until it finishes creating the trench. This is very important, because we have to distinguish between the area enclosed by the digger path from the area enclosed by the trench, which will be bigger.

As we follow the path of the digger, we'll keep track of four things:

-   The vertical edges (for example, `[[0.5, 6.5], [4.5, 6.5]]`)
-   The horziontal edges (for example, `[[0.5, 0.5], [0.5, 6.5]`)
-   The rows that contain one or more vertices (for example, `0.5` or `4.5`)
-   The columns that contain one or more vertices (for example, `0.5` or `6.5`)

With the rows and columns, we can divide the region enclosed by the digger path into several rectangles (the image below is not very accurate because the edges are on decimal rows/columns, but you get the idea):

```
    0 1 2 3 4 5 6 7 8 9

0   . . . . . . . . . .
1   . - - - - - - - - .
2   . | # | # # | . | .
3   . | # | # # | . | .
4   . | # | # # | . | .
5   . | # | # # | . | .
6   . | - | - - | - | .
7   . | . | # # | # | .
8   . | . | # # | # | .
9   . | . | # # | # | .
10  . - - - - - - - - .
11  . . . . . . . . . .
```

Some of those regions will be inside the digger path, while others will be outside it. To know what kind of region we have, we can use the same technique we used in [Advent of Code 2023, Day 10, Part 2](https://github.com/davidolivefarga/advent-of-code-2023/tree/master/day10#-second-puzzle), the ray casting alogrithm. We pick a point inside the region and we apply the algorithm to determine if it's inside the digger path or outside. This requires either the list of vertical edges or the list of horizontal edges, depending the direction of the ray you case (in my case I chose the vertical ones).

At this point, we have the area enclosed by the path of the digger. However, to calculate the area enclosed by the trench, we need to add a bit more area, because there are some parts of the trench that we haven't counted yet:

```
    0 1 2 3 4 5 6 7 8 9

0   # # # # # # # # . .
1   # o o o o o o # . .
2   # o o o o o o # . .
3   # o o o o o o # . .
4   # o o o o o o # . .
5   # o o o o o o # . .
6   # o o o o o o # . .
7   # # # o o o o # # #
8   . . # o o o o o o #
9   . . # o o o o o o #
10  . . # o o o o o o #
11  . . # # # # # # # #
```

Each edge will contribute to its length multiplied by 0.5, and the end we will be left with 4 corners that didn't get covered by any of the edge contributions. Since each corner has an area of 0.5 \* 0.5 and we have 4 of them, we just need to add 1 more unit of the area to get the desired result.

```js
const input = require("./input");

const DIRECTIONS = {
    R: [0, 1],
    D: [1, 0],
    L: [0, -1],
    U: [-1, 0],
};

function solve(digInstructions) {
    const {
        verticalEdges,
        horizontalEdges,
        rowsWithVertices,
        colsWithVertices,
    } = getTrenchData(digInstructions);

    let trenchTiles = 0;

    for (let i = 1; i < rowsWithVertices.length; i++) {
        for (let j = 1; j < colsWithVertices.length; j++) {
            const topRow = rowsWithVertices[i - 1];
            const bottomRow = rowsWithVertices[i];
            const leftCol = colsWithVertices[j - 1];
            const rightCol = colsWithVertices[j];

            const innerPoint = [
                (topRow + bottomRow) / 2,
                (leftCol + rightCol) / 2,
            ];

            const verticalEdgesCrossedOnTheLeft = verticalEdges.filter(
                (edge) => {
                    return (
                        edge[0][1] < innerPoint[1] &&
                        edge[0][0] < innerPoint[0] &&
                        edge[1][0] > innerPoint[0]
                    );
                }
            );

            const isRegionInsideTrench =
                verticalEdgesCrossedOnTheLeft.length % 2 === 1;

            if (isRegionInsideTrench) {
                const regionHeight = bottomRow - topRow;
                const regionWidth = rightCol - leftCol;
                const regionArea = regionWidth * regionHeight;

                trenchTiles += regionArea;
            }
        }
    }

    for (const [v1, v2] of verticalEdges) {
        trenchTiles += (v2[0] - v1[0]) / 2;
    }

    for (const [v1, v2] of horizontalEdges) {
        trenchTiles += (v2[1] - v1[1]) / 2;
    }

    return trenchTiles + 1;
}

function getTrenchData(digInstructions) {
    const verticalEdges = [];
    const horizontalEdges = [];

    const rowsWithVerticesSet = new Set();
    const colsWithVerticesSet = new Set();

    let diggerPosition = [0, 0];

    for (const { color } of digInstructions) {
        const amount = parseInt(color.slice(0, -1), 16);
        const direction = DIRECTIONS[Object.keys(DIRECTIONS)[color.at(-1)]];

        const newDiggerPosition = move(diggerPosition, direction, amount);

        if (isVerticalDirection(direction)) {
            let verticalEdge;

            if (diggerPosition[0] < newDiggerPosition[0]) {
                verticalEdge = [diggerPosition, newDiggerPosition];
            } else {
                verticalEdge = [newDiggerPosition, diggerPosition];
            }

            verticalEdges.push(verticalEdge);
        } else {
            let horizontalEdge;

            if (diggerPosition[1] < newDiggerPosition[1]) {
                horizontalEdge = [diggerPosition, newDiggerPosition];
            } else {
                horizontalEdge = [newDiggerPosition, diggerPosition];
            }

            horizontalEdges.push(horizontalEdge);
        }

        rowsWithVerticesSet.add(newDiggerPosition[0]);
        colsWithVerticesSet.add(newDiggerPosition[1]);

        diggerPosition = newDiggerPosition;
    }

    const rowsWithVertices = [...rowsWithVerticesSet.values()];
    const colsWithVertices = [...colsWithVerticesSet.values()];

    rowsWithVertices.sort((r1, r2) => r1 - r2);
    colsWithVertices.sort((c1, c2) => c1 - c2);

    return {
        verticalEdges,
        horizontalEdges,
        rowsWithVertices,
        colsWithVertices,
    };
}

function move(tile, direction, amount) {
    return [tile[0] + amount * direction[0], tile[1] + amount * direction[1]];
}

function isVerticalDirection(direction) {
    return direction[1] === 0;
}

console.log(solve(input));
```
