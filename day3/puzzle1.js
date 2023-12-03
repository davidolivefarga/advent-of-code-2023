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
