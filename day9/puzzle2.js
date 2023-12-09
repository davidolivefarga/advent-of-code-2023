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
