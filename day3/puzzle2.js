const input = require("./input");

function solve(engineSchematic) {
    let sumGearRatios = 0;

    const numsByRow = getNumsByRow(engineSchematic);

    const rows = engineSchematic.length;
    const cols = engineSchematic[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (engineSchematic[i][j] === "*") {
                const adjacentNumbers = getAdjacentNumbers(i, j, numsByRow);

                if (adjacentNumbers.length === 2) {
                    const gearRatio = adjacentNumbers[0] * adjacentNumbers[1];

                    sumGearRatios += gearRatio;
                }
            }
        }
    }

    return sumGearRatios;
}

function getNumsByRow(engineSchematic) {
    const numsByRow = [];

    engineSchematic.forEach((row, i) => {
        const numMatches = [...row.matchAll(/\d+/g)];
        const numsInRow = [];

        for (const numMatch of numMatches) {
            const numAsString = numMatch[0];
            const numColStart = numMatch.index;
            const numColEnd = numColStart + numAsString.length - 1;

            numsInRow.push({
                num: Number(numAsString),
                colStart: numColStart,
                colEnd: numColEnd,
            });
        }

        numsByRow[i] = numsInRow;
    });

    return numsByRow;
}

function getAdjacentNumbers(i, j, numsByRow) {
    const adjacentNumbers = [];

    for (let row = i - 1; row <= i + 1; row++) {
        numsByRow[row]?.forEach(({ num, colStart, colEnd }) => {
            for (let col = colStart; col <= colEnd; col++) {
                if (arePositionsAdjacent(i, j, row, col)) {
                    adjacentNumbers.push(num);
                    break;
                }
            }
        });
    }

    return adjacentNumbers;
}

function arePositionsAdjacent(row1, col1, row2, col2) {
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
}

console.log(solve(input));
