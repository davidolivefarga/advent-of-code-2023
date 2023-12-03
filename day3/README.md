# Day 3: Gear Ratios

You can find the puzzles [here](https://adventofcode.com/2023/day/3).

## ✍🏼 Input

In these puzzles we have an engine schematic, which is a map represented with a list of strings that can contain:

-   Numbers
-   The character `.`
-   Symbols (anything that is not a number or a `.`)

Example:

```js
const input = [
    "467..114..",
    "...*......",
    "..35..633.",
    "......#...",
    "617*......",
    ".....+.58.",
    "..592.....",
    "......755.",
    "...$.*....",
    ".664.598..",
];
```

## 🧩 First puzzle

### Objective

Any number adjacent to a symbol, even diagonally, represents an engine part. In the example input, `467` reprsents an engine part because it's adjacent to a `*` symbol, but `114` doesn't because it's not adjacent to any symbol.

Find the sum of all engine part numbers.

### Solution

The solution has two steps:

-   Find the numbers on each row using a regular expression (this is the reason the input is parsed as a list of strings, instead of parsing it as a matrix, which would the usual data structure to represent this kind of maps).
-   For each number, determine if it represents an engine number by checking its surrounding characters to see if it's adjacent to any symbol.

```js
const input = require("./input");

function solve(engineSchematic) {
    let sumEnginePartNumbers = 0;

    engineSchematic.forEach((row, numRow) => {
        const numMatches = row.matchAll(/\d+/g);

        for (const numMatch of numMatches) {
            const numAsString = numMatch[0];
            const numColStart = numMatch.index;
            const numColEnd = numColStart + numAsString.length - 1;

            if (isEnginePart(numRow, numColStart, numColEnd, engineSchematic)) {
                sumEnginePartNumbers += Number(numAsString);
            }
        }
    });

    return sumEnginePartNumbers;
}

function isEnginePart(row, colStart, colEnd, engineSchematic) {
    for (j = colStart - 1; j <= colEnd + 1; j++) {
        if (
            isSymbol(engineSchematic[row - 1]?.[j]) ||
            isSymbol(engineSchematic[row + 1]?.[j])
        ) {
            return true;
        }
    }

    if (
        isSymbol(engineSchematic[row][colStart - 1]) ||
        isSymbol(engineSchematic[row][colEnd + 1])
    ) {
        return true;
    }

    return false;
}

function isSymbol(char) {
    return char && !/[0-9]/.test(char) && char !== ".";
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

A gear is any `*` symbol that is adjacent, even diagonally, to exactly two part numbers. In the example input, the top `*` is a gear because it's adjacent to `467` and `35`, but the middle `*` isn't because it's only adjacent to `633`. The ratio of a gear is the result of multiplying the two part numbers that are adjacent to it.

Find the sum of gear ratios.

### Solution

The solution has two steps:

-   Find the position of each number and store this data by rows, so that we can know which numbers are in each row and their positions.
-   For each `*` in the map, find which numbers are adjacent to it using the data structure from the previous step. Since we're looking for adjacent numbers, we only need to check the current row, the one above it and the one below it (if they exist).

```js
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
```
