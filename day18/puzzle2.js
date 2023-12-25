const input = require("./input");

const DIRECTIONS = {
    R: [0, 1],
    D: [1, 0],
    L: [0, -1],
    U: [-1, 0],
};

function solve(digInstructions) {
    const {
        verticalEdges,
        horizontalEdges,
        rowsWithVertices,
        colsWithVertices,
    } = getTrenchData(digInstructions);

    let trenchTiles = 0;

    for (let i = 1; i < rowsWithVertices.length; i++) {
        for (let j = 1; j < colsWithVertices.length; j++) {
            const topRow = rowsWithVertices[i - 1];
            const bottomRow = rowsWithVertices[i];
            const leftCol = colsWithVertices[j - 1];
            const rightCol = colsWithVertices[j];

            const innerPoint = [
                (topRow + bottomRow) / 2,
                (leftCol + rightCol) / 2,
            ];

            const verticalEdgesCrossedOnTheLeft = verticalEdges.filter(
                (edge) => {
                    return (
                        edge[0][1] < innerPoint[1] &&
                        edge[0][0] < innerPoint[0] &&
                        edge[1][0] > innerPoint[0]
                    );
                }
            );

            const isRegionInsideTrench =
                verticalEdgesCrossedOnTheLeft.length % 2 === 1;

            if (isRegionInsideTrench) {
                const regionHeight = bottomRow - topRow;
                const regionWidth = rightCol - leftCol;
                const regionArea = regionWidth * regionHeight;

                trenchTiles += regionArea;
            }
        }
    }

    for (const [v1, v2] of verticalEdges) {
        trenchTiles += (v2[0] - v1[0]) / 2;
    }

    for (const [v1, v2] of horizontalEdges) {
        trenchTiles += (v2[1] - v1[1]) / 2;
    }

    return trenchTiles + 1;
}

function getTrenchData(digInstructions) {
    const verticalEdges = [];
    const horizontalEdges = [];

    const rowsWithVerticesSet = new Set();
    const colsWithVerticesSet = new Set();

    let diggerPosition = [0, 0];

    for (const { color } of digInstructions) {
        const amount = parseInt(color.slice(0, -1), 16);
        const direction = DIRECTIONS[Object.keys(DIRECTIONS)[color.at(-1)]];

        const newDiggerPosition = move(diggerPosition, direction, amount);

        if (isVerticalDirection(direction)) {
            let verticalEdge;

            if (diggerPosition[0] < newDiggerPosition[0]) {
                verticalEdge = [diggerPosition, newDiggerPosition];
            } else {
                verticalEdge = [newDiggerPosition, diggerPosition];
            }

            verticalEdges.push(verticalEdge);
        } else {
            let horizontalEdge;

            if (diggerPosition[1] < newDiggerPosition[1]) {
                horizontalEdge = [diggerPosition, newDiggerPosition];
            } else {
                horizontalEdge = [newDiggerPosition, diggerPosition];
            }

            horizontalEdges.push(horizontalEdge);
        }

        rowsWithVerticesSet.add(newDiggerPosition[0]);
        colsWithVerticesSet.add(newDiggerPosition[1]);

        diggerPosition = newDiggerPosition;
    }

    const rowsWithVertices = [...rowsWithVerticesSet.values()];
    const colsWithVertices = [...colsWithVerticesSet.values()];

    rowsWithVertices.sort((r1, r2) => r1 - r2);
    colsWithVertices.sort((c1, c2) => c1 - c2);

    return {
        verticalEdges,
        horizontalEdges,
        rowsWithVertices,
        colsWithVertices,
    };
}

function move(tile, direction, amount) {
    return [tile[0] + amount * direction[0], tile[1] + amount * direction[1]];
}

function isVerticalDirection(direction) {
    return direction[1] === 0;
}

console.log(solve(input));
