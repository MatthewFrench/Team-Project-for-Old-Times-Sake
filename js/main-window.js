import {AppendExperience} from "./models/LevelUpData.js";
import {ShowArmorShop} from "./models/ArmorData.js";
import {ShowWeaponShop} from "./models/WeaponData.js";
import {CREATURE_BABY_CHICKEN} from "./models/CreatureData.js";

export class MainWindow {
    constructor(game) {
        this.game = game;
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
        this.healthDiv = document.getElementById( "main-window-statview-stat-health")
        this.experienceDiv = document.getElementById( "main-window-statview-stat-experience")
        this.levelDiv = document.getElementById( "main-window-statview-stat-level")
        this.goldDiv = document.getElementById( "main-window-statview-stat-gold")
        document.getElementById("armorShopButton").onclick = () => {
            ShowArmorShop(this.game);
        }
        document.getElementById("weaponShopButton").onclick = () => {
            ShowWeaponShop(this.game);
        }
        document.getElementById("levelUpButton").onclick = ()  => {
            AppendExperience(10000, this.game);
        }
        document.getElementById("attackButton").onclick = () => {
            this.game.attackPopover.show(CREATURE_BABY_CHICKEN);
        }
        document.getElementById("healShopButton").onclick = () =>  {
            this.game.healShopPopover.show();
        }
        document.getElementById("foodShopButton").onclick = () =>  {
            this.game.foodShopPopover.show();
        }
    }
    show() {
        this.updateDisplay();
        this.window.style.display = "";
    }
    updateDisplay() {
        this.healthDiv.innerText = "Health: " + this.game.getCurrentGame().currentHealth + "/" + this.game.getCurrentGame().health;
        this.experienceDiv.innerText = "Experience: " + this.game.getCurrentGame().experience;
        this.levelDiv.innerText = "Level: " + this.game.getCurrentGame().level;
        this.goldDiv.innerText = "Gold: " + this.game.getCurrentGame().gold;
    }
}