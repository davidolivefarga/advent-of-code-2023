const input = require("./input");

function solve(almanac) {
    const { seeds, ...mapsAsObject } = almanac;
    const maps = Object.values(mapsAsObject);

    const seedLocations = seeds.map((seed) =>
        maps.reduce((value, map) => convert(value, map), seed)
    );

    return Math.min(...seedLocations);
}

function convert(value, map) {
    for (const [targetRangeStart, sourceRangeStart, rangeLength] of map) {
        const sourceRangeEnd = sourceRangeStart + rangeLength - 1;

        if (value >= sourceRangeStart && value <= sourceRangeEnd) {
            return targetRangeStart + value - sourceRangeStart;
        }
    }

    return value;
}

console.log(solve(input));
