const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const [rawWorkflows, rawParts] = rawInput.trim().split("\n\n");

const workflows = {};

rawWorkflows.split("\n").forEach((rawWorkflow) => {
    const [name, rawRules] = rawWorkflow.slice(0, -1).split("{");

    const rules = rawRules.split(",").map((rawRule) => {
        const [condition, destination] = rawRule.split(":");

        return { condition, destination };
    });

    rules[rules.length - 1] = {
        condition: undefined,
        destination: rules[rules.length - 1].condition,
    };

    workflows[name] = rules;
});

const parts = rawParts.split("\n").map((rawPart) => {
    const part = {};

    rawPart
        .slice(1, -1)
        .split(",")
        .forEach((rawElement) => {
            const [element, amount] = rawElement.split("=");

            part[element] = Number(amount);
        });

    return part;
});

module.exports = { workflows, parts };
