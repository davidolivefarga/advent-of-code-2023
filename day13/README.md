# Day 13: Point of Incidence

You can find the puzzles [here](https://adventofcode.com/2023/day/13).

## ✍🏼 Input

In these puzzles we have a list of patterns, where each pattern represents a matrix as a list of strings.

The strings can contain two types of symbols: `.` or `#`.

Example:

```js
const input = [
    [
        "#.##..##.",
        "..#.##.#.",
        "##......#",
        "##......#",
        "..#.##.#.",
        "..##..##.",
        "#.#.##.#.",
    ],
    [
        "#...##..#",
        "#....#..#",
        "..##..###",
        "#####.##.",
        "#####.##.",
        "..##..###",
        "#....#..#",
    ],
];
```

## 🧩 First puzzle

### Objective

In each pattern, it is guarateed that we will find a reflection line, either horizontal or vertical. To find the reflection in each pattern, we need to find a perfect reflection across either a horizontal line between two rows or across a vertical line between two columns.

For example, in the following pattern we have a vertical reflection between columns 5 and 6:

```
    \/
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.
    /\
```

It's possible that some rows are columns have nowhere to reflect, but this is allowed. In the above example, column 1 would reflect to column 10, but since there is no column 10 it can be ignored.

Given a pattern, we can calculate its summary as follows:

-   If it has a vertical reflection line, the number of columns on the left of that line
-   If it has a horizontal reflection line, the number of rows above that line multiplied by 100

Find the sum of all summaries.

### Solution

For each pattern:

-   We try to find the first row above the horizontal reflection line, if it exists. To do that, we process row by row starting from the second row (the first row is not possible because there must be some rows above the reflection line). For each row, we see how many rows do we have on top of it (these will be the rows above the reflection line) and how many rows do we have below it, including itself (these will be the rows below the reflection line). The minimum between these two values will let us know how many rows do we need to check to see if there is a reflection. Then, we check them to see if they form a perfect reflection. If they do, we're done.
-   If we didn't find a horizontal reflection line, then we must have a vertical one. The trick here is to rotate the original pattern 90 degrees to the left, so that instead of looking for vertical reflection lines in the original pattern we can look for horizontal reflection lines in the rotated pattern. This way, we can reuse the same algorithm we did to find horizontal reflection lines.

One we have the reflection line of each pattern, we can calculate its summary and use it to calculate the sum of all summaries.

```js
const input = require("./input");

function solve(patterns) {
    let sumSummaries = 0;

    for (const pattern of patterns) {
        sumSummaries += getSummary(pattern);
    }

    return sumSummaries;
}

function getSummary(pattern) {
    const horizontalReflectionRow = getHorizontalReflectionRow(pattern);

    if (horizontalReflectionRow) {
        return horizontalReflectionRow * 100;
    }

    const rotatedPattern = getRotatedPattern(pattern);

    return getHorizontalReflectionRow(rotatedPattern);
}

function getHorizontalReflectionRow(pattern) {
    const rows = pattern.length;

    for (let row = 1; row < rows; row++) {
        if (hasHorizontalReflection(pattern, row)) {
            return row;
        }
    }
}

function hasHorizontalReflection(pattern, row) {
    const rows = pattern.length;
    const numRowsToCheck = Math.min(row, rows - row);

    for (let i = 0; i < numRowsToCheck; i++) {
        if (pattern[row - 1 - i] !== pattern[row + i]) {
            return false;
        }
    }

    return true;
}

function getRotatedPattern(pattern) {
    const rows = pattern.length;
    const cols = pattern[0].length;

    const rotatedPattern = Array(cols).fill("");

    for (let row = rows - 1; row >= 0; row--) {
        for (let col = 0; col < cols; col++) {
            rotatedPattern[col] += pattern[row][col];
        }
    }

    return rotatedPattern;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Given a pattern, we're told that there's one of its tiles whose symbol can be switched to make a new reflection line appear (the original one might no longer be valid after the change). Switching a symbol means changing it from `.` to `#` or from `#` to `.`.

Find the sum of all pattern summaries, but using the new reflection line to calculate them.

### Solution

Very similar to the previous solution, it's just that we need to calculate a lot more.

For each pattern, we start by finding its vertical reflection line and its horizontal reflection line (only one will exist).

Then, for each tile in the pattern, we switch its symbol to obtain a new pattern and:

-   If we find a horizontal reflection line in this new pattern, different from the original one, we're done
-   Else if we find a vertical reflection line, different from the original one, we're done
-   Else, we move on to the next tile

To avoid using too much space for the different patterns, we only change the tile row everytime we need to switch a tile symbol, and then restore it afterwards.

```js
const input = require("./input");

function solve(patterns) {
    let sumSummaries = 0;

    for (const pattern of patterns) {
        sumSummaries += getSummary(pattern);
    }

    return sumSummaries;
}

function getSummary(pattern) {
    const rows = pattern.length;
    const cols = pattern[0].length;

    const rotatedPattern = getRotatedPattern(pattern);

    const horizontalReflectionRow = getHorizontalReflectionRow(pattern);
    const verticalReflectionCol = getHorizontalReflectionRow(rotatedPattern);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const originalRow = pattern[r];

            const newRow =
                originalRow.slice(0, c) +
                (originalRow[c] === "." ? "#" : ".") +
                originalRow.slice(c + 1);

            pattern[r] = newRow;

            const newHorizontalReflectionRow = getHorizontalReflectionRow(
                pattern,
                horizontalReflectionRow
            );

            if (newHorizontalReflectionRow) {
                return newHorizontalReflectionRow * 100;
            }

            const newRotatedPattern = getRotatedPattern(pattern);

            const newVerticalReflectionCol = getHorizontalReflectionRow(
                newRotatedPattern,
                verticalReflectionCol
            );

            if (newVerticalReflectionCol) {
                return newVerticalReflectionCol;
            }

            pattern[r] = originalRow;
        }
    }
}

function getHorizontalReflectionRow(pattern, forbiddenRow) {
    const rows = pattern.length;

    for (let row = 1; row < rows; row++) {
        if (row !== forbiddenRow && hasHorizontalReflection(pattern, row)) {
            return row;
        }
    }
}

function hasHorizontalReflection(pattern, row) {
    const rows = pattern.length;
    const numRowsToCheck = Math.min(row, rows - row);

    for (let i = 0; i < numRowsToCheck; i++) {
        if (pattern[row - 1 - i] !== pattern[row + i]) {
            return false;
        }
    }

    return true;
}

function getRotatedPattern(pattern) {
    const rows = pattern.length;
    const cols = pattern[0].length;

    const rotatedPattern = Array(cols).fill("");

    for (let row = rows - 1; row >= 0; row--) {
        for (let col = 0; col < cols; col++) {
            rotatedPattern[col] += pattern[row][col];
        }
    }

    return rotatedPattern;
}

console.log(solve(input));
```
