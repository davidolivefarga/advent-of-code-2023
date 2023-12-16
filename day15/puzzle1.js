const input = require("./input");

function solve(sequence) {
    let sumValues = 0;

    for (const step of sequence) {
        sumValues += getValue(step);
    }

    return sumValues;
}

function getValue(step) {
    let value = 0;

    for (let i = 0; i < step.length; i++) {
        const asciiCode = step.charCodeAt(i);

        value += asciiCode;
        value *= 17;
        value %= 256;
    }

    return value;
}

console.log(solve(input));
