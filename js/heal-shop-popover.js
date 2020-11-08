export class HealShopPopover {
    constructor(game) {
        this.game = game;
        this.popover = document.getElementById("heal-shop-popover-background-cover");
        this.closeButton = document.getElementById("heal-shop-close-button");
        this.closeButton.onclick = () => {
            this.hide();
        }
        this.healthDiv = document.getElementById("heal-shop-health");
        this.goldDiv = document.getElementById("heal-shop-gold");
        this.heal3To7Button = document.getElementById("heal-shop-3-7-button");
        this.heal3To7Button.onclick = () => this.heal3To7Health();
        this.heal30To70Button = document.getElementById("heal-shop-30-70-button");
        this.heal30To70Button.onclick = () => this.heal30To70Health();
        this.heal15To25PercentButton = document.getElementById("heal-shop-15-25-percent-button");
        this.heal15To25PercentButton.onclick = () => this.heal15To25PercentHealth();
        this.healFullButton = document.getElementById("heal-shop-full-heal-button");
        this.healFullButton.onclick = () => this.healFullHealth();
    }
    heal3To7Health() {
        this.doHeal(10, 3 + Math.random() * 4);
    }
    heal30To70Health() {
        this.doHeal(75, 30 + Math.random() * 40);
    }
    heal15To25PercentHealth() {
        this.doHeal(60, Math.ceil(this.game.getCurrentGame().health * (0.15 + Math.random() * 0.2)));
    }
    healFullHealth() {
        this.doHeal(200, this.game.getCurrentGame().health);
    }
    doHeal(cost, heal) {
        if (this.game.getCurrentGame().currentHealth === this.game.getCurrentGame().health) {
            return;
        }
        if (this.game.getCurrentGame().gold < cost) {
            return;
        }
        this.game.getCurrentGame().gold -= cost;
        let originalHealth = this.game.getCurrentGame().currentHealth;
        this.game.getCurrentGame().currentHealth += heal;
        this.game.getCurrentGame().currentHealth = Math.round(this.game.getCurrentGame().currentHealth);
        if (this.game.getCurrentGame().currentHealth > this.game.getCurrentGame().health) {
            this.game.getCurrentGame().currentHealth = this.game.getCurrentGame().health;
        }

        let healedAmount = this.game.getCurrentGame().currentHealth - originalHealth;
        this.game.print("You were healed " + healedAmount + " health for " + cost + " gold.");
        this.updateDisplay();
        this.game.mainWindow.updateDisplay();
    }
    updateDisplay() {
        this.healthDiv.innerText = "Health: " + this.game.getCurrentGame().currentHealth + " / " + this.game.getCurrentGame().health;
        this.goldDiv.innerText = "Current Gold: " + this.game.getCurrentGame().gold;
    }
    show() {
        this.updateDisplay();
        this.popover.style.display = "";
    }
    hide() {
        this.popover.style.display = "none";
    }
}