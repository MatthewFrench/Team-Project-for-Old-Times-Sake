import {GlobalData} from "./models/GlobalData.js";
import {MainWindow} from "./ui/main-window.js";
import {NewGameWindow} from "./ui/new-game-window.js";
import {LoadGameWindow} from "./ui/load-game-window.js";
import {AboutWindow} from "./ui/about-window.js";
import {CharacterCreatorWindow} from "./ui/character-creator-window.js";
import {ItemsPopover} from "./ui/items-popover.js";
import {StatsPopover} from "./ui/stats-popover.js";
import {EventPopover} from "./ui/event-popover.js";
import {ShopPopover} from "./ui/shop-popover.js";
import {AttackPopover} from "./ui/attack-popover.js";
import {FoodShopPopover} from "./ui/food-shop-popover.js";
import {HealShopPopover} from "./ui/heal-shop-popover.js";
import {GameData} from "./models/GameData.js";
import {ITEM_SUSHI} from "./models/ItemData.js";
import {EventTracker} from "./utility/EventTracker.js";

export class Game {
    constructor(world) {
        this.world = world;
        this.eventTracker = new EventTracker();
        this.globalData = new GlobalData();
        this.mainWindow = new MainWindow(this);
        this.newGameWindow = new NewGameWindow(this);
        this.loadWindow = new LoadGameWindow(this);
        this.aboutWindow = new AboutWindow(this);
        this.characterCreatorWindow = new CharacterCreatorWindow(this);
        this.itemsPopover = new ItemsPopover(this);
        this.statsPopover = new StatsPopover(this);
        this.eventPopover = new EventPopover(this);
        this.shopPopover = new ShopPopover(this);
        this.attackPopover = new AttackPopover(this);
        this.foodShopPopover = new FoodShopPopover(this);
        this.healShopPopover = new HealShopPopover(this);
        // Tracks what views are shown and in what order
        this.activeViews = [];
    }

    addView(view) {
        // Make sure view only exists once and at the top
        this.removeView(view);
        this.activeViews.push(view);
    }
    removeView(view) {
        let index;
        while ((index = this.activeViews.indexOf(view)) !== -1) {
            this.activeViews.splice(index, 1);
        }
    }
    getCurrentView() {
        if (this.activeViews.length === 0) {
            return "";
        }
        return this.activeViews[this.activeViews.length - 1];
    }

    createNewGame(name, strength, speed, health) {
        let newGame = new GameData();
        this.globalData.currentGame = newGame;
        newGame.name = name;
        newGame.strength = parseInt(strength);
        newGame.speed = parseInt(speed);
        newGame.health = parseInt(health);
        newGame.currentHealth = parseInt(health);
        newGame.level = 1;
        newGame.gold = 100;
        newGame.items.push(ITEM_SUSHI);
        newGame.items.push(ITEM_SUSHI);
        this.setCurrentGamePositionToStartPosition();
        this.globalData.games.push(newGame);
    }

    setCurrentGamePositionToStartPosition() {
        let currentGame = this.globalData.currentGame;
        // Starting map is hardcoded
        currentGame.currentMap = "Map 1";
        // Should set starting position from the map property
        let map = this.world.maps[currentGame.currentMap];
        let playerStartProperties = map.getPropertiesByName("player-start");
        if (playerStartProperties.length > 0) {
            currentGame.x = playerStartProperties[0].startX;
            currentGame.y = playerStartProperties[0].startY;
        }
    }

    getCurrentGame() {
        return this.globalData.currentGame;
    }

    print(text) {
        let textDiv = document.createElement("div");
        textDiv.classList.add("main-window-text-line");
        textDiv.innerText = text;
        this.mainWindow.mainTextDiv.insertBefore(textDiv, this.mainWindow.mainTextDiv.childNodes[0]);
    }
}