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
