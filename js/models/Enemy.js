export class Enemy {
    constructor(creatureData, x, y, canMove, specialId, shouldPermanentlyDie) {
        this.x = x;
        this.y = y;
        // The creature stats
        this.creatureData = creatureData;
        // Determines if the enemy follows the player or stands still
        this.canMove = canMove;
        // A special id for a manually placed enemy, allows specific logic and tracking
        this.specialId = specialId;
        // Marks if an enemy with a special id should respawn
        this.shouldPermanentlyDie = shouldPermanentlyDie;
    }
}