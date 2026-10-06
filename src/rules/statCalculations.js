// src/rules/statCalculations.js

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

    return Math.max(
        0,
        Math.min(4, gauge)
    );
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
//
// Permanent:
//
// Base + Level Up
//
// Temporary bonuses, weapon bonuses, terrain, statuses,
// and supports do NOT count toward permanent stat caps.
// =========================================================

export function getPermanentStat(
    character,
    stat
) {
    const statData = getStatData(
        character,
        stat
    );

    return (
        toNumber(statData.base) +
        toNumber(statData.levelUp)
    );
}

// =========================================================
// TEMPORARY STATS
// =========================================================

export function getTemporaryStat(
    character,
    stat
) {
    return toNumber(
        getStatData(
            character,
            stat
        ).temporary
    );
}

// =========================================================
// WEAPON STAT BONUSES
// =========================================================

export function getEquippedWeaponStatBonus(
    character,
    stat
) {
    const weapon =
        getEquippedWeapon(character);

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
// STATUS STAT BONUSES / PENALTIES
// =========================================================
//
// Example:
//
// Injured:
// Attack      -3
// Speed       -3
// Defense     -3
// Resistance  -3
//
// Overrides such as Shocked Avoid = 0 are handled
// separately.
// =========================================================

export function getStatusModifier(
    character,
    stat
) {
    return getStatusStatModifier(
        character,
        stat
    );
}

// =========================================================
// TERRAIN STAT BONUSES
// =========================================================
//
// This handles bonuses to BASE combat stats.
//
// Example:
//
// Forest:
// Defense +1
//
// Mountain:
// Defense +3
//
// Avoid is derived and is therefore handled separately in
// getAvoid().
// =========================================================

export function getTerrainBonus(
    character,
    stat
) {
    return getTerrainStatBonus(
        character,
        stat
    );
}

// =========================================================
// SUPPORT BONUSES
// =========================================================
//
// The active support relationship may provide bonuses to:
//
// Attack
// Speed
// Defense
// Resistance
// Hit
// Avoid
//
// Hit and Avoid are derived stats, so their bonuses are
// applied later in getHit() and getAvoid().
//
// This helper is used here for bonuses to normal combat
// stats.
// =========================================================

export function getActiveSupportBonus(
    character,
    stat
) {
    return getSupportBonus(
        character,
        stat
    );
}

// =========================================================
// FINAL COMBAT STATS
// =========================================================
//
// Final =
//
// Permanent
// + Temporary
// + Weapon
// + Status modifier
// + Terrain
// + Support
//
// This function is for the seven base combat stats:
//
// HP
// Attack
// Defense
// Dexterity
// Speed
// Resistance
// Luck
//
// Derived stats such as Hit and Avoid are calculated later.
// =========================================================

export function getFinalStat(
    character,
    stat
) {
    return (
        getPermanentStat(character, stat) +
        getTemporaryStat(character, stat) +
        getEquippedWeaponStatBonus(
            character,
            stat
        ) +
        getStatusModifier(
            character,
            stat
        ) +
        getTerrainBonus(
            character,
            stat
        ) +
        getActiveSupportBonus(
            character,
            stat
        )
    );
}

// =========================================================
// MAXIMUM HP
// =========================================================

export function getMaxHp(character) {
    return getFinalStat(
        character,
        'hp'
    );
}

// =========================================================
// HIT
// =========================================================
//
// Base:
//
// floor(Dexterity / 4)
//
// Precise:
//
// +ceil(Gauge / 2)
//
// Support:
//
// A support may directly grant Hit.
//
// Support Hit is applied AFTER calculating Hit from
// Dexterity. It does not modify Dexterity itself.
// =========================================================

export function getHit(character) {
    const dexterity =
        getFinalStat(
            character,
            'dexterity'
        );

    let hit =
        Math.floor(
            dexterity / 4
        );

    const weapon =
        getEquippedWeapon(character);

    if (weapon) {
        hit +=
            getWeaponDerivedStatBonus(
                weapon,
                'hit',
                getTransformationGauge(
                    character
                )
            );
    }

    hit +=
        getActiveSupportBonus(
            character,
            'hit'
        );

    return hit;
}

// =========================================================
// AVOID
// =========================================================
//
// Normal:
//
// floor(Luck / 4) + 4
//
// Then:
//
// + weapon bonuses
// + terrain bonuses
// + support bonuses
//
// Shocked:
//
// Avoid is SET to 0.
//
// The override happens first here because once Shocked is
// active the final value is fixed at 0. Forest, Water,
// Luckier, Support bonuses, etc. cannot raise it.
// =========================================================

export function getAvoid(character) {
    const override =
        getStatusStatOverride(
            character,
            'avoid'
        );

    if (override !== null) {
        return override;
    }

    const luck =
        getFinalStat(
            character,
            'luck'
        );

    let avoid =
        Math.floor(
            luck / 4
        ) + 4;

    const weapon =
        getEquippedWeapon(character);

    if (weapon) {
        avoid +=
            getWeaponDerivedStatBonus(
                weapon,
                'avoid',
                getTransformationGauge(
                    character
                )
            );
    }

    avoid +=
        getTerrainStatBonus(
            character,
            'avoid'
        );

    avoid +=
        getActiveSupportBonus(
            character,
            'avoid'
        );

    return avoid;
}

// =========================================================
// CRITICAL AVOID
// =========================================================
//
// Normal:
//
// Avoid + 15
//
// Shocked:
//
// Critical Avoid is SET to 15.
// =========================================================

export function getCriticalAvoid(
    character
) {
    const override =
        getStatusStatOverride(
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
//
// This is the character's NORMAL equipped weapon Might.
//
// Effectiveness is applied when calculating Power so that
// the normal Might display can remain the weapon's actual
// Might.
// =========================================================

export function getMight(character) {
    const weapon =
        getEquippedWeapon(character);

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
//
// Attack + Might
//
// Exact:
//
// Dexterity + Might
//
// Effective:
//
// Weapon Might is tripled BEFORE Attack/Dexterity is added.
// =========================================================

export function getPower(character) {
    const weapon =
        getEquippedWeapon(character);

    if (!weapon) {
        return 0;
    }

    return getWeaponPower({
        weapon,

        attack:
            getFinalStat(
                character,
                'attack'
            ),

        dexterity:
            getFinalStat(
                character,
                'dexterity'
            ),

        transformationGauge:
            getTransformationGauge(
                character
            ),

        effective:
            character?.situational?.effective ===
            true,
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
// Base movement comes from Movement Type.
//
// Nimbler:
//
// +ceil(Gauge / 2)
//
// Shocked:
//
// Movement is SET to 0.
//
// Terrain movement costs are NOT subtracted here.
// Terrain determines the cost of entering a tile rather
// than changing the character's actual Movement stat.
// =========================================================

export function getMovement(character) {
    const override =
        getStatusStatOverride(
            character,
            'movement'
        );

    if (override !== null) {
        return override;
    }

    const movementType =
        getMovementTypeData(
            character?.movementType
        );

    let movement =
        toNumber(
            movementType?.move
        );

    const weapon =
        getEquippedWeapon(character);

    if (weapon) {
        movement +=
            getWeaponDerivedStatBonus(
                weapon,
                'movement',
                getTransformationGauge(
                    character
                )
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
            toNumber(
                character?.size,
                1
            )
        )
    );
}

// =========================================================
// TOTAL SIZE
// =========================================================
//
// Strike / Talon / Breath:
//
// +2 Size while transformed.
//
// Gauge 0:
// Not transformed.
//
// Gauge 1-4:
// Transformed.
// =========================================================

export function getTotalSize(character) {
    let totalSize =
        getBaseSize(character);

    const baseWeapon =
        getEquippedBaseWeapon(
            character
        );

    const gauge =
        getTransformationGauge(
            character
        );

    if (
        gauge > 0 &&
        baseWeapon?.transformation?.enabled ===
        true
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
// Armor:
// +2 Con
// =========================================================

export function getCon(character) {
    let con =
        getTotalSize(character);

    if (
        character?.movementType ===
        'armor'
    ) {
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
    const strength =
        toNumber(
            character
                ?.outOfCombatStats
                ?.strength
        );

    const movementType =
        getMovementTypeData(
            character?.movementType
        );

    const baseAid =
        toNumber(
            movementType?.baseAid
        );

    return strength + baseAid;
}

// =========================================================
// OUT-OF-COMBAT DERIVED STATS
// =========================================================
//
// Fate:
//
// min(floor(Luck / 5), 3)
//
// Finesse:
//
// min(floor(Dexterity / 5), 3)
//
// Acrobatics:
//
// min(floor(Speed / 5), 3)
//
// These use the character's currently displayed combat
// stats, including active bonuses and penalties.
// =========================================================

export function getFate(character) {
    return Math.min(
        Math.floor(
            getFinalStat(
                character,
                'luck'
            ) / 5
        ),
        3
    );
}

export function getFinesse(character) {
    return Math.min(
        Math.floor(
            getFinalStat(
                character,
                'dexterity'
            ) / 5
        ),
        3
    );
}

export function getAcrobatics(character) {
    return Math.min(
        Math.floor(
            getFinalStat(
                character,
                'speed'
            ) / 5
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
    const currentLevel =
        Math.max(
            1,
            Math.floor(
                toNumber(
                    level,
                    1
                )
            )
        );

    const isHp =
        stat === 'hp';

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
// ONLY:
//
// Base + Level Up
//
// counts against the normal stat cap.
//
// These do NOT count:
//
// Temporary
// Weapon
// Status
// Terrain
// Support
// =========================================================

export function isStatWithinNormalCap(
    character,
    stat
) {
    const permanentStat =
        getPermanentStat(
            character,
            stat
        );

    const cap =
        getNormalStatCap(
            character?.level,
            stat
        );

    return permanentStat <= cap;
}

// =========================================================
// LEVEL-UP POINTS
// =========================================================
//
// Every level after Level 1:
//
// +3 stat points
// =========================================================

export function getLevelUpStatPoints(
    level
) {
    const currentLevel =
        Math.max(
            1,
            Math.floor(
                toNumber(
                    level,
                    1
                )
            )
        );

    return (
        currentLevel - 1
    ) * 3;
}

// =========================================================
// STARTING STAT POINTS
// =========================================================
//
// Level 1:
//
// HP starts at 15.
//
// All other combat stats start at 3.
//
// Character receives 12 additional points.
// =========================================================

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
        (
            total,
            [stat, minimum]
        ) => {
            const base =
                toNumber(
                    character
                        ?.combatStats
                        ?.[stat]
                        ?.base,
                    minimum
                );

            return (
                total +
                Math.max(
                    0,
                    base - minimum
                )
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
        getStartingStatPointsSpent(
            character
        )
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
                    character
                        ?.combatStats
                        ?.[stat]
                        ?.levelUp
                )
            ),
        0
    );
}

export function getLevelUpStatPointsRemaining(
    character
) {
    return (
        getLevelUpStatPoints(
            character?.level
        ) -
        getLevelUpStatPointsSpent(
            character
        )
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
                    character
                        ?.outOfCombatStats
                    ?.[stat]
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
        getOutOfCombatPointsSpent(
            character
        )
    );
}

// =========================================================
// OUT-OF-COMBAT STAT VALIDATION
// =========================================================

export function isOutOfCombatStatValid(
    character,
    stat
) {
    const value =
        toNumber(
            character
                ?.outOfCombatStats
            ?.[stat]
        );

    return (
        value >= 0 &&
        value <= 3
    );
}

// =========================================================
// TRANSFORMATION STATE
// =========================================================

export function isTransformed(
    character
) {
    const weapon =
        getEquippedBaseWeapon(
            character
        );

    return (
        getTransformationGauge(
            character
        ) > 0 &&
        weapon?.transformation?.enabled ===
        true
    );
}

// =========================================================
// COMBAT STAT SUMMARY
// =========================================================
//
// Useful for displaying:
//
// Base
// Level Up
// Temporary
// Weapon
// Status
// Terrain
// Support
// Final
//
// The normal stat cap still only checks:
//
// Base + Level Up
// =========================================================

export function getCombatStatSummary(
    character,
    stat
) {
    return {
        base:
            toNumber(
                character
                    ?.combatStats
                    ?.[stat]
                    ?.base
            ),

        levelUp:
            toNumber(
                character
                    ?.combatStats
                    ?.[stat]
                    ?.levelUp
            ),

        temporary:
            getTemporaryStat(
                character,
                stat
            ),

        weapon:
            getEquippedWeaponStatBonus(
                character,
                stat
            ),

        status:
            getStatusModifier(
                character,
                stat
            ),

        terrain:
            getTerrainBonus(
                character,
                stat
            ),

        support:
            getActiveSupportBonus(
                character,
                stat
            ),

        permanent:
            getPermanentStat(
                character,
                stat
            ),

        final:
            getFinalStat(
                character,
                stat
            ),

        cap:
            getNormalStatCap(
                character?.level,
                stat
            ),

        withinCap:
            isStatWithinNormalCap(
                character,
                stat
            ),
    };
}

// =========================================================
// DERIVED COMBAT SUMMARY
// =========================================================
//
// This gives the eventual character-sheet UI one convenient
// object containing all of the commonly displayed derived
// values.
// =========================================================

export function getDerivedCombatStats(
    character
) {
    return {
        maxHp:
            getMaxHp(character),

        currentHp:
            character?.currentHp ??
            getMaxHp(character),

        charge:
            toNumber(
                character?.charge
            ),

        might:
            getMight(character),

        power:
            getPower(character),

        tri:
            getTri(character),

        hit:
            getHit(character),

        avoid:
            getAvoid(character),

        criticalAvoid:
            getCriticalAvoid(
                character
            ),

        movement:
            getMovement(character),

        size:
            getBaseSize(character),

        totalSize:
            getTotalSize(
                character
            ),

        con:
            getCon(character),

        aid:
            getAid(character),

        fate:
            getFate(character),

        finesse:
            getFinesse(character),

        acrobatics:
            getAcrobatics(
                character
            ),

        transformed:
            isTransformed(
                character
            ),

        transformationGauge:
            getTransformationGauge(
                character
            ),
    };
}