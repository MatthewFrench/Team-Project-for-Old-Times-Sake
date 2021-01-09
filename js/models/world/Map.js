export class Map {
    constructor(name, mapJson) {
        this.name = name;
        this.height = mapJson.height;
        this.width = mapJson.width;
        // We don't pull in the images at this size but we need
        // to know the size to properly scale objects that are
        // recorded as pixel values instead of tile values
        this.tileWidth = mapJson.tilewidth;
        this.tileHeight = mapJson.tileheight;

        // [{id, name}]
        this.tileSets = [];
        for (const tileSet of mapJson.tilesets) {
            // This helps identify corresponding tiles in the map
            let firstGid = tileSet.firstgid;
            let nameSplit = tileSet.source.split("\/");
            let name = nameSplit[nameSplit.length - 1].split(".tsx")[0];
            this.tileSets.push({firstGid: firstGid, name: name});
        }

        // Load layers, tiles in layers
        this.tileLayers = [];
        // Collision map
        this.collisionLayer = null;
        // These are specific enemy existence points
        this.staticEnemies = {};
        // These are enemy spawn zones
        this.enemySpawnAreas = [];
        // These are special properties, player location, shop locations
        this.properties = [];
        this.tileProperties = {};
        for (const layer of mapJson.layers) {
            if (layer.type === "tilelayer" && layer.name !== "Collision Layer") {
                this.tileLayers.push(new TileLayer(layer));
            } else if (layer.type === "tilelayer" && layer.name === "Collision Layer") {
                this.collisionLayer = new CollisionLayer(layer);
            } else if (layer.type === "objectgroup" && layer.name === "Enemy Layer") {
                for (const object of layer.objects) {
                    let enemy = new StaticEnemy(object, this.tileWidth, this.tileHeight)
                    if (!(enemy.x in this.staticEnemies)) {
                        this.staticEnemies[enemy.x] = {};
                    }
                    if (!(enemy.y in this.staticEnemies[enemy.x])) {
                        this.staticEnemies[enemy.x][enemy.y] = []
                    }
                    this.staticEnemies[enemy.x][enemy.y].push(enemy);
                }
            } else if (layer.type === "objectgroup" && layer.name === "Enemy Spawn Layer") {

            } else if (layer.type === "objectgroup" && layer.name === "Properties Layer") {
                for (const object of layer.objects) {
                    let property = new Property(object, this.tileWidth, this.tileHeight);
                    this.properties.push(property);
                    // Now assign the properties to the tiles
                    for (let x = property.startX; x <= property.endX; x++) {
                        if (!(x in this.tileProperties)) {
                            this.tileProperties[x] = {};
                        }
                        for (let y = property.startY; y <= property.endY; y++) {
                            if (!(y in this.tileProperties[x])) {
                                this.tileProperties[x][y] = []
                            }
                            this.tileProperties[x][y].push(property);
                        }
                    }
                }
            } else {
                console.log("Unknown layer: " + layer.name);
            }
        }
    }

    getStaticEnemiesByTile(x, y) {
        if (!(x in this.staticEnemies)) {
            return [];
        }
        if (!(y in this.staticEnemies[x])) {
            return [];
        }
        return this.staticEnemies[x][y];
    }

    getPropertiesByTile(x, y) {
        if (!(x in this.tileProperties)) {
            return [];
        }
        if (!(y in this.tileProperties[x])) {
            return [];
        }
        return this.tileProperties[x][y];
    }

    getPropertiesByName(propertyName) {
        let properties = [];
        for (const property of this.properties) {
            if (property.name === propertyName) {
                properties.push(property);
            }
        }
        return properties;
    }

    isCollisionTile(x, y) {
        if (x in this.collisionLayer.tiles) {
            if (this.collisionLayer.tiles[x][y]) {
                return true;
            }
        }
        return false;
    }
}

class StaticEnemy {
    constructor(object, tileWidth, tileHeight) {
        // Set enemy tile x/y
        this.x = Math.round(object.x / tileWidth);
        this.y = Math.round(object.y / tileHeight);
        this.stringId = object.name;
        this.attributes = {};
        let properties = object.properties;
        if (properties !== undefined) {
            for (const property of properties) {
                this.attributes[property.name] = property.value;
            }
        }
    }
}

class Property {
    constructor(object, tileWidth, tileHeight) {
        let properties = object.properties;
        // Properties can span multiple tiles
        this.startX = Math.round(object.x / tileWidth);
        this.startY = Math.round(object.y / tileHeight);
        this.endX = Math.round(object.width / tileWidth) + this.startX - 1;
        this.endY = Math.round(object.height / tileHeight) + this.startY - 1;
        // All properties will have a name under "property"
        // other properties are considered attributes
        this.attributes = {};
        for (const property of properties) {
            if (property.name === "property") {
                this.name = property.value;
            } else {
                this.attributes[property.name] = property.value;
            }
        }
    }
}

class TileLayer {
    constructor(layer) {
        this.name = layer.name;
        this.minX = layer.startx;
        this.minY = layer.starty;
        this.maxX = layer.startx + layer.width;
        this.maxY = layer.starty + layer.height;
        // [x][y] = id
        this.tiles = {};
        for (const chunk of layer.chunks) {
            let chunkStartingX = chunk.x;
            let chunkStartingY = chunk.y;
            let chunkWidth = chunk.width;
            let x = 0;
            let y = 0;
            for (const tileId of chunk.data) {
                // tileId is 6 for collision
                // other tileIds may exist in the future for
                // special cases
                if (tileId > 0) {
                    this.putTile(x + chunkStartingX, y + chunkStartingY, tileId)
                }
                x += 1;
                if (x >= chunkWidth) {
                    x -= chunkWidth;
                    y += 1;
                }
            }
        }
    }

    putTile(x, y, id) {
        if (!(x in this.tiles)) {
            this.tiles[x] = {};
        }
        this.tiles[x][y] = id;
    }
}

class CollisionLayer {
    constructor(layer) {
        this.name = layer.name;
        this.minX = layer.startx;
        this.minY = layer.starty;
        this.maxX = layer.startx + layer.width;
        this.maxY = layer.starty + layer.height;
        // [x][y] = boolean
        this.tiles = {};
        for (const chunk of layer.chunks) {
            let chunkStartingX = chunk.x;
            let chunkStartingY = chunk.y;
            let chunkWidth = chunk.width;
            let x = 0;
            let y = 0;
            for (const tileId of chunk.data) {
                if (tileId > 0) {
                    this.putCollision(x + chunkStartingX, y + chunkStartingY, tileId);
                }
                x += 1;
                if (x >= chunkWidth) {
                    x -= chunkWidth;
                    y += 1;
                }
            }
        }
    }

    putCollision(x, y) {
        if (!(x in this.tiles)) {
            this.tiles[x] = {};
        }
        this.tiles[x][y] = true;
    }
}