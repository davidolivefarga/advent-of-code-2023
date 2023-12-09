# Day 9: Mirage Maintenance

You can find the puzzles [here](https://adventofcode.com/2023/day/9).

## ✍🏼 Input

In these puzzles we have a report containing several lines, each containing the history of a single value.

A history is represented as a list of integers.

Example:

```js
const input = [
    [0, 3, 6, 9, 12, 15],
    [1, 3, 6, 10, 15, 21],
    [10, 13, 16, 21, 30, 45],
];
```

## 🧩 First puzzle

### Objective

Given the history of a value, we want to extrapolate its next value.

To do that, first of all we need to create a new sequence from the difference at each step in our history. If this sequence only contains zeroes, we're done. Otherwise, we keep repeating the process until we reach a sequence that only contains zeroes.

For example, with the `[0, 3, 6, 9, 12, 15]` history we would have:

```
0   3   6   9  12  15
  3   3   3   3   3
    0   0   0   0
```

To extrapolate the next value, we need to add a new zero at the end of the last sequence and work our way upwards until we reach the original history sequence. That new value in the history sequence will be the extrapolated value.

Following our example, we would have:

```
0   3   6   9  12  15   B
  3   3   3   3   3   A
    0   0   0   0   0
```

This means that `A = 3` and `B = 18`, so our extrapolated value would be `18`.

Find the extrapolated value of each history and calculate their sum.

### Solution

The idea here is to observe what would happen with an abstract history sequence, to see if we can find a pattern.

Suppose we have the history `[a, b, c]`, and we want to find the next value `x`.

We'll have:

```
a         b         c         x
  b - a      c - b      x - c
    c - 2b + a   x - 2c + b
        x - 3c + 3b - a
```

Since we know that at some point we'll reach a row with all zeroes, this means that the last row must only contain a zero. Hence, we know that `x - 3c + 3b - a = 0`, which can be rewritten as `x = 3c - 3b + a`.

The coefficients in the expression we found are well-known, they are the [binomial coefficients](https://en.wikipedia.org/wiki/Binomial_coefficient): `x = (3 1) * c - (3 2) * b + (3 3) * a`. It's no surprise they appear here, because the way we build the rows is very similar to the way we build [Pascal's triangle](https://en.wikipedia.org/wiki/Pascal%27s_triangle), which can be used to calculate the binomial coefficients. The only catch is that in our expression we're alternating signs, as in each row we're computing differences instead of sums.

In general, if our history is `[h_1, ..., h_n]`, the extrapolated value will look like:

```
x = (n 1) * h_n - (n 2) * h_(n-1) + (n 3) * h_(n_2) - ...
```

```js
const input = require("./input");

function solve(report) {
    return report.reduce(
        (sumExtrapolatedValues, history) =>
            sumExtrapolatedValues + getExtrapolatedValue(history),
        0
    );
}

function getExtrapolatedValue(history) {
    let extrapolatedValue = 0;
    let sign = 1;

    for (let i = history.length - 1; i >= 0; i--) {
        extrapolatedValue +=
            sign * binomial(history.length, history.length - i) * history[i];
        sign *= -1;
    }

    return extrapolatedValue;
}

const cachedBinomials = [[1]];

function binomial(n, k) {
    while (n >= cachedBinomials.length) {
        const nextRow = [1];
        const previousRow = cachedBinomials.at(-1);

        for (let i = 1; i < previousRow.length; i++) {
            nextRow.push(previousRow[i - 1] + previousRow[i]);
        }

        nextRow.push(1);

        cachedBinomials.push(nextRow);
    }
    return cachedBinomials[n][k];
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

This time we want to extrapolate the previous value in the history sequence, following a similar process.

To extrapolate the previous value, we need to add a new zero at the start of the last sequence and work our way upwards until we reach the original history sequence. That new value in the history sequence will be the extrapolated value.

Following our previous example, we would have:

```
B   0   3   6   9  12  15
  A   3   3   3   3   3
    0   0   0   0   0
```

This means that `A = 3` and `B = -3`, so our extrapolated value would be `-3`.

### Solution

We can follow the same approach.

Suppose we have the history `[a, b, c]`, and we want to find the previous value `x`.

We'll have:

```
x         a         b         c
  a - x      b - a      c - b
    b - 2a + x   c - 2b + a
        c - 3b + 3a - x
```

Again, the last value must be a zero, so we have `c - 3b + 3a - x = 0`, which can be rewritten as `x = 3a - 3b + c`.

In general, if our history is `[h_1, ..., h_n]`, the extrapolated value will look like:

```
x = (n 1) * h_1 - (n 2) * h_2 + (n 3) * h_3 - ...
```

```js
const input = require("./input");

function solve(report) {
    return report.reduce(
        (sumExtrapolatedValues, history) =>
            sumExtrapolatedValues + getExtrapolatedValue(history),
        0
    );
}

function getExtrapolatedValue(history) {
    let extrapolatedValue = 0;
    let sign = 1;

    for (let i = 0; i < history.length; i++) {
        extrapolatedValue +=
            sign * binomial(history.length, i + 1) * history[i];
        sign *= -1;
    }

    return extrapolatedValue;
}

const cachedBinomials = [[1]];

function binomial(n, k) {
    while (n >= cachedBinomials.length) {
        const nextRow = [1];
        const previousRow = cachedBinomials.at(-1);

        for (let i = 1; i < previousRow.length; i++) {
            nextRow.push(previousRow[i - 1] + previousRow[i]);
        }

        nextRow.push(1);

        cachedBinomials.push(nextRow);
    }
    return cachedBinomials[n][k];
}

console.log(solve(input));
```
