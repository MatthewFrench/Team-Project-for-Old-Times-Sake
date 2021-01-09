export class GameData {
    constructor() {
        this.name = "";
        this.level = 0;
        this.experience = 0;
        this.strength = 0;
        this.speed = 0;
        this.health = 0;
        this.currentHealth = 0;
        this.gold = 0;
        // Each item/weapon/armor is a reference
        // Serializing and de-serializing requires id lookup
        this.armor = null;
        this.weapon = null;
        this.items = [];
        // Position in the world
        this.currentMap = "";
        this.x = 0;
        this.y = 0;
    }
    getArmorCount() {
        if (this.armor === null) {
            return 0;
        }
        return this.armor.rating;
    }
    getWeaponCount() {
        if (this.weapon === null) {
            return 0;
        }
        return this.weapon.rating;
    }
}