// Names are hard defined since we can't easily ask
// how many map files there are
import {World} from "../models/world/World.js";
import {Map} from "../models/world/Map.js";
import {TileSet} from "../models/world/TileSet.js";

let mapNames = ["Map 1"];
let tileSetNames = ["Basic Tiles", "Characters"];

export async function LoadWorld() {
    let maps = {};
    for (const mapName of mapNames) {
        // Loading code for the JSON
        // Need to make async loading with promises.
        // Need to make image loading work as well
        // Work on later
        // Figure out how to combine multiple promises
        await fetch("map/" + mapName + ".json")
            .then(response => response.json())
            .then(data => {
                maps[mapName] = new Map(mapName, data);
            });
    }
    let tileSets = {};
    for (const tileSetName of tileSetNames) {
        await fetch("map/" + tileSetName + ".json")
            .then(response => response.json())
            .then(data => {
                tileSets[tileSetName] = new TileSet(data);
            });
    }
    return new World(maps, tileSets);
}