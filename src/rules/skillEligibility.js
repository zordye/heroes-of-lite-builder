import skills from '../data/skills';
import movementTypes from '../data/movementTypes';

// =========================================================
// BASIC LOOKUPS
// =========================================================

function getSkillById(skillId) {
    return skills.find((skill) => skill.id === skillId) ?? null;
}

function getMovementTypeById(movementTypeId) {
    return (
        movementTypes.find(
            (movementType) => movementType.id === movementTypeId
        ) ?? null
    );
}

// Allows character skill fields to contain either:
// "perform"
// or
// { id: "perform", ... }
function normalizeSkillId(skill) {
    if (!skill) return null;

    if (typeof skill === 'string') {
        return skill;
    }

    return skill.id ?? null;
}

// =========================================================
// CHARACTER SKILL COLLECTION
// =========================================================

function getCharacterSkillIds(character) {
    const skillIds = [];

    const movementSkill = normalizeSkillId(
        character.skills?.movementSkill
    );

    const levelOneSkill = normalizeSkillId(
        character.skills?.levelOneSkill
    );

    const personalSkill = normalizeSkillId(
        character.personalSkill
    );

    if (movementSkill) {
        skillIds.push(movementSkill);
    }

    if (levelOneSkill) {
        skillIds.push(levelOneSkill);
    }

    if (personalSkill) {
        skillIds.push(personalSkill);
    }

    const additionalSkills =
        character.skills?.additionalSkills ?? [];

    additionalSkills.forEach((skill) => {
        const skillId = normalizeSkillId(skill);

        if (skillId) {
            skillIds.push(skillId);
        }
    });

    return [...new Set(skillIds)];
}

function characterHasSkill(character, skillId) {
    return getCharacterSkillIds(character).includes(skillId);
}

function characterHasCombatArt(character) {
    const characterSkillIds = getCharacterSkillIds(character);

    return characterSkillIds.some((skillId) => {
        const skill = getSkillById(skillId);

        return skill?.category === 'combat-art';
    });
}

// =========================================================
// WEAPON PROFICIENCY
// =========================================================

function characterHasWeaponProficiency(character, weaponTypeId) {
    return (
        character.weaponProficiencies?.includes(weaponTypeId) ??
        false
    );
}

function characterHasAnyWeaponProficiency(
    character,
    weaponTypeIds
) {
    return weaponTypeIds.some((weaponTypeId) =>
        characterHasWeaponProficiency(character, weaponTypeId)
    );
}

// =========================================================
// EFFECTIVE SKILL LEVEL
// =========================================================

function getSkillLevelOffset(character) {
    const movementType = getMovementTypeById(
        character.movementType
    );

    const movementOffset =
        movementType?.skillLevelOffset ?? 0;

    const characterSkillIds =
        getCharacterSkillIds(character);

    const skillOffsets = characterSkillIds
        .map((skillId) => {
            const skill = getSkillById(skillId);

            return skill?.skillLevelOffset ?? 0;
        })
        .filter((offset) => offset > 0);

    /*
      We use the highest available offset rather than adding them
      together.
  
      For example:
      - Armor gives +5 effective skill level.
      - Class Change - Armor also gives +5.
  
      They represent the same kind of early-access benefit and
      should not become +10 if multiple sources somehow apply.
    */
    return Math.max(
        movementOffset,
        ...skillOffsets,
        0
    );
}

function getEffectiveSkillLevel(character) {
    return (
        (character.level ?? 1) +
        getSkillLevelOffset(character)
    );
}

// =========================================================
// MOVEMENT SKILL ACCESS
// =========================================================

function hasGrantedMovementSkillAccess(
    character,
    movementTypeId,
    candidateSkill
) {
    const characterSkillIds =
        getCharacterSkillIds(character);

    return characterSkillIds.some((skillId) => {
        const accessSkill = getSkillById(skillId);

        if (!accessSkill?.grantsMovementSkillAccess) {
            return false;
        }

        if (
            !accessSkill.grantsMovementSkillAccess.includes(
                movementTypeId
            )
        ) {
            return false;
        }

        /*
          Heritor skills have special restrictions.
    
          Example:
          Heritor of Feathers:
          - grants access to Flier skills
          - only skills requiring level 10 or less
          - excludes Canter
        */

        if (
            accessSkill.excludedMovementSkills?.includes(
                candidateSkill.id
            )
        ) {
            return false;
        }

        if (
            accessSkill.movementSkillAccessMaximumLevel !==
            undefined &&
            (candidateSkill.requirements?.level ?? 1) >
            accessSkill.movementSkillAccessMaximumLevel
        ) {
            return false;
        }

        return true;
    });
}

function characterHasMovementSkillAccess(
    character,
    movementTypeId,
    candidateSkill
) {
    // The character naturally belongs to this movement type.
    if (character.movementType === movementTypeId) {
        return true;
    }

    /*
      Granted movement access only applies to actual Movement
      skills.
  
      This prevents things such as Heritor of Feathers from
      making the character count as a Flier for the prerequisite
      of Class Change - Cavalry.
  
      They gain access to Flier SKILLS. They do not actually
      become a Flier.
    */
    if (candidateSkill.category !== 'movement') {
        return false;
    }

    return hasGrantedMovementSkillAccess(
        character,
        movementTypeId,
        candidateSkill
    );
}

function characterHasAnyMovementSkillAccess(
    character,
    movementTypeIds,
    candidateSkill
) {
    return movementTypeIds.some((movementTypeId) =>
        characterHasMovementSkillAccess(
            character,
            movementTypeId,
            candidateSkill
        )
    );
}

// =========================================================
// "ANY OF" REQUIREMENTS
// =========================================================

function meetsSingleAnyOfRequirement(
    character,
    requirement
) {
    if (requirement.skill) {
        return characterHasSkill(
            character,
            requirement.skill
        );
    }

    if (requirement.weaponProficiency) {
        return characterHasWeaponProficiency(
            character,
            requirement.weaponProficiency
        );
    }

    return false;
}

function meetsAnyOfRequirement(character, anyOf) {
    return anyOf.some((requirement) =>
        meetsSingleAnyOfRequirement(
            character,
            requirement
        )
    );
}

// =========================================================
// OPTIONAL RULES
// =========================================================

function isOptionalRuleEnabled(character, ruleId) {
    return character.optionalRules?.[ruleId] === true;
}

// =========================================================
// FULL ELIGIBILITY CHECK
// =========================================================

function getSkillEligibility(character, skill) {
    const reasons = [];
    const warnings = [];

    if (!skill) {
        return {
            eligible: false,
            reasons: ['Skill could not be found.'],
            warnings: [],
        };
    }

    const requirements = skill.requirements ?? {};

    // -------------------------------------------------------
    // OPTIONAL MODULE
    // -------------------------------------------------------

    if (
        skill.optionalRule &&
        !isOptionalRuleEnabled(
            character,
            skill.optionalRule
        )
    ) {
        reasons.push(
            'The required optional module is not enabled.'
        );
    }

    // -------------------------------------------------------
    // LEVEL
    // -------------------------------------------------------

    const requiredLevel = requirements.level ?? 1;
    const effectiveLevel =
        getEffectiveSkillLevel(character);

    if (effectiveLevel < requiredLevel) {
        reasons.push(
            `Requires Level ${requiredLevel}.`
        );
    }

    // -------------------------------------------------------
    // WEAPON PROFICIENCY
    // -------------------------------------------------------

    if (
        requirements.anyWeaponProficiency &&
        !characterHasAnyWeaponProficiency(
            character,
            requirements.anyWeaponProficiency
        )
    ) {
        reasons.push(
            `Requires one of these Weapon Proficiencies: ${requirements.anyWeaponProficiency.join(
                ', '
            )}.`
        );
    }

    // -------------------------------------------------------
    // MOVEMENT TYPE
    // -------------------------------------------------------

    if (
        requirements.movementTypes &&
        !characterHasAnyMovementSkillAccess(
            character,
            requirements.movementTypes,
            skill
        )
    ) {
        reasons.push(
            `Requires one of these Movement Types: ${requirements.movementTypes.join(
                ', '
            )}.`
        );
    }

    // -------------------------------------------------------
    // REQUIRED SKILLS
    // -------------------------------------------------------

    if (requirements.requiredSkills) {
        requirements.requiredSkills.forEach(
            (requiredSkillId) => {
                if (
                    !characterHasSkill(
                        character,
                        requiredSkillId
                    )
                ) {
                    const requiredSkill =
                        getSkillById(requiredSkillId);

                    reasons.push(
                        `Requires ${requiredSkill?.name ??
                        requiredSkillId
                        }.`
                    );
                }
            }
        );
    }

    // -------------------------------------------------------
    // EXCLUDED SKILLS
    // -------------------------------------------------------

    if (requirements.excludedSkills) {
        requirements.excludedSkills.forEach(
            (excludedSkillId) => {
                if (
                    characterHasSkill(
                        character,
                        excludedSkillId
                    )
                ) {
                    const excludedSkill =
                        getSkillById(excludedSkillId);

                    reasons.push(
                        `Cannot be used with ${excludedSkill?.name ??
                        excludedSkillId
                        }.`
                    );
                }
            }
        );
    }

    // -------------------------------------------------------
    // COMBAT ART REQUIREMENT
    // -------------------------------------------------------

    if (
        requirements.requiresCombatArt &&
        !characterHasCombatArt(character)
    ) {
        reasons.push(
            'Requires the character to have a Combat Art.'
        );
    }

    // -------------------------------------------------------
    // ANY-OF REQUIREMENTS
    // -------------------------------------------------------

    if (
        requirements.anyOf &&
        !meetsAnyOfRequirement(
            character,
            requirements.anyOf
        )
    ) {
        reasons.push(
            'One of the listed prerequisite conditions must be met.'
        );
    }

    // -------------------------------------------------------
    // GM PERMISSION
    // -------------------------------------------------------

    /*
      GM permission is treated as a warning rather than a hard
      failure.
  
      The app cannot know whether the GM actually approved the
      skill, so the player can still select it while the UI makes
      the requirement clear.
    */
    if (requirements.requiresGMPermission) {
        warnings.push('Requires GM permission.');
    }

    return {
        eligible: reasons.length === 0,
        reasons,
        warnings,
        requiredLevel,
        effectiveLevel,
    };
}

// =========================================================
// CONVENIENCE FUNCTIONS
// =========================================================

function canLearnSkill(character, skill) {
    return getSkillEligibility(
        character,
        skill
    ).eligible;
}

function getEligibleSkills(character) {
    return skills.filter((skill) =>
        canLearnSkill(character, skill)
    );
}

function getUnavailableSkills(character) {
    return skills.filter(
        (skill) =>
            !canLearnSkill(character, skill)
    );
}

function getSkillsWithEligibility(character) {
    return skills.map((skill) => ({
        skill,
        eligibility: getSkillEligibility(
            character,
            skill
        ),
    }));
}

export {
    getSkillById,
    getCharacterSkillIds,
    characterHasSkill,
    characterHasCombatArt,
    characterHasWeaponProficiency,
    characterHasAnyWeaponProficiency,
    getSkillLevelOffset,
    getEffectiveSkillLevel,
    characterHasMovementSkillAccess,
    characterHasAnyMovementSkillAccess,
    isOptionalRuleEnabled,
    getSkillEligibility,
    canLearnSkill,
    getEligibleSkills,
    getUnavailableSkills,
    getSkillsWithEligibility,
};