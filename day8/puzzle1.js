const input = require("./input");

function solve({ instructions, nodes }) {
    let currentNode = "AAA";
    let stepCount = 0;

    while (currentNode !== "ZZZ") {
        const instructionIndex = stepCount % instructions.length;
        const instruction = instructions[instructionIndex];

        if (instruction === "L") {
            currentNode = nodes[currentNode][0];
        } else {
            currentNode = nodes[currentNode][1];
        }

        stepCount++;
    }

    return stepCount;
}

console.log(solve(input));
