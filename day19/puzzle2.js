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
