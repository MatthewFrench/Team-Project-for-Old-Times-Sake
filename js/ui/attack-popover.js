import {AppendExperience} from "../models/LevelUpData.js";

export class AttackPopover {
    constructor(game) {
        this.game = game;
        this.viewName = "Attack Popover";
        this.popover = document.getElementById("attack-popover-background-cover");
        document.getElementById("attack-run-button").onclick = () => {
            this.runClicked();
        }
        this.attackButton = document.getElementById("attack-attack-button");
        this.attackButton.onclick = () => {
            this.attackClicked();
        }
        document.getElementById("attack-items-button").onclick = () => {
            this.itemClicked();
        }
        this.enemyImage = document.getElementById("attack-enemy-image");
        this.enemyNameDiv = document.getElementById("attack-enemy-name");
        this.enemyHealthDiv = document.getElementById("attack-enemy-health");
        this.selfHealthDiv = document.getElementById("attack-self-information-container");
        this.controlsContainer = document.getElementById("attack-controls-container");
        this.victoryDiv = document.getElementById("attack-victory-container");
        this.victoryGoldDiv = document.getElementById("attack-rewards-gold");
        this.victoryExperienceDiv = document.getElementById("attack-rewards-experience");
        this.victoryCloseButton = document.getElementById("attack-victory-close-button");
        this.deathDiv = document.getElementById("attack-death-container");
        this.deathGoldDiv = document.getElementById("attack-death-gold");
        this.deathCloseButton = document.getElementById("attack-death-close-button");
        // Enemy creature data
        this.enemy = null;
        // Enemy modifiable stats
        this.enemyHealth = 0;
        this.enemyCurrentHealth = 0;
        this.victoryCloseCallback = () => {};
        this.deathCloseCallback = () => {};
    }
    updateHealthDisplays() {
        let currentGame = this.game.getCurrentGame();
        this.enemyHealthDiv.innerText = "HP: " + this.enemyCurrentHealth + " / " + this.enemyHealth;
        this.selfHealthDiv.innerText = "You:   HP: " + currentGame.currentHealth +" / " + currentGame.health;
    }
    attackClicked() {
        let currentGame = this.game.getCurrentGame();

        let turnDamage = AttackPopover.getTurnDamage(
            {strength: this.enemy.strength, speed: this.enemy.speed, weaponCount: this.enemy.weaponCount, armorCount: this.enemy.armorCount},
            {strength: currentGame.strength, speed: currentGame.speed, weaponCount: currentGame.getWeaponCount(), armorCount: currentGame.getArmorCount()})

        if (this.enemy.speed > currentGame.speed) {
            if (this.dealDamageToPlayer(turnDamage[1])) {
                this.dealDamageToEnemy(turnDamage[0]);
            }
        } else {
            if (this.dealDamageToEnemy(turnDamage[0])) {
                this.dealDamageToPlayer(turnDamage[1]);
            }
        }

        this.updateHealthDisplays();
    }
    dealDamageToEnemy(damage) {
        let currentGame = this.game.getCurrentGame();
        if (damage.dodgedHit === true) {
            if (Math.random() >= 0.5) {
                this.game.print("The " + this.enemy.name.toLowerCase() + " blocked your attack!");
            } else {
                this.game.print("The " + this.enemy.name.toLowerCase() + " dodged your attack!");
            }
        }
        if (damage.damageTaken === 0) {
            return true;
        }
        if (damage.numberOfHits <= 1) {
            if (currentGame.weapon != null) {
                this.game.print("You use your " + currentGame.weapon.name + " to" + (damage.criticalHit ? " CRITICALLY" : "") + " hit the " + this.enemy.name.toLowerCase() + " for " + damage.damageTaken + " damage!");
            } else {
                this.game.print("You" + (damage.criticalHit ? " CRITICALLY" : "") + " hit the " + this.enemy.name.toLowerCase() + " for " + damage.damageTaken + " damage!");
            }
        } else {
            let hitTimes;
            if (damage.numberOfHits === 2) {
                hitTimes = "twice";
            } else {
                hitTimes = damage.numberOfHits + " times";
            }
            if (currentGame.weapon != null) {
                this.game.print("You use your " + currentGame.weapon.name + " to" + (damage.criticalHit ? " CRITICALLY" : "") + " hit the " + this.enemy.name.toLowerCase() + " " + hitTimes + " for a total of " + damage.damageTaken + " damage!");
            } else {
                this.game.print("You" + (damage.criticalHit ? " CRITICALLY" : "") + " hit the " + this.enemy.name.toLowerCase() + " " + hitTimes + " for a total of " + damage.damageTaken + " damage!");
            }
        }
        this.enemyCurrentHealth -= damage.damageTaken;
        if (this.enemyCurrentHealth <= 0) {
            let earnedExperience = this.enemy.experience;
            let earnedGold = this.enemy.gold;
            currentGame.gold += earnedGold;
            // Killed enemy
            this.showVictory(earnedGold, earnedExperience);
            // Return if still alive
            return false;
        }
        return true;
    }
    dealDamageToPlayer(damage) {
        let currentGame = this.game.getCurrentGame();
        if (damage.dodgedHit === true) {
            if (Math.random() >= 0.5) {
                if (currentGame.armor != null) {
                    this.game.print("You blocked the " + this.enemy.name.toLowerCase() + "'s attack with your " + currentGame.armor.name + "!");
                } else {
                    this.game.print("You blocked the " + this.enemy.name.toLowerCase() + "'s attack!");
                }
            } else {
                this.game.print("You dodged the " + this.enemy.name.toLowerCase() + "'s attack!");
            }
        }
        if (damage.damageTaken === 0) {
            return true;
        }
        if (damage.numberOfHits <= 1) {
            this.game.print("The " + this.enemy.name.toLowerCase() + (damage.criticalHit ? " CRITICAL" : "") + " hits you for " + damage.damageTaken + " damage!");
        } else {
            let hitTimes;
            if (damage.numberOfHits === 2) {
                hitTimes = "twice";
            } else {
                hitTimes = damage.numberOfHits + " times";
            }
            this.game.print("The " + this.enemy.name.toLowerCase() + (damage.criticalHit ? " CRITICAL" : "") + " hits you " + hitTimes + " for a total of " + damage.damageTaken + " damage!");
        }
        currentGame.currentHealth -= damage.damageTaken;
        if (currentGame.currentHealth <= 0) {
            // Dead self
            let lostGold = this.enemy.gold * 2;
            let currentGold = currentGame.gold;
            let newGold = currentGold - lostGold;
            if (newGold < 0) {
                newGold = 0;
            }
            let actualLostGold = currentGold - newGold;
            currentGame.gold = newGold;
            this.showDeath(actualLostGold);
            // Return if still alive
            return false;
        }
        return true;
    }
    /*
    Creature object: strength, speed, weaponCount, armorCount

    Strength increases damage and increases chance of doing damage and change of not taking damage.
    Speed increases damage by normalized speed amount.
    Weapon Count increases damage and increases chance of doing damage.
    Armor Count reduces self damage and decreases chance of taking damage.

    Returns array of damage results done to each creature.
    {damageTaken: 0, numberOfHits: 0, dodgedHit: false, criticalHit: false}
     */
    static getTurnDamage(creature1, creature2) {
        let creature1Result = {damageTaken: 0, numberOfHits: 0, dodgedHit: false, criticalHit: false};
        let creature2Result = {damageTaken: 0, numberOfHits: 0, dodgedHit: false, criticalHit: false};
        let creature1Strength = creature1.strength;
        let creature1Speed = creature1.speed;
        let creature1WeaponCount = creature1.weaponCount;
        let creature1ArmorCount = creature1.armorCount;
        let creature2Strength = creature2.strength;
        let creature2Speed = creature2.speed;
        let creature2WeaponCount = creature2.weaponCount;
        let creature2ArmorCount = creature2.armorCount;

        let speedWeight = 0.5;

        let normalizedCreature1Speed = Math.max(creature1Speed * speedWeight, 1);
        let normalizedCreature2Speed = Math.max(creature2Speed * speedWeight, 1);
        if (normalizedCreature1Speed < normalizedCreature2Speed) {
            normalizedCreature2Speed = normalizedCreature2Speed / normalizedCreature1Speed;
            normalizedCreature1Speed = 1;
        } else {
            normalizedCreature1Speed = normalizedCreature1Speed / normalizedCreature2Speed;
            normalizedCreature2Speed = 1;
        }
        creature1Result.numberOfHits = Math.round(normalizedCreature2Speed);
        creature2Result.numberOfHits = Math.round(normalizedCreature1Speed);

        let strengthWeight = 0.25;
        let weaponWeight = 1.00;
        let armorWeight = 1.00;
        let damageWeight = 0.5;

        // Damage values fluctuate from 0.75x to 1.25x damage based on random
        let creature1Damage = normalizedCreature2Speed * (creature2Strength * strengthWeight + creature2WeaponCount * weaponWeight - creature1ArmorCount * armorWeight) * (Math.random() * 0.5 + 0.75) * damageWeight;
        let creature2Damage = normalizedCreature1Speed * (creature1Strength * strengthWeight + creature1WeaponCount * weaponWeight - creature2ArmorCount * armorWeight) * (Math.random() * 0.5 + 0.75) * damageWeight;

        creature1Result.damageTaken = Math.round(Math.max(creature1Damage, 1));
        creature2Result.damageTaken = Math.round(Math.max(creature2Damage, 1));

        // Calculate dodge/block
        let dodgeSuppression = 0.05;
        let normalizedCreature1Dodge = (creature1ArmorCount - creature2WeaponCount + creature1Strength - creature2Strength) * dodgeSuppression;
        let normalizedCreature2Dodge = (creature2ArmorCount - creature1WeaponCount + creature2Strength - creature1Strength) * dodgeSuppression;
        if (normalizedCreature1Dodge < normalizedCreature2Dodge) {
            let difference = 1 - normalizedCreature1Dodge;
            normalizedCreature1Dodge += difference;
            normalizedCreature2Dodge += difference;
            normalizedCreature1Dodge = normalizedCreature1Dodge / normalizedCreature2Dodge;
            normalizedCreature2Dodge = 2.0 - normalizedCreature1Dodge;
        } else {
            let difference = 1 - normalizedCreature2Dodge;
            normalizedCreature1Dodge += difference;
            normalizedCreature2Dodge += difference;
            normalizedCreature2Dodge = normalizedCreature2Dodge / normalizedCreature1Dodge;
            normalizedCreature1Dodge = 2.0 - normalizedCreature2Dodge;
        }
        let baseDodge = 0.5;
        let creature1DodgeNumber = 1.0 - (1 - baseDodge) * normalizedCreature1Dodge;
        let creature2DodgeNumber = 1.0 - (1 - baseDodge) * normalizedCreature2Dodge;
        let dodge1 = true;
        let dodge2 = true;
        while (dodge1 && dodge2) {
            dodge1 = Math.random() >= creature1DodgeNumber;
            dodge2 = Math.random() >= creature2DodgeNumber;
        }
        let criticalStrike1 = Math.random() >= 0.95;
        let criticalStrike2 = Math.random() >= 0.95;
        if (dodge1 && !criticalStrike1) {
            creature1Result.dodgedHit = true;
            creature1Result.damageTaken = 0;
        }
        if (dodge2 && !criticalStrike2) {
            creature2Result.dodgedHit = true;
            creature2Result.damageTaken = 0;
        }

        // Give a rare equal chance to critical strike
        if (criticalStrike1) {
            creature1Result.criticalHit = true;
            creature1Result.damageTaken *= 2;
        }
        if (criticalStrike2) {
            creature2Result.criticalHit = true;
            creature2Result.damageTaken *= 2;
        }

        return [creature1Result, creature2Result];
    }
    showVictory(gold, experience) {
        this.victoryGoldDiv.innerText = "Gold: " + gold;
        this.victoryExperienceDiv.innerText = "Experience: " + experience;
        this.victoryCloseButton.onclick = () => {
            this.hide();
            AppendExperience(experience, this.game);
            this.victoryCloseCallback();
            this.game.mainWindow.updateDisplay();
        }
        this.victoryDiv.style.display = "";
        this.controlsContainer.style.display = "none";
        this.victoryCloseButton.focus();
        this.game.print(this.enemy.name + " defeated! You earned " + gold + " gold and " + experience + " experience.");
    }
    showDeath(lostGold) {
        this.deathGoldDiv.innerText = "You lost " + lostGold + " gold.";
        this.deathCloseButton.onclick = () => {
            this.hide();
            this.deathCloseCallback();
            this.game.mainWindow.updateDisplay();
        }
        this.deathDiv.style.display = "";
        this.controlsContainer.style.display = "none";
        this.deathCloseButton.focus();
        this.game.print("You died. You lost " + lostGold + " gold. You were revived back in town.");
    }
    itemClicked() {
        this.game.itemsPopover.show(() => this.usedItem());
    }
    usedItem() {
        this.updateHealthDisplays();
    }
    runClicked() {
        let currentGame = this.game.getCurrentGame();
        let baseRunAway = 0.5;
        let runValue = (this.enemy.strength + this.enemy.speed) / (currentGame.strength + currentGame.speed);
        let runAwayChance = Math.min(Math.max(1.0 - (1 - baseRunAway) * runValue, 0.1), 0.9);
        let runAway = Math.random() < runAwayChance;
        if (!runAway) {
            this.game.print("You failed to run away from the " + this.enemy.name.toLowerCase() + ".");
            let turnDamage = AttackPopover.getTurnDamage(
                {strength: this.enemy.strength, speed: this.enemy.speed, weaponCount: this.enemy.weaponCount, armorCount: this.enemy.armorCount},
                {strength: currentGame.strength, speed: currentGame.speed, weaponCount: currentGame.getWeaponCount(), armorCount: currentGame.getArmorCount()})
            this.dealDamageToPlayer(turnDamage[1]);
            this.updateHealthDisplays();
        } else {
            this.hide();
            this.game.print("You successfully ran away from the " + this.enemy.name.toLowerCase() + "!");
        }
    }

    show(enemyCreatureData, victoryCloseCallback, deathCloseCallback) {
        this.enemy = enemyCreatureData;
        this.enemyHealth = enemyCreatureData.health;
        this.enemyCurrentHealth = enemyCreatureData.health;
        this.enemyImage.style.backgroundImage = "url(\"./images/" + enemyCreatureData.image +"\")";
        this.enemyNameDiv.innerText = enemyCreatureData.name;
        this.updateHealthDisplays();
        this.victoryDiv.style.display = "none";
        this.deathDiv.style.display = "none";
        this.controlsContainer.style.display = "";
        this.popover.style.display = "";
        this.attackButton.focus();
        this.game.print("A " + enemyCreatureData.name.toLowerCase() +  " attacks! " + enemyCreatureData.encounterLine);
        this.game.addView(this.viewName);
        this.victoryCloseCallback = victoryCloseCallback;
        this.deathCloseCallback = deathCloseCallback;
    }
    hide() {
        this.popover.style.display = "none";
        this.game.mainWindow.updateDisplay();
        this.game.removeView(this.viewName);
    }
}