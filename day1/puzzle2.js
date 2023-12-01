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
