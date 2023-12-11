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
