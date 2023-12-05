const fs = require("fs");
const path = require("path");

const rawInputPath = path.join(__dirname, "input.txt");
const rawInput = fs.readFileSync(rawInputPath, "utf8");

const input = rawInput.trim().split(/\n\n/);

const seeds = input[0].match(/\d+/g).map(Number);

function parseMap(rawMap) {
    return rawMap
        .split(/\n/)
        .slice(1)
        .map((line) => line.split(" ").map(Number));
}

const seedToSoilMap = parseMap(input[1]);
const soilToFertilizerMap = parseMap(input[2]);
const fertilizerToWaterMap = parseMap(input[3]);
const waterToLightMap = parseMap(input[4]);
const lightToTemperatureMap = parseMap(input[5]);
const temperatureToHumidityMap = parseMap(input[6]);
const humidityToLocationMap = parseMap(input[7]);

module.exports = {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
};
