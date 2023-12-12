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
