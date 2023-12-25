const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split("\n")
    .map((l) => {
        const [direction, rawAmount, rawColor] = l.split(" ");

        return {
            direction,
            amount: Number(rawAmount),
            color: rawColor.slice(2, -1),
        };
    });

module.exports = input;
