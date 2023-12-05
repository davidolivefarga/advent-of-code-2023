# Day 5: If You Give A Seed A Fertilizer

You can find the puzzles [here](https://adventofcode.com/2023/day/5).

## ✍🏼 Input

In these puzzles we have an alamanac, that contains:

-   A list of `seeds`, represented as positive integers.
-   Several maps that convert one type of thing to another: `seedToSoilMap`, `soilToFertilizerMap`, `fertilizerToWaterMap`, `waterToLightMap`, `lightToTemperatureMap`, `temperatureToHumidityMap`, `humidityToLocationMap`. Each map contains a list of instructions, represented as 3 positive integers.

Example:

```js
const input = {
    seeds: [79, 14, 55, 13],
    seedToSoilMap: [
        [50, 98, 2],
        [52, 50, 48],
    ],
    soilToFertilizerMap: [
        /* ... */
    ],
    fertilizerToWaterMap: [
        /* ... */
    ],
    waterToLightMap: [
        /* ... */
    ],
    lightToTemperatureMap: [
        /* ... */
    ],
    temperatureToHumidityMap: [
        /* ... */
    ],
    humidityToLocationMap: [
        /* ... */
    ],
};
```

## 🧩 First puzzle

### Objective

The three numbers of each instruction in a map indicate how to convert a certain range to another. The first number is the start of the destination range, the second number is the start of the source range, and the third number is the range length. For example, the instruction `[50, 98, 2]` indicates that the range `[98, 99]` will be mapped to the range `[50, 51]`.

When using a map to convert one thing to another, if there's a number that is not covered by any of the ranges in the map instructions, then it remains the same. For example, if a map only has the instruction `[50, 98, 2]`, any number outside the range `[98, 99]` will remain the same.

Using the maps from the input, we can convert seeds to locations.

Find the lowest location amongst all seeds provided in the input.

### Solution

Straight-forward solution, nothing interesting to add.

```js
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
```

## 🧩 Second puzzle

### Objective

Same situation as before, but this time the seeds from the input represent ranges. Each pair of seeds generates a range where the first seed is the start of the range and the second value is the length of the range. For example, if the initial seeds input is `[79, 14, 55, 13]`, this means we have we will have two ranges of seeds: `[79, 79 + 14 - 1]` and `[55, 55 + 13 - 1]`.

Using the maps from the input, we can convert the seeds within these ranges to locations.

Find the lowest location amongst all seed ranges provided in the input.

### Solution

Problems are getting harder! Applying the solution of the first puzzle to each seed in each range will be very slow, because the puzzle input has intentionally picked very large numbers... So we have to think of a better solution.

The idea is that instead of mapping each seed individually, we can map ranges of seeds. To get the idea, imagine that your range of seeds is `[1, 10]`, and the next map has a single instruction that tells you that the range `[1, 5]` will be mapped to the range `[21, 25]`. This means that your range of seeds will be mapped to the ranges `[21, 25]` and `[6, 10]` (which remains unstransformed because it wasn't covered by any map instruction).

Now that we have the general idea, let's see the outline of the solution:

1. Generate the seed ranges from the input.
2. Preemptively sort the input maps (this will be important for the range mapping logic, as you will see later).
3. Starting with the seed ranges, use all maps to start them to other kind of ranges until we have the location ranges.
4. Find the minimum location by grabbing the start of all location ranges and getting the smallest one.

The complicated stuff happens in Step 3, but I added comments in the code to facilitate its comprehension.

Imagine that we have a range `x` that needs to be mapped using a map with several instructions, each represented by a range `y_i`. Some of these ranges might not intersect with `x`, so we can safely discard them as they won't impact the mapping of `x`. Also, since we sorted the `y_i` ranges and they are disjoint (otherwise the problem would be ambiguous), we can iterate through them from left-to-right without worrying about overlaps.

The idea is to divide `x` in sub-ranges, some of which will be within one of the `y_i` ranges and will be transformed accordingly and some of which will not be covered by any `y_i` and will therefore remain untransformed.

Let's grab the first `y_i` interval that intersects `x` (let's call it `y1`) and see all the possible intersection cases to see if we can find a common pattern. Notice that in each of them I put a `^` symbol to keep track of the current position, as we'll be traversing `x` left-to-right.

```
Scenario 1:

[····· y1 ·····]
    [····· x ·····]
    ^

Scenario 2:
        [····· y1 ·····]
    [····· x ·····]
    ^

Scenario 3:

[········· y1 ·········]
    [····· x ·····]
    ^

Scenario 4:

       [·· y1 ··]
    [····· x ·····]
    ^
```

In scenarios 2 and 4 we have a part of `x` that is not covered by `y1`: `[x.start, y1.start - 1]`. This will be one of the sub-ranges that remains untransformed.

Now we can move the current position to `y1.start - 1`, so that our scenarios will look like:

```
Scenario 1:

[····· y1 ·····]
    [····· x ·····]
    ^

Scenario 2:
        [····· y1 ·····]
    [····· x ·····]
        ^

Scenario 3:

[········· y1 ·········]
    [····· x ·····]
    ^

Scenario 4:

       [·· y1 ··]
    [····· x ·····]
       ^
```

Next, in all scenarios we can get the intersection between `x` and `y1`, corresponding to the range `[^, min(x.end, y1.end)]`. This will be another of the sub-ranges, but this time it will get transformed according to the map instructions represented by `y1` (we just need to calculate a delta and move the interval according to it, nothing complicated).

Now we can move the current position accordingly, so that our scenarios will look like:

```
Scenario 1:

[····· y1 ·····]
    [····· x ·····]
                ^

Scenario 2:
        [····· y1 ·····]
    [····· x ·····]
                   ^

Scenario 3:

[········· y1 ·········]
    [····· x ·····]
                   ^

Scenario 4:

       [·· y1 ··]
    [····· x ·····]
                 ^
```

In scenarios 2 and 3 we're done, because we reached the end of `x`. However, in scenarios 1 and 4 we might have other intervals to process, so we would repeat the same thing we did with `y1` but this time with `y2`, keeping the value of `^` to know where we are. This will continue until we have no `y_i` left.

Finally, once there are no `y_i` left, it's possible that there's still a part of `x` that haven't been covered, for example:

```
[····· y1 ·····]   [····· y2 ·····]
    [··············· x ···············]
                                   ^
```

In these cases, we'll have one more sub-range, `[^, x.end]`, that will remain untransformed.

With these ideas in mind, coding the solution is not that hard.

```js
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

        if (currentPosition <= right) {
            convertedRanges.push([currentPosition, right]);
        }
    });

    return convertedRanges;
}

console.log(solve(input));
```
