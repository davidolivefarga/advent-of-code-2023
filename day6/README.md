# Day 6: Wait For It

You can find the puzzles [here](https://adventofcode.com/2023/day/6).

## ✍🏼 Input

In these puzzles we have a document consisting of two lines, describing toy boat races. The first line lists the time (milliseconds) allowed for each race, and the second line lists the best distance (millimeters) ever recorded in that race. Both times and distances are representes as positive integers.

Example:

```js
const input = [
    [7, 15, 30],
    [9, 40, 200],
];
```

## 🧩 First puzzle

### Objective

The toy boats have a button on top of them. Holding down the button charges the boat, and releasing the button allows the boat to move.

In each race, you can spend part of the allowed race time pushing the button. Pushing the button takes `1` millisecond, and it increases the toy boat speed by `1` millimeter/millisecond. For example, you could push the button `3` times, which would make the toy boat move at `3` millimeters/millisecond once the button is released.

Given a race, you might have different ways to spend the allowed time in order to beat the best recorded distance. For example, imagine you have `7` milliseconds to spend and the current record is `9` millimeters. If you start holding the button for `2`, `3`, `4`, or `5` milliseconds at the start of the race, you will beat the `9` millimeters record (because you will move `10`, `12`, `12` and `10` millimeters respectively).

For each race, find the amount of ways to beat its current record. Then, multiply these values.

### Solution

Let `t` be the time allowed for a race, and let `d` be the distance we want to beat.

If we spend `x` milliseconds pushing the button, then the boat's speed will be `x` millimeters/millisecond. Since we have `t - x` milliseconds left, this means the boat will move a total of `(t - x) * x` milliseconds. We want to beat the current record, so we want to find the minimum and maximum values that satisfy `(t - x) * x < d`.

One way to solve this inequation is to realise that in this situation, the distance moved by the toy boat will always be a positive integer. Since we want to beat the current, record `d`, this means that we must move at least `d + 1` millimeters. Hence, we can calculate the minimum button holding time and the maximum button holding time required to beat the record by finding the solutions to `(t - x) * x = d + 1` (if they exist).

We can rewrite the equation we found to `x^2 - tx + (d + 1) = 0`. We can start by calculating the discriminant, `D = time * time - 4 * (distance + 1)`, and checking its value. If it is negative, then the equation has no solutions, so we know there are exactly `0` ways to beat the record. Otherwise, we can calculate the solutions:

-   `x_min = (t - Math.sqrt(D)) / 2`
-   `x_max = (t + Math.sqrt(D)) / 2`

However, there's a catch! Since `x` must also be a positive integer, we cannot have decimals. This means that the real solutions are:

-   `x_min = Math.ceil((t - Math.sqrt(D)) / 2`)
-   `x_max = Math.floor((t + Math.sqrt(D)) / 2`)

Notice that for `x_min` we used the ceil function, because we already had the minimum, so we need the next positive integer; for `x_max` we used the floor function, because we already had the maximum, so we need the previous positive integer.

There's one more catch! It's possible that we have a single solution for `x`. If that solution is an integer we're good, but if it's a decimal then we won't have any integer solution. In fact, we'll end up in a situation where `x_min > x_max`, which doesn't make sense.

With this out of the way, we can calculate the ways to beat the race by counting the amount of possible `x` values in `[x_min, x_max]`, which is `x_max - x_min + 1`.

```js
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
```

## 🧩 Second puzzle

### Objective

Same rules as before, but this time the list of times represents a single time, and the list of distances represents a single distance. For example, if the list of times is `[7, 15, 30]` and the list of distances is `[9, 40, 200]`, then we have a single race with `71530` as the allowed time and `940200` as the distance to beat.

Find the amount of ways to beat its current record.

### Solution

Same idea as before.

```js
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
```
