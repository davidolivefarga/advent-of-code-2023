const input = require("./input");

function solve(races) {
    let result = 1;

    for (let i = 0; i < races[0].length; i++) {
        const time = races[0][i];
        const distance = races[1][i];

        result *= getWaysToBeatDistance(time, distance);
    }

    return result;
}

function getWaysToBeatDistance(time, distance) {
    const discriminant = time * time - 4 * (distance + 1);

    if (discriminant < 0) {
        return 0;
    }

    const minButtonHoldingTimeToWin = Math.ceil(
        (time - Math.sqrt(discriminant)) / 2
    );
    const maxButtonHoldingTimeToWin = Math.floor(
        (time + Math.sqrt(discriminant)) / 2
    );

    if (minButtonHoldingTimeToWin > maxButtonHoldingTimeToWin) {
        return 0;
    }

    return maxButtonHoldingTimeToWin - minButtonHoldingTimeToWin + 1;
}

console.log(solve(input));
