export class World {
    constructor(maps, tileSets) {
        this.maps = maps;
        this.tileSets = tileSets;
    }

    getTileForMap(map, tileId) {
        // Find which tileSet has the tileId
        // Translate the tileId to the
        // tileSet tileId value
        // then return the tile image
        // from the tileSet
        for (const tileSetPair of map.tileSets) {
            let firstGid = tileSetPair.firstGid;
            let tileSetName = tileSetPair.name;
            if (tileId >= firstGid) {
                // It is this tileset
                let tileSet = this.tileSets[tileSetName];
                let translatedTileId = tileId - firstGid;
                return tileSet.tiles[translatedTileId];
            }
        }
        // Error if this ever happens
        console.log("Were unable to find tileset for tileId: " + tileId);
        return null;
    }
}