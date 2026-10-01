const startingWeaponByProficiency = {
    sword: 'Iron Sword',
    lance: 'Iron Lance',
    axe: 'Iron Axe',
    bow: 'Iron Bow',
    dagger: 'Iron Dagger',
    gauntlets: 'Iron Gauntlets',
    anima: 'Anima',
    light: 'Light',
    dark: 'Flux',
    strike: 'Strike',
    talon: 'Talon',
    breath: 'Breath',
    'shifting-stone': 'Shifting Stone',
    staff: 'Heal',
    curse: 'Curse',
};

const characterCreationRules = {
    startingLevel: 1,

    startingGold: 1000,

    startingItems: [
        {
            name: 'Herb',
            quantity: 1,
        },
    ],

    combatStatPoints: 12,

    nonCombatStatPoints: 6,

    combatStatMinimums: {
        hp: 15,
        attack: 3,
        defense: 3,
        dexterity: 3,
        speed: 3,
        resistance: 3,
        luck: 3,
    },

    combatStatMaximums: {
        hp: 20,
        attack: 8,
        defense: 8,
        dexterity: 8,
        speed: 8,
        resistance: 8,
        luck: 8,
    },

    nonCombatStatMinimum: 0,
    nonCombatStatMaximum: 3,
};

function getStartingWeaponName(proficiencyId) {
    return startingWeaponByProficiency[proficiencyId] ?? null;
}

export {
    startingWeaponByProficiency,
    characterCreationRules,
    getStartingWeaponName,
};