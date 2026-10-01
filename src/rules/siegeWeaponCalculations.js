// src/rules/siegeWeaponCalculations.js

import {
    getSiegeWeaponById,
} from '../data/siegeWeapons';

import {
    getWeaponRefinementById,
    isRefinementCompatibleWithWeapon,
} from '../data/weaponRefinements';

// =========================================================
// INTERNAL HELPERS
// =========================================================

function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function getRefinementIds(siegeWeapon) {
    if (!Array.isArray(siegeWeapon?.refinements)) {
        return [];
    }

    return siegeWeapon.refinements.filter(Boolean);
}

function getSelectedRefinements(siegeWeapon) {
    return getRefinementIds(siegeWeapon)
        .map((refinementId) =>
            getWeaponRefinementById(refinementId)
        )
        .filter(Boolean);
}

// =========================================================
// BASE SIEGE WEAPON
// =========================================================

export function getSiegeWeaponBaseData(
    siegeWeapon
) {
    if (!siegeWeapon?.baseWeaponId) {
        return null;
    }

    return getSiegeWeaponById(
        siegeWeapon.baseWeaponId
    );
}

// =========================================================
// SELECTED REFINEMENTS
// =========================================================

export function getSiegeWeaponSelectedRefinements(
    siegeWeapon
) {
    return getSelectedRefinements(
        siegeWeapon
    );
}

// =========================================================
// MIGHT
// =========================================================
//
// Siege Might is completely independent of the character.
//
// Character Attack, Dexterity, Power, etc. are NEVER used.
//
// Calculation:
//
// Base Siege Might
// + refinement Might
// = normal Siege Might
//
// If Effective:
// normal Siege Might × 3
// =========================================================

export function getSiegeWeaponMight(
    siegeWeapon,
    effective = false
) {
    const baseWeapon =
        getSiegeWeaponBaseData(siegeWeapon);

    if (!baseWeapon) {
        return 0;
    }

    let might = toNumber(
        baseWeapon.might
    );

    for (const refinement of getSelectedRefinements(
        siegeWeapon
    )) {
        if (
            refinement?.effect?.type === 'might'
        ) {
            might += toNumber(
                refinement.effect.amount
            );
        }
    }

    if (effective === true) {
        might *= 3;
    }

    return might;
}

// =========================================================
// NORMAL MIGHT
// =========================================================
//
// Useful when the UI wants to show:
//
// Might: 39
// Normal Might: 13
//
// while Effective is active.
// =========================================================

export function getSiegeWeaponNormalMight(
    siegeWeapon
) {
    return getSiegeWeaponMight(
        siegeWeapon,
        false
    );
}

// =========================================================
// RANGE
// =========================================================
//
// Current base Siege range:
//
// Stonehoist: 3-10
// Magic Orb:  3-10
//
// This also supports future Siege refinements that alter
// range without connecting Siege weapons to the normal
// character weapon system.
// =========================================================

export function getSiegeWeaponRange(
    siegeWeapon
) {
    const baseWeapon =
        getSiegeWeaponBaseData(siegeWeapon);

    if (!baseWeapon?.range) {
        return {
            min: 0,
            max: 0,
        };
    }

    let min = toNumber(
        baseWeapon.range.min
    );

    let max = toNumber(
        baseWeapon.range.max
    );

    const refinements =
        getSelectedRefinements(
            siegeWeapon
        );

    // -------------------------------------------------------
    // Normal range adjustments
    // -------------------------------------------------------

    for (const refinement of refinements) {
        const effect =
            refinement?.effect;

        if (!effect) {
            continue;
        }

        if (effect.type === 'range-min') {
            min += toNumber(
                effect.amount
            );

            if (
                Number.isFinite(
                    Number(effect.minimum)
                )
            ) {
                min = Math.max(
                    toNumber(effect.minimum),
                    min
                );
            }
        }

        if (effect.type === 'range-max') {
            max += toNumber(
                effect.amount
            );
        }
    }

    // -------------------------------------------------------
    // Range overrides happen last.
    // -------------------------------------------------------

    for (const refinement of refinements) {
        const effect =
            refinement?.effect;

        if (
            effect?.type !==
            'range-override'
        ) {
            continue;
        }

        min = toNumber(
            effect.min,
            min
        );

        max = toNumber(
            effect.max,
            max
        );
    }

    return {
        min,
        max,
    };
}

// =========================================================
// FORMATTED RANGE
// =========================================================

export function formatSiegeWeaponRange(
    siegeWeapon
) {
    const range =
        getSiegeWeaponRange(
            siegeWeapon
        );

    if (
        range.min === 0 &&
        range.max === 0
    ) {
        return '-';
    }

    if (range.min === range.max) {
        return `${range.min}`;
    }

    return `${range.min}-${range.max}`;
}

// =========================================================
// EFFECTIVENESS TRAITS
// =========================================================
//
// This tells the UI what the Siege Weapon CAN be effective
// against.
//
// It does NOT automatically decide whether effectiveness
// currently applies.
//
// The player controls that using the shared Effective
// toggle on the character sheet.
// =========================================================

export function getSiegeWeaponEffectivenessTraits(
    siegeWeapon
) {
    const traits = new Set();

    for (const refinement of getSelectedRefinements(
        siegeWeapon
    )) {
        const effect =
            refinement?.effect;

        if (
            effect?.type === 'effectiveness' &&
            effect.trait
        ) {
            traits.add(
                effect.trait
            );
        }
    }

    return [...traits];
}

// =========================================================
// EFFECTIVENESS CHECK
// =========================================================

export function hasSiegeWeaponEffectiveness(
    siegeWeapon
) {
    return (
        getSiegeWeaponEffectivenessTraits(
            siegeWeapon
        ).length > 0
    );
}

// =========================================================
// AMMO
// =========================================================
//
// Ammo is manually entered.
//
// No attack, turn, or action automatically changes it.
// =========================================================

export function getSiegeWeaponAmmo(
    siegeWeapon
) {
    if (
        siegeWeapon?.unlimitedAmmo === true
    ) {
        return null;
    }

    if (
        siegeWeapon?.ammo === null ||
        siegeWeapon?.ammo === undefined ||
        siegeWeapon?.ammo === ''
    ) {
        return null;
    }

    return Math.max(
        0,
        Math.floor(
            toNumber(
                siegeWeapon.ammo
            )
        )
    );
}

// =========================================================
// AMMO DISPLAY
// =========================================================

export function getSiegeWeaponAmmoDisplay(
    siegeWeapon
) {
    if (
        siegeWeapon?.unlimitedAmmo === true
    ) {
        return '∞';
    }

    const ammo =
        getSiegeWeaponAmmo(
            siegeWeapon
        );

    if (ammo === null) {
        return '-';
    }

    return String(ammo);
}

// =========================================================
// ADVANCED REFINEMENTS
// =========================================================
//
// Siege weapons follow our builder restriction:
//
// Maximum 1 Advanced Attribute.
//
// Basic / GM-only attributes do not count toward this
// restriction.
// =========================================================

export function getSiegeWeaponAdvancedRefinements(
    siegeWeapon
) {
    return getSelectedRefinements(
        siegeWeapon
    ).filter(
        (refinement) =>
            refinement.category === 'advanced'
    );
}

export function hasTooManySiegeAdvancedRefinements(
    siegeWeapon
) {
    return (
        getSiegeWeaponAdvancedRefinements(
            siegeWeapon
        ).length > 1
    );
}

// =========================================================
// INVALID REFINEMENTS
// =========================================================
//
// Siege refinements use the pseudo weapon type:
//
// siege
//
// from weaponRefinements.js.
// =========================================================

export function getInvalidSiegeWeaponRefinements(
    siegeWeapon
) {
    const invalid = [];

    for (const refinementId of getRefinementIds(
        siegeWeapon
    )) {
        const refinement =
            getWeaponRefinementById(
                refinementId
            );

        // -----------------------------------------------------
        // Refinement ID doesn't exist
        // -----------------------------------------------------

        if (!refinement) {
            invalid.push({
                refinementId,
                reason:
                    'Unknown Siege Weapon refinement.',
            });

            continue;
        }

        // -----------------------------------------------------
        // Refinement isn't compatible with Siege weapons
        // -----------------------------------------------------

        if (
            !isRefinementCompatibleWithWeapon(
                refinementId,
                'siege'
            )
        ) {
            invalid.push({
                refinementId,
                refinement,
                reason:
                    'This refinement cannot be used on a Siege Weapon.',
            });
        }
    }

    return invalid;
}

// =========================================================
// VALIDATION
// =========================================================

export function validateSiegeWeapon(
    siegeWeapon
) {
    const errors = [];

    // -------------------------------------------------------
    // No Siege Weapon selected
    // -------------------------------------------------------

    if (!siegeWeapon?.baseWeaponId) {
        errors.push(
            'No Siege Weapon selected.'
        );

        return {
            valid: false,
            errors,
        };
    }

    // -------------------------------------------------------
    // Invalid base Siege Weapon
    // -------------------------------------------------------

    if (
        !getSiegeWeaponBaseData(
            siegeWeapon
        )
    ) {
        errors.push(
            'Invalid Siege Weapon.'
        );
    }

    // -------------------------------------------------------
    // Invalid refinements
    // -------------------------------------------------------

    const invalidRefinements =
        getInvalidSiegeWeaponRefinements(
            siegeWeapon
        );

    for (const invalid of invalidRefinements) {
        errors.push(
            invalid.reason
        );
    }

    // -------------------------------------------------------
    // Advanced Attribute limit
    // -------------------------------------------------------

    if (
        hasTooManySiegeAdvancedRefinements(
            siegeWeapon
        )
    ) {
        errors.push(
            'A Siege Weapon can have at most one Advanced Attribute.'
        );
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// =========================================================
// SIEGE WEAPON SUMMARY
// =========================================================
//
// This is what the eventual Siege Weapon sheet component
// can consume.
//
// IMPORTANT:
//
// There is intentionally no:
// - Attack
// - Dexterity
// - Hit
// - Avoid
// - Power
// - Tri
// - Character trait
// - Weapon proficiency
// - Character skill
//
// Siege Weapons are completely self-contained.
// =========================================================

export function getSiegeWeaponSummary(
    siegeWeapon,
    effective = false
) {
    const baseWeapon =
        getSiegeWeaponBaseData(
            siegeWeapon
        );

    if (!baseWeapon) {
        return {
            id: null,
            name: null,

            might: 0,
            normalMight: 0,

            effective:
                effective === true,

            range: {
                min: 0,
                max: 0,
            },

            rangeDisplay: '-',

            ammo: null,
            ammoDisplay: '-',

            refinements: [],

            effectivenessTraits: [],

            validation:
                validateSiegeWeapon(
                    siegeWeapon
                ),
        };
    }

    const range =
        getSiegeWeaponRange(
            siegeWeapon
        );

    return {
        id: baseWeapon.id,
        name: baseWeapon.name,

        might:
            getSiegeWeaponMight(
                siegeWeapon,
                effective
            ),

        normalMight:
            getSiegeWeaponNormalMight(
                siegeWeapon
            ),

        effective:
            effective === true,

        range,

        rangeDisplay:
            formatSiegeWeaponRange(
                siegeWeapon
            ),

        ammo:
            getSiegeWeaponAmmo(
                siegeWeapon
            ),

        ammoDisplay:
            getSiegeWeaponAmmoDisplay(
                siegeWeapon
            ),

        refinements:
            getSiegeWeaponSelectedRefinements(
                siegeWeapon
            ),

        effectivenessTraits:
            getSiegeWeaponEffectivenessTraits(
                siegeWeapon
            ),

        validation:
            validateSiegeWeapon(
                siegeWeapon
            ),
    };
}

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default {
    getSiegeWeaponBaseData,

    getSiegeWeaponSelectedRefinements,

    getSiegeWeaponMight,
    getSiegeWeaponNormalMight,

    getSiegeWeaponRange,
    formatSiegeWeaponRange,

    getSiegeWeaponEffectivenessTraits,
    hasSiegeWeaponEffectiveness,

    getSiegeWeaponAmmo,
    getSiegeWeaponAmmoDisplay,

    getSiegeWeaponAdvancedRefinements,
    hasTooManySiegeAdvancedRefinements,

    getInvalidSiegeWeaponRefinements,
    validateSiegeWeapon,

    getSiegeWeaponSummary,
};