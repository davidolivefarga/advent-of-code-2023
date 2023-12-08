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
