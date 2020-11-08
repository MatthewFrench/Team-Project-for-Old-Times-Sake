import {CharacterCreatorWindow} from "./character-creator-window.js";
import {NewGameWindow} from "./new-game-window.js";
import {MainWindow} from "./main-window.js";
import {ItemsPopover} from "./items-popover.js";
import {StatsPopover} from "./stats-popover.js";
import {EventPopover} from "./event-popover.js";
import {ShopPopover} from "./shop-popover.js";
import {AttackPopover} from "./attack-popover.js";
import {AboutWindow} from "./about-window.js";
import {LoadGameWindow} from "./load-game-window.js";
import {GlobalData} from "./models/GlobalData.js";
import {GameData} from "./models/GameData.js";
import {ITEM_SUSHI} from "./models/ItemData.js";
import {FoodShopPopover} from "./food-shop-popover.js";
import {HealShopPopover} from "./heal-shop-popover.js";

export class Game {
    constructor() {
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
    }

    createNewGame(name, strength, speed, health) {
        let newGame = new GameData();
        newGame.name = name;
        newGame.strength = parseInt(strength);
        newGame.speed = parseInt(speed);
        newGame.health = parseInt(health);
        newGame.currentHealth = parseInt(health);
        newGame.level = 1;
        newGame.gold = 100;
        newGame.items.push(ITEM_SUSHI);
        newGame.items.push(ITEM_SUSHI);
        this.globalData.currentGame = newGame;
        this.globalData.games.push(newGame);
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

let game;
function main() {
    game = new Game();
}

window.addEventListener("load", main);