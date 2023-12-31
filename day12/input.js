const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n/)
    .map((line) => {
        const [rawSprings, rawDamagedGroups] = line.split(" ");

        const springs = rawSprings.split("");
        const damagedGroups = rawDamagedGroups.split(",").map(Number);

        return { springs, damagedGroups };
    });

module.exports = input;
