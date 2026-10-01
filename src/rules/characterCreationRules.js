import {
    characterCreationRules,
    getStartingWeaponName,
} from '../data/characterCreation';

import {
    getStatCap,
} from './progressionCalculations';

import {
    getConnectedStatPairStatus,
} from './optionalRuleCalculations';

// =========================================================
// COMBAT STAT POINTS
// =========================================================

function getCombatStatPointsSpent(character) {
    const minimums =
        characterCreationRules.combatStatMinimums;

    return Object.entries(minimums).reduce(
        (total, [statId, minimum]) => {
            const current =
                character.stats?.base?.[statId] ??
                minimum;

            return total + Math.max(0, current - minimum);
        },
        0
    );
}

function getCombatStatPointsRemaining(character) {
    return (
        characterCreationRules.combatStatPoints -
        getCombatStatPointsSpent(character)
    );
}

// =========================================================
// LEVEL 1 INDIVIDUAL STAT VALIDATION
// =========================================================

function getCombatStatCreationStatus(
    character,
    statId
) {
    const value =
        character.stats?.base?.[statId] ?? 0;

    const minimum =
        characterCreationRules.combatStatMinimums[
        statId
        ];

    const maximum = getStatCap(1, statId);

    if (
        minimum === undefined ||
        maximum === null
    ) {
        return null;
    }

    return {
        statId,
        value,
        minimum,
        maximum,
        belowMinimum: value < minimum,
        aboveMaximum: value > maximum,
        valid:
            value >= minimum &&
            value <= maximum,
    };
}

function getAllCombatStatCreationStatuses(
    character
) {
    return Object.keys(
        characterCreationRules.combatStatMinimums
    ).map((statId) =>
        getCombatStatCreationStatus(
            character,
            statId
        )
    );
}

// =========================================================
// NON-COMBAT STAT POINTS
// =========================================================

function getNonCombatStatPointsSpent(character) {
    const stats = character.nonCombatStats ?? {};

    return (
        (stats.strength ?? 0) +
        (stats.intellect ?? 0) +
        (stats.perception ?? 0) +
        (stats.charisma ?? 0)
    );
}

function getNonCombatStatPointsRemaining(
    character
) {
    return (
        characterCreationRules.nonCombatStatPoints -
        getNonCombatStatPointsSpent(character)
    );
}

function getNonCombatStatCreationStatus(
    character,
    statId
) {
    const value =
        character.nonCombatStats?.[statId] ?? 0;

    const minimum =
        characterCreationRules.nonCombatStatMinimum;

    const maximum =
        characterCreationRules.nonCombatStatMaximum;

    return {
        statId,
        value,
        minimum,
        maximum,
        belowMinimum: value < minimum,
        aboveMaximum: value > maximum,
        valid:
            value >= minimum &&
            value <= maximum,
    };
}

function getAllNonCombatStatCreationStatuses(
    character
) {
    return [
        'strength',
        'intellect',
        'perception',
        'charisma',
    ].map((statId) =>
        getNonCombatStatCreationStatus(
            character,
            statId
        )
    );
}

// =========================================================
// CONNECTED STAT CAPS
// =========================================================

function getConnectedStatCreationStatuses(
    character
) {
    if (
        !character.optionalRules?.connectedStatCaps
    ) {
        return [];
    }

    return [
        'attack-speed',
        'dexterity-luck',
        'defense-resistance',
    ].map((pairId) =>
        getConnectedStatPairStatus(
            character,
            pairId
        )
    );
}

// =========================================================
// STARTING WEAPON
// =========================================================

function getStartingWeaponForCharacter(
    character
) {
    const startingProficiency =
        character.weaponProficiencies?.[0];

    if (!startingProficiency) {
        return null;
    }

    const weaponName =
        getStartingWeaponName(
            startingProficiency
        );

    if (!weaponName) {
        return null;
    }

    return {
        proficiency: startingProficiency,
        weaponName,
    };
}

// =========================================================
// CHARACTER CREATION VALIDATION
// =========================================================

function validateCharacterCreation(character) {
    const errors = [];

    // -------------------------------------------------------
    // BASIC INFORMATION
    // -------------------------------------------------------

    if (!character.name?.trim()) {
        errors.push('Character name is required.');
    }

    if (!character.playerName?.trim()) {
        errors.push('Player name is required.');
    }

    if (!character.movementType) {
        errors.push('Movement Type is required.');
    }

    if (character.size === null) {
        errors.push('Size must be selected.');
    }

    if (
        !character.weaponProficiencies?.length
    ) {
        errors.push(
            'A starting Weapon Proficiency is required.'
        );
    }

    // -------------------------------------------------------
    // COMBAT STATS
    // -------------------------------------------------------

    const combatStatuses =
        getAllCombatStatCreationStatuses(
            character
        );

    combatStatuses.forEach((status) => {
        if (!status?.valid) {
            errors.push(
                `${status.statId} must be between ${status.minimum} and ${status.maximum}.`
            );
        }
    });

    const combatPointsRemaining =
        getCombatStatPointsRemaining(character);

    if (combatPointsRemaining > 0) {
        errors.push(
            `${combatPointsRemaining} combat stat point(s) remain unspent.`
        );
    }

    if (combatPointsRemaining < 0) {
        errors.push(
            `${Math.abs(
                combatPointsRemaining
            )} too many combat stat point(s) have been spent.`
        );
    }

    // -------------------------------------------------------
    // CONNECTED STAT CAPS
    // -------------------------------------------------------

    const connectedStatuses =
        getConnectedStatCreationStatuses(
            character
        );

    connectedStatuses.forEach((status) => {
        if (
            status &&
            !status.isWithinCap
        ) {
            errors.push(
                `${status.stats.join(
                    ' + '
                )} exceeds the connected stat cap of ${status.cap
                }.`
            );
        }
    });

    // -------------------------------------------------------
    // NON-COMBAT STATS
    // -------------------------------------------------------

    const nonCombatStatuses =
        getAllNonCombatStatCreationStatuses(
            character
        );

    nonCombatStatuses.forEach((status) => {
        if (!status.valid) {
            errors.push(
                `${status.statId} must be between ${status.minimum} and ${status.maximum}.`
            );
        }
    });

    const nonCombatPointsRemaining =
        getNonCombatStatPointsRemaining(
            character
        );

    if (nonCombatPointsRemaining > 0) {
        errors.push(
            `${nonCombatPointsRemaining} non-combat stat point(s) remain unspent.`
        );
    }

    if (nonCombatPointsRemaining < 0) {
        errors.push(
            `${Math.abs(
                nonCombatPointsRemaining
            )} too many non-combat stat point(s) have been spent.`
        );
    }

    // -------------------------------------------------------
    // RESULT
    // -------------------------------------------------------

    return {
        valid: errors.length === 0,
        errors,
    };
}

export {
    getCombatStatPointsSpent,
    getCombatStatPointsRemaining,
    getCombatStatCreationStatus,
    getAllCombatStatCreationStatuses,
    getNonCombatStatPointsSpent,
    getNonCombatStatPointsRemaining,
    getNonCombatStatCreationStatus,
    getAllNonCombatStatCreationStatuses,
    getConnectedStatCreationStatuses,
    getStartingWeaponForCharacter,
    validateCharacterCreation,
};