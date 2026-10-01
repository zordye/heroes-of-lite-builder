const baseWeapons = [
    // =========================================================
    // SWORDS
    // =========================================================

    {
        id: 'iron-sword',
        name: 'Iron Sword',
        weaponType: 'sword',
        might: 6,
        range: {
            min: 1,
            max: 1,
        },
        innateAttributes: [],
    },

    // =========================================================
    // LANCES
    // =========================================================

    {
        id: 'iron-lance',
        name: 'Iron Lance',
        weaponType: 'lance',
        might: 6,
        range: {
            min: 1,
            max: 1,
        },
        innateAttributes: [],
    },

    // =========================================================
    // AXES
    // =========================================================

    {
        id: 'iron-axe',
        name: 'Iron Axe',
        weaponType: 'axe',
        might: 6,
        range: {
            min: 1,
            max: 1,
        },
        innateAttributes: [],
    },

    // =========================================================
    // BOWS
    // =========================================================

    {
        id: 'iron-bow',
        name: 'Iron Bow',
        weaponType: 'bow',
        might: 4,
        range: {
            min: 2,
            max: 2,
        },

        /*
          All Bows inherently have Wingclipping.
    
          Wingclipping:
          Deals effective damage against units with the Winged trait.
    
          This is not a selected refinement and does not occupy a
          refinement selection.
        */
        innateAttributes: ['wingclipping'],
    },

    // =========================================================
    // DAGGERS
    // =========================================================

    {
        id: 'iron-dagger',
        name: 'Iron Dagger',
        weaponType: 'dagger',
        might: 4,
        range: {
            min: 1,
            max: 2,
        },
        innateAttributes: [],
    },

    // =========================================================
    // GAUNTLETS
    // =========================================================

    {
        id: 'iron-gauntlets',
        name: 'Iron Gauntlets',
        weaponType: 'gauntlets',
        might: 3,
        range: {
            min: 1,
            max: 1,
        },

        /*
          All Gauntlets inherently have Brave.
    
          Brave:
          When the user initiates combat, they deal
          2 consecutive strikes per attack instead of 1.
    
          Canter is nullified while the Gauntlets are equipped.
        */
        innateAttributes: ['brave'],
    },

    // =========================================================
    // ANIMA
    // =========================================================

    {
        id: 'anima',
        name: 'Anima',
        weaponType: 'anima',
        might: 4,
        range: {
            min: 1,
            max: 2,
        },
        innateAttributes: [],
    },

    // =========================================================
    // LIGHT
    // =========================================================

    {
        id: 'light',
        name: 'Light',
        weaponType: 'light',
        might: 4,
        range: {
            min: 1,
            max: 2,
        },
        innateAttributes: [],
    },

    // =========================================================
    // DARK
    // =========================================================

    {
        id: 'flux',
        name: 'Flux',
        weaponType: 'dark',
        might: 4,
        range: {
            min: 1,
            max: 2,
        },
        innateAttributes: [],
    },

    // =========================================================
    // STAVES
    // =========================================================

    {
        id: 'heal',
        name: 'Heal',
        weaponType: 'staff',
        might: 5,
        range: {
            min: 1,
            max: 1,
        },

        /*
          All Staves inherently have the Heal Effect.
    
          Heal:
          As an Action, restores an adjacent ally's HP
          by the user's Power.
    
          Other Staff-specific rules will be handled/displayed
          separately rather than simulated by this base data.
        */
        innateAttributes: ['heal'],
    },

    // =========================================================
    // STRIKES
    // =========================================================

    {
        id: 'strike',
        name: 'Strike',
        weaponType: 'strike',
        might: 3,
        range: {
            min: 1,
            max: 1,
        },
        innateAttributes: [],

        /*
          Gauge is manually selected on the character sheet.
    
          Gauge 0:
          Not transformed.
    
          Gauge 1-4:
          Transformed.
          Weapon gains Might equal to current Gauge.
          Character gains the Furred trait.
    
          The sheet does NOT automatically decrease Gauge.
        */
        transformation: {
            enabled: true,
            trait: 'Furred',
            maxGauge: 4,
            mightPerGauge: 1,
        },
    },

    // =========================================================
    // TALONS
    // =========================================================

    {
        id: 'talon',
        name: 'Talon',
        weaponType: 'talon',
        might: 3,
        range: {
            min: 1,
            max: 1,
        },
        innateAttributes: [],

        /*
          While Gauge is 1-4:
          +Gauge Might
          Winged trait
        */
        transformation: {
            enabled: true,
            trait: 'Winged',
            maxGauge: 4,
            mightPerGauge: 1,
        },
    },

    // =========================================================
    // BREATHS
    // =========================================================

    {
        id: 'breath',
        name: 'Breath',
        weaponType: 'breath',
        might: 3,
        range: {
            min: 1,
            max: 1,
        },
        innateAttributes: [],

        /*
          While Gauge is 1-4:
          +Gauge Might
          Scaled trait
        */
        transformation: {
            enabled: true,
            trait: 'Scaled',
            maxGauge: 4,
            mightPerGauge: 1,
        },
    },

    // =========================================================
    // SHIFTING STONES
    // =========================================================

    {
        id: 'shifting-stone',
        name: 'Shifting Stone',
        weaponType: 'shifting-stone',
        might: 6,
        range: {
            min: 1,
            max: 1,
        },
        innateAttributes: [],
    },

    // =========================================================
    // CURSES
    // =========================================================

    {
        id: 'curse',
        name: 'Curse',
        weaponType: 'curse',
        might: 0,
        range: {
            min: 1,
            max: 1,
        },

        /*
          All Curses inherently have Poison.
    
          Poison:
          If the user initiates combat and their attack hits,
          the foe becomes Poisoned after combat.
    
          Equipping a Curse also grants the Fiendish trait.
          That trait is already defined by weaponTypes.js,
          rather than duplicated here.
        */
        innateAttributes: ['poison'],
    },
];

// =========================================================
// LOOKUP HELPERS
// =========================================================

function getBaseWeaponById(baseWeaponId) {
    return (
        baseWeapons.find(
            (weapon) => weapon.id === baseWeaponId
        ) ?? null
    );
}

function getBaseWeaponsByType(weaponType) {
    return baseWeapons.filter(
        (weapon) => weapon.weaponType === weaponType
    );
}

function getStartingBaseWeaponForType(weaponType) {
    return (
        baseWeapons.find(
            (weapon) => weapon.weaponType === weaponType
        ) ?? null
    );
}

function isTransformationWeapon(baseWeaponId) {
    const weapon = getBaseWeaponById(baseWeaponId);

    return weapon?.transformation?.enabled === true;
}

export {
    baseWeapons,
    getBaseWeaponById,
    getBaseWeaponsByType,
    getStartingBaseWeaponForType,
    isTransformationWeapon,
};

export default baseWeapons;