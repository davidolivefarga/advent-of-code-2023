# Day 16: The Floor Will Be Lava

You can find the puzzles [here](https://adventofcode.com/2023/day/16).

## ✍🏼 Input

In these puzzles we have a map with mirrors and splitter.

Each tile in the map can be:

-   `.`: empty space
-   `/` or `\`: mirror
-   `|` or `-`: splitter

Example:

```js
const input = [
    [".", "|", ".", ".", ".", "\\", ".", ".", ".", "."],
    ["|", ".", "-", ".", "\\", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "|", "-", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "|", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "\\"],
    [".", ".", ".", ".", "/", ".", "\\", "\\", ".", "."],
    [".", "-", ".", "-", "/", ".", ".", "|", ".", "."],
    [".", "|", ".", ".", ".", ".", "-", "|", ".", "\\"],
    [".", ".", "/", "/", ".", "|", ".", ".", ".", "."],
];
```

## 🧩 First puzzle

### Objective

A beam enters the top-left tile from the left, heading to the right.

Its behaviour depends on the tiles it founds:

-   If the beam encounters a `.`, it continues in the same direction.
-   If the beam encounters a `/` or a `\` mirror, the beam is reflected 90 degrees depending on the angle of the mirror. For instance, a rightward-moving beam that encounters a `/` mirror would continue upward in the mirror's column, while a rightward-moving beam that encounters a `\` mirror would continue downward from the mirror's column.
-   If the beam encounters the pointy end of a `|` or `-` splitter, the beam passes through the splitter as if the splitter were empty space. For instance, a rightward-moving beam that encounters a `-` splitter would continue in the same direction.
-   If the beam encounters the flat side of a `|` or `-` splitter, the beam is split into two beams going in each of the two directions the splitter's pointy ends are pointing. For instance, a rightward-moving beam that encounters a `|` splitter would split into two beams: one that continues upward from the splitter's column and one that continues downward from the splitter's column.

Beams do not interact with other beams; a tile can have many beams passing through it at the same time. A tile is energized if that tile has at least one beam pass through it, reflect in it, or split in it.

Find how many tiles end up being energized.

### Solution

The idea is to start with the initial beam and simulate the beam movement until we're done.

First of all, we need to realise that a beam could infinitely bounce between mirrors and splitters, so we need to keep track of the visited tiles. Each tile can be visited from four different directions, so we need take the beam direction into account when checking whether it has been visited or not. This is different from keeping track of the energized tiles, where the beam direction doesn't matter and we only care about its position.

Now, we just need to apply the mirror and splitter rules accordingly, which isn't that hard to do. The trickist part is to see how the direction changes when we find a mirror. If you're having trouble with that you can check each of the four possible directions one by one, but if you know a little bit of maths, you'll remember that if you have a normal vector `(a, b)`, there are two normal vectors perpendicular to it: `(b, -a)` and `(-b, a)`. Each mirror corresponds to one of these vectors. Since all our directions have a coordinate that is 0, we can write our perpendicular normal vectors as `(b, a)` and `(-b, -a)`.

```js
const input = require("./input");

const NORTH = [-1, 0];
const SOUTH = [1, 0];
const WEST = [0, -1];
const EAST = [0, 1];

function solve(map) {
    const beams = [{ position: [0, 0], direction: EAST }];
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
```

## 🧩 Second puzzle

### Objective

Same rules as before, but this time we can have a beam enter from any edge tile and heading away from that edge (each corner will have two beams).

Find the maximum amount of energized tiles that we can obtain from one of these beams.

### Solution

Very similar solution, we can reuse the logic from the previous puzzle and try all beams to find the one that maximises the amount of energized tiles.

```js
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
```
