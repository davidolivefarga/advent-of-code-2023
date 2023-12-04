# Day 4: Scratchcards

You can find the puzzles [here](https://adventofcode.com/2023/day/4).

## ✍🏼 Input

In these puzzles we have a list of scratchcards, each containing two lists of numbers:

-   `winningNumbers`: the numbers that you need to scratch to win
-   `cardNumbers`: the numbers that have been scratched

Example:

```js
const input = [
    {
        winningNumbers: [41, 48, 83, 86, 17],
        cardNumbers: [83, 86, 6, 31, 17, 9, 48, 53],
    },
    {
        winningNumbers: [13, 32, 20, 16, 61],
        cardNumbers: [61, 30, 68, 82, 17, 32, 24, 19],
    },
];
```

## 🧩 First puzzle

### Objective

The points obtained with card depend on the amount of winning numbers that can be found in the scratched card numbers. The first match makes the card worth one point and each match after the first doubles the point value of that card. In the example input, the first card has four winning numbers, so it is worth 8 points; the second card only has two winning numbers, so it is worth 4 points.

Find how many points can be obtained with all the cards.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const input = require("./input");

function solve(cards) {
    let sumPoints = 0;

    cards.forEach(({ winningNumbers, cardNumbers }) => {
        const winningNumbersSet = new Set(winningNumbers);
        const winningCardNumbers = cardNumbers.filter((num) =>
            winningNumbersSet.has(num)
        );

        if (winningCardNumbers.length) {
            sumPoints += Math.pow(2, winningCardNumbers.length - 1);
        }
    });

    return sumPoints;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

This time, the cards only cause you to win more cards equal to the number of winning numbers you have. Specifically, you win copies of the scratchcards below the winning card equal to the number of matches. In the example input, the first card has four winning numbers, which means that you would get an extra copy of the next four cards (in the example input we only have two cards, but assume there are more).

Find how many cards can be obtained with all the cards.

### Solution

Once you understand the problem is not that hard, you just need to keep track of the amounts of each card in an array. Initially, we only have one of each. Every time we process a new card, we update the array accordingly. If we're in card `x`, the next card is `y` and `x` has one winning number, this means that we need to increase the amount of `y` cards by `x`. Finally, we just need to sum all the amounts.

```js
const input = require("./input");

function solve(cards) {
    const amountOfCards = new Array(cards.length).fill(1);

    cards.forEach(({ winningNumbers, cardNumbers }, i) => {
        const winningNumbersSet = new Set(winningNumbers);
        const winningCardNumbers = cardNumbers.filter((num) =>
            winningNumbersSet.has(num)
        );

        for (let j = 0; j < winningCardNumbers.length; j++) {
            amountOfCards[i + j + 1] += amountOfCards[i];
        }
    });

    const totalCards = amountOfCards.reduce((acc, curr) => acc + curr, 0);

    return totalCards;
}

console.log(solve(input));
```
