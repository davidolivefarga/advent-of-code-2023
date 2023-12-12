# Day 12: Hot Springs

You can find the puzzles [here](https://adventofcode.com/2023/day/12).

## ✍🏼 Input

In these puzzles we have a list of records, where each record has:

-   A list of springs, which can be of several types:
    -   `.`: working spring
    -   `#`: damaged spring
    -   `?`: unknown spring (could be working or damaged)
-   The list of sizes of groups of damaged springs that are in the list of springs

Example:

```js
const input = [
    { springs: ["?", "?", "?", ".", "#", "#", "#"], damagedGroups: [1, 1, 3] },
    { springs: ["?", "?", ".", "#", ".", "?", "?"], damagedGroups: [1, 1, 1] },
];
```

## 🧩 First puzzle

### Objective

For each record, find the amount of possible spring arrangements that can satisify the given damaged groups restriction, by changing every `?` to either an `.` or an `#`. Then, find the sum of all possible arrangements across all records.

For example, if our list of springs is `["?", "?", ".", "#", ".", "?", "?"]` and our damage groups restriction is `[1, 1, 1]`, we have four possible arrangements:

```
#..#.#.
#..#..#
.#.#.#.
.#.#..#
```

### Solution

Hardest problem so far. This first puzzle can be brute-forced, but after hitting a wall with the second part I want to refine it until I had something good enough that could solve the second puzzle too.

Initially, I did backtracking while cutting dead branches to speed up the process, but this wasn't good enough. Then, I spend more time than I should trying to find a pattern that I could exploit, but I found nothing. Then, I tried to solve the problem in some mathematical way, using combinatorics, but I also found nothing. Finally, I looked for some hints and I learned that the correct approach was dynamic programming. For some reason, it didn't occur to me that caching sub-problems was the best way to speed up the algorithm, in my mind the record values were very different to each other, so the chance of hitting the same sub-problem was very low... But it turns out there are a lot of repeated sub-problems.

Anyways, with the right approach in mind, it's all about making sure you cut branches as much as possible, which is quite fun! I added comments along the code to explain all the scenarios where can cut a branch or where we need to continue exploring.

```js
const input = require("./input");

const WORKING_SPRING = ".";
const DAMAGED_SPRING = "#";
const UNKNOWN_SPRING = "?";

function solve(records) {
    let sumArrangements = 0;

    for (const record of records) {
        const { springs, damagedGroups } = record;

        sumArrangements += getArrangements(springs, damagedGroups);
    }

    return sumArrangements;
}

const cachedResults = {};

function getArrangements(springs, damagedGroups) {
    const encodedInput = springs.join("") + ";" + damagedGroups.join("");

    // If we already visited this scenario, return the cached result
    if (cachedResults[encodedInput] !== undefined) {
        return cachedResults[encodedInput];
    }

    let result;

    // If we don't have springs left, we will have a valid arrangement
    // if and only if we're also out of groups
    if (springs.length === 0) {
        result = damagedGroups.length === 0 ? 1 : 0;
    }

    // If we have springs left and we're out of groups, we will have a
    // valid arrangement if and only if there are no damaged springs left
    else if (damagedGroups.length === 0) {
        result = springs.every((s) => s !== DAMAGED_SPRING) ? 1 : 0;
    }

    // If we have springs and groups left but we don't have enough
    // damaged/unknown springs to fill the groups, we can stop
    else if (
        springs.filter((s) => s !== WORKING_SPRING).length <
        damagedGroups.reduce((acc, curr) => acc + curr)
    ) {
        result = 0;
    }

    // If we have working springs on the left or on the right, we
    // can remove them because they will not contribute to fill the
    // groups; after that, we can iterate again
    else if ([springs.at(0), springs.at(-1)].includes(WORKING_SPRING)) {
        while (springs.at(0) === WORKING_SPRING) {
            springs.shift();
        }

        while (springs.at(-1) === WORKING_SPRING) {
            springs.pop();
        }

        result = getArrangements(springs, damagedGroups);
    }

    // If we have an unknown spring next, we have two options:
    // - Treat it as a damaged spring
    // - Treat it as a working spring (which can be ignored)
    else if (springs.at(0) === UNKNOWN_SPRING) {
        const asDamagedSpring = [DAMAGED_SPRING, ...springs.slice(1)];
        const asWorkingSpring = springs.slice(1);

        result =
            getArrangements(asDamagedSpring, damagedGroups) +
            getArrangements(asWorkingSpring, damagedGroups);
    }

    // If we have a damaged spring next, it must be part of the
    // next group, so we will try to fill it:
    // - If we succeed, we need to remove the next spring to create
    //   the minimum separation for the next group, but this will
    //   only be possible if the next spring is not a damaged one
    //   (if it is a damaged one, we can stop)
    // - If we fail (because we find a working spring before filling
    //   the group), we can stop
    else {
        const [group, ...groupsLeft] = damagedGroups;
        const groupSprings = springs.slice(0, group);

        if (groupSprings.some((s) => s === WORKING_SPRING)) {
            result = 0;
        } else if (springs.at(group) === DAMAGED_SPRING) {
            result = 0;
        } else {
            const springsLeft = springs.slice(group + 1);

            result = getArrangements(springsLeft, groupsLeft);
        }
    }

    cachedResults[encodedInput] = result;

    return result;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same as before, but this time we unfold the record to have a larger input. To unfold a record, you must replace the list of spring conditions with five copies of itself, separated by a `?`, and replace the list of damaged groups with five copies of itself (flattened as a single list).

For example, if the original record is:

```
.#
1
```

The expanded record is:

```
.#?.#?.#?.#?.#
1,1,1,1,1
```

### Solution

Same solution as before, just modifying the input as explained. It runs pretty fast!

```js
const input = require("./input");

const WORKING_SPRING = ".";
const DAMAGED_SPRING = "#";
const UNKNOWN_SPRING = "?";

function solve(records) {
    let sumArrangements = 0;

    for (const record of records) {
        const { springs, damagedGroups } = record;

        const unfoldedSprings = Array(4)
            .fill(springs.concat(UNKNOWN_SPRING))
            .concat(springs)
            .flat();

        const unfoldedDamagedGroups = Array(5).fill(damagedGroups).flat();

        sumArrangements += getArrangements(
            unfoldedSprings,
            unfoldedDamagedGroups
        );
    }

    return sumArrangements;
}

const cachedResults = {};

function getArrangements(springs, damagedGroups) {
    const encodedInput = springs.join("") + ";" + damagedGroups.join("");

    // If we already visited this scenario, return the cached result
    if (cachedResults[encodedInput] !== undefined) {
        return cachedResults[encodedInput];
    }

    let result;

    // If we don't have springs left, we will have a valid arrangement
    // if and only if we're also out of groups
    if (springs.length === 0) {
        result = damagedGroups.length === 0 ? 1 : 0;
    }

    // If we have springs left and we're out of groups, we will have a
    // valid arrangement if and only if there are no damaged springs left
    else if (damagedGroups.length === 0) {
        result = springs.every((s) => s !== DAMAGED_SPRING) ? 1 : 0;
    }

    // If we have springs and groups left but we don't have enough
    // damaged/unknown springs to fill the groups, we can stop
    else if (
        springs.filter((s) => s !== WORKING_SPRING).length <
        damagedGroups.reduce((acc, curr) => acc + curr)
    ) {
        result = 0;
    }

    // If we have working springs on the left or on the right, we
    // can remove them because they will not contribute to fill the
    // groups; after that, we can iterate again
    else if ([springs.at(0), springs.at(-1)].includes(WORKING_SPRING)) {
        while (springs.at(0) === WORKING_SPRING) {
            springs.shift();
        }

        while (springs.at(-1) === WORKING_SPRING) {
            springs.pop();
        }

        result = getArrangements(springs, damagedGroups);
    }

    // If we have an unknown spring next, we have two options:
    // - Treat it as a damaged spring
    // - Treat it as a working spring (which can be ignored)
    else if (springs.at(0) === UNKNOWN_SPRING) {
        const asDamagedSpring = [DAMAGED_SPRING, ...springs.slice(1)];
        const asWorkingSpring = springs.slice(1);

        result =
            getArrangements(asDamagedSpring, damagedGroups) +
            getArrangements(asWorkingSpring, damagedGroups);
    }

    // If we have a damaged spring next, it must be part of the
    // next group, so we will try to fill it:
    // - If we succeed, we need to remove the next spring to create
    //   the minimum separation for the next group, but this will
    //   only be possible if the next spring is not a damaged one
    //   (if it is a damaged one, we can stop)
    // - If we fail (because we find a working spring before filling
    //   the group), we can stop
    else {
        const [group, ...groupsLeft] = damagedGroups;
        const groupSprings = springs.slice(0, group);

        if (groupSprings.some((s) => s === WORKING_SPRING)) {
            result = 0;
        } else if (springs.at(group) === DAMAGED_SPRING) {
            result = 0;
        } else {
            const springsLeft = springs.slice(group + 1);

            result = getArrangements(springsLeft, groupsLeft);
        }
    }

    cachedResults[encodedInput] = result;

    return result;
}

console.log(solve(input));
```
