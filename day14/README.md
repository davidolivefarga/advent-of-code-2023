# Day 14: Parabolic Reflector Dish

You can find the puzzles [here](https://adventofcode.com/2023/day/14).

## ✍🏼 Input

In these puzzles we have a platform containing rocks, represented as a matrix.

Each tile in the matrix can be:

-   `O`: a rounded rock
-   `#`: a cube-shaped rock
-   `.`: empty space

Example:

```js
const input = [
    ["O", ".", ".", ".", ".", "#", ".", ".", ".", "."],
    ["O", ".", "O", "O", "#", ".", ".", ".", ".", "#"],
    [".", ".", ".", ".", ".", "#", "#", ".", ".", "."],
    ["O", "O", ".", "#", "O", ".", ".", ".", ".", "O"],
    [".", "O", ".", ".", ".", ".", ".", "O", "#", "."],
    ["O", ".", "#", ".", ".", "O", ".", "#", ".", "#"],
    [".", ".", "O", ".", ".", "#", "O", ".", ".", "O"],
    [".", ".", ".", ".", ".", ".", ".", "O", ".", "."],
    ["#", ".", ".", ".", ".", "#", "#", "#", ".", "."],
    ["#", "O", "O", ".", ".", "#", ".", ".", ".", "."],
];
```

## 🧩 First puzzle

### Objective

The platform can be tilted in one of four directions: north, south, west and east. When the platform is tilted in a direction, the rounded rocks will move as much as possible in that direction, while the cube-shaped rocks will stay in place. Given a platform configuration, we can calculate its load by adding together the load of each rounded rock, which will be equal to the number of rows to the south of it, incluing itself.

Calculate the platform load after tilting it to the north.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const input = require("./input");

const ROUNDED_ROCK = "O";
const EMPTY_SPACE = ".";

function solve(platform) {
    const rows = platform.length;
    const cols = platform[0].length;

    let platformLoad = 0;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            if (platform[row][col] === ROUNDED_ROCK) {
                let newRow = row;

                while (platform[newRow - 1]?.[col] === EMPTY_SPACE) {
                    newRow--;
                }

                if (newRow !== row) {
                    platform[newRow][col] = ROUNDED_ROCK;
                    platform[row][col] = EMPTY_SPACE;
                }

                platformLoad += rows - newRow;
            }
        }
    }

    return platformLoad;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Spinning the platform means tilting it to the north, then to the west, then to the south and finally to the east.

Calculate the platform load after spinning it 1000000000 times.

### Solution

This is a classic Advent of Code problem, and of course we cannot simulate the 1000000000 spins.

Since the amount of platform configurations is much smaller than the amount of spins we need to perform, we know that at some point we will reach a cycle. However, it might take a few spins to reach the first cycle, so we will have something like this:

```
initial spins
cycle
...
cycle
some leftover spins
```

Hence, we just need to find when the cycle starts and its length, and we'll be able to find the leftover spins.

To do that, we start spinning the platform and for every spin, we store its configuration and the number of cycles it took to reach it. Once we find a repeated configuration, we will know how many spins did we need before reaching the cycle and the cycle length. With this information, we calculate the leftover spins, apply them and calculate the platform load.

```js
const input = require("./input");

const ROUNDED_ROCK = "O";
const EMPTY_SPACE = ".";

const SPINS = 1000000000;

function solve(platform) {
    const visitedPlatforms = {};

    let spinCount = 0;

    while (true) {
        spin(platform);

        spinCount++;

        const encodedPlatform = platform.map((row) => row.join("")).join("");

        if (visitedPlatforms[encodedPlatform]) {
            const spinsBeforeCycles = visitedPlatforms[encodedPlatform];
            const cycleLength = spinCount - visitedPlatforms[encodedPlatform];
            const spinsAfterCycles = (SPINS - spinsBeforeCycles) % cycleLength;

            for (let i = 0; i < spinsAfterCycles; i++) {
                spin(platform);
            }

            return getPlatformLoad(platform);
        }

        visitedPlatforms[encodedPlatform] = spinCount;
    }
}

function spin(platform) {
    tiltNorth(platform);
    tiltWest(platform);
    tiltSouth(platform);
    tiltEast(platform);
}

function tiltNorth(platform) {
    const rows = platform.length;
    const cols = platform[0].length;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            if (platform[row][col] === ROUNDED_ROCK) {
                let newRow = row;

                while (platform[newRow - 1]?.[col] === EMPTY_SPACE) {
                    newRow--;
                }

                if (newRow !== row) {
                    platform[newRow][col] = ROUNDED_ROCK;
                    platform[row][col] = EMPTY_SPACE;
                }
            }
        }
    }
}

function tiltSouth(platform) {
    const rows = platform.length;
    const cols = platform[0].length;

    for (let col = 0; col < cols; col++) {
        for (let row = rows - 1; row >= 0; row--) {
            if (platform[row][col] === ROUNDED_ROCK) {
                let newRow = row;

                while (platform[newRow + 1]?.[col] === EMPTY_SPACE) {
                    newRow++;
                }

                if (newRow !== row) {
                    platform[newRow][col] = ROUNDED_ROCK;
                    platform[row][col] = EMPTY_SPACE;
                }
            }
        }
    }
}

function tiltWest(platform) {
    const rows = platform.length;
    const cols = platform[0].length;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (platform[row][col] === ROUNDED_ROCK) {
                let newCol = col;

                while (platform[row][newCol - 1] === EMPTY_SPACE) {
                    newCol--;
                }

                if (newCol !== col) {
                    platform[row][newCol] = ROUNDED_ROCK;
                    platform[row][col] = EMPTY_SPACE;
                }
            }
        }
    }
}

function tiltEast(platform) {
    const rows = platform.length;
    const cols = platform[0].length;

    for (let row = 0; row < rows; row++) {
        for (let col = cols - 1; col >= 0; col--) {
            if (platform[row][col] === ROUNDED_ROCK) {
                let newCol = col;

                while (platform[row][newCol + 1] === EMPTY_SPACE) {
                    newCol++;
                }

                if (newCol !== col) {
                    platform[row][newCol] = ROUNDED_ROCK;
                    platform[row][col] = EMPTY_SPACE;
                }
            }
        }
    }
}

function getPlatformLoad(platform) {
    const rows = platform.length;
    const cols = platform[0].length;

    let platformLoad = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (platform[row][col] === ROUNDED_ROCK) {
                platformLoad += rows - row;
            }
        }
    }

    return platformLoad;
}

console.log(solve(input));
```
