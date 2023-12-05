const input = require("./input");

function solve(almanac) {
    const { seeds, ...mapsAsObject } = almanac;

    const seedRanges = Array.from({ length: seeds.length / 2 }, (_, i) => [
        seeds[2 * i],
        seeds[2 * i] + seeds[2 * i + 1] - 1,
    ]);

    const seedLocationRanges = Object.values(mapsAsObject)
        // Preemptively sort all maps to facilitate the range
        // conversion logic in the `convert` function.
        .map((map) => map.toSorted((r1, r2) => r1[1] - r2[1]))
        .reduce((ranges, map) => convert(ranges, map), seedRanges);

    return Math.min(...seedLocationRanges.map((range) => range[0]));
}

function convert(ranges, map) {
    const convertedRanges = [];

    ranges.forEach((range) => {
        const [left, right] = range;

        // Exclude all map ranges that do not intersect with the range,
        // as they will have no effect on it.
        const intersectingMapRanges = map.filter(
            ([_, sourceRangeStart, rangeLength]) => {
                const sourceRangeEnd = sourceRangeStart + rangeLength - 1;

                return sourceRangeEnd >= left && sourceRangeStart <= right;
            }
        );

        let currentPosition = left;

        intersectingMapRanges.forEach(
            ([targetRangeStart, sourceRangeStart, rangeLength]) => {
                const sourceRangeEnd = sourceRangeStart + rangeLength - 1;
                const delta = targetRangeStart - sourceRangeStart;

                // If there's a part of the range that is not covered by the
                // map range, add it without transforming it.
                if (currentPosition < sourceRangeStart) {
                    convertedRanges.push([
                        currentPosition,
                        sourceRangeStart - 1,
                    ]);

                    currentPosition = sourceRangeStart;
                }

                const intersectionRangeStart = currentPosition;
                const intersectionRangeEnd = Math.min(right, sourceRangeEnd);

                // Add the intersection between the range and the map range,
                // transforming it according to the map range delta.
                convertedRanges.push([
                    intersectionRangeStart + delta,
                    intersectionRangeEnd + delta,
                ]);

                currentPosition = intersectionRangeEnd + 1;
            }
        );

        // If there's still a part of the range that hasn't been covered,
        // add it without transforming it.
        if (currentPosition <= right) {
            convertedRanges.push([currentPosition, right]);
        }
    });

    return convertedRanges;
}

console.log(solve(input));
