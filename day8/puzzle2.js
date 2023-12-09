const input = require("./input");

function solve({ instructions, nodes }) {
    const initialNodes = Object.keys(nodes).filter((n) => n.endsWith("A"));

    const stepsToReachEndNode = initialNodes.map((n) =>
        getStepsToReachEndNode(n, instructions, nodes)
    );

    return stepsToReachEndNode.reduce(lcm);
}

function getStepsToReachEndNode(node, instructions, nodes) {
    let currentNode = node;
    let stepCount = 0;

    while (!currentNode.endsWith("Z")) {
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

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function gcd(a, b) {
    if (b === 0) {
        return a;
    }

    return gcd(b, a % b);
}

console.log(solve(input));
