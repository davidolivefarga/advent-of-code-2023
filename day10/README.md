# Day 10: Pipe Maze

You can find the puzzles [here](https://adventofcode.com/2023/day/10).

## ✍🏼 Input

In these puzzles we have a map representing tiles.

These are the different types of tiles:

-   `|`: vertical pipe connecting north and south
-   `-`: horizontal pipe connecting east and west
-   `L`: 90-degree bend connecting north and east
-   `J`: 90-degree bend connecting north and west
-   `7`: 90-degree bend connecting south and west
-   `F`: 90-degree bend connecting south and east
-   `.`: ground (there is no pipe in this tile)
-   `S`: starting position (there is a pipe in this tile, but the map does not show its type)

Example:

```js
const input = [
    [".", ".", ".", ".", "."],
    [".", "F", "-", "7", "."],
    [".", "|", ".", "|", "."],
    [".", "L", "-", "J", "."],
    [".", ".", ".", ".", "."],
];
```

## 🧩 First puzzle

### Objective

We're told that there's a loop of pipes containing the starting position, `S`. The objective is to find how many steps along the loop does it take to get from the starting position to the point farthest from the starting position.

For example, imagine that we have the following map:

```
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
```

The distances from each loop tile to the starting position would be:

```
..45.
.236.
01.78
14567
23...
```

So the answer would be 8.

### Solution

The idea of the solution is to start by finding two tiles:

-   The starting tile (let's call it `A`)
-   A tile adjacent to the starting tile that connects to it (let's call it `B`)

We know that each tile in the loop will be connected to exactly two other tiles. This means that we will have `...-A-B-C-...`. From the tile type of `B` we can find which two tiles are connected to it; we already know one of them is `A`, so we can deduce that the other one is `C`. We can follow this procedure with `B` and `C` until we're back to the starting position, closing the loop.

While we do the above process, we can keep track of how many tiles do we have in the loop. Then, the amount of steps along the loop that it takes to get from the starting position to the point farthest from the starting position will be half that amount, rounded down.

```js
const input = require("./input");

const START_TILE = "S";

const TILES_CONNECTING_NORTH = ["|", "L", "J"];
const TILES_CONNECTING_SOUTH = ["|", "7", "F"];
const TILES_CONNECTING_WEST = ["-", "J", "7"];
const TILES_CONNECTING_EAST = ["-", "L", "F"];

function solve(map) {
    const startTile = getStartTile(map);

    let numTilesInLoop = 1;

    let previousTile = startTile;
    let currentTile = getTileConnectedToStartTile(startTile, map);

    while (!(map[currentTile[0]][currentTile[1]] === START_TILE)) {
        const nextTile = getTilesConnectedToTile(currentTile, map).filter(
            (tile) => tile[0] !== previousTile[0] || tile[1] !== previousTile[1]
        )[0];

        previousTile = currentTile;
        currentTile = nextTile;

        numTilesInLoop++;
    }

    return Math.floor(numTilesInLoop / 2);
}

function getStartTile(map) {
    const rows = map.length;
    const cols = map[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (map[i][j] === "S") {
                return [i, j];
            }
        }
    }
}

function getTileConnectedToStartTile([r, c], map) {
    if (TILES_CONNECTING_SOUTH.includes(map[r - 1]?.[c])) {
        return [r - 1, c];
    }

    if (TILES_CONNECTING_NORTH.includes(map[r + 1]?.[c])) {
        return [r + 1, c];
    }

    // We know the that the start tile will be connected to two
    // tiles. If it's not connected to the north and south tiles,
    // it must be connected to the west and east tiles, so we
    // can return any of them without any additional checks.
    return [r, c - 1];
}

function getTilesConnectedToTile([r, c], map) {
    const connectedTiles = [];

    if (TILES_CONNECTING_NORTH.includes(map[r][c])) {
        connectedTiles.push([r - 1, c]);
    }

    if (TILES_CONNECTING_SOUTH.includes(map[r][c])) {
        connectedTiles.push([r + 1, c]);
    }

    if (TILES_CONNECTING_WEST.includes(map[r][c])) {
        connectedTiles.push([r, c - 1]);
    }

    if (TILES_CONNECTING_EAST.includes(map[r][c])) {
        connectedTiles.push([r, c + 1]);
    }

    return connectedTiles;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same situation as before, but this time we want to find the amount of tiles inside the loop. It is important to notice that there doesn't need to be a full tile path to the outside for tiles to count as outside the loop, because squeezing between pipes is also allowed.

For example, in this map `I` represents a tile inside the loop and `O` represents a tile outside the loop:

```
OOOOOOOOOO
OS------7O
O|F----7|O
O||OOOO||O
O||OOOO||O
O|L-7F-J|O
O|II||II|O
OL--JL--JO
OOOOOOOOOO
```

### Solution

This has been the hardest problem so far! The fact that squeezing between pipes is allowed complicates things, and requires looking for an algorithm that can tell us if a point is inside a polygon. Luckily there are a few, but the easiest one to implement is the [ray casting algorithm](https://en.wikipedia.org/wiki/Point_in_polygon#:~:text=.%5B2%5D-,Ray%20casting%20algorithm,-%5Bedit%5D):

> One simple way of finding whether the point is inside or outside a simple polygon is to test how many times a ray, starting from the point and going in any fixed direction, intersects the edges of the polygon. If the point is on the outside of the polygon the ray will intersect its edge an even number of times. If the point is on the inside of the polygon then it will intersect the edge an odd number of times.

So that's what we do. For each row in the map, we traverse it and start counting the number of intersections with the loop edges, to see if the points are inside the loop or outside it. Counting the intersection is the tricky part, let's see some scenarios:

```
Scenario 1:

  .F-7
> .|.|
  .L-J

Scenario 2:

  .F-7
> .L-J
  ....

Scenario 3:

  ....
> .F-7
  .L-J
```

The first scenario is the easy one, because in that row we can see that we have two clear intersections. However, in the second and third scenarios is not that clear, because the "ray" we're casting is coincides with the edge of the loop. The trick we can do here is to slightly move the ray to the north or to the south so that it no longer coincides with the edge. If we move it to the north, then we only need to care about the tiles that connect to the north; otherwise, we only need to care about the tiles that connect to the south.

This means that one way to check intersections is to see if the tile is part of the loop and it is of type `|`, `L` or `J` (alternatively, we could check if it is of type `|`, `7` or `F`).

There's one more caveat! If we use the ray tracing technique, we must make sure to replace the starting position by its pipe type, otherwise it can affect the count of intersections. Doing that isn't hard, we just need to check the positions adjacent to the starting position and based on their shapes, find the only possible pipe type for the starting position.

```js
const input = require("./input");

const START_TILE = "S";

const TILES_CONNECTING_NORTH = ["|", "L", "J"];
const TILES_CONNECTING_SOUTH = ["|", "7", "F"];
const TILES_CONNECTING_WEST = ["-", "J", "7"];
const TILES_CONNECTING_EAST = ["-", "L", "F"];

function solve(map) {
    const startTile = getStartTile(map);
    const startTileType = getStartTileType(startTile, map);

    let previousTile = startTile;
    let currentTile = getTileConnectedToStartTile(startTile, map);

    const loopTiles = new Set();

    loopTiles.add(encodeTile(previousTile));
    loopTiles.add(encodeTile(currentTile));

    while (!(map[currentTile[0]][currentTile[1]] === START_TILE)) {
        const nextTile = getTilesConnectedToTile(currentTile, map).filter(
            (tile) => tile[0] !== previousTile[0] || tile[1] !== previousTile[1]
        )[0];

        loopTiles.add(encodeTile(nextTile));

        previousTile = currentTile;
        currentTile = nextTile;
    }

    map[startTile[0]][startTile[1]] = startTileType;

    let numTilesInsideLoop = 0;

    const rows = map.length;
    const cols = map[0].length;

    for (let i = 0; i < rows; i++) {
        let insideLoop = false;

        for (let j = 0; j < cols; j++) {
            if (loopTiles.has(encodeTile([i, j]))) {
                if (TILES_CONNECTING_NORTH.includes(map[i][j])) {
                    insideLoop = !insideLoop;
                }
            } else if (insideLoop) {
                numTilesInsideLoop++;
            }
        }
    }

    return numTilesInsideLoop;
}

function encodeTile([r, c]) {
    return `${r};${c}`;
}

function getStartTile(map) {
    const rows = map.length;
    const cols = map[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (map[i][j] === "S") {
                return [i, j];
            }
        }
    }
}

function getStartTileType([r, c], map) {
    const isConnectingNorth = TILES_CONNECTING_SOUTH.includes(map[r - 1]?.[c]);
    const isConnectingSouth = TILES_CONNECTING_NORTH.includes(map[r + 1]?.[c]);
    const isConnectingWest = TILES_CONNECTING_EAST.includes(map[r][c - 1]);
    const isConnectingEast = TILES_CONNECTING_WEST.includes(map[r][c + 1]);

    if (isConnectingNorth && isConnectingSouth) return "|";
    if (isConnectingEast && isConnectingWest) return "-";
    if (isConnectingNorth && isConnectingEast) return "L";
    if (isConnectingNorth && isConnectingWest) return "J";
    if (isConnectingSouth && isConnectingEast) return "F";
    if (isConnectingSouth && isConnectingWest) return "7";

    throw new Error("The provided tile wasn't the start tile");
}

function getTileConnectedToStartTile([r, c], map) {
    if (TILES_CONNECTING_SOUTH.includes(map[r - 1]?.[c])) {
        return [r - 1, c];
    }

    if (TILES_CONNECTING_NORTH.includes(map[r + 1]?.[c])) {
        return [r + 1, c];
    }

    // We know the that the start tile will be connected to two
    // tiles. If it's not connected to the north and south tiles,
    // it must be connected to the west and east tiles, so we
    // can return any of them without any additional checks.
    return [r, c - 1];
}

function getTilesConnectedToTile([r, c], map) {
    const connectedTiles = [];

    if (TILES_CONNECTING_NORTH.includes(map[r][c])) {
        connectedTiles.push([r - 1, c]);
    }

    if (TILES_CONNECTING_SOUTH.includes(map[r][c])) {
        connectedTiles.push([r + 1, c]);
    }

    if (TILES_CONNECTING_WEST.includes(map[r][c])) {
        connectedTiles.push([r, c - 1]);
    }

    if (TILES_CONNECTING_EAST.includes(map[r][c])) {
        connectedTiles.push([r, c + 1]);
    }

    return connectedTiles;
}

console.log(solve(input));
```
