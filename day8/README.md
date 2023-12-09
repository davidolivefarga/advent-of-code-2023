# Day 8: Haunted Wasteland

You can find the puzzles [here](https://adventofcode.com/2023/day/8).

## ✍🏼 Input

In these puzzles we have two inputs:

-   A list of instructions, which can be either `L` (left) or `R` (right)
-   A map of nodes, where the key is the node name and the value is a list telling which node is at its left and which node is at its right

Example:

```js
const input = {
    instructions: ["R", "L"],
    nodes: {
        AAA: ["BBB", "CCC"],
        BBB: ["DDD", "EEE"],
        CCC: ["ZZZ", "GGG"],
        DDD: ["DDD", "DDD"],
        EEE: ["EEE", "EEE"],
        GGG: ["GGG", "GGG"],
        ZZZ: ["ZZZ", "ZZZ"],
    },
};
```

## 🧩 First puzzle

### Objective

Starting at `AAA`, we want to find the minimum amount of steps it takes to reach `ZZZ`. Each step, we'll pick the next instruction and using the nodes map we'll be able to know which ones comes next. If we run out of instructions, we repeat the whole list of instructions from the beginning.

### Solution

Straight-forward solution, nothing interesting to add.

```js
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
```

## 🧩 Second puzzle

### Objective

Same situation as before, but this time we have several starting nodes (those ending with `A`) and several ending nodes (those ending with `Z`). This time we want to find the minimum amount of steps it takes for all of the starting nodes to end up in an ending node.

### Solution

Very disappointed with this problem, because the intended solution relies on a couple assumptions that are not true in general:

-   Each starting node will only reach an end node
-   The amount of steps it takes for a starting node to reach its end node is the same amount of steps it takes for the end node to reach itself

With these two assumptions the problem is quite easy, we just need to get the amount of steps it takes to reach the end node from every starting node and calculate the LCM (least common multiplier) of all these values. Without these assumptions the problem becomes much more complicated, and would probably require using the Chinese Reminder Theorem to solve a bunch of congruences.

```js
const input = require("./input");

function solve({ instructions, nodes }) {
    const initialNodes = Object.keys(nodes).filter((n) => n.endsWith("A"));

    const stepsToReachEndNode = initialNodes.map((n) =>
        getStepsToReachEndNode(n, instructions, nodes)
    );

    return stepsToReachEndNode.reduce(hcf);
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

function hcf(a, b) {
    return (a * b) / gcd(a, b);
}

function gcd(a, b) {
    if (b === 0) {
        return a;
    }

    return gcd(b, a % b);
}

console.log(solve(input));
```
