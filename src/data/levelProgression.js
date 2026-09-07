const statCapBands = [
    {
        minLevel: 1,
        maxLevel: 1,
        hpCap: 20,
        otherStatCap: 8,
    },
    {
        minLevel: 2,
        maxLevel: 10,
        hpCap: 30,
        otherStatCap: 12,
    },
    {
        minLevel: 11,
        maxLevel: 15,
        hpCap: 35,
        otherStatCap: 16,
    },
    {
        minLevel: 16,
        maxLevel: 20,
        hpCap: 40,
        otherStatCap: 20,
    },
    {
        minLevel: 21,
        maxLevel: 25,
        hpCap: 45,
        otherStatCap: 24,
    },
    {
        minLevel: 26,
        maxLevel: Infinity,
        hpCap: 50,
        otherStatCap: 30,
    },
];

const levelMilestones = [
    {
        level: 5,
        type: 'skill',
        name: 'New Skill',
    },
    {
        level: 7,
        type: 'attribute',
        name: 'Basic Attribute',
        attributeRequirement: 'basic',
    },
    {
        level: 10,
        type: 'skill',
        name: 'New Skill',
    },
    {
        level: 15,
        type: 'skill',
        name: 'New Skill',
    },
    {
        level: 17,
        type: 'attribute',
        name: 'Weapon Attribute',
        rules: {
            weaponWithBasicRefine: 'any',
            weaponWithoutRefines: 'basic',
        },
    },
    {
        level: 20,
        type: 'skill',
        name: 'New Skill',
    },
    {
        level: 25,
        type: 'skill',
        name: 'New Skill',
    },
    {
        level: 27,
        type: 'attribute',
        name: 'Any Attribute',
        attributeRequirement: 'any',
    },
    {
        level: 30,
        type: 'skill',
        name: 'New Skill',
    },
];

const progressionRules = {
    suggestedLevelCap: 30,
    statPointsPerLevel: 3,
};

export {
    statCapBands,
    levelMilestones,
    progressionRules,
};