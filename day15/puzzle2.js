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
