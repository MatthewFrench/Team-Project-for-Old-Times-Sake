import {AppendExperience} from "../models/LevelUpData.js";
import {ShowArmorShop} from "../models/ArmorData.js";
import {ShowWeaponShop} from "../models/WeaponData.js";
import {CREATURE_BABY_CHICKEN, CREATURES, GetCreatureDataByStringId} from "../models/CreatureData.js";
import {Enemy} from "../models/Enemy.js";

const TILE_DISPLAY_SIZE = 32;
const MAP_TILE_WIDTH = 10;
const MAP_TILE_HEIGHT = 10;
const MOVE_DELAY_SECONDS = 0.15;

// Todo, add smooth gliding for character from tile to tile
export class MainWindow {
    constructor(game) {
        this.game = game;
        this.viewName = "Main Window";
        this.canvas = document.getElementById("gameview-canvas");
        this.mainTextDiv = document.getElementById("mainTextDiv")
        this.itemsButton = document.getElementById("itemsButton")
        this.itemsButton.onclick = () => {
            this.game.itemsPopover.show(() => {
                this.updateDisplay();
            });
        }
        this.statsButton = document.getElementById("statsButton")
        this.statsButton.onclick = () => {
            this.game.statsPopover.show();
        }
        this.window = document.getElementById("main-window")
        this.healthDiv = document.getElementById("main-window-statview-stat-health")
        this.experienceDiv = document.getElementById("main-window-statview-stat-experience")
        this.levelDiv = document.getElementById("main-window-statview-stat-level")
        this.goldDiv = document.getElementById("main-window-statview-stat-gold")
        this.isShowing = false;
        // Should make a better place for this, game resources
        this.mainCharacterImage = new Image();
        this.mainCharacterImage.src = "images/main-character.png";
        // Creature images
        this.creatureImages = {};
        for (const creature of CREATURES) {
            let image = new Image();
            image.src = "images/" + creature.image;
            this.creatureImages[creature.stringId] = image;
        }
        // Time tracking
        this.lastPlayerMove = 0;
        // Track on screen enemies
        this.enemies = [];
    }

    getContext() {
        let canvas = this.canvas;
        // Get the device pixel ratio, falling back to 1.
        let dpr = window.devicePixelRatio || 1;
        // Get the size of the canvas in CSS pixels.
        let rect = canvas.getBoundingClientRect();
        // Give the canvas pixel dimensions of their CSS
        // size * the device pixel ratio.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        let ctx = canvas.getContext('2d');
        // Scale all drawing operations by the dpr, so you
        // don't have to worry about the difference.
        ctx.scale(dpr, dpr);
        return ctx;
    }

    // Load the enemies in a new area, remove enemies from old area
    enterArea() {
        // Remove all previous enemies
        this.enemies = [];
        // Add new enemies from new section
        // Loop through every tile of the new map, add enemies
        let currentGame = this.game.getCurrentGame();
        let world = this.game.world;
        let map = world.maps[currentGame.currentMap];
        let mapX = Math.floor(currentGame.x / MAP_TILE_WIDTH);
        let mapY = Math.floor(currentGame.y / MAP_TILE_HEIGHT);
        let cameraX = mapX * MAP_TILE_WIDTH;
        let cameraY = mapY * MAP_TILE_HEIGHT;
        let minX = cameraX;
        let maxX = cameraX + MAP_TILE_WIDTH;
        let minY = cameraY;
        let maxY = cameraY + MAP_TILE_HEIGHT;

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                let staticEnemies = map.getStaticEnemiesByTile(x, y);
                for (const staticEnemy of staticEnemies) {
                    let newEnemy = new Enemy(GetCreatureDataByStringId(staticEnemy.stringId), staticEnemy.x, staticEnemy.y, true);
                    this.enemies.push(newEnemy);
                }
            }
        }
    }

    runOverworldLogic(timestamp) {
        if (this.game.getCurrentView() !== this.viewName) {
            return;
        }

        let currentGame = this.game.getCurrentGame();
        let world = this.game.world;
        let map = world.maps[currentGame.currentMap];
        // Todo, make a time tracking class for easy
        // world time tracking, like character movement
        const elapsed = timestamp - this.lastPlayerMove;
        let originalMapX = Math.floor(currentGame.x / MAP_TILE_WIDTH);
        let originalMapY = Math.floor(currentGame.y / MAP_TILE_HEIGHT);
        if (elapsed > MOVE_DELAY_SECONDS * 1000 && (this.game.eventTracker.up || this.game.eventTracker.left || this.game.eventTracker.down || this.game.eventTracker.right)) {
            let targetTileX = currentGame.x;
            let targetTileY = currentGame.y;
            let moved = false;
            if (this.game.eventTracker.left || this.game.eventTracker.right) {
                if (this.game.eventTracker.left) {
                    targetTileX -= 1;
                }
                if (this.game.eventTracker.right) {
                    targetTileX += 1;
                }
                // Check for collisions in new position
                if (!map.isCollisionTile(targetTileX, currentGame.y)) {
                    currentGame.x = targetTileX;
                    moved = true;
                }
            }
            if (this.game.eventTracker.up || this.game.eventTracker.down) {
                if (this.game.eventTracker.up) {
                    targetTileY -= 1;
                }
                if (this.game.eventTracker.down) {
                    targetTileY += 1;
                }
                // Check for collisions in new position
                if (!map.isCollisionTile(currentGame.x, targetTileY)) {
                    currentGame.y = targetTileY;
                    moved = true;
                }
            }
            // Check for collisions in new position
            if (moved) {
                this.lastPlayerMove = timestamp;
            }
            // Check collisions when attempting to move to
            // the target tile
            // First check special properties of the tile
            let propertiesOfTile = map.getPropertiesByTile(targetTileX, targetTileY);
            for (const property of propertiesOfTile) {
                if (property.name === "shop") {
                    if (property.attributes["shop"] === "weapon") {
                        ShowWeaponShop(this.game);
                    } else if (property.attributes["shop"] === "armor") {
                        ShowArmorShop(this.game);
                    } else if (property.attributes["shop"] === "food") {
                        this.game.foodShopPopover.show();
                    } else if (property.attributes["shop"] === "heal") {
                        this.game.healShopPopover.show();
                    }
                }
            }
            // Check if we moved onto an enemy
            for (const enemy of this.enemies) {
                if (enemy.x === currentGame.x && enemy.y === currentGame.y) {
                    this.game.attackPopover.show(enemy.creatureData, () => {
                        // Any special victory actions
                        this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    }, () => {
                        currentGame.currentHealth = 1;
                        this.game.setCurrentGamePositionToStartPosition();
                    });
                }
            }
        }
        if (!this.game.eventTracker.up && !this.game.eventTracker.left && !this.game.eventTracker.down && !this.game.eventTracker.right) {
            this.lastPlayerMove = 0;
        }
        let newMapX = Math.floor(currentGame.x / MAP_TILE_WIDTH);
        let newMapY = Math.floor(currentGame.y / MAP_TILE_HEIGHT);
        // We entered a new area
        if (originalMapX !== newMapX || originalMapY !== newMapY) {
            this.enterArea();
        }
    }

    updateCanvas(timestamp) {
        if (!this.isShowing) {
            return;
        }
        requestAnimationFrame((timestamp) => this.updateCanvas(timestamp));

        // run logic
        this.runOverworldLogic(timestamp);

        let currentGame = this.game.getCurrentGame();
        let ctx = this.getContext();
        // Scale the display to show 10 tiles no matter screen size
        let bounds = this.canvas.getBoundingClientRect();
        let canvasWidth = bounds.width;
        let canvasHeight = bounds.height;
        // Limit view to 10 tiles
        let targetWidth = MAP_TILE_WIDTH * TILE_DISPLAY_SIZE;
        let targetHeight = MAP_TILE_HEIGHT * TILE_DISPLAY_SIZE;
        ctx.scale(canvasWidth / targetWidth, canvasHeight / targetHeight);
        let mapX = Math.floor(currentGame.x / MAP_TILE_WIDTH);
        let mapY = Math.floor(currentGame.y / MAP_TILE_HEIGHT);
        let cameraX = mapX * MAP_TILE_WIDTH;
        let cameraY = mapY * MAP_TILE_HEIGHT;
        let minX = cameraX;
        let maxX = cameraX + MAP_TILE_WIDTH;
        let minY = cameraY;
        let maxY = cameraY + MAP_TILE_HEIGHT;
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.rect(0, 0, targetWidth, targetHeight);
        ctx.fill();
        ctx.fillStyle = "red";
        // Draw world
        let world = this.game.world;
        let map = world.maps[currentGame.currentMap];
        for (const tileLayer of map.tileLayers) {
            for (let x = minX; x <= maxX; x++) {
                if (x in tileLayer.tiles) {
                    let tileX = tileLayer.tiles[x];
                    for (let y = minY; y <= maxY; y++) {
                        if (y in tileX) {
                            let tileId = tileX[y];
                            // Get the tile image and draw it
                            let tileImage = world.getTileForMap(map, tileId);
                            let drawX = (x - cameraX) * TILE_DISPLAY_SIZE;
                            let drawY = (y - cameraY) * TILE_DISPLAY_SIZE;
                            ctx.drawImage(tileImage, drawX, drawY, TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE);
                        }
                    }
                }
            }
        }
        // Draw enemies
        for (const enemy of this.enemies) {
            let image = this.creatureImages[enemy.creatureData.stringId];
            let drawX = (enemy.x - cameraX) * TILE_DISPLAY_SIZE;
            let drawY = (enemy.y - cameraY) * TILE_DISPLAY_SIZE;
            ctx.drawImage(image, drawX, drawY, TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE);
        }
        // Draw main character
        let drawX = (currentGame.x - cameraX) * TILE_DISPLAY_SIZE;
        let drawY = (currentGame.y - cameraY) * TILE_DISPLAY_SIZE;
        ctx.drawImage(this.mainCharacterImage, drawX, drawY, TILE_DISPLAY_SIZE, TILE_DISPLAY_SIZE);
    }

    show() {
        this.updateDisplay();
        this.window.style.display = "";
        // Start redraw loop
        this.isShowing = true;
        this.updateCanvas();
        requestAnimationFrame((timestamp) => this.updateCanvas(timestamp));
        this.game.addView(this.viewName);
        this.enterArea();
    }

    hide() {
        this.isShowing = false;
        this.window.style.display = "display: none";
        this.game.removeView(this.viewName);
    }

    updateDisplay() {
        this.healthDiv.innerText = "Health: " + this.game.getCurrentGame().currentHealth + "/" + this.game.getCurrentGame().health;
        this.experienceDiv.innerText = "Experience: " + this.game.getCurrentGame().experience;
        this.levelDiv.innerText = "Level: " + this.game.getCurrentGame().level;
        this.goldDiv.innerText = "Gold: " + this.game.getCurrentGame().gold;
    }
}