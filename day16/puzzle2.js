const input = require("./input");

const NORTH = [-1, 0];
const SOUTH = [1, 0];
const WEST = [0, -1];
const EAST = [0, 1];

function solve(map) {
    const rows = map.length;
    const cols = map[0].length;

    let maxEnergizedTiles = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < rows; i++) {
        maxEnergizedTiles = Math.max(
            maxEnergizedTiles,
            getEnergizedTiles(map, [
                {
                    position: [i, 0],
                    direction: EAST,
                },
            ]),
            getEnergizedTiles(map, [
                {
                    position: [i, cols - 1],
                    direction: WEST,
                },
            ])
        );
    }

    for (let j = 0; j < cols; j++) {
        maxEnergizedTiles = Math.max(
            maxEnergizedTiles,
            getEnergizedTiles(map, [
                {
                    position: [0, j],
                    direction: SOUTH,
                },
            ]),
            getEnergizedTiles(map, [
                {
                    position: [rows - 1, j],
                    direction: NORTH,
                },
            ])
        );
    }

    const beams = [{ position: [0, 0], direction: EAST }];

    return maxEnergizedTiles;
}

function getEnergizedTiles(map, beams) {
    const visitedTiles = new Set();
    const energizedTiles = new Set();

    while (beams.length > 0) {
        const beam = beams.pop();

        const tileType = map[beam.position[0]]?.[beam.position[1]];

        if (!tileType) {
            continue;
        }

        const encodedBeam = encodeBeam(beam);

        if (visitedTiles.has(encodedBeam)) {
            continue;
        }

        visitedTiles.add(encodedBeam);

        const encodedPosition = encodePosition(beam.position);

        energizedTiles.add(encodedPosition);

        let newBeams = [];

        if (tileType === ".") {
            newBeams = moveToEmptySpace(beam);
        } else if (tileType === "\\") {
            newBeams = moveToLeftMirror(beam);
        } else if (tileType === "/") {
            newBeams = moveToRightMirror(beam);
        } else if (tileType === "-") {
            newBeams = moveToHorizontalMirror(beam);
        } else if (tileType === "|") {
            newBeams = moveToVerticalMirror(beam);
        }

        beams.push(...newBeams);
    }

    return energizedTiles.size;
}

function moveToEmptySpace({ position, direction }) {
    const newPosition = move(position, direction);

    return [{ position: newPosition, direction }];
}

function moveToLeftMirror({ position, direction }) {
    const newDirection = [direction[1], direction[0]];
    const newPosition = move(position, newDirection);

    return [{ position: newPosition, direction: newDirection }];
}

function moveToRightMirror({ position, direction }) {
    const newDirection = [-1 * direction[1], -1 * direction[0]];
    const newPosition = move(position, newDirection);

    return [{ position: newPosition, direction: newDirection }];
}

function moveToHorizontalMirror({ position, direction }) {
    if (direction[0] === 0) {
        return moveToEmptySpace({ position, direction });
    }

    const westPosition = move(position, WEST);
    const eastPosition = move(position, EAST);

    return [
        { position: westPosition, direction: WEST },
        { position: eastPosition, direction: EAST },
    ];
}

function moveToVerticalMirror({ position, direction }) {
    if (direction[1] === 0) {
        return moveToEmptySpace({ position, direction });
    }

    const northPosition = move(position, NORTH);
    const southPosition = move(position, SOUTH);

    return [
        { position: northPosition, direction: NORTH },
        { position: southPosition, direction: SOUTH },
    ];
}

function move(position, direction) {
    return [position[0] + direction[0], position[1] + direction[1]];
}

function encodeBeam({ position, direction }) {
    return [position, direction].flat().join(";");
}

function encodePosition(position) {
    return position.join(";");
}

console.log(solve(input));
