# Day 19: Aplenty

You can find the puzzles [here](https://adventofcode.com/2023/day/19).

## ✍🏼 Input

In these puzzles we have a list of workflows and a list of parts.

Each workflow has a name and a set of rules. Each rule specifies a condition and where to send the part if the condition is true. If the condition is false, we jump the next rule, and so on. The last rule has no condition, so it always applies if reached. There are two special workflows, `A` and `R`. If `A` is reached, the part is accepted; if `R` is reached, the part is rejected.

Each part is composed of four elements, `x`, `m`, `a` and `s`, each of which has a value between 1 and 4000.

Example:

```js
const input = {
    workflows: {
        px: [
            { condition: "a<2006", destination: "qkq" },
            { condition: "m>2090", destination: "A" },
            { condition: undefined, destination: "rfg" },
        ],
        // ...
    },
    parts: [
        { x: 787, m: 2655, a: 1222, s: 2876 },
        // ...
    ],
};
```

## 🧩 First puzzle

### Objective

Each part starts at workflow `in`.

The rating of a part is the sum of its element values.

Find the sum of the ratings of the accepted parts.

### Solution

Straight-forward solution, the only remarkable thing is the usage of `eval` because I was too lazy to manually evaluate the condition myself.

```js
const input = require("./input");

const INITIAL_WORKFLOW_NAME = "in";
const ACCEPTED_WORKFLOW_NAME = "A";
const REJECTED_WORKFLOW_NAME = "R";

function solve({ workflows, parts }) {
    let sumAcceptedPartsRatings = 0;

    parts.forEach((part) => {
        if (isAcceptedPart(part, INITIAL_WORKFLOW_NAME, workflows)) {
            sumAcceptedPartsRatings += getRating(part);
        }
    });

    return sumAcceptedPartsRatings;
}

function isAcceptedPart(part, workflowName, workflows) {
    if (workflowName === ACCEPTED_WORKFLOW_NAME) {
        return true;
    }

    if (workflowName === REJECTED_WORKFLOW_NAME) {
        return false;
    }

    for (const rule of workflows[workflowName]) {
        const { condition, destination } = rule;

        const x = part.x;
        const m = part.m;
        const a = part.a;
        const s = part.s;

        if (!condition || eval(condition)) {
            return isAcceptedPart(part, destination, workflows);
        }
    }
}

function getRating(part) {
    return part.x + part.m + part.a + part.s;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

Remember that each part is composed of four elements, `x`, `m`, `a` and `s`, each of which has a value between 1 and 4000. This means there's a total of 4000^4 distinct combinations of possible parts.

Find the amount of combinations that will be accepted, assuming we start at workflow `in`.

### Solution

The idea is to describe the possible parts as an object where each element is described by a range with its possible values. After we evaluate a rule, we can split this object into two objects: one that describes the possible parts that match the rule and one that doesn't (it's possible for one of these two objects to not exist, because the rule either matches all possible parts or doesn't match any). The first object will be directed to the destination specified by the rule, whereas the second one will jump to the next rule.

Eventually, we'll encounter the `A` and `R` workflows. If `A` is reached, then we count the amount of possible parts described by the object; if `R` is reached, then we ignore that object as we only care about accepted parts.

```js
const input = require("./input");

const INITIAL_WORKFLOW_NAME = "in";
const ACCEPTED_WORKFLOW_NAME = "A";
const REJECTED_WORKFLOW_NAME = "R";

function solve({ workflows }) {
    const possibleParts = {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
    };

    return getAcceptedPartsCount(
        possibleParts,
        INITIAL_WORKFLOW_NAME,
        workflows
    );
}

function getAcceptedPartsCount(possibleParts, workflowName, workflows) {
    if (workflowName === ACCEPTED_WORKFLOW_NAME) {
        let acceptedPartsCount = 1;

        ["x", "m", "a", "s"].forEach((element) => {
            acceptedPartsCount *=
                possibleParts[element][1] - possibleParts[element][0] + 1;
        });

        return acceptedPartsCount;
    }

    if (workflowName === REJECTED_WORKFLOW_NAME) {
        return 0;
    }

    let currentPossibleParts = possibleParts;
    let acceptedPartsCount = 0;

    for (const rule of workflows[workflowName]) {
        const { condition, destination } = rule;

        const { validParts, invalidParts } = splitByCondition(
            currentPossibleParts,
            condition
        );

        if (validParts) {
            acceptedPartsCount += getAcceptedPartsCount(
                validParts,
                destination,
                workflows
            );
        }

        if (!invalidParts) {
            break;
        }

        currentPossibleParts = invalidParts;
    }

    return acceptedPartsCount;
}

function splitByCondition(possibleParts, condition) {
    if (!condition) {
        return {
            validParts: possibleParts,
            invalidParts: undefined,
        };
    }

    const element = condition[0];
    const operation = condition[1];
    const amount = Number(condition.slice(2));

    const left = possibleParts[element][0];
    const right = possibleParts[element][1];

    if (operation === "<") {
        if (amount <= left) {
            return {
                validParts: undefined,
                invalidParts: possibleParts,
            };
        }

        if (amount > right) {
            return {
                validParts: possibleParts,
                invalidParts: undefined,
            };
        }

        return {
            validParts: { ...possibleParts, [element]: [left, amount - 1] },
            invalidParts: { ...possibleParts, [element]: [amount, right] },
        };
    } else {
        if (amount >= right) {
            return {
                validParts: undefined,
                invalidParts: possibleParts,
            };
        }

        if (amount < left) {
            return {
                validParts: possibleParts,
                invalidParts: undefined,
            };
        }

        return {
            validParts: { ...possibleParts, [element]: [amount + 1, right] },
            invalidParts: { ...possibleParts, [element]: [left, amount] },
        };
    }
}

console.log(solve(input));
```
