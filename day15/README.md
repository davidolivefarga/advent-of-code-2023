# Day 15: Lens Library

You can find the puzzles [here](https://adventofcode.com/2023/day/15).

## ✍🏼 Input

In these puzzles we have a sequence of steps represented as strings.

Example:

```js
const input = [
    "rn=1",
    "cm-",
    "qp=3",
    "cm=2",
    "qp-",
    "pc=4",
    "ot=9",
    "ab=5",
    "pc-",
    "pc=6",
    "ot=7",
];
```

## 🧩 First puzzle

### Objective

Given a step in the sequence, we can calculate its value applying the HASH algorithm, which consist on:

-   Initialise the value at 0
-   For each character in the step:
    -   Get its ASCII code
    -   Increase the value by the ASCII code
    -   Set the value to itself multiplied by 17
    -   Set the value to the reminder of dividing itself by 256

### Solution

Straight-forward solution, nothing interesting to add.

```js
const input = require("./input");

function solve(sequence) {
    let sumValues = 0;

    for (const step of sequence) {
        sumValues += getValue(step);
    }

    return sumValues;
}

function getValue(step) {
    let value = 0;

    for (let i = 0; i < step.length; i++) {
        const asciiCode = step.charCodeAt(i);

        value += asciiCode;
        value *= 17;
        value %= 256;
    }

    return value;
}

console.log(solve(input));
```

## 🧩 Second puzzle

### Objective

This time, we have 256 boxes that can contain several lenses.

To know how the boxes are filled, we need to process each step in the sequence. Each step will start with the label of the lens followed by an operation. Applying the HASH algorithm to the lens label, we can find which box we're targeting.

There are two types of operations:

-   If the step has a `-`, we will remove the lens from the box. If the lens is not in the box, we'll do nothing.
-   If the step has a `=`, the operation will be followed by another value, the lens focal length. We will add the lens to the box, always adding it behind any lenses that were already in the box. If the box already contained that lens, we'll replace it, so that its focal length might change.

Once the sequence has been processed an all boxed have been filled with lenses, we can calculate the focusing power of each lens by multiplying three values:

-   The box number where the lens is located
-   The lens position in the box
-   The focal length of the lens

The focusing power of the boxes is the sum of the focusing power of each lens in each box.

Find the focusing power of the boxes.

### Solution

Straight-forward solution, nothing interesting to add.

```js
const input = require("./input");

function solve(sequence) {
    const boxContents = Array.from({ length: 256 }, () => []);

    for (const step of sequence) {
        if (step.at(-1) === "-") {
            const lensLabel = step.slice(0, -1);
            const box = getBox(lensLabel);

            boxContents[box] = boxContents[box].filter(
                ({ label }) => label !== lensLabel
            );
        } else {
            const [lensLabel, lensFocalLengthAsString] = step.split("=");
            const lensFocalLength = Number(lensFocalLengthAsString);
            const box = getBox(lensLabel);

            const lens = boxContents[box].find(
                ({ label }) => label === lensLabel
            );

            if (lens) {
                lens.focalLength = lensFocalLength;
            } else {
                boxContents[box].push({
                    label: lensLabel,
                    focalLength: lensFocalLength,
                });
            }
        }
    }

    return getFocusingPower(boxContents);
}

function getBox(lensLabel) {
    let box = 0;

    for (let i = 0; i < lensLabel.length; i++) {
        const asciiCode = lensLabel.charCodeAt(i);

        box += asciiCode;
        box *= 17;
        box %= 256;
    }

    return box;
}

function getFocusingPower(boxContents) {
    let focusingPower = 0;

    boxContents.forEach((boxContent, i) => {
        boxContent.forEach((lens, j) => {
            focusingPower += (i + 1) * (j + 1) * lens.focalLength;
        });
    });

    return focusingPower;
}

console.log(solve(input));
```
