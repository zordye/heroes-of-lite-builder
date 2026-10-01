import { movementTypes } from '../data/movementTypes';

import {
    getWeaponMight,
    getWeaponPower,
    getWeaponTri,
    getWeaponStatBonus,
    getWeaponDerivedStatBonus,
    getWeaponBaseData,
} from './weaponCalculations';

// =========================================================
// INTERNAL HELPERS
// =========================================================

function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function getMovementTypeData(movementTypeId) {
    if (!movementTypeId) {
        return null;
    }

    /*
      Supports either:
  
      movementTypes = {
        infantry: {...},
        cavalry: {...},
      }
  
      OR:
  
      movementTypes = [
        { id: 'infantry', ... },
        ...
      ]
  
      This keeps the calculation file tolerant of either
      data-file structure.
    */
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

function getStatData(character, stat) {
    return character?.combatStats?.[stat] ?? {};
}

function getTransformationGauge(character) {
    const gauge = Math.floor(
        toNumber(character?.transformationGauge)
    );

    return Math.max(0, Math.min(4, gauge));
}

// =========================================================
// EQUIPPED WEAPON
// =========================================================

export function getEquippedWeapon(character) {
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

export function getEquippedBaseWeapon(character) {
    const weapon = getEquippedWeapon(character);

    if (!weapon) {
        return null;
    }

    return getWeaponBaseData(weapon);
}

// =========================================================
// PERMANENT STATS
// =========================================================

export function getPermanentStat(character, stat) {
    const statData = getStatData(character, stat);

    return (
        toNumber(statData.base) +
        toNumber(statData.levelUp)
    );
}

// =========================================================
// TEMPORARY STATS
// =========================================================

export function getTemporaryStat(character, stat) {
    return toNumber(
        getStatData(character, stat).temporary
    );
}

// =========================================================
// WEAPON STAT BONUSES
// =========================================================

export function getEquippedWeaponStatBonus(
    character,
    stat
) {
    const weapon = getEquippedWeapon(character);

    if (!weapon) {
        return 0;
    }

    return getWeaponStatBonus(
        weapon,
        stat,
        getTransformationGauge(character)
    );
}

// =========================================================
// FINAL STATS
// =========================================================

export function getFinalStat(character, stat) {
    return (
        getPermanentStat(character, stat) +
        getTemporaryStat(character, stat) +
        getEquippedWeaponStatBonus(character, stat)
    );
}

// =========================================================
// MAXIMUM HP
// =========================================================

export function getMaxHp(character) {
    return getFinalStat(character, 'hp');
}

// =========================================================
// HIT
// =========================================================
//
// Base:
// floor(Dexterity / 4)
//
// Precise:
// +ceil(Gauge / 2) while transformed
// =========================================================

export function getHit(character) {
    const dexterity = getFinalStat(
        character,
        'dexterity'
    );

    let hit = Math.floor(dexterity / 4);

    const weapon = getEquippedWeapon(character);

    if (weapon) {
        hit += getWeaponDerivedStatBonus(
            weapon,
            'hit',
            getTransformationGauge(character)
        );
    }

    return hit;
}

// =========================================================
// AVOID
// =========================================================
//
// Base:
// floor(Luck / 4) + 4
//
// Luckier:
// +ceil(Gauge / 2) while transformed
// =========================================================

export function getAvoid(character) {
    const luck = getFinalStat(
        character,
        'luck'
    );

    let avoid = Math.floor(luck / 4) + 4;

    const weapon = getEquippedWeapon(character);

    if (weapon) {
        avoid += getWeaponDerivedStatBonus(
            weapon,
            'avoid',
            getTransformationGauge(character)
        );
    }

    return avoid;
}

// =========================================================
// CRITICAL AVOID
// =========================================================

export function getCriticalAvoid(character) {
    return getAvoid(character) + 15;
}

// =========================================================
// MIGHT
// =========================================================

export function getMight(character) {
    const weapon = getEquippedWeapon(character);

    if (!weapon) {
        return 0;
    }

    return getWeaponMight(
        weapon,
        getTransformationGauge(character)
    );
}

// =========================================================
// POWER
// =========================================================
//
// Normal:
// Attack + Might
//
// Exact:
// Dexterity + Might
//
// Effective:
// Might is tripled before Attack/Dexterity is added.
// =========================================================

export function getPower(character) {
    const weapon = getEquippedWeapon(character);

    if (!weapon) {
        return 0;
    }

    return getWeaponPower({
        weapon,

        attack: getFinalStat(
            character,
            'attack'
        ),

        dexterity: getFinalStat(
            character,
            'dexterity'
        ),

        transformationGauge:
            getTransformationGauge(character),

        effective:
            character?.situational?.effective === true,
    });
}

// =========================================================
// TRI
// =========================================================

export function getTri(character) {
    return getWeaponTri(
        getPower(character)
    );
}

// =========================================================
// MOVEMENT
// =========================================================
//
// Base Movement comes from Movement Type.
//
// Nimbler:
// +ceil(Gauge / 2) while transformed.
// =========================================================

export function getMovement(character) {
    const movementType = getMovementTypeData(
        character?.movementType
    );

    let movement = toNumber(
        movementType?.move
    );

    const weapon = getEquippedWeapon(character);

    if (weapon) {
        movement += getWeaponDerivedStatBonus(
            weapon,
            'movement',
            getTransformationGauge(character)
        );
    }

    return movement;
}

// =========================================================
// SIZE
// =========================================================

export function getBaseSize(character) {
    return Math.max(
        1,
        Math.floor(
            toNumber(character?.size, 1)
        )
    );
}

// =========================================================
// TOTAL SIZE
// =========================================================
//
// Strike / Talon / Breath:
// +2 Size while transformed.
//
// Gauge 0 = not transformed.
// Gauge 1-4 = transformed.
// =========================================================

export function getTotalSize(character) {
    let totalSize = getBaseSize(character);

    const baseWeapon =
        getEquippedBaseWeapon(character);

    const gauge =
        getTransformationGauge(character);

    if (
        gauge > 0 &&
        baseWeapon?.transformation?.enabled === true
    ) {
        totalSize += 2;
    }

    return totalSize;
}

// =========================================================
// CONSTITUTION
// =========================================================
//
// Con = Total Size
//
// Armor Movement Type:
// +2 Con
// =========================================================

export function getCon(character) {
    let con = getTotalSize(character);

    if (character?.movementType === 'armor') {
        con += 2;
    }

    return con;
}

// =========================================================
// AID
// =========================================================
//
// Aid = Strength + Movement Type Base Aid
// =========================================================

export function getAid(character) {
    const strength = toNumber(
        character?.outOfCombatStats?.strength
    );

    const movementType = getMovementTypeData(
        character?.movementType
    );

    const baseAid = toNumber(
        movementType?.baseAid
    );

    return strength + baseAid;
}

// =========================================================
// OUT-OF-COMBAT DERIVED STATS
// =========================================================
//
// Fate:
// min(floor(Luck / 5), 3)
//
// Finesse:
// min(floor(Dexterity / 5), 3)
//
// Acrobatics:
// min(floor(Speed / 5), 3)
// =========================================================

export function getFate(character) {
    return Math.min(
        Math.floor(
            getFinalStat(character, 'luck') / 5
        ),
        3
    );
}

export function getFinesse(character) {
    return Math.min(
        Math.floor(
            getFinalStat(character, 'dexterity') / 5
        ),
        3
    );
}

export function getAcrobatics(character) {
    return Math.min(
        Math.floor(
            getFinalStat(character, 'speed') / 5
        ),
        3
    );
}

// =========================================================
// NORMAL STAT CAPS
// =========================================================

export function getNormalStatCap(
    level,
    stat
) {
    const currentLevel = Math.max(
        1,
        Math.floor(toNumber(level, 1))
    );

    const isHp = stat === 'hp';

    if (currentLevel === 1) {
        return isHp ? 20 : 8;
    }

    if (currentLevel <= 10) {
        return isHp ? 30 : 12;
    }

    if (currentLevel <= 15) {
        return isHp ? 35 : 16;
    }

    if (currentLevel <= 20) {
        return isHp ? 40 : 20;
    }

    if (currentLevel <= 25) {
        return isHp ? 45 : 24;
    }

    return isHp ? 50 : 30;
}

// =========================================================
// STAT CAP VALIDATION
// =========================================================
//
// Caps apply to permanent stats:
//
// Base + Level Up
//
// Temporary bonuses and equipped weapon bonuses do NOT
// count against permanent stat caps.
// =========================================================

export function isStatWithinNormalCap(
    character,
    stat
) {
    const permanentStat =
        getPermanentStat(character, stat);

    const cap = getNormalStatCap(
        character?.level,
        stat
    );

    return permanentStat <= cap;
}

// =========================================================
// LEVEL-UP POINTS
// =========================================================
//
// Level 1:
// 12 starting allocation points.
//
// Every level after Level 1:
// +3 stat points.
//
// This function reports only points earned from leveling.
// =========================================================

export function getLevelUpStatPoints(level) {
    const currentLevel = Math.max(
        1,
        Math.floor(toNumber(level, 1))
    );

    return (currentLevel - 1) * 3;
}

// =========================================================
// STARTING STAT POINTS
// =========================================================

export function getStartingStatPointsSpent(character) {
    const startingMinimums = {
        hp: 15,
        attack: 3,
        defense: 3,
        dexterity: 3,
        speed: 3,
        resistance: 3,
        luck: 3,
    };

    return Object.entries(startingMinimums).reduce(
        (total, [stat, minimum]) => {
            const base = toNumber(
                character?.combatStats?.[stat]?.base,
                minimum
            );

            return total + Math.max(0, base - minimum);
        },
        0
    );
}

export function getStartingStatPointsRemaining(
    character
) {
    return (
        12 -
        getStartingStatPointsSpent(character)
    );
}

// =========================================================
// LEVEL-UP POINTS SPENT
// =========================================================

export function getLevelUpStatPointsSpent(character) {
    const stats = [
        'hp',
        'attack',
        'defense',
        'dexterity',
        'speed',
        'resistance',
        'luck',
    ];

    return stats.reduce(
        (total, stat) =>
            total +
            Math.max(
                0,
                toNumber(
                    character?.combatStats?.[stat]?.levelUp
                )
            ),
        0
    );
}

export function getLevelUpStatPointsRemaining(
    character
) {
    return (
        getLevelUpStatPoints(character?.level) -
        getLevelUpStatPointsSpent(character)
    );
}

// =========================================================
// OUT-OF-COMBAT POINTS
// =========================================================

export function getOutOfCombatPointsSpent(character) {
    const stats = [
        'strength',
        'intellect',
        'perception',
        'charisma',
    ];

    return stats.reduce(
        (total, stat) =>
            total +
            Math.max(
                0,
                toNumber(
                    character?.outOfCombatStats?.[stat]
                )
            ),
        0
    );
}

export function getOutOfCombatPointsRemaining(
    character
) {
    return (
        6 -
        getOutOfCombatPointsSpent(character)
    );
}

// =========================================================
// OUT-OF-COMBAT STAT VALIDATION
// =========================================================

export function isOutOfCombatStatValid(
    character,
    stat
) {
    const value = toNumber(
        character?.outOfCombatStats?.[stat]
    );

    return value >= 0 && value <= 3;
}

// =========================================================
// TRANSFORMATION STATE
// =========================================================

export function isTransformed(character) {
    const weapon =
        getEquippedBaseWeapon(character);

    return (
        getTransformationGauge(character) > 0 &&
        weapon?.transformation?.enabled === true
    );
}

// =========================================================
// DISPLAYED STAT SUMMARY
// =========================================================

export function getCombatStatSummary(
    character,
    stat
) {
    return {
        base: toNumber(
            character?.combatStats?.[stat]?.base
        ),

        levelUp: toNumber(
            character?.combatStats?.[stat]?.levelUp
        ),

        temporary: toNumber(
            character?.combatStats?.[stat]?.temporary
        ),

        weapon: getEquippedWeaponStatBonus(
            character,
            stat
        ),

        permanent: getPermanentStat(
            character,
            stat
        ),

        final: getFinalStat(
            character,
            stat
        ),

        cap: getNormalStatCap(
            character?.level,
            stat
        ),

        withinCap: isStatWithinNormalCap(
            character,
            stat
        ),
    };
}

// =========================================================
// DERIVED COMBAT SUMMARY
// =========================================================

export function getDerivedCombatStats(character) {
    return {
        maxHp: getMaxHp(character),

        currentHp:
            character?.currentHp ??
            getMaxHp(character),

        charge: toNumber(
            character?.charge
        ),

        might: getMight(character),

        power: getPower(character),

        tri: getTri(character),

        hit: getHit(character),

        avoid: getAvoid(character),

        criticalAvoid:
            getCriticalAvoid(character),

        movement:
            getMovement(character),

        size:
            getBaseSize(character),

        totalSize:
            getTotalSize(character),

        con:
            getCon(character),

        aid:
            getAid(character),

        fate:
            getFate(character),

        finesse:
            getFinesse(character),

        acrobatics:
            getAcrobatics(character),

        transformed:
            isTransformed(character),

        transformationGauge:
            getTransformationGauge(character),
    };
}