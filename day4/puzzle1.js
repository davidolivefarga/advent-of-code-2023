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
