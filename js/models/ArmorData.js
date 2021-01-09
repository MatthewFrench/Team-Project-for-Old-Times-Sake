const ARMOR_CARDBOARD_UNDERWEAR = {
    id: 1,
    name: "Cardboard Underwear",
    rating: 1,
    cost: 25,
    buyLine: "Kinda chafey. At least they're already brown."
};
const ARMOR_CROCHETED_CROCS = {
    id: 2,
    name: "Crocheted Crocs",
    rating: 2,
    cost: 60,
    buyLine: "So breathable, so comfortable, so humiliating."
};
const ARMOR_CARPET_TSHIRT = {
    id: 3,
    name: "Carpet T-Shirt",
    rating: 3,
    cost: 140,
    buyLine: "Itchy, stiff, but it feels like the carpet at home."
};
const ARMOR_WOOD_PANTS = {
    id: 4,
    name: "Wood Pants",
    rating: 4,
    cost: 330,
    buyLine: "\"There's wood in your pants?\" No the pants are wood!"
};
const ARMOR_SHINY_NIGHTGOWN = {
    id: 5,
    name: "Shiny Nightgown",
    rating: 5,
    cost: 470,
    buyLine: "I look stunning. Super silky and breathable."
};
const ARMOR_CHRISTMAS_LIGHT_UP_SOCKS = {
    id: 6,
    name: "Christmas Light Up Socks",
    rating: 6,
    cost: 820,
    buyLine: "These are definitely dad socks. Even plays a Christmas tune."
};
const ARMOR_ADAMANTIUM_NOSE_RING = {
    id: 7,
    name: "Adamantium Nose-ring",
    rating: 8,
    cost: 1210,
    buyLine: "Wolverine would be so jealous. We're allowed to wear other armor with this, right?"
};
const ARMOR_DRIED_DOG_TURD_SUIT = {
    id: 8,
    name: "Dried Dog-turd Suit",
    rating: 10,
    cost: 1650,
    buyLine: "Did the suit exist before the turds or...?"
};
const ARMOR_TOWEL_OF_INDECENCY = {
    id: 9,
    name: "Towel of Indecency",
    rating: 12,
    cost: 2150,
    buyLine: "Don't look! This feels like a nightmare I once had."
};
const ARMOR_YELLOW_POLKA_DOT_BIKINI = {
    id: 10,
    name: "Yellow Polka-dot Bikini",
    rating: 14,
    cost: 3100,
    buyLine: "It was an itsy bitsy teenie weenie... any-who, the less clothing, the more powerful the armor. Right?"
};
const ARMOR_DRAGON_SCALE_FULL_BODY_ARMOR = {
    id: 11,
    name: "Dragon Scale Full Body Armor",
    rating: 16,
    cost: 6400,
    buyLine: "You have the power of anime on your side."
};
const ARMORS = [ARMOR_CARDBOARD_UNDERWEAR, ARMOR_CROCHETED_CROCS, ARMOR_CARPET_TSHIRT, ARMOR_WOOD_PANTS, ARMOR_SHINY_NIGHTGOWN, ARMOR_CHRISTMAS_LIGHT_UP_SOCKS, ARMOR_ADAMANTIUM_NOSE_RING, ARMOR_DRIED_DOG_TURD_SUIT, ARMOR_TOWEL_OF_INDECENCY, ARMOR_YELLOW_POLKA_DOT_BIKINI, ARMOR_DRAGON_SCALE_FULL_BODY_ARMOR];

export function ShowArmorShop(game) {
    let currentGame = game.getCurrentGame();
    game.shopPopover.setShopType("Armor", "shield.png", "sand-stone-background.jpg");
    game.shopPopover.setItems(ARMORS, currentGame.armor);
    UpdateCurrentArmorDisplay(game);
    game.shopPopover.updateGoldDisplay();
    game.shopPopover.setBuyButtonClick((buyItem) => {
        if (buyItem != null && buyItem !== currentGame.armor) {
            let currentArmorRating = 0;
            let currentArmorCost = 0;
            if (currentGame.armor != null) {
                currentArmorCost = Math.floor(currentGame.armor.cost / 2);
                currentArmorRating = currentGame.armor.rating;
            }
            if (currentGame.gold + currentArmorCost >= buyItem.cost && buyItem.rating > currentArmorRating) {
                // Sell current armor first
                currentGame.gold += currentArmorCost;
                // Buy new armor
                currentGame.gold -= buyItem.cost;
                currentGame.armor = buyItem;
                game.shopPopover.setItems(ARMORS, currentGame.armor);
                UpdateCurrentArmorDisplay(game);
                game.shopPopover.updateGoldDisplay();
                game.mainWindow.updateDisplay();
                game.print("You bought armor: " + currentGame.armor.name + ". " + currentGame.armor.buyLine);
            }
        }
    });
    game.shopPopover.show();
}

function UpdateCurrentArmorDisplay(game) {
    let armor = game.getCurrentGame().armor;
    let armorName = "No Armor";
    let armorRating = "0";
    let armorWorth = "0";
    if (armor !== null) {
        armorName = armor.name;
        armorRating = armor.rating;
        armorWorth = Math.floor(armor.cost / 2);
    }
    game.shopPopover.updateCurrentItemDisplay(armorName, armorRating, armorWorth);
}