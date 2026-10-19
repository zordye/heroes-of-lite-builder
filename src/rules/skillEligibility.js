
import { skills } from '../data/skills';
import { weaponTypes } from '../data/weaponTypes';
import { movementTypes } from '../data/movementTypes';
import { getBaseWeaponById } from '../data/baseWeapons';

const number = (value, fallback = 0) => {
    const result = Number(value);
    return Number.isFinite(result) ? result : fallback;
};

const findById = (collection, id) => {
    if (!collection || !id) return null;
    if (Array.isArray(collection)) {
        return collection.find((entry) => entry.id === id) ?? null;
    }
    return collection[id] ?? null;
};

const getSkillById = (id) => findById(skills, id);

export function getSelectedSkillIds(character, excludeSkillId = null) {
    const ids = [
        ...Object.values(character?.skillSlots ?? {}),
        ...(character?.additionalSkills ?? []),
        character?.personalSkill,
    ];

    return [...new Set(ids.filter(
        (id) => typeof id === 'string' &&
            id.length > 0 &&
            id !== excludeSkillId
    ))];
}

export function getSelectedSkills(character, excludeSkillId = null) {
    return getSelectedSkillIds(character, excludeSkillId)
        .map(getSkillById)
        .filter(Boolean);
}

export function hasSkill(character, skillId, excludeSkillId = null) {
    return getSelectedSkillIds(character, excludeSkillId)
        .includes(skillId);
}

export function hasWeaponProficiency(character, weaponTypeId) {
    return (character?.weaponProficiencies ?? [])
        .includes(weaponTypeId);
}

export function hasAnyWeaponProficiency(character, ids = []) {
    return ids.some((id) => hasWeaponProficiency(character, id));
}

export function hasAllWeaponProficiencies(character, ids = []) {
    return ids.every((id) => hasWeaponProficiency(character, id));
}

export function hasMovementType(character, movementTypeId) {
    return character?.movementType === movementTypeId;
}

export function getActiveSkillEffects(character, excludeSkillId = null) {
    return getSelectedSkills(character, excludeSkillId)
        .flatMap((skill) => Array.isArray(skill.effects)
            ? skill.effects
            : []);
}

export function hasSkillEffect(
    character,
    effectType,
    excludeSkillId = null
) {
    return getActiveSkillEffects(character, excludeSkillId)
        .some((effect) => effect?.type === effectType);
}

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
            effect.type === 'grant-weapon-proficiency' ||
            effect.type === 'weapon-proficiency'
        ) {
            if (effect.weaponType) granted.add(effect.weaponType);
            if (effect.weapon) granted.add(effect.weapon);

            for (const id of effect.weaponTypes ?? []) {
                granted.add(id);
            }
        }
    }

    for (const skill of getSelectedSkills(
        character,
        excludeSkillId
    )) {
        for (const id of skill.grantsWeaponProficiencies ?? []) {
            granted.add(id);
        }
    }

    return [...granted];
}

export function hasEffectiveWeaponProficiency(
    character,
    weaponTypeId,
    excludeSkillId = null
) {
    return hasWeaponProficiency(character, weaponTypeId) ||
        getSkillGrantedWeaponProficiencies(
            character,
            excludeSkillId
        ).includes(weaponTypeId);
}

export function getSkillLevelOffset(
    character,
    excludeSkillId = null
) {
    return getActiveSkillEffects(character, excludeSkillId)
        .reduce((total, effect) => {
            return effect?.type === 'skill-level-offset'
                ? total + number(effect.amount)
                : total;
        }, 0);
}

export function getMovementSkillLevelOffset(character) {
    const movement = findById(
        movementTypes,
        character?.movementType
    );

    return number(movement?.skillLevelOffset);
}

export function getEffectiveSkillLevel(
    character,
    excludeSkillId = null
) {
    return Math.max(1, Math.floor(number(character?.level, 1))) +
        getMovementSkillLevelOffset(character) +
        getSkillLevelOffset(character, excludeSkillId);
}

function collectTraitsFromSkill(skill) {
    const traits = new Set();

    if (skill?.trait) traits.add(skill.trait);
    if (skill?.grantsTrait) traits.add(skill.grantsTrait);

    for (const trait of skill?.grantsTraits ?? []) {
        traits.add(trait);
    }

    for (const effect of skill?.effects ?? []) {
        if (effect?.type === 'grant-trait' && effect.trait) {
            traits.add(effect.trait);
        }
    }

    return [...traits];
}

export function getSkillGrantedTraits(
    character,
    excludeSkillId = null
) {
    return [...new Set(
        getSelectedSkills(character, excludeSkillId)
            .flatMap(collectTraitsFromSkill)
    )];
}

export function getTraitsForSkillEligibility(
    character,
    excludeSkillId = null
) {
    const traits = new Set();
    const movement = findById(
        movementTypes,
        character?.movementType
    );

    if (movement?.trait) traits.add(movement.trait);

    for (const trait of movement?.traits ?? []) {
        traits.add(trait);
    }

    const equipped = character?.weapons?.find(
        (weapon) => weapon.id === character.equippedWeaponId
    );

    const baseWeapon = equipped
        ? getBaseWeaponById(equipped.baseWeaponId)
        : null;

    if (baseWeapon) {
        const weaponType = findById(
            weaponTypes,
            baseWeapon.weaponType
        );

        if (weaponType?.equippedTrait) {
            traits.add(weaponType.equippedTrait);
        }

        if (
            number(character?.transformationGauge) > 0 &&
            baseWeapon.transformation?.enabled
        ) {
            const trait = baseWeapon.transformation.trait ??
                weaponType?.transformationTrait;

            if (trait) traits.add(trait);
        }
    }

    for (const trait of getSkillGrantedTraits(
        character,
        excludeSkillId
    )) {
        traits.add(trait);
    }

    return [...traits];
}

function meetsOptionalRuleRequirement(character, requirement) {
    const ruleId = requirement.rule ??
        requirement.id ??
        requirement.optionalRule;

    if (!ruleId) return false;

    return character?.optionalRules?.[ruleId] ===
        (requirement.enabled ?? true);
}

export function meetsSkillRequirement(
    character,
    requirement,
    candidateSkillId = null
) {
    if (!requirement || typeof requirement !== 'object') {
        return false;
    }

    // The anyOf entries in skills.js are shorthand objects.
    if (!requirement.type && !requirement.kind) {
        if (requirement.skill) {
            return hasSkill(
                character,
                requirement.skill,
                candidateSkillId
            );
        }

        if (requirement.weaponProficiency) {
            return hasEffectiveWeaponProficiency(
                character,
                requirement.weaponProficiency,
                candidateSkillId
            );
        }

        if (requirement.trait) {
            return getTraitsForSkillEligibility(
                character,
                candidateSkillId
            ).includes(requirement.trait);
        }

        if (requirement.movementType) {
            return hasMovementType(character, requirement.movementType);
        }

        return false;
    }

    switch (requirement.type ?? requirement.kind) {
        case 'level':
        case 'minimum-level':
            return getEffectiveSkillLevel(
                character,
                candidateSkillId
            ) >= number(requirement.level ?? requirement.value);

        case 'weapon-proficiency':
            return hasEffectiveWeaponProficiency(
                character,
                requirement.weaponType ?? requirement.weapon,
                candidateSkillId
            );

        case 'any-weapon-proficiency':
            return (requirement.weaponTypes ?? requirement.weapons ?? [])
                .some((id) => hasEffectiveWeaponProficiency(
                    character,
                    id,
                    candidateSkillId
                ));

        case 'all-weapon-proficiencies':
            return (requirement.weaponTypes ?? requirement.weapons ?? [])
                .every((id) => hasEffectiveWeaponProficiency(
                    character,
                    id,
                    candidateSkillId
                ));

        case 'movement-type':
            return hasMovementType(
                character,
                requirement.movementType ?? requirement.value
            );

        case 'any-movement-type':
            return (requirement.movementTypes ?? requirement.values ?? [])
                .includes(character?.movementType);

        case 'skill':
            return hasSkill(
                character,
                requirement.skillId ?? requirement.skill,
                candidateSkillId
            );

        case 'any-skill':
            return (requirement.skillIds ?? requirement.skills ?? [])
                .some((id) => hasSkill(
                    character,
                    id,
                    candidateSkillId
                ));

        case 'trait':
            return getTraitsForSkillEligibility(
                character,
                candidateSkillId
            ).includes(requirement.trait ?? requirement.value);

        case 'any-trait':
            return (requirement.traits ?? requirement.values ?? [])
                .some((trait) => getTraitsForSkillEligibility(
                    character,
                    candidateSkillId
                ).includes(trait));

        case 'optional-rule':
            return meetsOptionalRuleRequirement(character, requirement);

        default:
            return false;
    }
}

function meetsObjectRequirements(character, requirements, skillId) {
    const supported = new Set([
        'level',
        'movementTypes',
        'anyWeaponProficiency',
        'requiredSkills',
        'excludedSkills',
        'requiresCombatArt',
        'requiresGMPermission',
        'anyOf',
    ]);

    if (Object.keys(requirements).some((key) => !supported.has(key))) {
        return false;
    }

    if (
        requirements.level != null &&
        getEffectiveSkillLevel(character, skillId) <
        number(requirements.level)
    ) {
        return false;
    }

    if (
        requirements.movementTypes &&
        !requirements.movementTypes.includes(character?.movementType)
    ) {
        return false;
    }

    if (
        requirements.anyWeaponProficiency &&
        !requirements.anyWeaponProficiency.some((id) =>
            hasEffectiveWeaponProficiency(character, id, skillId)
        )
    ) {
        return false;
    }

    if (
        requirements.requiredSkills &&
        !requirements.requiredSkills.every((id) =>
            hasSkill(character, id, skillId)
        )
    ) {
        return false;
    }

    if (
        requirements.excludedSkills?.some((id) =>
            hasSkill(character, id, skillId)
        )
    ) {
        return false;
    }

    if (
        requirements.requiresCombatArt === true &&
        !getSelectedSkills(character, skillId)
            .some((skill) => skill.category === 'combat-art')
    ) {
        return false;
    }

    if (
        requirements.anyOf &&
        !requirements.anyOf.some((requirement) =>
            meetsSkillRequirement(character, requirement, skillId)
        )
    ) {
        return false;
    }

    // GM approval is not enforced by the character builder.
    return true;
}

export function meetsSkillRequirements(character, skill) {
    const requirements = skill?.requirements ??
        skill?.prerequisites ??
        [];

    if (Array.isArray(requirements)) {
        const checks = requirements.map((requirement) =>
            meetsSkillRequirement(character, requirement, skill?.id)
        );

        return (skill?.requirementMode ?? skill?.prerequisiteMode) === 'any'
            ? checks.length === 0 || checks.some(Boolean)
            : checks.every(Boolean);
    }

    if (requirements && typeof requirements === 'object') {
        return meetsObjectRequirements(character, requirements, skill?.id);
    }

    return false;
}

export function getMutuallyExclusiveSkillIds(skill) {
    return [...new Set([
        skill?.mutuallyExclusiveWith,
        skill?.excludes,
        skill?.conflictsWith,
    ].flatMap((value) =>
        Array.isArray(value) ? value : value ? [value] : []
    ))];
}

export function hasSkillConflict(character, skill) {
    const selectedIds = getSelectedSkillIds(character, skill?.id);

    if (getMutuallyExclusiveSkillIds(skill)
        .some((id) => selectedIds.includes(id))) {
        return true;
    }

    return selectedIds.some((id) => {
        const selected = getSkillById(id);
        return selected &&
            getMutuallyExclusiveSkillIds(selected).includes(skill?.id);
    });
}

export function isSkillModuleEnabled(character, skill) {
    const rule = skill?.optionalRule ?? skill?.module;
    return !rule || character?.optionalRules?.[rule] === true;
}

export function getSkillEligibility(character, skill) {
    if (!skill) {
        return {
            eligible: false,
            reasons: ['Skill not found.'],
        };
    }

    const reasons = [];

    if (!isSkillModuleEnabled(character, skill)) {
        reasons.push('Required optional rule is disabled.');
    }

    if (!meetsSkillRequirements(character, skill)) {
        reasons.push('Skill prerequisites are not met.');
    }

    if (hasSkillConflict(character, skill)) {
        reasons.push('Conflicts with an existing skill.');
    }

    return {
        eligible: reasons.length === 0,
        reasons,
    };
}

export function canSelectSkill(character, skill) {
    return getSkillEligibility(character, skill).eligible;
}

export function getEligibleSkills(character) {
    return skills.filter((skill) => canSelectSkill(character, skill));
}

export function getEligibleSkillsByCategory(character, category) {
    return getEligibleSkills(character).filter(
        (skill) => skill.category?.toLowerCase() ===
            category?.toLowerCase()
    );
}

export function validateSelectedSkills(character) {
    return getSelectedSkillIds(character).map((skillId) => {
        const skill = getSkillById(skillId);
        return {
            skillId,
            skill,
            ...getSkillEligibility(character, skill),
        };
    });
}

export default {
    getSelectedSkillIds,
    getSelectedSkills,
    hasSkill,
    hasWeaponProficiency,
    hasAnyWeaponProficiency,
    hasAllWeaponProficiencies,
    getActiveSkillEffects,
    hasSkillEffect,
    getSkillGrantedWeaponProficiencies,
    hasEffectiveWeaponProficiency,
    hasMovementType,
    getSkillLevelOffset,
    getMovementSkillLevelOffset,
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
