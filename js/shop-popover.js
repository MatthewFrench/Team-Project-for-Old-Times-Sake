export class ShopPopover {
    constructor(game) {
        this.game = game;
        this.selectedItemDiv = null;
        this.popoverContainer = document.getElementById("shop-popover-background-cover");
        this.popover = document.getElementById("shop-popover");
        this.closeButton = document.getElementById("shop-close-button");
        this.closeButton.onclick = () => {
            this.hide();
        }
        this.titleImage1 = document.getElementById("shop-title-image-1");
        this.titleImage2 = document.getElementById("shop-title-image-2");
        this.title = document.getElementById("shop-title");
        this.rowContainer = document.getElementById("shop-table-row-container");
        this.goldDiv = document.getElementById("shop-gold");
        this.currentArmorTitle = document.getElementById("shop-current-armor-title");
        this.currentArmorName = document.getElementById("shop-current-armor");
        this.currentArmorRating = document.getElementById("shop-current-armor-count");
        this.currentArmorValue = document.getElementById("shop-current-armor-value");
        this.selectedItem = null;
        this.buyButtonOnclick = null;
        document.getElementById("shop-buy-button").onclick = () => {
            this.buyButtonOnclick(this.selectedItem);
        }
    }
    show() {
        this.popoverContainer.style.display = "";
    }
    hide() {
        this.popoverContainer.style.display = "none";
    }
    setShopType(shopType, image, backgroundImage) {
        this.popover.style.backgroundImage = "url(\"./images/textures/" + backgroundImage +"\")";
        this.titleImage1.style.backgroundImage = "url(\"./images/" + image +"\")";
        this.titleImage2.style.backgroundImage = "url(\"./images/" + image +"\")";
        this.title.innerText = shopType + " Shop";
        this.currentArmorTitle.innerText = "Current " + shopType;
    }
    setItems(items, currentItem) {
        let currentItemRating = 0;
        let currentItemValue = 0;
        if (currentItem !== null) {
            currentItemRating = currentItem.rating;
            currentItemValue = Math.floor(currentItem.cost / 2);
        }
        // Clear items
        while(this.rowContainer.firstChild) {
            this.rowContainer.removeChild(this.rowContainer.firstChild);
        }
        for (const item of items) {
            if (item.rating > currentItemRating) {
                this.addItem(item, currentItemValue + this.game.getCurrentGame().gold);
            }
        }
        if (!this.rowContainer.hasChildNodes()) {
            let textNode = document.createElement("div");
            textNode.innerText = "No items left to buy";
            textNode.classList.add("shop-table-empty");
            this.rowContainer.append(textNode);
        }
    }
    setBuyButtonClick(callback) {
        this.buyButtonOnclick = callback;
    }
    updateCurrentItemDisplay(name, rating, value) {
        this.currentArmorName.innerText = "Name: " + name;
        this.currentArmorRating.innerText = "Rating: " + rating;
        this.currentArmorValue.innerText = "Worth: " + value + " Gold";
    }
    updateGoldDisplay() {
        this.goldDiv.innerText = "Gold: " + this.game.getCurrentGame().gold;
    }
    addItem(item, totalAvailableGold) {
        let name = item.name;
        let rating = item.rating;
        let cost = item.cost;
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("shop-table-row");
        if (cost <= totalAvailableGold) {
            rowDiv.classList.add("shop-table-row-buyable");
        } else {
            rowDiv.classList.add("shop-table-row-not-buyable");
        }
        let ratingDiv = document.createElement("div");
        ratingDiv.innerText = rating;
        ratingDiv.className = "shop-table-rating-column";
        let itemDiv = document.createElement("div");
        itemDiv.innerText = name;
        itemDiv.className = "shop-table-item-column";
        let costDiv = document.createElement("div");
        costDiv.innerText = cost;
        costDiv.className = "shop-table-cost-column";
        rowDiv.append(ratingDiv);
        rowDiv.append(itemDiv);
        rowDiv.append(costDiv);
        this.rowContainer.append(rowDiv);
        rowDiv.onclick = () => {
            this.itemClicked(rowDiv, item);
        }
    }
    itemClicked(rowDiv, item) {
        if (this.selectedItemDiv != null) {
            this.selectedItemDiv.classList.remove("selected");
        }
        this.selectedItemDiv = rowDiv;
        this.selectedItemDiv.classList.add("selected");
        // Track which item is active
        this.selectedItem = item;
    }
}