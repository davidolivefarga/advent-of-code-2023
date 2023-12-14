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
