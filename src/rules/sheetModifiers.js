
export const PERFORM_STATS = [
    { id: 'attack', name: 'Attack' },
    { id: 'defense', name: 'Defense' },
    { id: 'dexterity', name: 'Dexterity' },
    { id: 'speed', name: 'Speed' },
    { id: 'resistance', name: 'Resistance' },
    { id: 'luck', name: 'Luck' },
];

export const RALLY_EFFECTS = [
    {
        id: 'offenses',
        name: 'Rally Offenses',
        description: 'Attack +3, Hit +1',
        bonuses: { attack: 3, hit: 1 },
    },
    {
        id: 'reflexes',
        name: 'Rally Reflexes',
        description: 'Speed +3, Avoid +1',
        bonuses: { speed: 3, avoid: 1 },
    },
    {
        id: 'defenses',
        name: 'Rally Defenses',
        description: 'Defense +2, Resistance +2',
        bonuses: { defense: 2, resistance: 2 },
    },
    {
        id: 'movement',
        name: 'Rally Movement',
        description: 'Movement +1',
        bonuses: { movement: 1 },
    },
];

export function hasPerform(character) {
    const slots = Object.values(character.skillSlots ?? {});
    const selected = [
        ...slots,
        ...(character.additionalSkills ?? []),
    ];

    return selected.some((skill) => {
        if (typeof skill === 'string') {
            return skill.toLowerCase() === 'perform';
        }

        return (
            skill?.id?.toLowerCase() === 'perform' ||
            skill?.name?.toLowerCase() === 'perform'
        );
    });
}

export function getPerformPenalty(character, stat) {
    if (!hasPerform(character)) return 0;

    if (stat === 'hp') return -3;

    return (character.performStats ?? []).includes(stat)
        ? -2
        : 0;
}

export function validPerformSelection(stats) {
    return (
        Array.isArray(stats) &&
        stats.length === 4 &&
        new Set(stats).size === 4 &&
        stats.every((stat) =>
            PERFORM_STATS.some((option) => option.id === stat)
        )
    );
}

export function getRallyBonus(character, stat) {
    const active = character.combatModifiers?.rallies ?? [];

    return RALLY_EFFECTS.reduce((total, rally) => {
        if (!active.includes(rally.id)) return total;
        return total + (rally.bonuses[stat] ?? 0);
    }, 0);
}

export function getEffectiveMight(baseMight, effective) {
    return effective ? baseMight * 3 : baseMight;
}

export function getMatchupHitBonus(matchup) {
    if (matchup === 'advantage') return 2;
    if (matchup === 'disadvantage') return -2;
    return 0;
}

export function getMatchupPower(power, tri, matchup) {
    if (matchup === 'advantage') return power + tri;
    if (matchup === 'disadvantage') return power - tri;
    return power;
}
