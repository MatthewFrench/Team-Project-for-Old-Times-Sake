const BASE = 29;
const INCREASE_MULTIPLIER = 1.4;
const LEVEL_EXPERIENCE_CACHE = [0, 0, BASE];
// This is a fibonacci-like algorithm
function GetExperienceForLevel(level) {
    // Cache to save a lot of CPU cycles later levels
    if (level < LEVEL_EXPERIENCE_CACHE.length) {
        let experience = LEVEL_EXPERIENCE_CACHE[level];
        if (experience !== undefined) {
            return experience;
        }
    }
    let experience = Math.floor((GetExperienceForLevel(level - 1) - GetExperienceForLevel(level - 2)) * INCREASE_MULTIPLIER + GetExperienceForLevel(level - 1));
    LEVEL_EXPERIENCE_CACHE[level] = experience;
    return experience;
}

// Increase experience, check level up
export function AppendExperience(experience, game) {
    game.getCurrentGame().experience += experience;
    CheckLevelUp(game);
    game.mainWindow.updateDisplay();
}

// Attempt to level up, increase stats, show popup
function CheckLevelUp(game) {
    let currentGame = game.getCurrentGame();
    const nextLevelExperience = GetExperienceForLevel(currentGame.level + 1);
    if (currentGame.experience >= nextLevelExperience) {
        // Level up
        currentGame.level += 1;
        // Determine random stat increase
        const STRENGTH_STAT = 1;
        const SPEED_STAT = 2;
        const HEALTH_STAT = 3;
        const GOLD_STAT = 4;
        const STAT_ARRAY = shuffleArray([STRENGTH_STAT, SPEED_STAT, HEALTH_STAT, GOLD_STAT]);
        let increaseStats = 0;
        let printMessage = "Leveled up to level " + currentGame.level + "! ";
        let statMessage = "You have leveled up to level " + currentGame.level + "!\n\n";
        // Give one free stat increase per level
        increaseStats += 1;
        // Randomly choose to increase other stats
        const baseRandomness = 0.5;
        for (let index = 1; index < STAT_ARRAY.length; index++) {
            if (Math.random() >= baseRandomness) {
                increaseStats += 1;
            }
        }
        for (let index = 0; index < STAT_ARRAY.length && index < increaseStats; index++) {
            let stat = STAT_ARRAY[index];
            if (stat === STRENGTH_STAT) {
                let increaseAmount = Math.round(Math.random() * 2 + 1);
                currentGame.strength += increaseAmount;
                statMessage += "Your strength has increased by " + increaseAmount + "!\n";
                printMessage += "Strength has increased by " + increaseAmount + "! ";
            } else if (stat === SPEED_STAT) {
                let increaseAmount = Math.round(Math.random() * 2 + 1);
                currentGame.speed += increaseAmount;
                statMessage += "Your speed has increased by " + increaseAmount + "!\n";
                printMessage += "Speed has increased by " + increaseAmount + "! ";
            } else if (stat === HEALTH_STAT) {
                let healthIncrease = Math.floor(Math.random() * 5 + 5);
                currentGame.health += healthIncrease;
                currentGame.currentHealth += healthIncrease;
                statMessage += "Your health has increased by " + healthIncrease + "!\n";
                printMessage += "Health has increased by " + healthIncrease + "! ";
            } else if (stat === GOLD_STAT) {
                let goldBase = currentGame.level * 5;
                let foundGold = Math.floor(Math.random() * goldBase + goldBase);
                currentGame.gold += foundGold;
                statMessage += "You found " + foundGold + " gold!\n";
                printMessage += "Found " + foundGold + " gold! ";
            }
        }
        game.eventPopover.set("Level up!",
            statMessage,
            "Yay!",
            () => {
                game.eventPopover.hide();
                CheckLevelUp(game);
            })
        game.eventPopover.show();
        game.print(printMessage);
        game.mainWindow.updateDisplay();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}