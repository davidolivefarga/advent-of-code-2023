const input = require("./input");

function solve(races) {
    const time = Number(races[0].join(""));
    const distance = Number(races[1].join(""));

    return getWaysToBeatDistance(time, distance);
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
