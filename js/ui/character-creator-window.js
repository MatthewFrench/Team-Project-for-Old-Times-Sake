export class CharacterCreatorWindow {
    constructor(game) {
        this.game = game;
        this.viewName = "Character Creator Window";
        this.window = document.getElementById("character-creator-window");
        this.nameInput = document.getElementById("character-creator-window-name");
        this.goButton = document.getElementById("character-creator-window-go-button");
        this.goButton.onclick = () => {
            this.createNewGame();
        }
        this.rerollButton = document.getElementById("character-creator-window-stats-reroll-button");
        this.rerollButton.onclick = () => {
            this.rerollStats();
        }
        this.strengthLabel = document.getElementById("character-creator-window-strength-metric");
        this.speedLabel = document.getElementById("character-creator-window-speed-metric");
        this.healthLabel = document.getElementById("character-creator-window-health-metric");
        this.strength = 0;
        this.health = 0;
        this.speed = 0;
        this.rerollStats();
    }
    createNewGame() {
        this.game.createNewGame(this.nameInput.value, this.strength, this.speed, this.health);
        this.hide();
        this.game.print("Welcome to the Adventure of Eek!");
        this.game.mainWindow.show();
    }
    rerollStats() {
        this.setStrength(8 + Math.floor(Math.random() * 8));
        this.setHealth(8 + Math.floor(Math.random() * 8));
        this.setSpeed(8 + Math.floor(Math.random() * 8));
    }
    setStrength(strength) {
        this.strength = strength;
        this.strengthLabel.innerText = "Strength: " + strength;
    }
    setHealth(health) {
        this.health = health;
        this.healthLabel.innerText = "Health: " + health;
    }
    setSpeed(speed) {
        this.speed = speed;
        this.speedLabel.innerText = "Speed: " + speed;
    }
    show() {
        this.window.style.display = "";
        this.game.addView(this.viewName);
    }
    hide() {
        this.window.style.display = "none";
        this.game.removeView(this.viewName);
    }
}