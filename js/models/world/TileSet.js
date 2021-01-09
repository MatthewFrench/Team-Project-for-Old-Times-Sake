export class TileSet {
    constructor(tileSetJson) {
        this.name = tileSetJson.name;
        // id, image
        this.tiles = {};
        let pathSplitter = "/Originals/";
        let prefix = "images/";
        for (const tile of tileSetJson.tiles){
            let path = prefix + tile.image.split(pathSplitter)[1];
            let image = new Image();
            // Should track image loading
            // image.onload = function () {};
            image.src = path;
            this.tiles[tile.id] = image;
        }
    }
}