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
