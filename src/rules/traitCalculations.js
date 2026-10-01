import { movementTypes } from '../data/movementTypes';
import { weaponTypes } from '../data/weaponTypes';
import { getBaseWeaponById } from '../data/baseWeapons';
import { getWeaponRefinementById } from '../data/weaponRefinements';

// =========================================================
// INTERNAL HELPERS
// =========================================================

function getMovementTypeData(movementTypeId) {
    if (!movementTypeId) {
        return null;
    }

    if (Array.isArray(movementTypes)) {
        return (
            movementTypes.find(
                (movementType) =>
                    movementType.id === movementTypeId
            ) ?? null
        );
    }

    return movementTypes[movementTypeId] ?? null;
}

function getWeaponTypeData(weaponTypeId) {
    if (!weaponTypeId) {
        return null;
    }

    if (Array.isArray(weaponTypes)) {
        return (
            weaponTypes.find(
                (weaponType) =>
                    weaponType.id === weaponTypeId
            ) ?? null
        );
    }

    return weaponTypes[weaponTypeId] ?? null;
}

function normalizeGauge(gauge) {
    const numericGauge = Number(gauge);

    if (!Number.isFinite(numericGauge)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(4, Math.floor(numericGauge))
    );
}

function normalizeTrait(trait) {
    if (!trait) {
        return null;
    }

    if (typeof trait === 'string') {
        return trait;
    }

    if (typeof trait === 'object') {
        return (
            trait.id ??
            trait.name ??
            null
        );
    }

    return null;
}

// =========================================================
// EQUIPPED WEAPON
// =========================================================

export function getEquippedWeaponForTraits(character) {
    if (
        !character?.equippedWeaponId ||
        !Array.isArray(character?.weapons)
    ) {
        return null;
    }

    return (
        character.weapons.find(
            (weapon) =>
                weapon.id === character.equippedWeaponId
        ) ?? null
    );
}

export function getEquippedBaseWeaponForTraits(
    character
) {
    const weapon =
        getEquippedWeaponForTraits(character);

    if (!weapon?.baseWeaponId) {
        return null;
    }

    return getBaseWeaponById(
        weapon.baseWeaponId
    );
}

// =========================================================
// MOVEMENT TRAIT
// =========================================================

export function getMovementTrait(character) {
    const movementType = getMovementTypeData(
        character?.movementType
    );

    return normalizeTrait(
        movementType?.trait
    );
}

// =========================================================
// EQUIPPED WEAPON TRAIT
// =========================================================
//
// Example:
//
// Curse → Fiendish
//
// This is based on the weapon currently equipped,
// not merely having Curse proficiency.
// =========================================================

export function getEquippedWeaponTrait(character) {
    const baseWeapon =
        getEquippedBaseWeaponForTraits(character);

    if (!baseWeapon) {
        return null;
    }

    const weaponType = getWeaponTypeData(
        baseWeapon.weaponType
    );

    return normalizeTrait(
        weaponType?.equippedTrait
    );
}

// =========================================================
// TRANSFORMATION TRAIT
// =========================================================
//
// Gauge 0:
// Not transformed.
//
// Gauge 1-4:
// Transformed.
//
// Strike → Furred
// Talon  → Winged
// Breath → Scaled
// =========================================================

export function getTransformationTrait(character) {
    const gauge = normalizeGauge(
        character?.transformationGauge
    );

    if (gauge <= 0) {
        return null;
    }

    const baseWeapon =
        getEquippedBaseWeaponForTraits(character);

    if (!baseWeapon?.transformation?.enabled) {
        return null;
    }

    /*
      Prefer the transformation definition on the actual
      base weapon because that is now the authoritative
      transformation configuration.
    */
    const baseWeaponTrait = normalizeTrait(
        baseWeapon.transformation.trait
    );

    if (baseWeaponTrait) {
        return baseWeaponTrait;
    }

    /*
      Fallback to weaponTypes.js if needed.
    */
    const weaponType = getWeaponTypeData(
        baseWeapon.weaponType
    );

    return normalizeTrait(
        weaponType?.transformationTrait
    );
}

// =========================================================
// SKILL-GRANTED TRAITS
// =========================================================
//
// Skills may grant traits.
//
// This supports several possible skill data structures:
//
// trait: 'Furred'
//
// grantsTrait: 'Furred'
//
// grantsTraits: ['Furred', 'Scaled']
//
// effects: [
//   {
//     type: 'grant-trait',
//     trait: 'Furred',
//   },
// ]
//
// That keeps this rule flexible as skill data evolves.
// =========================================================

function getTraitsFromSkill(skill) {
    if (!skill) {
        return [];
    }

    const traits = [];

    const directTrait = normalizeTrait(
        skill.trait
    );

    if (directTrait) {
        traits.push(directTrait);
    }

    const grantedTrait = normalizeTrait(
        skill.grantsTrait
    );

    if (grantedTrait) {
        traits.push(grantedTrait);
    }

    if (Array.isArray(skill.grantsTraits)) {
        for (const trait of skill.grantsTraits) {
            const normalized = normalizeTrait(trait);

            if (normalized) {
                traits.push(normalized);
            }
        }
    }

    if (Array.isArray(skill.effects)) {
        for (const effect of skill.effects) {
            if (effect?.type !== 'grant-trait') {
                continue;
            }

            const normalized = normalizeTrait(
                effect.trait
            );

            if (normalized) {
                traits.push(normalized);
            }
        }
    }

    return traits;
}

function getSelectedSkills(character, skills = []) {
    const selectedIds = new Set();

    // -------------------------------------------------------
    // Normal skill slots
    // -------------------------------------------------------

    if (character?.skillSlots) {
        for (const skillId of Object.values(
            character.skillSlots
        )) {
            if (skillId) {
                selectedIds.add(skillId);
            }
        }
    }

    // -------------------------------------------------------
    // Additional skills
    // -------------------------------------------------------

    if (Array.isArray(character?.additionalSkills)) {
        for (const skillId of character.additionalSkills) {
            if (skillId) {
                selectedIds.add(skillId);
            }
        }
    }

    // -------------------------------------------------------
    // Personal skill
    // -------------------------------------------------------

    if (character?.personalSkill) {
        selectedIds.add(character.personalSkill);
    }

    return skills.filter((skill) =>
        selectedIds.has(skill.id)
    );
}

export function getSkillTraits(
    character,
    skills = []
) {
    const selectedSkills = getSelectedSkills(
        character,
        skills
    );

    return selectedSkills.flatMap(
        getTraitsFromSkill
    );
}

// =========================================================
// REFINEMENT-GRANTED TRAITS
// =========================================================
//
// We don't currently have refinements that grant a normal
// persistent character trait, but supporting it here makes
// the trait system ready for future official/homebrew data.
//
// Expected refinement effect:
//
// {
//   type: 'grant-trait',
//   trait: 'Furred',
// }
// =========================================================

export function getRefinementTraits(character) {
    const weapon =
        getEquippedWeaponForTraits(character);

    if (!weapon?.refinements) {
        return [];
    }

    const traits = [];

    for (const refinementId of weapon.refinements) {
        const refinement =
            getWeaponRefinementById(refinementId);

        if (
            refinement?.effect?.type !==
            'grant-trait'
        ) {
            continue;
        }

        const trait = normalizeTrait(
            refinement.effect.trait
        );

        if (trait) {
            traits.push(trait);
        }
    }

    return traits;
}

// =========================================================
// ACTIVE TRAITS
// =========================================================
//
// Sources:
//
// 1. Movement Type
// 2. Equipped weapon
// 3. Transformation
// 4. Skills
// 5. Refinements
//
// Duplicate traits are removed.
// =========================================================

export function getActiveTraits(
    character,
    skills = []
) {
    const traits = [];

    // -------------------------------------------------------
    // Movement
    // -------------------------------------------------------

    const movementTrait =
        getMovementTrait(character);

    if (movementTrait) {
        traits.push(movementTrait);
    }

    // -------------------------------------------------------
    // Equipped weapon
    // -------------------------------------------------------

    const weaponTrait =
        getEquippedWeaponTrait(character);

    if (weaponTrait) {
        traits.push(weaponTrait);
    }

    // -------------------------------------------------------
    // Transformation
    // -------------------------------------------------------

    const transformationTrait =
        getTransformationTrait(character);

    if (transformationTrait) {
        traits.push(transformationTrait);
    }

    // -------------------------------------------------------
    // Skills
    // -------------------------------------------------------

    traits.push(
        ...getSkillTraits(
            character,
            skills
        )
    );

    // -------------------------------------------------------
    // Refinements
    // -------------------------------------------------------

    traits.push(
        ...getRefinementTraits(character)
    );

    // -------------------------------------------------------
    // Normalize + remove duplicates
    // -------------------------------------------------------

    return [
        ...new Set(
            traits
                .map(normalizeTrait)
                .filter(Boolean)
        ),
    ];
}

// =========================================================
// TRAIT CHECK
// =========================================================

export function hasTrait(
    character,
    trait,
    skills = []
) {
    const targetTrait =
        normalizeTrait(trait);

    if (!targetTrait) {
        return false;
    }

    return getActiveTraits(
        character,
        skills
    ).includes(targetTrait);
}

// =========================================================
// TRAIT SUMMARY
// =========================================================

export function getTraitSummary(
    character,
    skills = []
) {
    return {
        movement:
            getMovementTrait(character),

        equippedWeapon:
            getEquippedWeaponTrait(character),

        transformation:
            getTransformationTrait(character),

        skills:
            getSkillTraits(
                character,
                skills
            ),

        refinements:
            getRefinementTraits(character),

        active:
            getActiveTraits(
                character,
                skills
            ),
    };
}