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

The complicated stuff happens in Step 3, but I added comments to facilitate its comprehension.

Let's see an example.

Imagine that we have a range `x` that needs to be mapped using a map with four instructions, each representing a range: `y1`, `y2`, `y3` and `y4`. To avoid ambiguities, the problem guaratees that the `y_i` ranges are disjoint. Also, they are sorted because we sorted them in Step 2.

Hence, we might have a situation like this one:

```
[· range y1 ·]     [· range y2 ·]     [· range y3 ·]     [· range y4 ·]

                [·············· range x ··············]
```

The first step is to get rid of the ranges that do not intersect `x`, as they will have no impact on its mapping. Also, let's keep track of the current position (indicated as a `^` in the diagrams) and initialise it to `x.start`:

```
   [· range y2 ·]     [· range y3 ·]

[·············· range x ··············]
^
```

Now, let's focus on range `x` and range `y2`. The left part of `x` is not covered by `y2`, so this means that it will remain untransformed. Hence, we already have one mapped range, `[x.start, y2.start - 1]`, and we can advance the current position to `y2.start`.

```
   [· range y2 ·]     [· range y3 ·]

[·············· range x ··············]
   ^
```

Then, we have another mapped range, the intersection between `x` and `y2`: `[y2.start + delta, y2.end + delta]` (`delta` is calculated based on the instruction represented by `y2`.). This means that we can advance the current position to `y2.end + 1`.

```
   [· range y2 ·]     [· range y3 ·]

[·············· range x ··············]
                 ^
```

And now we repeat the algorithm, but this time focusing on range `x` and range `y3`, using the current position to know what has already been mapped. This will give us two new ranges: `[y2.end + 1, y3.start - 1]` and `[y3.start + delta, y3.end + delta]`.

Once we've gone through all `y_i` ranges, it's possible that we still have a part of `x` that hasn't been mapped yet:

```
   [· range y2 ·]     [· range y3 ·]

[·············· range x ··············]
                                    ^
```

Hence, we have one final range that will remain untransformed, `[y3.end + 1, x.end]`.

Of course, in this example we haven't covered all edge cases. For example, it's possible that `x` is fully covered by the `y_i`, but this can easily be covered by checking the relative position between the ranges.

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
