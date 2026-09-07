const combatStats = [
    {
        id: 'hp',
        name: 'HP',
        description:
            'Hit Points. A unit is rendered unconscious when their HP reaches 0.',
        levelOneMinimum: 15,
    },
    {
        id: 'attack',
        name: 'Attack',
        description:
            'Used when calculating Power.',
        levelOneMinimum: 3,
    },
    {
        id: 'defense',
        name: 'Defense',
        description:
            'Reduces damage taken from physical attacks.',
        levelOneMinimum: 3,
    },
    {
        id: 'dexterity',
        name: 'Dexterity',
        description:
            'Affects Hit and Finesse.',
        levelOneMinimum: 3,
    },
    {
        id: 'speed',
        name: 'Speed',
        description:
            'Determines follow-up attacks and contributes to Acrobatics.',
        levelOneMinimum: 3,
    },
    {
        id: 'resistance',
        name: 'Resistance',
        description:
            'Reduces damage taken from magical attacks.',
        levelOneMinimum: 3,
    },
    {
        id: 'luck',
        name: 'Luck',
        description:
            'Affects Avoid and contributes to Fate.',
        levelOneMinimum: 3,
    },
];

const nonCombatStats = [
    {
        id: 'strength',
        name: 'Strength',
        type: 'allocated',
        minimum: 0,
        maximum: 3,
        description:
            'Used for physical tasks such as lifting or moving objects. Also contributes to Aid.',
    },
    {
        id: 'intellect',
        name: 'Intellect',
        type: 'allocated',
        minimum: 0,
        maximum: 3,
        description:
            'Represents knowledge gained through study, books, or instruction.',
    },
    {
        id: 'perception',
        name: 'Perception',
        type: 'allocated',
        minimum: 0,
        maximum: 3,
        description:
            'Used to notice important details and perceive things such as deception.',
    },
    {
        id: 'charisma',
        name: 'Charisma',
        type: 'allocated',
        minimum: 0,
        maximum: 3,
        description:
            'Represents a character’s presence and is used for things such as charm or intimidation.',
    },
    {
        id: 'fate',
        name: 'Fate',
        type: 'derived',
        maximum: 3,
        sourceStat: 'luck',
        divisor: 5,
        description:
            'Used for non-combat luck-based rolls. Derived from Luck.',
    },
    {
        id: 'finesse',
        name: 'Finesse',
        type: 'derived',
        maximum: 3,
        sourceStat: 'dexterity',
        divisor: 5,
        description:
            'Represents fine motor control and precision. Derived from Dexterity.',
    },
    {
        id: 'acrobatics',
        name: 'Acrobatics',
        type: 'derived',
        maximum: 3,
        sourceStat: 'speed',
        divisor: 5,
        description:
            'Used for running, jumping, and other physical feats. Derived from Speed.',
    },
];

const statRules = {
    levelOneCombatPoints: 12,
    levelUpPointsPerLevel: 3,
    nonCombatAllocationPoints: 6,
};

export {
    combatStats,
    nonCombatStats,
    statRules,
};