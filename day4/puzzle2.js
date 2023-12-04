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
