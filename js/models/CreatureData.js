export const CREATURE_BABY_CHICKEN = {id: 1, stringId: "baby-chicken", name: "Baby Chicken", image: "baby-chicken.png", health: 10, strength: 4, speed: 8, gold: 5, experience: 5, weaponCount: 0,  armorCount: 0, encounterLine: "Extremely adorable, easy experience. Good thing the town doesn't have laws against killing cute creatures."}

export const CREATURES = [CREATURE_BABY_CHICKEN];

export function GetCreatureDataByStringId(stringId) {
    for (const creature of CREATURES) {
        if (creature.stringId === stringId) {
            return creature;
        }
    }
    return null;
}