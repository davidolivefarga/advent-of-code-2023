const input = require("./input");

function solve(games) {
    let sumCubesPower = 0;

    games.forEach(({ reveals }) => {
        let numRedCubes = 0;
        let numBlueCubes = 0;
        let numGreenCubes = 0;

        reveals.forEach(({ red = 0, blue = 0, green = 0 }) => {
            numRedCubes = Math.max(numRedCubes, red);
            numBlueCubes = Math.max(numBlueCubes, blue);
            numGreenCubes = Math.max(numGreenCubes, green);
        });

        const cubesPower = numRedCubes * numBlueCubes * numGreenCubes;

        sumCubesPower += cubesPower;
    });

    return sumCubesPower;
}

console.log(solve(input));
