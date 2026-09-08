import { getStatCap } from './progressionCalculations';

function getPermanentStat(character, statId) {
    const base = character.stats?.base?.[statId] ?? 0;
    const levelUp = character.stats?.levelUp?.[statId] ?? 0;

    return base + levelUp;
}

function getFinalStat(character, statId, extraModifiers = 0) {
    const permanent = getPermanentStat(character, statId);
    const temporary = character.stats?.temporary?.[statId] ?? 0;

    return permanent + temporary + extraModifiers;
}

function getHit(character) {
    const dexterity = getFinalStat(character, 'dexterity');

    return Math.floor(dexterity / 4);
}

function getAvoid(character) {
    const luck = getFinalStat(character, 'luck');

    return Math.floor(luck / 4) + 4;
}

function getCriticalAvoid(character) {
    return getAvoid(character) + 15;
}

function getPower(character, might = 0) {
    const attack = getFinalStat(character, 'attack');

    return attack + might;
}

function getTri(character, might = 0) {
    const power = getPower(character, might);

    return Math.floor(power / 5);
}

function getTotalSize(character) {
    const size = character.size ?? 0;

    return character.isTransformed
        ? size + 2
        : size;
}

function getCon(character) {
    const totalSize = getTotalSize(character);

    const armorBonus =
        character.movementType === 'armor'
            ? 2
            : 0;

    return totalSize + armorBonus;
}

function getAid(character, movementTypeData) {
    const strength = character.nonCombatStats?.strength ?? 0;
    const baseAid = movementTypeData?.baseAid ?? 0;

    return strength + baseAid;
}

function isStatWithinNormalCap(character, statId) {
    const permanentValue = getPermanentStat(character, statId);
    const cap = getStatCap(character.level, statId);

    return permanentValue <= cap;
}

export {
    getPermanentStat,
    getFinalStat,
    getHit,
    getAvoid,
    getCriticalAvoid,
    getPower,
    getTri,
    getTotalSize,
    getCon,
    getAid,
    isStatWithinNormalCap,
};