const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput.trim().split(/\n/);

const instructions = input[0].split("");

const nodes = [];

for (let i = 2; i < input.length; i++) {
    const [node, leftNode, rightNode] = input[i].match(/[A-Z\d]{3}/g);

    nodes[node] = [leftNode, rightNode];
}

module.exports = { instructions, nodes };
