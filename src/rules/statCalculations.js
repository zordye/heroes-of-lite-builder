
import { movementTypes } from '../data/movementTypes';

import {
    getWeaponMight,
    getWeaponPower,
    getWeaponTri,
    getWeaponStatBonus,
    getWeaponDerivedStatBonus,
    getWeaponBaseData,
} from './weaponCalculations';

import {
    getTerrainStatBonus,
} from './terrainCalculations';

import {
    getStatusStatModifier,
    getStatusStatOverride,
} from './statusCalculations';

import {
    getSupportBonus,
} from './supportCalculations';

import {
    getPerformPenalty,
    getRallyBonus,
} from './sheetModifiers';

// =========================================================
// INTERNAL HELPERS
// =========================================================

function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
}

function getMovementTypeData(movementTypeId) {
    if (!movementTypeId) return null;

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

    if (!weapon) return null;

    return getWeaponBaseData(weapon);
}

// =========================================================
// PERMANENT STATS
// =========================================================

// Only Base + Level Up counts against permanent stat caps.
// Perform does not modify the allocated values.

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

    if (!weapon) return 0;

    return getWeaponStatBonus(
        weapon,
        stat,
        getTransformationGauge(character)
    );
}

// =========================================================
// STATUS MODIFIERS
// =========================================================

export function getStatusModifier(character, stat) {
    return getStatusStatModifier(character, stat);
}

// =========================================================
// TERRAIN BONUSES
// =========================================================

export function getTerrainBonus(character, stat) {
    return getTerrainStatBonus(character, stat);
}

// =========================================================
// SUPPORT BONUSES
// =========================================================

export function getActiveSupportBonus(
    character,
    stat
) {
    return getSupportBonus(character, stat);
}

// =========================================================
// PERFORM
// =========================================================

// Perform imposes permanent penalties while learned.
//
// HP: -3
// Four different selected combat stats: -2 each
//
// These penalties are independent of allocated points.

export function getPerformStatModifier(
    character,
    stat
) {
    return getPerformPenalty(character, stat);
}

// =========================================================
// RALLY
// =========================================================

// Rally effects are situational bonuses.
//
// Rally Offenses:
// Attack +3, Hit +1
//
// Rally Reflexes:
// Speed +3, Avoid +1
//
// Rally Defenses:
// Defense +2, Resistance +2
//
// Rally Movement:
// Movement +1
//
// All four effects can be active simultaneously.

export function getRallyStatModifier(
    character,
    stat
) {
    return getRallyBonus(character, stat);
}

// =========================================================
// FINAL COMBAT STATS
// =========================================================

// Final =
// Permanent
// + Temporary
// + Weapon
// + Status
// + Terrain
// + Support
// + Perform
// + Rally
//
// Only allocated Base + Level Up counts toward caps.

export function getFinalStat(character, stat) {
    return (
        getPermanentStat(character, stat) +
        getTemporaryStat(character, stat) +
        getEquippedWeaponStatBonus(character, stat) +
        getStatusModifier(character, stat) +
        getTerrainBonus(character, stat) +
        getActiveSupportBonus(character, stat) +
        getPerformStatModifier(character, stat) +
        getRallyStatModifier(character, stat)
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

// Base: floor(Dexterity / 4)
//
// Weapon-derived bonuses, support bonuses, and
// direct Rally Hit bonuses are added afterward.
//
// Weapon matchup bonuses are applied separately
// by the character sheet.

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

    hit += getActiveSupportBonus(
        character,
        'hit'
    );

    hit += getRallyStatModifier(
        character,
        'hit'
    );

    return hit;
}

// =========================================================
// AVOID
// =========================================================

// Normal: floor(Luck / 4) + 4
//
// Additional bonuses:
// Weapon, Terrain, Support, Rally
//
// Shocked sets Avoid to 0.
// This override takes precedence over every bonus.

export function getAvoid(character) {
    const override = getStatusStatOverride(
        character,
        'avoid'
    );

    if (override !== null) {
        return override;
    }

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

    avoid += getTerrainStatBonus(
        character,
        'avoid'
    );

    avoid += getActiveSupportBonus(
        character,
        'avoid'
    );

    avoid += getRallyStatModifier(
        character,
        'avoid'
    );

    return avoid;
}

// =========================================================
// CRITICAL AVOID
// =========================================================

// Normal: Avoid + 15
//
// Shocked: Critical Avoid is set to 15.

export function getCriticalAvoid(character) {
    const override = getStatusStatOverride(
        character,
        'criticalAvoid'
    );

    if (override !== null) {
        return override;
    }

    return getAvoid(character) + 15;
}

// =========================================================
// MIGHT
// =========================================================

// Returns normal weapon Might.
//
// Effectiveness is applied by getWeaponPower().
// The character sheet can display effective Might
// separately without changing the weapon itself.

export function getMight(character) {
    const weapon = getEquippedWeapon(character);

    if (!weapon) return 0;

    return getWeaponMight(
        weapon,
        getTransformationGauge(character)
    );
}

// =========================================================
// POWER
// =========================================================

// Normal weapons use Attack + Might.
//
// Exact weapons use Dexterity + Might.
//
// Effectiveness triples weapon Might before
// Attack or Dexterity is added.
//
// Rally Offenses is already included in getFinalStat().

export function getPower(character) {
    const weapon = getEquippedWeapon(character);

    if (!weapon) return 0;

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

// Tri is based on Power after effectiveness
// and Rally bonuses.
//
// Weapon matchup adjustments do not change Tri.

export function getTri(character) {
    return getWeaponTri(
        getPower(character)
    );
}

// =========================================================
// MOVEMENT
// =========================================================

// Movement comes from movement type,
// transformation-related weapon bonuses,
// and Rally Movement.
//
// Shocked sets Movement to 0.

export function getMovement(character) {
    const override = getStatusStatOverride(
        character,
        'movement'
    );

    if (override !== null) {
        return override;
    }

    const movementType = getMovementTypeData(
        character?.movementType
    );

    let movement = toNumber(
        movementType?.movement
    );

    const weapon = getEquippedWeapon(character);

    if (weapon) {
        movement += getWeaponDerivedStatBonus(
            weapon,
            'movement',
            getTransformationGauge(character)
        );
    }

    movement += getRallyStatModifier(
        character,
        'movement'
    );

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

// Strike, Talon, and Breath transformation:
// +2 Size when transformed.

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

// Con = Total Size
// Armor movement type: +2 Con

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

// Aid = Strength + Movement Type Base Aid

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

// Fate: min(floor(Luck / 5), 3)
// Finesse: min(floor(Dexterity / 5), 3)
// Acrobatics: min(floor(Speed / 5), 3)
//
// These use final combat stats, including Perform
// and any currently active Rally effects.

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

export function getNormalStatCap(level, stat) {
    const currentLevel = Math.max(
        1,
        Math.floor(
            toNumber(level, 1)
        )
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

// Only allocated Base + Level Up counts.
//
// Perform penalties and Rally bonuses do not
// alter the normal cap validation.

export function isStatWithinNormalCap(
    character,
    stat
) {
    const permanentStat = getPermanentStat(
        character,
        stat
    );

    const cap = getNormalStatCap(
        character?.level,
        stat
    );

    return permanentStat <= cap;
}

// =========================================================
// LEVEL-UP POINTS
// =========================================================

export function getLevelUpStatPoints(level) {
    const currentLevel = Math.max(
        1,
        Math.floor(
            toNumber(level, 1)
        )
    );

    return (currentLevel - 1) * 3;
}

// =========================================================
// STARTING STAT POINTS
// =========================================================

// HP starts at 15.
// Other combat stats start at 3.
// Players receive 12 additional points.
//
// Perform penalties are excluded from allocation.

export function getStartingStatPointsSpent(
    character
) {
    const startingMinimums = {
        hp: 15,
        attack: 3,
        defense: 3,
        dexterity: 3,
        speed: 3,
        resistance: 3,
        luck: 3,
    };

    return Object.entries(
        startingMinimums
    ).reduce(
        (total, [stat, minimum]) => {
            const base = toNumber(
                character?.combatStats?.[stat]?.base,
                minimum
            );

            return (
                total +
                Math.max(0, base - minimum)
            );
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

export function getLevelUpStatPointsSpent(
    character
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

export function getOutOfCombatPointsSpent(
    character
) {
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
// COMBAT STAT SUMMARY
// =========================================================

// Provides the full breakdown of a combat stat.
//
// Perform and Rally are reported separately
// so the source of each modifier remains visible.

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

        temporary: getTemporaryStat(
            character,
            stat
        ),

        weapon: getEquippedWeaponStatBonus(
            character,
            stat
        ),

        status: getStatusModifier(
            character,
            stat
        ),

        terrain: getTerrainBonus(
            character,
            stat
        ),

        support: getActiveSupportBonus(
            character,
            stat
        ),

        perform: getPerformStatModifier(
            character,
            stat
        ),

        rally: getRallyStatModifier(
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

        movement: getMovement(character),

        size: getBaseSize(character),

        totalSize: getTotalSize(character),

        con: getCon(character),

        aid: getAid(character),

        fate: getFate(character),

        finesse: getFinesse(character),

        acrobatics: getAcrobatics(character),

        transformed: isTransformed(character),

        transformationGauge:
            getTransformationGauge(character),
    };
}
