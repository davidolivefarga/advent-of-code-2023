const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n/)
    .map((card) => {
        const [, rawNumbers] = card.split(": ");
        const [rawWinningNumbers, rawCardNumbers] = rawNumbers.split(" | ");

        return {
            winningNumbers: rawWinningNumbers.trim().split(/\s+/).map(Number),
            cardNumbers: rawCardNumbers.trim().split(/\s+/).map(Number),
        };
    });

module.exports = input;
