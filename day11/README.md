# Day 11: Cosmic Expansion

You can find the puzzles [here](https://adventofcode.com/2023/day/11).

## ✍🏼 Input

In these puzzles we have a map describing a part of the universe.

The map can contain two types of tiles:

-   `#`: galaxy
-   `.`: empty space

Example:

```js
const input = [
    [".", ".", ".", "#", ".", "."],
    [".", ".", ".", ".", ".", "."],
    ["#", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "#"],
    [".", "#", ".", ".", ".", "."],
];
```

## 🧩 First puzzle

### Objective

The objective is to find the sum of the lengths of the shortest path between every pair of galaxies. To find the shortest path between two galaxies we can use only steps that move up, down, left, or right exactly one `.` or `#` at a time (the shortest path between two galaxies is allowed to pass through another galaxy).

However, there's a catch! Due to something involving gravitational effects, only some space expands. In fact, the result is that any rows or columns that contain no galaxies should all actually be twice as big.

### Solution

Given two positions `[r1, c1]` and `[r2, c2]`, the distance between them is the distance between rows plus the distance between columns. Hence, we just need to increase the row distance by one for every empty row between `[r1, r2]` (or `[r2, r1]`, depending on the values) and the column distance by one for every empty column between `[c1, c2]` (or `[c2, c1]`, depending on the values).

```js
const input = require("./input");

function solve(map) {
    const rows = map.length;
    const cols = map[0].length;

    const rowsWithGalaxies = new Array(rows).fill(false);
    const colsWithGalaxies = new Array(cols).fill(false);
    const galaxies = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (map[i][j] === "#") {
                rowsWithGalaxies[i] = true;
                colsWithGalaxies[j] = true;
                galaxies.push([i, j]);
            }
        }
    }

    let totalDistanceBetweenGalaxies = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const [r1, c1] = galaxies[i];
            const [r2, c2] = galaxies[j];

            let distanceBetweenGalaxies = Math.abs(r1 - r2) + Math.abs(c1 - c2);

            const minRow = Math.min(r1, r2);
            const maxRow = Math.max(r1, r2);
            const minCol = Math.min(c1, c2);
            const maxCol = Math.max(c1, c2);

            for (let r = minRow + 1; r < maxRow; r++) {
                if (!rowsWithGalaxies[r]) {
                    distanceBetweenGalaxies++;
                }
            }

            for (let c = minCol + 1; c < maxCol; c++) {
                if (!colsWithGalaxies[c]) {
                    distanceBetweenGalaxies++;
                }
            }

            totalDistanceBetweenGalaxies += distanceBetweenGalaxies;
        }
    }

    return totalDistanceBetweenGalaxies;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same as before, but this time any rows or columns that contain no galaxies should be one milion times as big.

### Solution

Same solution as before, but this time instead of adding one unit of distance for empty row/column, we need to add one milion minus one units of distance (because we're adding one milion minus one extra rows/columns).

```js
const input = require("./input");

function solve(map) {
    const rows = map.length;
    const cols = map[0].length;

    const rowsWithGalaxies = new Array(rows).fill(false);
    const colsWithGalaxies = new Array(cols).fill(false);
    const galaxies = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (map[i][j] === "#") {
                rowsWithGalaxies[i] = true;
                colsWithGalaxies[j] = true;
                galaxies.push([i, j]);
            }
        }
    }

    let totalDistanceBetweenGalaxies = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const [r1, c1] = galaxies[i];
            const [r2, c2] = galaxies[j];

            let distanceBetweenGalaxies = Math.abs(r1 - r2) + Math.abs(c1 - c2);

            const minRow = Math.min(r1, r2);
            const maxRow = Math.max(r1, r2);
            const minCol = Math.min(c1, c2);
            const maxCol = Math.max(c1, c2);

            for (let r = minRow + 1; r < maxRow; r++) {
                if (!rowsWithGalaxies[r]) {
                    distanceBetweenGalaxies += 1000000 - 1;
                }
            }

            for (let c = minCol + 1; c < maxCol; c++) {
                if (!colsWithGalaxies[c]) {
                    distanceBetweenGalaxies += 1000000 - 1;
                }
            }

            totalDistanceBetweenGalaxies += distanceBetweenGalaxies;
        }
    }

    return totalDistanceBetweenGalaxies;
}

console.log(solve(input));
```
