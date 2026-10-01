import {
    getBaseWeaponById,
} from '../data/baseWeapons';

import {
    getWeaponRefinementById,
    REFINEMENT_CATEGORIES,
} from '../data/weaponRefinements';

// =========================================================
// INTERNAL HELPERS
// =========================================================

function normalizeGauge(gauge) {
    const numericGauge = Number(gauge);

    if (!Number.isFinite(numericGauge)) {
        return 0;
    }

    return Math.max(0, Math.min(4, Math.floor(numericGauge)));
}

function getWeaponRefinementIds(weapon) {
    if (!weapon || !Array.isArray(weapon.refinements)) {
        return [];
    }

    return weapon.refinements;
}

function getSelectedRefinements(weapon) {
    return getWeaponRefinementIds(weapon)
        .map((refinementId) =>
            getWeaponRefinementById(refinementId)
        )
        .filter(Boolean);
}

function getInnateAttributes(baseWeapon) {
    if (!baseWeapon || !Array.isArray(baseWeapon.innateAttributes)) {
        return [];
    }

    return baseWeapon.innateAttributes;
}

function calculateGaugeValue(gauge, effect) {
    const currentGauge = normalizeGauge(gauge);

    if (currentGauge <= 0) {
        return 0;
    }

    if (effect.multiplier !== undefined) {
        return currentGauge * effect.multiplier;
    }

    if (effect.divisor !== undefined) {
        const value = currentGauge / effect.divisor;

        switch (effect.rounding) {
            case 'ceil':
                return Math.ceil(value);

            case 'round':
                return Math.round(value);

            case 'floor':
            default:
                return Math.floor(value);
        }
    }

    return currentGauge;
}

// =========================================================
// BASE WEAPON
// =========================================================

export function getWeaponBaseData(weapon) {
    if (!weapon?.baseWeaponId) {
        return null;
    }

    return getBaseWeaponById(weapon.baseWeaponId);
}

export function getWeaponType(weapon) {
    return getWeaponBaseData(weapon)?.weaponType ?? null;
}

// =========================================================
// TRANSFORMATION
// =========================================================

export function isTransformationWeapon(weapon) {
    const baseWeapon = getWeaponBaseData(weapon);

    return baseWeapon?.transformation?.enabled === true;
}

export function isWeaponTransformed(
    weapon,
    transformationGauge = 0
) {
    return (
        isTransformationWeapon(weapon) &&
        normalizeGauge(transformationGauge) > 0
    );
}

export function getTransformationGaugeBonus(
    weapon,
    transformationGauge = 0
) {
    const baseWeapon = getWeaponBaseData(weapon);

    if (!baseWeapon?.transformation?.enabled) {
        return 0;
    }

    const gauge = normalizeGauge(transformationGauge);

    if (gauge <= 0) {
        return 0;
    }

    return (
        gauge *
        (baseWeapon.transformation.mightPerGauge ?? 0)
    );
}

// =========================================================
// MIGHT
// =========================================================

export function getWeaponMight(
    weapon,
    transformationGauge = 0
) {
    const baseWeapon = getWeaponBaseData(weapon);

    if (!baseWeapon) {
        return 0;
    }

    let might = baseWeapon.might ?? 0;

    // Transformation weapons gain Might equal to Gauge.
    might += getTransformationGaugeBonus(
        weapon,
        transformationGauge
    );

    const refinements = getSelectedRefinements(weapon);

    for (const refinement of refinements) {
        if (refinement.effect?.type === 'might') {
            might += refinement.effect.amount ?? 0;
        }
    }

    return might;
}

// =========================================================
// RANGE
// =========================================================

export function getWeaponRange(
    weapon,
    transformationGauge = 0
) {
    const baseWeapon = getWeaponBaseData(weapon);

    if (!baseWeapon) {
        return {
            min: 0,
            max: 0,
        };
    }

    let min = baseWeapon.range?.min ?? 0;
    let max = baseWeapon.range?.max ?? 0;

    const refinements = getSelectedRefinements(weapon);

    // -------------------------------------------------------
    // Range adjustments
    // -------------------------------------------------------

    for (const refinement of refinements) {
        const effect = refinement.effect;

        if (!effect) {
            continue;
        }

        if (effect.type === 'range-min') {
            min += effect.amount ?? 0;

            if (effect.minimum !== undefined) {
                min = Math.max(effect.minimum, min);
            }
        }

        if (effect.type === 'range-max') {
            max += effect.amount ?? 0;
        }

        if (
            effect.type === 'gauge-range-max' &&
            normalizeGauge(transformationGauge) > 0
        ) {
            max += calculateGaugeValue(
                transformationGauge,
                effect
            );
        }
    }

    // -------------------------------------------------------
    // Range overrides
    //
    // These are processed after ordinary adjustments because
    // "Range becomes X-Y" takes precedence over +Range.
    // -------------------------------------------------------

    for (const refinement of refinements) {
        const effect = refinement.effect;

        if (effect?.type === 'range-override') {
            min = effect.min;
            max = effect.max;
        }
    }

    return {
        min,
        max,
    };
}

export function formatWeaponRange(
    weapon,
    transformationGauge = 0
) {
    const { min, max } = getWeaponRange(
        weapon,
        transformationGauge
    );

    if (min === max) {
        return `${min}`;
    }

    return `${min}–${max}`;
}

// =========================================================
// EQUIPPED STAT BONUSES
// =========================================================

export function getWeaponStatBonus(
    weapon,
    stat,
    transformationGauge = 0
) {
    const refinements = getSelectedRefinements(weapon);

    let bonus = 0;

    for (const refinement of refinements) {
        const effect = refinement.effect;

        if (!effect) {
            continue;
        }

        // Permanent while-equipped stat bonus.
        if (
            effect.type === 'stat' &&
            effect.stat === stat
        ) {
            bonus += effect.amount ?? 0;
        }

        // Transformation Gauge-based stat bonus.
        if (
            effect.type === 'gauge-stat' &&
            effect.stat === stat &&
            normalizeGauge(transformationGauge) > 0
        ) {
            bonus += calculateGaugeValue(
                transformationGauge,
                effect
            );
        }
    }

    return bonus;
}

export function getAllWeaponStatBonuses(
    weapon,
    transformationGauge = 0
) {
    const stats = [
        'hp',
        'attack',
        'defense',
        'dexterity',
        'speed',
        'resistance',
        'luck',
    ];

    return stats.reduce((bonuses, stat) => {
        bonuses[stat] = getWeaponStatBonus(
            weapon,
            stat,
            transformationGauge
        );

        return bonuses;
    }, {});
}

// =========================================================
// DERIVED STAT BONUSES
// =========================================================

export function getWeaponDerivedStatBonus(
    weapon,
    derivedStat,
    transformationGauge = 0
) {
    const refinements = getSelectedRefinements(weapon);

    let bonus = 0;

    for (const refinement of refinements) {
        const effect = refinement.effect;

        if (
            effect?.type === 'gauge-derived' &&
            effect.derivedStat === derivedStat &&
            normalizeGauge(transformationGauge) > 0
        ) {
            bonus += calculateGaugeValue(
                transformationGauge,
                effect
            );
        }
    }

    return bonus;
}

// =========================================================
// POWER STAT
// =========================================================

export function getWeaponPowerStat(weapon) {
    const refinements = getSelectedRefinements(weapon);

    const powerStatRefinement = refinements.find(
        (refinement) =>
            refinement.effect?.type === 'power-stat'
    );

    return (
        powerStatRefinement?.effect?.stat ??
        'attack'
    );
}

export function usesExactPower(weapon) {
    return getWeaponPowerStat(weapon) === 'dexterity';
}

// =========================================================
// POWER
// =========================================================

export function getWeaponPower({
    weapon,
    attack = 0,
    dexterity = 0,
    transformationGauge = 0,
    effective = false,
}) {
    const might = getWeaponMight(
        weapon,
        transformationGauge
    );

    /*
      Effectiveness triples Might before Power is calculated.
  
      The sheet does not decide whether a target is actually
      vulnerable to the weapon. The user controls the manual
      Effective toggle.
    */
    const effectiveMight = effective
        ? might * 3
        : might;

    const powerStat = getWeaponPowerStat(weapon);

    const stat =
        powerStat === 'dexterity'
            ? dexterity
            : attack;

    return stat + effectiveMight;
}

// =========================================================
// TRI
// =========================================================

export function getWeaponTri(power) {
    return Math.floor((Number(power) || 0) / 5);
}

// =========================================================
// INNATE ATTRIBUTES
// =========================================================

export function getWeaponInnateAttributeIds(weapon) {
    const baseWeapon = getWeaponBaseData(weapon);

    return getInnateAttributes(baseWeapon);
}

export function getWeaponInnateAttributes(weapon) {
    return getWeaponInnateAttributeIds(weapon)
        .map((attributeId) =>
            getWeaponRefinementById(attributeId)
        )
        .filter(Boolean);
}

// =========================================================
// SELECTED REFINEMENTS
// =========================================================

export function getWeaponSelectedRefinements(weapon) {
    return getSelectedRefinements(weapon);
}

export function hasWeaponRefinement(
    weapon,
    refinementId
) {
    return getWeaponRefinementIds(weapon).includes(
        refinementId
    );
}

// =========================================================
// EFFECTIVENESS
// =========================================================

export function getWeaponEffectivenessTraits(weapon) {
    const traits = new Set();

    const innateAttributes =
        getWeaponInnateAttributes(weapon);

    const selectedRefinements =
        getSelectedRefinements(weapon);

    const allAttributes = [
        ...innateAttributes,
        ...selectedRefinements,
    ];

    for (const attribute of allAttributes) {
        if (
            attribute.effect?.type === 'effectiveness' &&
            attribute.effect.trait
        ) {
            traits.add(attribute.effect.trait);
        }
    }

    return [...traits];
}

// =========================================================
// ADVANCED REFINEMENT VALIDATION
// =========================================================

export function getAdvancedRefinementsOnWeapon(weapon) {
    return getSelectedRefinements(weapon).filter(
        (refinement) =>
            refinement.category ===
            REFINEMENT_CATEGORIES.ADVANCED
    );
}

export function hasTooManyAdvancedRefinements(weapon) {
    return getAdvancedRefinementsOnWeapon(weapon).length > 1;
}

// =========================================================
// COMPATIBILITY VALIDATION
// =========================================================

export function getInvalidWeaponRefinements(weapon) {
    const weaponType = getWeaponType(weapon);

    if (!weaponType) {
        return getWeaponRefinementIds(weapon);
    }

    return getWeaponRefinementIds(weapon).filter(
        (refinementId) => {
            const refinement =
                getWeaponRefinementById(refinementId);

            if (!refinement) {
                return true;
            }

            return !refinement.weaponTypes.includes(
                weaponType
            );
        }
    );
}

// =========================================================
// FULL WEAPON VALIDATION
// =========================================================

export function validateWeapon(weapon) {
    const errors = [];

    const baseWeapon = getWeaponBaseData(weapon);

    if (!baseWeapon) {
        errors.push('A valid base weapon is required.');

        return {
            valid: false,
            errors,
        };
    }

    const invalidRefinements =
        getInvalidWeaponRefinements(weapon);

    if (invalidRefinements.length > 0) {
        errors.push(
            'One or more selected refinements are not compatible with this weapon type.'
        );
    }

    if (hasTooManyAdvancedRefinements(weapon)) {
        errors.push(
            'A weapon may have at most one Advanced Attribute.'
        );
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// =========================================================
// DISPLAY SUMMARY
// =========================================================

export function getWeaponSummary(
    weapon,
    transformationGauge = 0
) {
    const baseWeapon = getWeaponBaseData(weapon);

    if (!baseWeapon) {
        return null;
    }

    return {
        id: weapon.id ?? null,

        name:
            weapon.name?.trim() ||
            baseWeapon.name,

        baseWeaponId: baseWeapon.id,

        baseWeaponName: baseWeapon.name,

        weaponType: baseWeapon.weaponType,

        might: getWeaponMight(
            weapon,
            transformationGauge
        ),

        range: getWeaponRange(
            weapon,
            transformationGauge
        ),

        rangeText: formatWeaponRange(
            weapon,
            transformationGauge
        ),

        powerStat: getWeaponPowerStat(weapon),

        innateAttributes:
            getWeaponInnateAttributes(weapon),

        refinements:
            getWeaponSelectedRefinements(weapon),

        effectivenessTraits:
            getWeaponEffectivenessTraits(weapon),

        transformed:
            isWeaponTransformed(
                weapon,
                transformationGauge
            ),

        advancedRefinement:
            getAdvancedRefinementsOnWeapon(weapon)[0] ??
            null,

        validation: validateWeapon(weapon),
    };
}