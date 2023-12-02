# Day 2: Cube Conundrum

You can find the puzzles [here](https://adventofcode.com/2023/day/2).

## ✍🏼 Input

In these puzzles, we play a game consisting on hiding an unknown number of colored cubes (which can be red, blue or green) inside a bag. Then, on each turn, we grab some cubes from the bag, reveal them, and then put them back in the bag.

The input contains a list of games, where each game contains:

-   An `id`, which represents the game as a positive integer
-   A list of `reveals`, where each reveal includes the number of revealed cubes of each color

Example:

```js
const input = [
    {
        id: 1,
        reveals: [
            { blue: 3, red: 4 },
            { blue: 6, red: 1, green: 2 },
            { green: 2 },
        ],
    },
    {
        id: 2,
        reveals: [
            { blue: 1, green: 2 },
            { red: 1, blue: 4, green: 3 },
            { blue: 1, green: 1 },
        ],
    },
];
```

## 🧩 First puzzle

### Objective

Find the sum of the IDs of the games that would have been possible if the bag contained `12` red cubes, `13` green cubes, and `14` blue cubes.

### Solution

Straight-forward solution, nothing interesting to add.

```js
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
```

## 🧩 Second puzzle

### Objective

For each game, we can figure out the minimum number of cubes of each color that must be in the bag for the game to be possible. The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together.

Find the sum of the cubes power of each game.

### Solution

Straight-forward solution, nothing interesting to add.

```js
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
```
