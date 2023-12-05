# Day 1: Trebuchet?!

You can find the puzzles [here](https://adventofcode.com/2023/day/1).

## ✍🏼 Input

In these puzzles we have a document consisting in several lines of text.

Each line of text can contain the numbers from 1 to 9 and lower-case letters.

Example:

```js
const input = [
    "1abc2",
    "pqr3stu8vwx",
    "treb7uchet",
    "two1nine",
    "abcone2threexyz",
    "xtwone3four",
];
```

## 🧩 First puzzle

### Objective

For each line, find the two-digit number obtained from combining the first digit and the last digit that appear in it. For example, the line `a1b2c3d4e5f` would produce the number `15`.

Calculate the sum of all these numbers.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const input = require("./input");

function solve(lines) {
    let sumValues = 0;

    for (const line of lines) {
        const digits = line.match(/\d/);

        sumValues += Number(digits.at(0)) * 10;
        sumValues += Number(digits.at(-1));
    }

    return sumValues;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Same as the first puzzle, but this time the digits can also be represented as their name (`1` as `one`, `2` as `two`, and so on). For example, the line `7pqrstsixteen` would produce the number `76`.

### Solution

This problem is unexpectedly difficult for the first day!

My immediate idea was to replace the digit names by their number:

```js
line = line.replace("one", "1");
line = line.replace("two", "2");
// ...and so on
```

This would leave us in the same situation as the first puzzle. However, this won't work because the digit names can overlap. For example, consider the string `twoeightwo`. If we start replacing the digit names, we'll end up with `28wo`, which will produce the number `28`. However, `twoeightwo` should produce the number `22`.

Extending the regular expression from the first puzzle to include the digit names won't work either:

```js
const digits = line.match(/\d|one|two|three|four|five|six|seven|eight|nine/);
```

This is because regular expressions consume characters as they find matches. This means that if we apply the previous regular expression to the string `eightwo` we will only get `eight` as a match, because the `t` will be already consumed for the `two` match.

My next idea was to use regular expressions with capturing groups, one to find the first digit match and one to find the last digit match:

```js
const firstDigit = line.match(
    /(\d|one|two|three|four|five|six|seven|eight|nine).*/
)[1];
const lastDigit = line.match(
    /.*(\d|one|two|three|four|five|six|seven|eight|nine)/
)[1];
```

The `.*` is a greedy quantifier that tries to match as many characters as possible. If we put it at the beginning of the regular expression it will match everything before the last digit, leaving the last digit in the capturing group. Similarly, if we put it at the end of the string, it will match everything after the first digit, leaving the first digit in the capturing group. Since we're now interested in the capturing groups, we need to access the second element of the match output.

The two-regex approach works, but I got obsessed with finding a way to get the first and last digit of the string with a singular regular expression. After some research, I learned that [positive lookaheads](https://www.regular-expressions.info/lookaround.html) don't consume characters, so we can use them to find all matches without caring if they overlap or not:

```js
const digits = [
    ...line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g),
].map((match) => match[1]);
```

I'm not sure if that is more performant, but I think it's harder to read and understand. Since I didn't have any performance issues with the two regular expressions approach, I decided to stick with it.

```js
const input = require("./input");

function solve(lines) {
    let sumValues = 0;

    for (const line of lines) {
        const firstDigit = toNumber(
            line.match(/(\d|one|two|three|four|five|six|seven|eight|nine).*/)[1]
        );
        const lastDigit = toNumber(
            line.match(/.*(\d|one|two|three|four|five|six|seven|eight|nine)/)[1]
        );

        sumValues += firstDigit * 10;
        sumValues += lastDigit;
    }

    return sumValues;
}

function toNumber(value) {
    if (value === "one") return 1;
    if (value === "two") return 2;
    if (value === "three") return 3;
    if (value === "four") return 4;
    if (value === "five") return 5;
    if (value === "six") return 6;
    if (value === "seven") return 7;
    if (value === "eight") return 8;
    if (value === "nine") return 9;

    return parseInt(value, 10);
}

console.log(solve(input));
```
