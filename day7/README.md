# Day 7: Camel Cards

You can find the puzzles [here](https://adventofcode.com/2023/day/7).

## ✍🏼 Input

In these puzzles we play a card game in which we are dealt a list of 5-card hands, each with a bid:

Example:

```js
const input = [
    { hand: ["3", "2", "T", "3", "K"], bid: 765 },
    { hand: ["T", "5", "5", "J", "5"], bid: 684 },
    { hand: ["K", "K", "6", "7", "7"], bid: 28 },
];
```

## 🧩 First puzzle

### Objective

The objective is to find the total winnngs of the game. To do that, first of all we need to sort the hands by strength. Then, we can calculate the winnings of each card by multiplying its bid by its rank (the weakest hands gets rank 1, the second-weakest hand gets rank 2 and so on). Finally, once we have the winnings of each hand, we can add them all to get the total winnings of the game.

In order to sort the hands, we first check the hand type. From strongest to weakest: five of a kind, four of a kind, full house, three of a kind, two pair, one pair and high card. If two hands have the same type, then we break the tie by comparing the hand cards one by one, from strongest to weakest: `A`, `K`, `Q`, `J`, `T`, `9`, `8`, `7`, `6`, `5`, `4`, `3` and `2`.

### Solution

The problem isn't very hard. The trickiest part is calculating the type of hand, but this can easily be done by counting the frequencies of each symbol, sorting them out and then joining them to form a code that identifies the type.

```js
const input = require("./input");

const CARDS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const HAND_TYPES = ["5", "14", "23", "113", "122", "1112", "11111"];

function solve(game) {
    game.sort(({ hand: h1 }, { hand: h2 }) => compareHands(h1, h2));

    return game.reduce((winnings, { bid }, i) => winnings + bid * (i + 1), 0);
}

function compareHands(hand1, hand2) {
    return compareHandsByType(hand1, hand2) || compareHandsByCard(hand1, hand2);
}

function compareHandsByType(hand1, hand2) {
    const handType1 = getHandType(hand1);
    const handType2 = getHandType(hand2);

    return HAND_TYPES.indexOf(handType2) - HAND_TYPES.indexOf(handType1);
}

function getHandType(hand) {
    const cardFrequencies = {};

    hand.forEach((card) => {
        if (!cardFrequencies[card]) {
            cardFrequencies[card] = 0;
        }

        cardFrequencies[card]++;
    });

    return Object.values(cardFrequencies).sort().join("");
}

function compareHandsByCard(hand1, hand2) {
    for (let i = 0; i < 5; i++) {
        const card1 = hand1[i];
        const card2 = hand2[i];

        const compareValue = CARDS.indexOf(card2) - CARDS.indexOf(card1);

        if (compareValue) {
            return compareValue;
        }
    }
    return 0;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Similar situation as before, but this time the `J` symbol acts as a joker, which act as wildcards that can act like whatever card would make the hand the strongest hand type possible. To balance this, the `J` card is now the weakest card, so from strongest to weakest we would have: `A`, `K`, `Q`, `T`, `9`, `8`, `7`, `6`, `5`, `4`, `3`, `2` and `J`.

### Solution

Very similar to the first puzzle, we just need to adapt the hand type calculation to new rule but we can still use the symbol frequency approach. There's one edge case to take care about though! If we have 5 `J`, this counts as a five of a kind hand type.

```js
const input = require("./input");

const CARDS = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];
const HAND_TYPES = ["5", "14", "23", "113", "122", "1112", "11111"];

function solve(game) {
    game.sort(({ hand: h1 }, { hand: h2 }) => compareHands(h1, h2));

    return game.reduce((winnings, { bid }, i) => winnings + bid * (i + 1), 0);
}

function compareHands(hand1, hand2) {
    return compareHandsByType(hand1, hand2) || compareHandsByCard(hand1, hand2);
}

function compareHandsByType(hand1, hand2) {
    const handType1 = getHandType(hand1);
    const handType2 = getHandType(hand2);

    return HAND_TYPES.indexOf(handType2) - HAND_TYPES.indexOf(handType1);
}

function getHandType(hand) {
    const cardFrequencies = {};

    const cardsWithoutJoker = hand.filter((card) => card !== "J");
    const numJokers = hand.length - cardsWithoutJoker.length;

    if (numJokers === 5) {
        return "5";
    }

    cardsWithoutJoker.forEach((card) => {
        if (!cardFrequencies[card]) {
            cardFrequencies[card] = 0;
        }

        cardFrequencies[card]++;
    });

    const sortedFrequencyValues = Object.values(cardFrequencies).sort();

    sortedFrequencyValues[sortedFrequencyValues.length - 1] += numJokers;

    return sortedFrequencyValues.join("");
}

function compareHandsByCard(hand1, hand2) {
    for (let i = 0; i < 5; i++) {
        const card1 = hand1[i];
        const card2 = hand2[i];

        const compareValue = CARDS.indexOf(card2) - CARDS.indexOf(card1);

        if (compareValue) {
            return compareValue;
        }
    }
    return 0;
}

console.log(solve(input));
```
