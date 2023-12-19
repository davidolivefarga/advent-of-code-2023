# Day 17: Clumsy Crucible

You can find the puzzles [here](https://adventofcode.com/2023/day/17).

## ✍🏼 Input

In these puzzles we have a map that indicates how much heat will be lose if we cross each tile.

Example:

```js
const input = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [4, 3, 2, 1],
    [8, 7, 6, 5],
];
```

## 🧩 First puzzle

### Objective

We want to move from the top left corner to the bottom right corner following the path that minimises the heat loss.

Since we start at the top left corner, we don't count its heat loss (unless we come back to it).

There's a couple rules that determine the way we can move:

-   We can never reverse direction, we can only move forward, turn left or turn right
-   Once we pick a direction, we can move at most `3` tiles in that direction before having to turn left or right

Find the minimum amount of heat loss required to reach the bottom right corner.

### Solution

Hardest problem so far, it required coding a version of [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra's_algorithm) adapted to the special movement rules described in the puzzle. I'm not particularly happy with my code, because it's not optimized and that makes it a little bit slow, but it works.

I added comments to explain each step in the solution.

```js
const input = require("./input");

const NORTH = [-1, 0];
const SOUTH = [1, 0];
const WEST = [0, -1];
const EAST = [0, 1];

const MAX_DIRECTION_COUNT = 3;

function solve(map) {
    const rows = map.length;
    const cols = map[0].length;

    // This map will contain, for each tile, the minimum amount of heat loss
    // that is required to reach that tile from a specific direction and
    // with a specific direction count. Clearly, the direction from where
    // we reach the tile matters, because it determines the next directions
    // that we can explore. The direction count is also involved in the
    // calculation of the next directions, so it matters for the same reason.
    const minHeatLossMap = Array.from({ length: rows }, () => Array(cols));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const minHeatByDirection = {};

            [NORTH, SOUTH, WEST, EAST].forEach((direction) => {
                minHeatByDirection[direction] = {};

                for (let i = 1; i <= MAX_DIRECTION_COUNT; i++) {
                    minHeatByDirection[direction][i] = Number.POSITIVE_INFINITY;
                }
            });

            minHeatLossMap[r][c] = minHeatByDirection;
        }
    }

    // There are two initial scenarios:
    // - The one were we moved from [0, 0] to [1, 0] (south direction)
    // - The one were we moved from [0, 0] to [0, 1] (east direction)
    const scenarios = [
        { tile: [1, 0], direction: SOUTH, directionCount: 1, heatLoss: 0 },
        { tile: [0, 1], direction: EAST, directionCount: 1, heatLoss: 0 },
    ];

    while (scenarios.length) {
        const { tile, direction, directionCount, heatLoss } = scenarios.pop();

        const [r, c] = tile;

        const newHeatLoss = heatLoss + map[r][c];
        const minHeatLoss = minHeatLossMap[r][c][direction][directionCount];

        // If we already found a way to reach this tile with the current
        // direction and direction count, but with less heat loss than
        // the current path, we can ignore this path
        if (newHeatLoss >= minHeatLoss) {
            continue;
        }

        minHeatLossMap[r][c][direction][directionCount] = newHeatLoss;

        // For each of the possible directions that we're allowed to move,
        // simulate the next scenario as longs as we're within the map
        const newDirections = getNewDirections(direction, directionCount);

        newDirections.forEach((newDirection) => {
            const newTile = move(tile, newDirection);

            if (!isTileOutOfBounds(newTile, rows, cols)) {
                const newDirectionCount =
                    newDirection === direction ? directionCount + 1 : 1;

                scenarios.push({
                    tile: newTile,
                    direction: newDirection,
                    directionCount: newDirectionCount,
                    heatLoss: newHeatLoss,
                });
            }
        });

        // Very important! Prioritise the scenarios with the smallest
        // heat loss possible, because this will drastically reduce the
        // amount of scenarios we want to check.
        scenarios.sort(
            (scenario1, scenario2) => scenario2.heatLoss - scenario1.heatLoss
        );
    }

    let minHeatLoss = Number.POSITIVE_INFINITY;

    [NORTH, SOUTH, WEST, EAST].forEach((direction) => {
        for (let i = 1; i <= MAX_DIRECTION_COUNT; i++) {
            minHeatLoss = Math.min(
                minHeatLoss,
                minHeatLossMap[rows - 1][cols - 1][direction][i]
            );
        }
    });

    return minHeatLoss;
}

function getNewDirections(direction, directionCount) {
    const newDirections = [];

    if (directionCount < MAX_DIRECTION_COUNT) {
        newDirections.push(direction);
    }

    if (direction[0] === 0) {
        newDirections.push(NORTH, SOUTH);
    }

    if (direction[1] === 0) {
        newDirections.push(WEST, EAST);
    }

    return newDirections;
}

function move(tile, direction) {
    return [tile[0] + direction[0], tile[1] + direction[1]];
}

function isTileOutOfBounds(tile, rows, cols) {
    return tile[0] < 0 || tile[0] >= rows || tile[1] < 0 || tile[1] >= cols;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same situation as before, but this time the movement rules are different:

-   We can never reverse direction, we can only move forward, turn left or turn right
-   Once we pick a direction, we must move at least `4` tiles in that direction before being able to turn left or right
-   Once we pick a direction, we can move at most `10` tiles in that direction before having to turn left or right

Find the minimum amount of heat loss required to reach the bottom right corner.

### Solution

Same solution as before, adapting to the new movements rules. This time we have more scenarios to consider, so the algorithm is slower than before, but it still finishes in a reasonable amount of time so I would say that it's still good enough.

I also added comments to explain each step in the solution.

```js
const input = require("./input");

const NORTH = [-1, 0];
const SOUTH = [1, 0];
const WEST = [0, -1];
const EAST = [0, 1];

const MAX_DIRECTION_COUNT = 10;
const MIN_DIRECTION_COUNT_TO_TURN_OR_STOP = 4;

function solve(map) {
    const rows = map.length;
    const cols = map[0].length;

    // This map will contain, for each tile, the minimum amount of heat loss
    // that is required to reach that tile from a specific direction and
    // with a specific direction count. Clearly, the direction from where
    // we reach the tile matters, because it determines the next directions
    // that we can explore. The direction count is also involved in the
    // calculation of the next directions, so it matters for the same reason.
    const minHeatLossMap = Array.from({ length: rows }, () => Array(cols));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const minHeatByDirection = {};

            [NORTH, SOUTH, WEST, EAST].forEach((direction) => {
                minHeatByDirection[direction] = {};

                for (let i = 1; i <= MAX_DIRECTION_COUNT; i++) {
                    minHeatByDirection[direction][i] = Number.POSITIVE_INFINITY;
                }
            });

            minHeatLossMap[r][c] = minHeatByDirection;
        }
    }

    // There are two initial scenarios:
    // - The one were we moved from [0, 0] to [1, 0] (south direction)
    // - The one were we moved from [0, 0] to [0, 1] (east direction)
    const scenarios = [
        { tile: [1, 0], direction: SOUTH, directionCount: 1, heatLoss: 0 },
        { tile: [0, 1], direction: EAST, directionCount: 1, heatLoss: 0 },
    ];

    while (scenarios.length) {
        const { tile, direction, directionCount, heatLoss } = scenarios.pop();

        const [r, c] = tile;

        const newHeatLoss = heatLoss + map[r][c];
        const minHeatLoss = minHeatLossMap[r][c][direction][directionCount];

        // If we already found a way to reach this tile with the current
        // direction and direction count, but with less heat loss than
        // the current path, we can ignore this path
        if (newHeatLoss >= minHeatLoss) {
            continue;
        }

        minHeatLossMap[r][c][direction][directionCount] = newHeatLoss;

        // For each of the possible directions that we're allowed to move,
        // simulate the next scenario as longs as we're within the map
        const newDirections = getNewDirections(direction, directionCount);

        newDirections.forEach((newDirection) => {
            const newTile = move(tile, newDirection);

            if (!isTileOutOfBounds(newTile, rows, cols)) {
                const newDirectionCount =
                    newDirection === direction ? directionCount + 1 : 1;

                scenarios.push({
                    tile: newTile,
                    direction: newDirection,
                    directionCount: newDirectionCount,
                    heatLoss: newHeatLoss,
                });
            }
        });

        // Very important! Prioritise the scenarios with the smallest
        // heat loss possible, because this will drastically reduce the
        // amount of scenarios we want to check.
        scenarios.sort(
            (scenario1, scenario2) => scenario2.heatLoss - scenario1.heatLoss
        );
    }

    let minHeatLoss = Number.POSITIVE_INFINITY;

    // Once we pick a direction, we are forced to move at least 4 tiles
    // in that direction before being able to stop. Hence, we only look
    // at heat loss values with direction count 4 or more.
    [NORTH, SOUTH, WEST, EAST].forEach((direction) => {
        for (
            let i = MIN_DIRECTION_COUNT_TO_TURN_OR_STOP;
            i <= MAX_DIRECTION_COUNT;
            i++
        ) {
            minHeatLoss = Math.min(
                minHeatLoss,
                minHeatLossMap[rows - 1][cols - 1][direction][i]
            );
        }
    });

    return minHeatLoss;
}

function getNewDirections(direction, directionCount) {
    const newDirections = [];

    if (directionCount < MAX_DIRECTION_COUNT) {
        newDirections.push(direction);
    }

    if (directionCount >= MIN_DIRECTION_COUNT_TO_TURN_OR_STOP) {
        if (direction[0] === 0) {
            newDirections.push(NORTH, SOUTH);
        }

        if (direction[1] === 0) {
            newDirections.push(WEST, EAST);
        }
    }

    return newDirections;
}

function move(tile, direction) {
    return [tile[0] + direction[0], tile[1] + direction[1]];
}

function isTileOutOfBounds(tile, rows, cols) {
    return tile[0] < 0 || tile[0] >= rows || tile[1] < 0 || tile[1] >= cols;
}

console.log(solve(input));
```
