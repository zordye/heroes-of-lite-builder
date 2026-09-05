const supportTypes = [
    {
        id: 'cavalry',
        name: 'Cavalry',
        bonuses: {
            C: {
                attack: 1,
            },
            B: {
                attack: 2,
            },
            A: {
                attack: 2,
                hit: 1,
            },
            S: {
                attack: 3,
                hit: 1,
            },
        },
    },

    {
        id: 'flier',
        name: 'Flier',
        bonuses: {
            C: {
                speed: 1,
            },
            B: {
                speed: 2,
            },
            A: {
                speed: 2,
                avoid: 1,
            },
            S: {
                speed: 3,
                avoid: 1,
            },
        },
    },

    {
        id: 'armor',
        name: 'Armor',
        bonuses: {
            C: {
                defense: 1,
            },
            B: {
                defense: 1,
                resistance: 1,
            },
            A: {
                defense: 2,
                resistance: 2,
            },
            S: {
                defense: 3,
                resistance: 3,
            },
        },
    },
];

export default supportTypes;