const connectedStatPairs = [
    {
        id: 'attack-speed',
        stats: ['attack', 'speed'],
    },
    {
        id: 'dexterity-luck',
        stats: ['dexterity', 'luck'],
    },
    {
        id: 'defense-resistance',
        stats: ['defense', 'resistance'],
    },
];

const connectedStatCapBands = [
    {
        minLevel: 1,
        maxLevel: 10,
        cap: 16,
    },
    {
        minLevel: 11,
        maxLevel: 15,
        cap: 24,
    },
    {
        minLevel: 16,
        maxLevel: 20,
        cap: 32,
    },
    {
        minLevel: 21,
        maxLevel: 25,
        cap: 40,
    },
    {
        minLevel: 26,
        maxLevel: Infinity,
        cap: 46,
    },
];

const optionalRules = {
    connectedStatCaps: {
        name: 'Connected Stat Caps',
        description:
            'Connects certain combat stats and limits their combined permanent values based on level.',
        defaultEnabled: false,
        pairs: connectedStatPairs,
        capBands: connectedStatCapBands,
    },
};

export {
    connectedStatPairs,
    connectedStatCapBands,
    optionalRules,
};