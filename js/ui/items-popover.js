import {UseItem} from "../models/ItemData.js";

export class ItemsPopover {
    constructor(game) {
        this.game = game
        this.viewName = "Item Popover";
        this.popover = document.getElementById("items-popover-background-cover");
        this.closeButton = document.getElementById("items-close-button");
        this.closeButton.onclick = () => {
            this.hide()
        }
        this.itemDivs = [
            document.getElementById("item-0"),
            document.getElementById("item-1"),
            document.getElementById("item-2"),
            document.getElementById("item-3"),
            document.getElementById("item-4")
        ];
        this.itemNameDivs = [
            document.getElementById("item-name-0"),
            document.getElementById("item-name-1"),
            document.getElementById("item-name-2"),
            document.getElementById("item-name-3"),
            document.getElementById("item-name-4")
        ];
        // Set on click events for each item div
        for (const itemIndex in this.itemDivs) {
            if (this.itemDivs.hasOwnProperty(itemIndex)) {
                const itemDiv = this.itemDivs[itemIndex];
                itemDiv.onclick = () => {
                    this.itemClicked(itemIndex);
                }
            }
        }
        this.useCallback = null;
    }
    itemClicked(itemIndex) {
        const item = itemIndex < this.game.getCurrentGame().items.length ? this.game.getCurrentGame().items[itemIndex] : null;
        if (item === null) {
            return;
        }
        UseItem(item, this.game);
        this.game.getCurrentGame().items.splice(itemIndex, 1);
        this.updateItemDisplay();
        if (this.useCallback != null) {
            this.useCallback();
        }
    }
    updateItemDisplay() {
        for (const itemIndex in this.itemDivs) {
            const itemDiv = this.itemDivs[itemIndex];
            const itemNameDiv = this.itemNameDivs[itemIndex];
            const item = itemIndex < this.game.getCurrentGame().items.length ? this.game.getCurrentGame().items[itemIndex] : null;
            if (item === null) {
                itemNameDiv.innerText = "";
                itemDiv.style.backgroundImage = "";
                itemDiv.style.cursor = "";;
            } else {
                itemNameDiv.innerText = item.itemName;
                itemDiv.style.cursor = "pointer";
                itemDiv.style.backgroundImage = "url(\"./images/" + item.itemImage +"\")";
            }
        }
    }
    show(useCallback = null) {
        this.useCallback = useCallback;
        this.updateItemDisplay();
        this.popover.style.display = "";
        this.game.addView(this.viewName);
    }
    hide() {
        this.popover.style.display = "none";
        this.game.removeView(this.viewName);
    }
}