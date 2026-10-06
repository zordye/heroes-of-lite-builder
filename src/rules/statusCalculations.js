import {
    getActiveStatusEffects,
    hasStatus,
} from '../data/statusEffects';

export function getStatusStatModifier(character, stat) {
    return getActiveStatusEffects(character).reduce(
        (total, status) => total + (status.statModifiers?.[stat] ?? 0),
        0
    );
}

export function getStatusStatOverride(character, stat) {
    const statuses = getActiveStatusEffects(character);

    for (const status of statuses) {
        if (status.statOverrides?.[stat] !== undefined) {
            return status.statOverrides[stat];
        }
    }

    return null;
}

export function hasStatusStatOverride(character, stat) {
    return getStatusStatOverride(character, stat) !== null;
}

export function isPoisoned(character) {
    return hasStatus(character, 'poisoned');
}

export function isSilenced(character) {
    return hasStatus(character, 'silenced');
}

export function isBerserk(character) {
    return hasStatus(character, 'berserk');
}

export function isBroken(character) {
    return hasStatus(character, 'broken');
}

export function isShocked(character) {
    return hasStatus(character, 'shocked');
}

export function isInjured(character) {
    return hasStatus(character, 'injured');
}