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
