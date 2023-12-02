const input = require("./input");

const NUM_RED_CUBES = 12;
const NUM_GREEN_CUBES = 13;
const NUM_BLUE_CUBES = 14;

function solve(games) {
    let sumValidGameIds = 0;

    games.forEach(({ id, reveals }) => {
        if (
            reveals.every(
                ({ red = 0, blue = 0, green = 0 }) =>
                    red <= NUM_RED_CUBES &&
                    blue <= NUM_BLUE_CUBES &&
                    green <= NUM_GREEN_CUBES
            )
        ) {
            sumValidGameIds += id;
        }
    });

    return sumValidGameIds;
}

console.log(solve(input));
