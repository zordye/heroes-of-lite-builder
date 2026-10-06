// src/rules/supportCalculations.js

import { supportTypes } from '../data/supportTypes';

// =========================================================
// INTERNAL HELPERS
// =========================================================

function getSupportTypeData(supportTypeId) {
    if (!supportTypeId) {
        return null;
    }

    if (Array.isArray(supportTypes)) {
        return (
            supportTypes.find(
                (supportType) =>
                    supportType.id === supportTypeId
            ) ?? null
        );
    }

    return supportTypes[supportTypeId] ?? null;
}

// =========================================================
// ACTIVE SUPPORT
// =========================================================
//
// A character may have multiple support relationships,
// but only the support currently affecting the character
// should modify their displayed stats.
//
// Each support relationship can therefore have:
//
// active: true / false
//
// We do NOT automatically determine whether the partner is
// close enough. The player tells the sheet which support is
// currently active.
// =========================================================

export function getActiveSupport(character) {
    if (!Array.isArray(character?.supports)) {
        return null;
    }

    return (
        character.supports.find(
            (support) => support.active === true
        ) ?? null
    );
}

// =========================================================
// SUPPORT TYPE
// =========================================================
//
// IMPORTANT:
//
// The bonuses RECEIVED by this character are determined by
// the PARTNER'S Support Type.
//
// Therefore each support relationship stores the partner's
// supportType.
// =========================================================

export function getActiveSupportType(character) {
    const support =
        getActiveSupport(character);

    if (!support) {
        return null;
    }

    return getSupportTypeData(
        support.supportType
    );
}

// =========================================================
// SUPPORT RANK
// =========================================================

export function getActiveSupportRank(character) {
    return (
        getActiveSupport(character)?.rank ??
        null
    );
}

// =========================================================
// SUPPORT BONUSES
// =========================================================

export function getSupportBonuses(character) {
    const support =
        getActiveSupport(character);

    const supportType =
        getActiveSupportType(character);

    if (
        !support ||
        !supportType ||
        !support.rank
    ) {
        return {};
    }

    return (
        supportType.bonuses?.[
        support.rank
        ] ?? {}
    );
}

// =========================================================
// INDIVIDUAL BONUS
// =========================================================
//
// Works for:
//
// attack
// speed
// defense
// resistance
// hit
// avoid
//
// Any stat not granted by the current support simply
// returns 0.
// =========================================================

export function getSupportBonus(
    character,
    stat
) {
    return (
        getSupportBonuses(character)?.[
        stat
        ] ?? 0
    );
}

// =========================================================
// SUPPORT SUMMARY
// =========================================================
//
// Useful later for the character sheet UI.
// =========================================================

export function getActiveSupportSummary(
    character
) {
    const support =
        getActiveSupport(character);

    if (!support) {
        return null;
    }

    const supportType =
        getActiveSupportType(character);

    return {
        id: support.id ?? null,

        name:
            support.name ??
            support.characterName ??
            '',

        rank:
            support.rank ?? null,

        supportTypeId:
            support.supportType ?? null,

        supportTypeName:
            supportType?.name ?? '',

        bonuses:
            getSupportBonuses(character),
    };
}