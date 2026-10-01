// =========================================================
// WEAPON REFINEMENT CATEGORIES
// =========================================================

export const REFINEMENT_CATEGORIES = {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    GM_ONLY: 'gm-only',
};

// =========================================================
// WEAPON TYPE GROUPS
// =========================================================

const SWORD_LANCE_AXE = ['sword', 'lance', 'axe'];
const BOW_DAGGER = ['bow', 'dagger'];
const MAGIC = ['anima', 'light', 'dark'];
const TRANSFORMATION = ['strike', 'talon', 'breath'];
const STONE_AND_SIEGE = ['shifting-stone', 'siege'];

// =========================================================
// WEAPON REFINEMENTS
// =========================================================
//
// effectType is used only when the digital sheet needs to
// calculate something automatically.
//
// Combat-only effects remain descriptive.
//
// A weapon may have:
// - Any applicable Basic refinements
// - At most ONE applicable Advanced refinement
// - Any applicable GM-only refinements
//
// The builder does NOT enforce:
// - Gold costs
// - Level progression
// - GM permission
// - How the refinement was acquired
// =========================================================

export const weaponRefinements = [
    // =======================================================
    // SHARED BASIC — SWORD / LANCE / AXE
    // =======================================================

    {
        id: 'steel',
        name: 'Steel',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: SWORD_LANCE_AXE,
        description: '+3 Might.',
        effect: {
            type: 'might',
            amount: 3,
        },
    },

    {
        id: 'scalerending',
        name: 'Scalerending',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: [
            'sword',
            'lance',
            'axe',
            'dagger',
            'anima',
            'shifting-stone',
            'gauntlets',
            'siege',
        ],
        description: 'Effective against units with the Scaled trait.',
        effect: {
            type: 'effectiveness',
            trait: 'Scaled',
        },
    },

    {
        id: 'furflaying',
        name: 'Furflaying',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: [
            'sword',
            'lance',
            'axe',
            'dagger',
            'bow',
            'anima',
            'shifting-stone',
            'siege',
        ],
        description: 'Effective against units with the Furred trait.',
        effect: {
            type: 'effectiveness',
            trait: 'Furred',
        },
    },

    {
        id: 'fiendslaying',
        name: 'Fiendslaying',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: [
            'sword',
            'lance',
            'axe',
            'bow',
            'light',
            'gauntlets',
            'siege',
        ],
        description: 'Effective against units with the Fiendish trait.',
        effect: {
            type: 'effectiveness',
            trait: 'Fiendish',
        },
    },

    {
        id: 'smashing',
        name: 'Smashing',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: SWORD_LANCE_AXE,
        description:
            'If the user initiates combat and hits, the opponent becomes Broken and Shocked after combat. Regardless of who initiates combat, the opponent attacks first.',
    },

    // =======================================================
    // SWORD BASIC
    // =======================================================

    {
        id: 'enchanted-speed',
        name: 'Enchanted [Speed]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['sword'],
        description: '+2 Speed while equipped.',
        effect: {
            type: 'stat',
            stat: 'speed',
            amount: 2,
        },
    },

    {
        id: 'enchanted-luck',
        name: 'Enchanted [Luck]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['sword'],
        description: '+2 Luck while equipped.',
        effect: {
            type: 'stat',
            stat: 'luck',
            amount: 2,
        },
    },

    // =======================================================
    // LANCE BASIC
    // =======================================================

    {
        id: 'enchanted-defense',
        name: 'Enchanted [Defense]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['lance'],
        description: '+2 Defense while equipped.',
        effect: {
            type: 'stat',
            stat: 'defense',
            amount: 2,
        },
    },

    {
        id: 'enchanted-resistance',
        name: 'Enchanted [Resistance]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['lance', 'light'],
        description: '+2 Resistance while equipped.',
        effect: {
            type: 'stat',
            stat: 'resistance',
            amount: 2,
        },
    },

    // =======================================================
    // AXE BASIC
    // =======================================================

    {
        id: 'enchanted-attack',
        name: 'Enchanted [Attack]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['axe', 'dark'],
        description: '+2 Attack while equipped.',
        effect: {
            type: 'stat',
            stat: 'attack',
            amount: 2,
        },
    },

    {
        id: 'enchanted-dexterity',
        name: 'Enchanted [Dexterity]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['axe', 'light'],
        description: '+2 Dexterity while equipped.',
        effect: {
            type: 'stat',
            stat: 'dexterity',
            amount: 2,
        },
    },

    // =======================================================
    // SHARED ADVANCED — SWORD / LANCE / AXE
    // =======================================================

    {
        id: 'silver',
        name: 'Silver',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['sword', 'lance', 'axe', 'dagger', 'bow', 'gauntlets'],
        description: '+4 Might.',
        effect: {
            type: 'might',
            amount: 4,
        },
    },

    {
        id: 'brave',
        name: 'Brave',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['sword', 'lance', 'axe', 'bow', 'dark'],
        description:
            'When the user initiates combat, they deal 2 consecutive strikes per attack instead of 1. Canter is nullified.',
    },

    {
        id: 'long',
        name: 'Long',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: [
            'sword',
            'lance',
            'axe',
            'dagger',
            'bow',
            'anima',
            'light',
            'dark',
            'curse',
        ],
        description: '+1 maximum Range.',
        effect: {
            type: 'range-max',
            amount: 1,
        },
    },

    {
        id: 'killer',
        name: 'Killer',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: [
            'sword',
            'lance',
            'axe',
            'dagger',
            'bow',
            'dark',
            'gauntlets',
        ],
        description: "Opponent suffers -5 Critical Avoid.",
    },

    {
        id: 'hefty',
        name: 'Hefty',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['sword', 'lance', 'axe', 'bow', 'dagger'],
        description: '+7 Might. Cannot Follow-Up.',
        effect: {
            type: 'might',
            amount: 7,
        },
    },

    // =======================================================
    // DAGGER BASIC
    // =======================================================

    {
        id: 'dagger-steel',
        name: 'Steel',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['dagger'],
        description: '+3 Might.',
        effect: {
            type: 'might',
            amount: 3,
        },
    },

    {
        id: 'poison',
        name: 'Poison',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['dagger', 'light'],
        description:
            'If the user initiates combat and hits, the opponent becomes Poisoned after combat.',
    },

    {
        id: 'exact',
        name: 'Exact',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['bow', 'dagger', 'anima', 'light', 'dark'],
        description:
            'Use Dexterity + Might instead of Attack + Might when determining Power. Cannot Critical.',
        effect: {
            type: 'power-stat',
            stat: 'dexterity',
        },
    },

    // =======================================================
    // DAGGER ADVANCED
    // =======================================================

    {
        id: 'bloodletting',
        name: 'Bloodletting',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['dagger', 'curse'],
        description:
            'If the user initiates combat and hits, the opponent becomes Injured for 3 turns.',
    },

    {
        id: 'lethal',
        name: 'Lethal',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['dagger'],
        description:
            'Critical hits deal ×3 damage instead of ×2 damage.',
    },

    // =======================================================
    // BOW BASIC
    // =======================================================

    {
        id: 'bow-steel',
        name: 'Steel',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['bow'],
        description: '+3 Might.',
        effect: {
            type: 'might',
            amount: 3,
        },
    },

    {
        id: 'short',
        name: 'Short',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['bow'],
        description: 'Minimum Range is reduced by 1, to a minimum of 1.',
        effect: {
            type: 'range-min',
            amount: -1,
            minimum: 1,
        },
    },

    // =======================================================
    // MAGIC BASIC
    // =======================================================

    {
        id: 'elder',
        name: 'Elder',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['anima', 'light', 'dark', 'curse'],
        description: '+2 Might.',
        effect: {
            type: 'might',
            amount: 2,
        },
    },

    // =======================================================
    // ANIMA BASIC
    // =======================================================

    {
        id: 'wingclipping',
        name: 'Wingclipping',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['anima', 'gauntlets', 'siege'],
        description: 'Effective against units with the Winged trait.',
        effect: {
            type: 'effectiveness',
            trait: 'Winged',
        },
    },

    // =======================================================
    // LIGHT BASIC
    // =======================================================

    {
        id: 'light-enchanted-speed',
        name: 'Enchanted [Speed]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['light'],
        description: '+2 Speed while equipped.',
        effect: {
            type: 'stat',
            stat: 'speed',
            amount: 2,
        },
    },

    // =======================================================
    // DARK BASIC
    // =======================================================

    {
        id: 'eerie',
        name: 'Eerie',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['dark', 'curse'],
        description:
            'If the user initiates combat and hits, the opponent becomes Silenced after combat.',
    },

    {
        id: 'dark-enchanted-defense',
        name: 'Enchanted [Defense]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['dark'],
        description: '+2 Defense while equipped.',
        effect: {
            type: 'stat',
            stat: 'defense',
            amount: 2,
        },
    },

    {
        id: 'dark-enchanted-luck',
        name: 'Enchanted [Luck]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['dark'],
        description: '+2 Luck while equipped.',
        effect: {
            type: 'stat',
            stat: 'luck',
            amount: 2,
        },
    },

    // =======================================================
    // MAGIC ADVANCED
    // =======================================================

    {
        id: 'arcane',
        name: 'Arcane',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['anima', 'light', 'dark', 'curse'],
        description: '+3 Might.',
        effect: {
            type: 'might',
            amount: 3,
        },
    },

    {
        id: 'adaptive',
        name: 'Adaptive',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['anima'],
        description:
            'Grants Weapon Triangle Advantage against Stones, Strikes, Talons, Breaths, Bows, Daggers, Staves, and Curses.',
    },

    {
        id: 'resire',
        name: 'Resire',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['light', 'curse'],
        description:
            'User regains HP equal to half the damage dealt.',
    },

    {
        id: 'siege',
        name: 'Siege',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['anima', 'light', 'dark', 'curse'],
        description:
            'Range becomes 3–7. User takes a penalty to Hit equal to the number of spaces away their opponent is at the beginning of combat. Cannot Follow-Up.',
        effect: {
            type: 'range-override',
            min: 3,
            max: 7,
        },
    },

    // =======================================================
    // STAFF BASIC
    // =======================================================

    {
        id: 'mend',
        name: 'Mend',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            '+5 Weapon Power when restoring an ally’s HP.',
    },

    {
        id: 'restore',
        name: 'Restore',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            'Adds a Staff Effect that heals Status Effects from an adjacent ally.',
    },

    {
        id: 'rescue',
        name: 'Rescue',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            'Adds a Staff Effect that teleports an ally adjacent to the user. Range 1–7.',
    },

    {
        id: 'berserk',
        name: 'Berserk',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            'Adds a Staff Effect that inflicts Berserk on Hit. Range 1–2.',
    },

    {
        id: 'break',
        name: 'Break',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            'Adds a Staff Effect that inflicts Broken. Range 1–2.',
    },

    {
        id: 'shock',
        name: 'Shock',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            'Adds a Staff Effect that inflicts Shocked. Range 1–2.',
    },

    {
        id: 'silence',
        name: 'Silence',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            'Adds a Staff Effect that inflicts Silenced. Range 1–2.',
    },

    {
        id: 'self-healing',
        name: 'Self-Healing',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['staff'],
        description:
            'The user may target themselves with Staff Effects.',
    },

    // =======================================================
    // STAFF ADVANCED
    // =======================================================

    {
        id: 'recover',
        name: 'Recover',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['staff'],
        description:
            '+10 Weapon Power when restoring HP.',
    },

    {
        id: 'physic',
        name: 'Physic',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['staff'],
        description:
            'All Staff Effects have Range 1–7.',
    },

    {
        id: 'warp',
        name: 'Warp',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['staff'],
        description:
            'Adds a Staff Effect that teleports an adjacent ally to a tile in range. Range 1–7.',
    },

    {
        id: 'augmented',
        name: 'Augmented',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['staff'],
        description:
            'When a Staff Effect is successfully applied to a unit, the same Effect is also applied to all adjacent units.',
    },

    // =======================================================
    // TRANSFORMATION WEAPON BASIC
    // =======================================================

    {
        id: 'faster',
        name: 'Faster',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: TRANSFORMATION,
        description:
            'While transformed, gain Speed equal to current Gauge.',
        effect: {
            type: 'gauge-stat',
            stat: 'speed',
            multiplier: 1,
        },
    },

    {
        id: 'bulkier',
        name: 'Bulkier',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: TRANSFORMATION,
        description:
            'While transformed, gain Defense equal to current Gauge.',
        effect: {
            type: 'gauge-stat',
            stat: 'defense',
            multiplier: 1,
        },
    },

    {
        id: 'calmed',
        name: 'Calmed',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: TRANSFORMATION,
        description:
            'While transformed, gain Resistance equal to current Gauge.',
        effect: {
            type: 'gauge-stat',
            stat: 'resistance',
            multiplier: 1,
        },
    },

    {
        id: 'precise',
        name: 'Precise',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: TRANSFORMATION,
        description:
            'While transformed, gain Hit equal to half current Gauge, rounded up.',
        effect: {
            type: 'gauge-derived',
            derivedStat: 'hit',
            divisor: 2,
            rounding: 'ceil',
        },
    },

    {
        id: 'luckier',
        name: 'Luckier',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: TRANSFORMATION,
        description:
            'While transformed, gain Avoid equal to half current Gauge, rounded up.',
        effect: {
            type: 'gauge-derived',
            derivedStat: 'avoid',
            divisor: 2,
            rounding: 'ceil',
        },
    },

    // =======================================================
    // TRANSFORMATION WEAPON ADVANCED
    // =======================================================

    {
        id: 'strike-superior',
        name: 'Superior',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['strike'],
        description: '+3 Might.',
        effect: {
            type: 'might',
            amount: 3,
        },
    },

    {
        id: 'nimbler',
        name: 'Nimbler',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['talon'],
        description:
            'While transformed, gain Movement equal to half current Gauge, rounded up.',
        effect: {
            type: 'gauge-derived',
            derivedStat: 'movement',
            divisor: 2,
            rounding: 'ceil',
        },
    },

    {
        id: 'broader',
        name: 'Broader',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['breath'],
        description:
            'While transformed, maximum Range increases by half current Gauge, rounded up.',
        effect: {
            type: 'gauge-range-max',
            divisor: 2,
            rounding: 'ceil',
        },
    },

    {
        id: 'captivating',
        name: 'Captivating',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: TRANSFORMATION,
        description:
            'When transformed and using an [Action] skill that targets an adjacent unit, the user may target a number of adjacent units equal to half their Gauge, rounded up.',
    },

    {
        id: 'imbued',
        name: 'Imbued',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: TRANSFORMATION,
        description:
            'When transformed, adjacent allies regain HP equal to the user’s Gauge at the start of the turn.',
    },

    {
        id: 'wild',
        name: 'Wild',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: TRANSFORMATION,
        description:
            'While transformed, the user’s Gauge does not decrease.',
    },

    // =======================================================
    // SHIFTING STONE BASIC
    // =======================================================

    {
        id: 'greater',
        name: 'Greater',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['shifting-stone'],
        description: '+2 Might.',
        effect: {
            type: 'might',
            amount: 2,
        },
    },

    {
        id: 'even-stronger',
        name: 'Even Stronger',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['shifting-stone'],
        description:
            'Deals 4 damage to the opponent after combat on even-numbered turns.',
    },

    {
        id: 'odd-shaped',
        name: 'Odd-Shaped',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['shifting-stone'],
        description:
            'Deals 3 damage to the opponent after combat on odd-numbered turns.',
    },

    // =======================================================
    // SHIFTING STONE ADVANCED
    // =======================================================

    {
        id: 'stone-superior',
        name: 'Superior',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['shifting-stone'],
        description: '+3 Might.',
        effect: {
            type: 'might',
            amount: 3,
        },
    },

    {
        id: 'even-brighter',
        name: 'Even Brighter',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['shifting-stone'],
        description:
            'While equipped, the user regains 6 HP at the start of even-numbered turns.',
    },

    {
        id: 'oddly-glowing',
        name: 'Oddly Glowing',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['shifting-stone'],
        description:
            'While equipped, the user regains 7 HP at the start of odd-numbered turns.',
    },

    // =======================================================
    // STONE / SIEGE ADVANCED
    // =======================================================

    {
        id: 'burning',
        name: 'Burning',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: STONE_AND_SIEGE,
        description:
            'If the user initiates combat, creates Fire in a 3-by-3 square centered around the opponent after combat.',
    },

    {
        id: 'freezing',
        name: 'Freezing',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: STONE_AND_SIEGE,
        description:
            'If the user initiates combat, creates Ice in a 3-by-3 square centered around the opponent after combat.',
    },

    {
        id: 'noxious',
        name: 'Noxious',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: STONE_AND_SIEGE,
        description:
            'If the user initiates combat, creates Smog in a 3-by-3 square centered around the opponent after combat.',
    },

    // =======================================================
    // CURSE BASIC
    // =======================================================

    {
        id: 'incapacitating',
        name: 'Incapacitating',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['curse'],
        description:
            'If the user initiates combat and hits, the opponent becomes Shocked after combat.',
    },

    {
        id: 'enraging',
        name: 'Enraging',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['curse'],
        description:
            'If the user initiates combat and hits, the opponent becomes Berserk after combat.',
    },

    {
        id: 'enfeebling',
        name: 'Enfeebling',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['curse'],
        description:
            'If the user initiates combat and hits, the opponent becomes Broken after combat.',
    },

    // =======================================================
    // GM-ONLY — SHARED
    // =======================================================

    {
        id: 'cheap',
        name: 'Cheap',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: [
            'sword',
            'lance',
            'axe',
            'dagger',
            'bow',
            'anima',
            'light',
            'dark',
            'staff',
            'strike',
            'talon',
            'breath',
            'shifting-stone',
            'siege',
        ],
        description: '-2 Might.',
        effect: {
            type: 'might',
            amount: -2,
        },
    },

    {
        id: 'sealed',
        name: 'Sealed',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: [
            'sword',
            'lance',
            'axe',
            'dagger',
            'bow',
            'anima',
            'light',
            'dark',
            'shifting-stone',
            'gauntlets',
        ],
        description:
            'Seals away a Basic refinement. Cannot normally be removed or changed.',
    },

    {
        id: 'hexed',
        name: 'Hexed',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: ['sword', 'lance', 'axe'],
        description:
            '+6 Might. If the user rolls 1–6 on their Accuracy check, the user takes damage instead.',
        effect: {
            type: 'might',
            amount: 6,
        },
    },

    {
        id: 'close',
        name: 'Close',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: ['dagger', 'anima', 'light', 'dark'],
        description:
            'Minimum and maximum Range become 1. Cannot normally be removed or changed.',
        effect: {
            type: 'range-override',
            min: 1,
            max: 1,
        },
    },

    // =======================================================
    // STAFF GM-ONLY
    // =======================================================

    {
        id: 'harmful',
        name: 'Harmful',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: ['staff'],
        description:
            'A target loses 5 HP when a Staff Effect is used on them.',
    },

    {
        id: 'sacrificial',
        name: 'Sacrificial',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: ['staff'],
        description:
            'The user loses 5 HP when a Staff Effect is used.',
    },

    // =======================================================
    // CURSE GM-ONLY
    // =======================================================

    {
        id: 'reciprocal',
        name: 'Reciprocal',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: ['curse'],
        description:
            'When the user initiates combat, they lose 5 HP after combat.',
    },

    {
        id: 'half',
        name: 'Half',
        category: REFINEMENT_CATEGORIES.GM_ONLY,
        weaponTypes: ['curse'],
        description:
            'On hit, instead of dealing damage, halve the opponent’s remaining HP. Cannot Critical, Cannot Follow-Up, and cannot reduce the opponent to 0 HP.',
    },

    // =======================================================
    // GAUNTLET BASIC
    // =======================================================

    {
        id: 'flighty',
        name: 'Flighty',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['gauntlets'],
        description:
            'If the user initiates combat, they may move 1 space in any direction after combat. This stacks with movement Skills.',
    },

    {
        id: 'empowered-speed',
        name: 'Empowered [Speed]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['gauntlets'],
        description:
            '+4 Speed when initiating combat with this weapon.',
    },

    {
        id: 'empowered-dexterity',
        name: 'Empowered [Dexterity]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['gauntlets'],
        description:
            '+4 Dexterity when initiating combat with this weapon.',
    },

    {
        id: 'empowered-luck',
        name: 'Empowered [Luck]',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['gauntlets'],
        description:
            '+4 Luck when initiating combat with this weapon.',
    },

    // =======================================================
    // GAUNTLET ADVANCED
    // =======================================================

    {
        id: 'fierce',
        name: 'Fierce',
        category: REFINEMENT_CATEGORIES.ADVANCED,
        weaponTypes: ['gauntlets'],
        description:
            'When the user initiates combat, they deal 3 consecutive strikes per attack instead of 2.',
    },

    // =======================================================
    // SIEGE-ONLY
    // =======================================================

    {
        id: 'heavy',
        name: 'Heavy',
        category: REFINEMENT_CATEGORIES.BASIC,
        weaponTypes: ['siege'],
        description: '+3 Might.',
        effect: {
            type: 'might',
            amount: 3,
        },
    },
];

// =========================================================
// LOOKUP HELPERS
// =========================================================

export function getWeaponRefinementById(refinementId) {
    return (
        weaponRefinements.find(
            (refinement) => refinement.id === refinementId
        ) ?? null
    );
}

export function getWeaponRefinementsByType(weaponType) {
    return weaponRefinements.filter((refinement) =>
        refinement.weaponTypes.includes(weaponType)
    );
}

export function getWeaponRefinementsByCategory(category) {
    return weaponRefinements.filter(
        (refinement) => refinement.category === category
    );
}

export function getWeaponRefinementsForTypeAndCategory(
    weaponType,
    category
) {
    return weaponRefinements.filter(
        (refinement) =>
            refinement.category === category &&
            refinement.weaponTypes.includes(weaponType)
    );
}

export function getBasicWeaponRefinements(weaponType) {
    return getWeaponRefinementsForTypeAndCategory(
        weaponType,
        REFINEMENT_CATEGORIES.BASIC
    );
}

export function getAdvancedWeaponRefinements(weaponType) {
    return getWeaponRefinementsForTypeAndCategory(
        weaponType,
        REFINEMENT_CATEGORIES.ADVANCED
    );
}

export function getGMOnlyWeaponRefinements(weaponType) {
    return getWeaponRefinementsForTypeAndCategory(
        weaponType,
        REFINEMENT_CATEGORIES.GM_ONLY
    );
}

export function isRefinementCompatibleWithWeapon(
    refinementId,
    weaponType
) {
    const refinement = getWeaponRefinementById(refinementId);

    if (!refinement) {
        return false;
    }

    return refinement.weaponTypes.includes(weaponType);
}

export function countAdvancedRefinements(refinementIds = []) {
    return refinementIds.reduce((count, refinementId) => {
        const refinement = getWeaponRefinementById(refinementId);

        if (
            refinement?.category ===
            REFINEMENT_CATEGORIES.ADVANCED
        ) {
            return count + 1;
        }

        return count;
    }, 0);
}

export function hasValidAdvancedRefinementCount(
    refinementIds = []
) {
    return countAdvancedRefinements(refinementIds) <= 1;
}

export default weaponRefinements;