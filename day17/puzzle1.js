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
