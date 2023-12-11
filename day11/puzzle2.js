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
