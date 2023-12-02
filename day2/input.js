const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput
    .trim()
    .split(/\n/)
    .map((game, i) => {
        const [rawId, rawReveals] = game.split(": ");

        const id = Number(rawId.replace("Game ", ""));
        const reveals = rawReveals.split("; ").map((rawReveal) => {
            const reveal = {};

            rawReveal.split(", ").forEach((rawCubes) => {
                const [cubes, cubesColor] = rawCubes.split(" ");

                reveal[cubesColor] = Number(cubes);
            });

            return reveal;
        });

        return { id, reveals };
    });

module.exports = input;
