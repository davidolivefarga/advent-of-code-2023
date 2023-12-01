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
