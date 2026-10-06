import { getTerrainById } from '../data/terrain';
import { getMovementTypeById } from '../data/movementTypes';

export function getCharacterTerrain(character) {
    return getTerrainById(character?.terrain) ?? null;
}

export function ignoresTerrainStatEffects(character) {
    const movementType = getMovementTypeById(character?.movementType);

    return movementType?.id === 'flier';
}

export function getTerrainStatBonus(character, stat) {
    const terrain = getCharacterTerrain(character);

    if (!terrain) {
        return 0;
    }

    // Fliers ignore positive and negative terrain effects,
    // except effects that gain or lose HP.
    if (ignoresTerrainStatEffects(character)) {
        return 0;
    }

    return terrain.statBonuses?.[stat] ?? 0;
}

export function getTerrainHpChange(character) {
    const terrain = getCharacterTerrain(character);

    return terrain?.hpChange ?? 0;
}

export function getTerrainMoveType(character) {
    return getCharacterTerrain(character)?.moveType ?? null;
}

export function getTerrainDescription(character) {
    return getCharacterTerrain(character)?.description ?? '';
}