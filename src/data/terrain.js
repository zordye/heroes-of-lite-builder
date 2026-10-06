export const TERRAIN_MOVE_TYPES = {
    STANDARD: 'standard',
    ROUGH: 'rough',
    DIFFICULT: 'difficult',
    IMPASSABLE: 'impassable',
};

export const terrainTypes = [
    {
        id: 'plains',
        name: 'Plains / Floor',
        moveType: TERRAIN_MOVE_TYPES.STANDARD,
        statBonuses: {},
        hpChange: 0,
        description: 'No terrain effect.',
    },
    {
        id: 'forest',
        name: 'Forest / Pillar',
        moveType: TERRAIN_MOVE_TYPES.ROUGH,
        statBonuses: {
            defense: 1,
            avoid: 2,
        },
        hpChange: 0,
        description: '+2 Avoid, +1 Defense.',
    },
    {
        id: 'mountain',
        name: 'Mountain / Sandbag',
        moveType: TERRAIN_MOVE_TYPES.DIFFICULT,
        statBonuses: {
            defense: 3,
            avoid: 3,
        },
        hpChange: 0,
        description: '+3 Avoid, +3 Defense.',
    },
    {
        id: 'fort',
        name: 'Fort / Throne',
        moveType: TERRAIN_MOVE_TYPES.ROUGH,
        statBonuses: {
            avoid: 2,
        },
        hpChange: 3,
        description: '+2 Avoid. Recover 3 HP when the unit’s turn starts.',
    },
    {
        id: 'water',
        name: 'Water',
        moveType: TERRAIN_MOVE_TYPES.DIFFICULT,
        statBonuses: {
            defense: 2,
            avoid: 4,
        },
        hpChange: 0,
        description: '+4 Avoid, +2 Defense.',
    },
    {
        id: 'desert',
        name: 'Desert / Rubble',
        moveType: TERRAIN_MOVE_TYPES.ROUGH,
        statBonuses: {},
        hpChange: 0,
        description:
            'Rough Terrain, except for Infantry with Anima, Light, or Dark Magic equipped.',
    },
    {
        id: 'house',
        name: 'House / Altar',
        moveType: TERRAIN_MOVE_TYPES.STANDARD,
        statBonuses: {
            avoid: 1,
        },
        hpChange: 0,
        description: '+1 Avoid.',
    },
    {
        id: 'miasma',
        name: 'Miasma',
        moveType: TERRAIN_MOVE_TYPES.STANDARD,
        statBonuses: {},
        hpChange: -3,
        description: 'Lose 3 HP when the unit’s turn starts.',
    },
    {
        id: 'pitfall',
        name: 'Pitfall',
        moveType: TERRAIN_MOVE_TYPES.DIFFICULT,
        statBonuses: {},
        hpChange: 0,
        description:
            'Inflicts Shocked when stopped on. Once revealed, becomes Difficult Terrain.',
    },
    {
        id: 'magic-tile',
        name: 'Magic Tile / Magic Vein',
        moveType: TERRAIN_MOVE_TYPES.STANDARD,
        statBonuses: {},
        hpChange: 0,
        description: 'Recover the unit’s Status when their turn starts.',
    },
    {
        id: 'cursed-tile',
        name: 'Cursed Tile / Cursed Vein',
        moveType: TERRAIN_MOVE_TYPES.STANDARD,
        statBonuses: {},
        hpChange: 0,
        description: 'Inflicts Silenced when stopped on.',
    },
    {
        id: 'wall',
        name: 'Wall',
        moveType: TERRAIN_MOVE_TYPES.IMPASSABLE,
        statBonuses: {},
        hpChange: 0,
        description: 'Impassable Terrain.',
    },
    {
        id: 'cracked-wall',
        name: 'Cracked Wall',
        moveType: TERRAIN_MOVE_TYPES.IMPASSABLE,
        statBonuses: {},
        hpChange: 0,
        description:
            'Impassable until destroyed. Then becomes Standard Terrain.',
    },
    {
        id: 'door',
        name: 'Door / Gate',
        moveType: TERRAIN_MOVE_TYPES.IMPASSABLE,
        statBonuses: {},
        hpChange: 0,
        description:
            'Impassable while closed. Becomes Standard Terrain when opened.',
    },
    {
        id: 'chest',
        name: 'Chest / Crate',
        moveType: TERRAIN_MOVE_TYPES.STANDARD,
        statBonuses: {},
        hpChange: 0,
        description: 'Contains an item.',
    },
];

export function getTerrainById(id) {
    return terrainTypes.find((terrain) => terrain.id === id) ?? null;
}

export default terrainTypes;