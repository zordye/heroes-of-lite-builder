export const statusEffects = [
    {
        id: 'poisoned',
        name: 'Poisoned',
        statModifiers: {},
        statOverrides: {},
        description:
            'Unit loses 4 HP at the start of their phase. This can reduce HP to 0.',
    },
    {
        id: 'silenced',
        name: 'Silenced',
        statModifiers: {},
        statOverrides: {},
        description:
            'Unit cannot use Magical weapons or Staff Effects, but may still equip them.',
    },
    {
        id: 'berserk',
        name: 'Berserk',
        statModifiers: {},
        statOverrides: {},
        description:
            'Unit attacks nearby units indiscriminately, regardless of affiliation.',
    },
    {
        id: 'broken',
        name: 'Broken',
        statModifiers: {},
        statOverrides: {},
        description: 'Unit cannot counterattack.',
    },
    {
        id: 'shocked',
        name: 'Shocked',
        statModifiers: {},
        statOverrides: {
            movement: 0,
            avoid: 0,
            criticalAvoid: 15,
        },
        description:
            'Unit cannot move, but may still use Actions. Avoid is set to 0 and Critical Avoid to 15.',
    },
    {
        id: 'injured',
        name: 'Injured',
        statModifiers: {
            attack: -3,
            speed: -3,
            defense: -3,
            resistance: -3,
        },
        statOverrides: {},
        description:
            'Attack, Speed, Defense, and Resistance are reduced by 3.',
    },
];

export function getStatusEffectById(id) {
    return statusEffects.find((status) => status.id === id) ?? null;
}

export function getActiveStatusEffects(character) {
    return (character.statuses ?? [])
        .map(getStatusEffectById)
        .filter(Boolean);
}

export function hasStatus(character, statusId) {
    return (character.statuses ?? []).includes(statusId);
}

export default statusEffects;