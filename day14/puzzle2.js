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
