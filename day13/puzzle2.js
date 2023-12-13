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
