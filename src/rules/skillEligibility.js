import { skills } from '../data/skills';
import { weaponTypes } from '../data/weaponTypes';
import { movementTypes } from '../data/movementTypes';
import { getBaseWeaponById } from '../data/baseWeapons';

// =========================================================
// INTERNAL HELPERS
// =========================================================

function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function normalizeString(value) {
    if (typeof value !== 'string') {
        return null;
    }

    return value.trim().toLowerCase();
}

function getSkillById(skillId) {
    return (
        skills.find(
            (skill) => skill.id === skillId
        ) ?? null
    );
}

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

// =========================================================
// SELECTED SKILL IDS
// =========================================================

export function getSelectedSkillIds(
    character,
    excludeSkillId = null
) {
    const ids = new Set();

    if (character?.skillSlots) {
        for (const skillId of Object.values(
            character.skillSlots
        )) {
            if (
                skillId &&
                skillId !== excludeSkillId
            ) {
                ids.add(skillId);
            }
        }
    }

    if (Array.isArray(character?.additionalSkills)) {
        for (const skillId of character.additionalSkills) {
            if (
                skillId &&
                skillId !== excludeSkillId
            ) {
                ids.add(skillId);
            }
        }
    }

    if (
        character?.personalSkill &&
        character.personalSkill !== excludeSkillId
    ) {
        ids.add(character.personalSkill);
    }

    return [...ids];
}

export function getSelectedSkills(
    character,
    excludeSkillId = null
) {
    return getSelectedSkillIds(
        character,
        excludeSkillId
    )
        .map(getSkillById)
        .filter(Boolean);
}

export function hasSkill(
    character,
    skillId,
    excludeSkillId = null
) {
    return getSelectedSkillIds(
        character,
        excludeSkillId
    ).includes(skillId);
}

// =========================================================
// WEAPON PROFICIENCIES
// =========================================================

export function hasWeaponProficiency(
    character,
    weaponTypeId
) {
    if (
        !Array.isArray(
            character?.weaponProficiencies
        )
    ) {
        return false;
    }

    return character.weaponProficiencies.includes(
        weaponTypeId
    );
}

export function hasAnyWeaponProficiency(
    character,
    weaponTypeIds = []
) {
    return weaponTypeIds.some(
        (weaponTypeId) =>
            hasWeaponProficiency(
                character,
                weaponTypeId
            )
    );
}

export function hasAllWeaponProficiencies(
    character,
    weaponTypeIds = []
) {
    return weaponTypeIds.every(
        (weaponTypeId) =>
            hasWeaponProficiency(
                character,
                weaponTypeId
            )
    );
}

// =========================================================
// MOVEMENT TYPE
// =========================================================

export function hasMovementType(
    character,
    movementTypeId
) {
    return (
        character?.movementType ===
        movementTypeId
    );
}

// =========================================================
// SKILL EFFECTS
// =========================================================
//
// These helpers inspect effects granted by skills the
// character ALREADY possesses.
//
// The candidate skill can be excluded so that it cannot
// satisfy its own prerequisite.
// =========================================================

export function getActiveSkillEffects(
    character,
    excludeSkillId = null
) {
    const selectedSkills =
        getSelectedSkills(
            character,
            excludeSkillId
        );

    return selectedSkills.flatMap(
        (skill) =>
            Array.isArray(skill.effects)
                ? skill.effects
                : []
    );
}

export function hasSkillEffect(
    character,
    effectType,
    excludeSkillId = null
) {
    return getActiveSkillEffects(
        character,
        excludeSkillId
    ).some(
        (effect) =>
            effect?.type === effectType
    );
}

// =========================================================
// SKILL-GRANTED WEAPON PROFICIENCIES
// =========================================================
//
// Future/homebrew skills may grant weapon proficiency.
//
// Supported effect:
//
// {
//   type: 'grant-weapon-proficiency',
//   weaponType: 'sword',
// }
// =========================================================

export function getSkillGrantedWeaponProficiencies(
    character,
    excludeSkillId = null
) {
    const granted = new Set();

    for (const effect of getActiveSkillEffects(
        character,
        excludeSkillId
    )) {
        if (
            effect?.type ===
            'grant-weapon-proficiency' &&
            effect.weaponType
        ) {
            granted.add(effect.weaponType);
        }
    }

    return [...granted];
}

export function hasEffectiveWeaponProficiency(
    character,
    weaponTypeId,
    excludeSkillId = null
) {
    if (
        hasWeaponProficiency(
            character,
            weaponTypeId
        )
    ) {
        return true;
    }

    return getSkillGrantedWeaponProficiencies(
        character,
        excludeSkillId
    ).includes(weaponTypeId);
}

// =========================================================
// SKILL-GRANTED MOVEMENT TYPE LEVEL OFFSET
// =========================================================
//
// This supports skills such as Class Change skills that may
// alter how the character qualifies for other skills.
//
// IMPORTANT:
// The candidate skill is excluded during its own
// eligibility check.
//
// Supported effect:
//
// {
//   type: 'skill-level-offset',
//   amount: 5,
// }
// =========================================================

export function getSkillLevelOffset(
    character,
    excludeSkillId = null
) {
    return getActiveSkillEffects(
        character,
        excludeSkillId
    ).reduce(
        (total, effect) => {
            if (
                effect?.type !==
                'skill-level-offset'
            ) {
                return total;
            }

            return (
                total +
                toNumber(effect.amount)
            );
        },
        0
    );
}

// =========================================================
// MOVEMENT TYPE LEVEL OFFSET
// =========================================================
//
// Armor has a +5 Skill Level Offset.
//
// This affects skill qualification only.
// =========================================================

export function getMovementSkillLevelOffset(
    character
) {
    const movementType =
        getMovementTypeData(
            character?.movementType
        );

    return toNumber(
        movementType?.skillLevelOffset
    );
}

// =========================================================
// EFFECTIVE SKILL LEVEL
// =========================================================

export function getEffectiveSkillLevel(
    character,
    excludeSkillId = null
) {
    const level = Math.max(
        1,
        Math.floor(
            toNumber(character?.level, 1)
        )
    );

    return (
        level +
        getMovementSkillLevelOffset(character) +
        getSkillLevelOffset(
            character,
            excludeSkillId
        )
    );
}

// =========================================================
// TRAITS GRANTED BY EXISTING SKILLS
// =========================================================
//
// Supported forms:
//
// trait: 'Furred'
//
// grantsTrait: 'Furred'
//
// grantsTraits: ['Furred']
//
// effects: [
//   {
//     type: 'grant-trait',
//     trait: 'Furred',
//   },
// ]
//
// Again, candidate skill is excluded.
// =========================================================

function collectTraitsFromSkill(skill) {
    const traits = new Set();

    if (!skill) {
        return [];
    }

    if (skill.trait) {
        traits.add(skill.trait);
    }

    if (skill.grantsTrait) {
        traits.add(skill.grantsTrait);
    }

    if (Array.isArray(skill.grantsTraits)) {
        for (const trait of skill.grantsTraits) {
            if (trait) {
                traits.add(trait);
            }
        }
    }

    if (Array.isArray(skill.effects)) {
        for (const effect of skill.effects) {
            if (
                effect?.type === 'grant-trait' &&
                effect.trait
            ) {
                traits.add(effect.trait);
            }
        }
    }

    return [...traits];
}

export function getSkillGrantedTraits(
    character,
    excludeSkillId = null
) {
    const traits = new Set();

    for (const skill of getSelectedSkills(
        character,
        excludeSkillId
    )) {
        for (const trait of collectTraitsFromSkill(
            skill
        )) {
            traits.add(trait);
        }
    }

    return [...traits];
}

// =========================================================
// CHARACTER TRAITS FOR PREREQUISITES
// =========================================================
//
// This calculates the trait sources needed for skill
// prerequisites without importing traitCalculations.js.
//
// Avoiding that import keeps us from creating a circular
// dependency between trait eligibility and skill
// eligibility.
// =========================================================

export function getTraitsForSkillEligibility(
    character,
    excludeSkillId = null
) {
    const traits = new Set();

    // -------------------------------------------------------
    // Movement trait
    // -------------------------------------------------------

    const movementType =
        getMovementTypeData(
            character?.movementType
        );

    if (movementType?.trait) {
        traits.add(movementType.trait);
    }

    // -------------------------------------------------------
    // Equipped weapon / transformation traits
    // -------------------------------------------------------

    if (
        character?.equippedWeaponId &&
        Array.isArray(character?.weapons)
    ) {
        const equippedWeapon =
            character.weapons.find(
                (weapon) =>
                    weapon.id ===
                    character.equippedWeaponId
            );

        const baseWeapon =
            getBaseWeaponById(
                equippedWeapon?.baseWeaponId
            );

        if (baseWeapon) {
            const weaponType =
                getWeaponTypeData(
                    baseWeapon.weaponType
                );

            // Curse → Fiendish
            if (weaponType?.equippedTrait) {
                traits.add(
                    weaponType.equippedTrait
                );
            }

            // Strike / Talon / Breath transformation trait
            if (
                toNumber(
                    character?.transformationGauge
                ) > 0 &&
                baseWeapon?.transformation?.enabled
            ) {
                const transformationTrait =
                    baseWeapon.transformation.trait ??
                    weaponType?.transformationTrait;

                if (transformationTrait) {
                    traits.add(
                        transformationTrait
                    );
                }
            }
        }
    }

    // -------------------------------------------------------
    // Skill traits
    // -------------------------------------------------------

    for (const trait of getSkillGrantedTraits(
        character,
        excludeSkillId
    )) {
        traits.add(trait);
    }

    return [...traits];
}

// =========================================================
// OPTIONAL RULE REQUIREMENTS
// =========================================================

function meetsOptionalRuleRequirement(
    character,
    requirement
) {
    if (!requirement) {
        return true;
    }

    const ruleId =
        requirement.rule ??
        requirement.id ??
        requirement.optionalRule;

    if (!ruleId) {
        return true;
    }

    const expected =
        requirement.enabled ?? true;

    return (
        character?.optionalRules?.[ruleId] ===
        expected
    );
}

// =========================================================
// SINGLE REQUIREMENT CHECK
// =========================================================
//
// This supports the prerequisite shapes we currently use
// and leaves room for future/homebrew skill data.
//
// Unknown requirement types fail safely rather than
// silently granting eligibility.
// =========================================================

export function meetsSkillRequirement(
    character,
    requirement,
    candidateSkillId = null
) {
    if (!requirement) {
        return true;
    }

    const type =
        requirement.type ??
        requirement.kind;

    switch (type) {
        // -----------------------------------------------------
        // Level
        // -----------------------------------------------------

        case 'level':
            return (
                getEffectiveSkillLevel(
                    character,
                    candidateSkillId
                ) >=
                toNumber(requirement.level)
            );

        case 'minimum-level':
            return (
                getEffectiveSkillLevel(
                    character,
                    candidateSkillId
                ) >=
                toNumber(
                    requirement.level ??
                    requirement.value
                )
            );

        // -----------------------------------------------------
        // Weapon proficiency
        // -----------------------------------------------------

        case 'weapon-proficiency':
            return hasEffectiveWeaponProficiency(
                character,
                requirement.weaponType ??
                requirement.weapon,
                candidateSkillId
            );

        case 'any-weapon-proficiency':
            return (
                requirement.weaponTypes ??
                requirement.weapons ??
                []
            ).some((weaponTypeId) =>
                hasEffectiveWeaponProficiency(
                    character,
                    weaponTypeId,
                    candidateSkillId
                )
            );

        case 'all-weapon-proficiencies':
            return (
                requirement.weaponTypes ??
                requirement.weapons ??
                []
            ).every((weaponTypeId) =>
                hasEffectiveWeaponProficiency(
                    character,
                    weaponTypeId,
                    candidateSkillId
                )
            );

        // -----------------------------------------------------
        // Movement type
        // -----------------------------------------------------

        case 'movement-type':
            return hasMovementType(
                character,
                requirement.movementType ??
                requirement.value
            );

        case 'any-movement-type':
            return (
                requirement.movementTypes ??
                requirement.values ??
                []
            ).includes(character?.movementType);

        // -----------------------------------------------------
        // Existing skill
        // -----------------------------------------------------

        case 'skill':
            return hasSkill(
                character,
                requirement.skillId ??
                requirement.skill,
                candidateSkillId
            );

        case 'any-skill':
            return (
                requirement.skillIds ??
                requirement.skills ??
                []
            ).some((skillId) =>
                hasSkill(
                    character,
                    skillId,
                    candidateSkillId
                )
            );

        // -----------------------------------------------------
        // Trait
        // -----------------------------------------------------

        case 'trait': {
            const requiredTrait =
                requirement.trait ??
                requirement.value;

            return getTraitsForSkillEligibility(
                character,
                candidateSkillId
            ).includes(requiredTrait);
        }

        case 'any-trait': {
            const traits =
                requirement.traits ??
                requirement.values ??
                [];

            const activeTraits =
                getTraitsForSkillEligibility(
                    character,
                    candidateSkillId
                );

            return traits.some((trait) =>
                activeTraits.includes(trait)
            );
        }

        // -----------------------------------------------------
        // Optional rule
        // -----------------------------------------------------

        case 'optional-rule':
            return meetsOptionalRuleRequirement(
                character,
                requirement
            );

        default:
            return false;
    }
}

// =========================================================
// REQUIREMENT GROUP
// =========================================================
//
// Default:
// ALL requirements must be met.
//
// If the skill explicitly uses:
//
// requirementMode: 'any'
//
// then only one requirement must be met.
// =========================================================

export function meetsSkillRequirements(
    character,
    skill
) {
    const requirements =
        skill?.requirements ??
        skill?.prerequisites ??
        [];

    if (!Array.isArray(requirements)) {
        return true;
    }

    if (requirements.length === 0) {
        return true;
    }

    const mode =
        skill.requirementMode ??
        skill.prerequisiteMode ??
        'all';

    if (mode === 'any') {
        return requirements.some(
            (requirement) =>
                meetsSkillRequirement(
                    character,
                    requirement,
                    skill.id
                )
        );
    }

    return requirements.every(
        (requirement) =>
            meetsSkillRequirement(
                character,
                requirement,
                skill.id
            )
    );
}

// =========================================================
// MUTUAL EXCLUSIONS
// =========================================================

export function getMutuallyExclusiveSkillIds(
    skill
) {
    const ids = new Set();

    const sources = [
        skill?.mutuallyExclusiveWith,
        skill?.excludes,
        skill?.conflictsWith,
    ];

    for (const source of sources) {
        if (Array.isArray(source)) {
            for (const skillId of source) {
                if (skillId) {
                    ids.add(skillId);
                }
            }
        } else if (source) {
            ids.add(source);
        }
    }

    return [...ids];
}

export function hasSkillConflict(
    character,
    skill
) {
    const selectedSkillIds =
        getSelectedSkillIds(
            character,
            skill?.id
        );

    const exclusions =
        getMutuallyExclusiveSkillIds(skill);

    if (
        exclusions.some((skillId) =>
            selectedSkillIds.includes(skillId)
        )
    ) {
        return true;
    }

    /*
      Also check the reverse direction.
  
      This means only one of the two skills needs to declare
      the exclusion for the builder to recognize it.
    */
    for (const selectedSkillId of selectedSkillIds) {
        const selectedSkill =
            getSkillById(selectedSkillId);

        if (!selectedSkill) {
            continue;
        }

        if (
            getMutuallyExclusiveSkillIds(
                selectedSkill
            ).includes(skill.id)
        ) {
            return true;
        }
    }

    return false;
}

// =========================================================
// OPTIONAL MODULE CHECK
// =========================================================

export function isSkillModuleEnabled(
    character,
    skill
) {
    const optionalRule =
        skill?.optionalRule ??
        skill?.module;

    if (!optionalRule) {
        return true;
    }

    return (
        character?.optionalRules?.[
        optionalRule
        ] === true
    );
}

// =========================================================
// SKILL ELIGIBILITY
// =========================================================

export function getSkillEligibility(
    character,
    skill
) {
    const reasons = [];

    if (!skill) {
        return {
            eligible: false,
            reasons: ['Skill not found.'],
        };
    }

    if (
        !isSkillModuleEnabled(
            character,
            skill
        )
    ) {
        reasons.push(
            'The optional rule required for this skill is disabled.'
        );
    }

    if (
        !meetsSkillRequirements(
            character,
            skill
        )
    ) {
        reasons.push(
            'The character does not meet this skill’s prerequisites.'
        );
    }

    if (
        hasSkillConflict(
            character,
            skill
        )
    ) {
        reasons.push(
            'This skill conflicts with another selected skill.'
        );
    }

    return {
        eligible: reasons.length === 0,
        reasons,
    };
}

export function canSelectSkill(
    character,
    skill
) {
    return getSkillEligibility(
        character,
        skill
    ).eligible;
}

// =========================================================
// ELIGIBLE SKILLS
// =========================================================

export function getEligibleSkills(character) {
    return skills.filter((skill) =>
        canSelectSkill(
            character,
            skill
        )
    );
}

// =========================================================
// ELIGIBLE SKILLS BY CATEGORY
// =========================================================

export function getEligibleSkillsByCategory(
    character,
    category
) {
    const normalizedCategory =
        normalizeString(category);

    return getEligibleSkills(
        character
    ).filter(
        (skill) =>
            normalizeString(skill.category) ===
            normalizedCategory
    );
}

// =========================================================
// SKILL VALIDATION
// =========================================================
//
// Checks skills already present on the character.
//
// This is useful when something else changes:
//
// - Level
// - Movement Type
// - Weapon proficiency
// - Optional rules
// - Another selected skill
//
// The builder can then warn the user that an existing
// selection no longer meets its requirements.
// =========================================================

export function validateSelectedSkills(character) {
    const results = [];

    for (const skillId of getSelectedSkillIds(
        character
    )) {
        const skill = getSkillById(skillId);

        if (!skill) {
            results.push({
                skillId,
                skill: null,
                eligible: false,
                reasons: ['Skill not found.'],
            });

            continue;
        }

        const eligibility =
            getSkillEligibility(
                character,
                skill
            );

        results.push({
            skillId,
            skill,
            ...eligibility,
        });
    }

    return results;
}

export default {
    getSelectedSkillIds,
    getSelectedSkills,
    hasSkill,

    hasWeaponProficiency,
    hasAnyWeaponProficiency,
    hasAllWeaponProficiencies,
    hasEffectiveWeaponProficiency,

    hasMovementType,

    getActiveSkillEffects,
    getSkillGrantedWeaponProficiencies,

    getMovementSkillLevelOffset,
    getSkillLevelOffset,
    getEffectiveSkillLevel,

    getSkillGrantedTraits,
    getTraitsForSkillEligibility,

    meetsSkillRequirement,
    meetsSkillRequirements,

    getMutuallyExclusiveSkillIds,
    hasSkillConflict,

    isSkillModuleEnabled,

    getSkillEligibility,
    canSelectSkill,

    getEligibleSkills,
    getEligibleSkillsByCategory,

    validateSelectedSkills,
};