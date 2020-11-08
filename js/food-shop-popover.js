import {ITEM_CORNED_BEEF_HASH, ITEM_EARL_GREY_TEA, ITEM_SPAGHETTI, ITEM_SPINACH, ITEM_SUSHI} from "./models/ItemData.js";

export class FoodShopPopover {
    constructor(game) {
        this.game = game;
        this.popover = document.getElementById("food-shop-popover-background-cover");
        this.closeButton = document.getElementById("food-shop-close-button");
        this.closeButton.onclick = () => {
            this.hide();
        }
        this.titleImage1 = document.getElementById("food-shop-title-image-1");
        this.titleImage2 = document.getElementById("food-shop-title-image-2");
        this.title = document.getElementById("food-shop-title");
        this.buyFood0 = ITEM_SUSHI;
        this.buyFood1 = ITEM_CORNED_BEEF_HASH;
        this.buyFood2 = ITEM_SPINACH;
        this.buyFood3 = ITEM_SPAGHETTI;
        this.buyFood4 = ITEM_EARL_GREY_TEA;
        this.buyFood0Div = document.getElementById("food-shop-buy-item-0");
        this.buyFood1Div = document.getElementById("food-shop-buy-item-1");
        this.buyFood2Div = document.getElementById("food-shop-buy-item-2");
        this.buyFood3Div = document.getElementById("food-shop-buy-item-3");
        this.buyFood4Div = document.getElementById("food-shop-buy-item-4");
        this.buyFood0Div.style.backgroundImage = "url(\"./images/" + this.buyFood0.itemImage +"\")";
        this.buyFood1Div.style.backgroundImage = "url(\"./images/" + this.buyFood1.itemImage +"\")";
        this.buyFood2Div.style.backgroundImage = "url(\"./images/" + this.buyFood2.itemImage +"\")";
        this.buyFood3Div.style.backgroundImage = "url(\"./images/" + this.buyFood3.itemImage +"\")";
        this.buyFood4Div.style.backgroundImage = "url(\"./images/" + this.buyFood4.itemImage +"\")";
        this.buyFood0NameDiv = document.getElementById("food-shop-buy-item-name-0");
        this.buyFood1NameDiv = document.getElementById("food-shop-buy-item-name-1");
        this.buyFood2NameDiv = document.getElementById("food-shop-buy-item-name-2");
        this.buyFood3NameDiv = document.getElementById("food-shop-buy-item-name-3");
        this.buyFood4NameDiv = document.getElementById("food-shop-buy-item-name-4");
        this.buyFood0NameDiv.innerText = this.buyFood0.itemName + " - Small Heal";
        this.buyFood1NameDiv.innerText = this.buyFood1.itemName + " - Large Heal";
        this.buyFood2NameDiv.innerText = this.buyFood2.itemName + " - Strength ⬆";
        this.buyFood3NameDiv.innerText = this.buyFood3.itemName + " - Speed ⬆";
        this.buyFood4NameDiv.innerText = this.buyFood4.itemName + " - Health ⬆";
        this.buyFood0ValueDiv = document.getElementById("food-shop-buy-item-value-0");
        this.buyFood1ValueDiv = document.getElementById("food-shop-buy-item-value-1");
        this.buyFood2ValueDiv = document.getElementById("food-shop-buy-item-value-2");
        this.buyFood3ValueDiv = document.getElementById("food-shop-buy-item-value-3");
        this.buyFood4ValueDiv = document.getElementById("food-shop-buy-item-value-4");
        this.buyFood0ValueDiv.innerText = "Cost: " + this.buyFood0.cost;
        this.buyFood1ValueDiv.innerText = "Cost: " + this.buyFood1.cost;
        this.buyFood2ValueDiv.innerText = "Cost: " + this.buyFood2.cost;
        this.buyFood3ValueDiv.innerText = "Cost: " + this.buyFood3.cost;
        this.buyFood4ValueDiv.innerText = "Cost: " + this.buyFood4.cost;
        this.buyFood0Div.onclick = () => this.buyFood(this.buyFood0);
        this.buyFood1Div.onclick = () => this.buyFood(this.buyFood1);
        this.buyFood2Div.onclick = () => this.buyFood(this.buyFood2);
        this.buyFood3Div.onclick = () => this.buyFood(this.buyFood3);
        this.buyFood4Div.onclick = () => this.buyFood(this.buyFood4);

        this.itemDivs = [
            document.getElementById("food-shop-item-0"),
            document.getElementById("food-shop-item-1"),
            document.getElementById("food-shop-item-2"),
            document.getElementById("food-shop-item-3"),
            document.getElementById("food-shop-item-4")
        ];
        this.itemNameDivs = [
            document.getElementById("food-shop-item-name-0"),
            document.getElementById("food-shop-item-name-1"),
            document.getElementById("food-shop-item-name-2"),
            document.getElementById("food-shop-item-name-3"),
            document.getElementById("food-shop-item-name-4")
        ];
        this.itemValueDivs = [
            document.getElementById("food-shop-item-value-0"),
            document.getElementById("food-shop-item-value-1"),
            document.getElementById("food-shop-item-value-2"),
            document.getElementById("food-shop-item-value-3"),
            document.getElementById("food-shop-item-value-4")
        ];
        // Set on click events for each item div
        for (const itemIndex in this.itemDivs) {
            if (this.itemDivs.hasOwnProperty(itemIndex)) {
                const itemDiv = this.itemDivs[itemIndex];
                itemDiv.onclick = () => {
                    this.sellFood(itemIndex);
                }
            }
        }

        this.goldDiv = document.getElementById("food-shop-bottom-gold");
    }
    buyFood(foodItem) {
        let currentGame = this.game.getCurrentGame();
        if (currentGame.items.length >= 5) {
            return;
        }
        if (currentGame.gold < foodItem.cost) {
            return;
        }
        currentGame.gold -= foodItem.cost;
        currentGame.items.push(foodItem);
        this.game.print("Bought " + foodItem.itemName + " for " + foodItem.cost + " gold. " + foodItem.buyText);
        this.updateInventoryDisplay();
        this.game.mainWindow.updateDisplay();
    }
    sellFood(itemIndex) {
        const item = itemIndex < this.game.getCurrentGame().items.length ? this.game.getCurrentGame().items[itemIndex] : null;
        if (item === null) {
            return;
        }
        this.game.getCurrentGame().gold += Math.floor(item.cost / 2);
        this.game.getCurrentGame().items.splice(itemIndex, 1);
        this.game.print("Sold " + item.itemName + " for " + Math.floor(item.cost / 2) + " gold. ");
        this.game.mainWindow.updateDisplay();
        this.updateInventoryDisplay();
    }
    updateInventoryDisplay() {
        for (const itemIndex in this.itemDivs) {
            const itemDiv = this.itemDivs[itemIndex];
            const itemNameDiv = this.itemNameDivs[itemIndex];
            const itemValueDiv = this.itemValueDivs[itemIndex];
            const item = itemIndex < this.game.getCurrentGame().items.length ? this.game.getCurrentGame().items[itemIndex] : null;
            if (item === null) {
                itemNameDiv.innerText = "";
                itemDiv.style.backgroundImage = "";
                itemDiv.style.cursor = "";
                itemValueDiv.innerText = "";
            } else {
                itemNameDiv.innerText = item.itemName;
                itemValueDiv.innerText = "Worth: " + Math.floor(item.cost / 2.0);
                itemDiv.style.cursor = "pointer";
                itemDiv.style.backgroundImage = "url(\"./images/" + item.itemImage +"\")";
            }
        }
        this.goldDiv.innerText = "Gold: " + this.game.getCurrentGame().gold;
    }
    show() {
        let image = "utensils.png";
        if (Math.random() >= 0.9) {
            image = "utensils-tara.png";
        }
        this.titleImage1.style.backgroundImage = "url(\"./images/" + image +"\")";
        this.titleImage2.style.backgroundImage = "url(\"./images/" + image +"\")";
        this.updateInventoryDisplay();
        this.popover.style.display = "";
    }
    hide() {
        this.popover.style.display = "none";
    }
}