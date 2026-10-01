// src/data/siegeWeapons.js

// =========================================================
// SIEGE WEAPONS
// =========================================================
//
// Siege Weapons are map-based weapons.
//
// They are NOT:
// - Carried weapons
// - Weapon proficiencies
// - Normal equipped weapons
//
// The character sheet simply records which Siege Weapon
// the character is currently using and its current ammo.
//
// Ammo is manually controlled by the user.
// The sheet does NOT automatically decrement ammo.
//
// A GM may also declare a Siege Weapon to have unlimited
// ammo.
// =========================================================

export const siegeWeapons = [
    // -------------------------------------------------------
    // STONEHOIST
    // -------------------------------------------------------

    {
        id: 'stonehoist',
        name: 'Stonehoist',

        might: 10,

        range: {
            min: 3,
            max: 10,
        },
    },

    // -------------------------------------------------------
    // MAGIC ORB
    // -------------------------------------------------------

    {
        id: 'magic-orb',
        name: 'Magic Orb',

        might: 10,

        range: {
            min: 3,
            max: 10,
        },
    },
];

// =========================================================
// LOOKUP
// =========================================================

export function getSiegeWeaponById(siegeWeaponId) {
    if (!siegeWeaponId) {
        return null;
    }

    return (
        siegeWeapons.find(
            (siegeWeapon) =>
                siegeWeapon.id === siegeWeaponId
        ) ?? null
    );
}

// =========================================================
// VALID SIEGE WEAPON
// =========================================================

export function isValidSiegeWeaponId(
    siegeWeaponId
) {
    return Boolean(
        getSiegeWeaponById(siegeWeaponId)
    );
}

// =========================================================
// DEFAULT SIEGE WEAPON STATE
// =========================================================
//
// This represents the character's CURRENT interaction with
// a Siege Weapon.
//
// Example:
//
// {
//   baseWeaponId: 'stonehoist',
//   refinements: ['heavy', 'burning'],
//   ammo: 5,
//   unlimitedAmmo: false,
// }
//
// The user manually chooses:
// - Siege Weapon
// - Refinements
// - Ammo
// - Unlimited Ammo
//
// No turn/combat automation occurs.
// =========================================================

export function createEmptySiegeWeaponState() {
    return {
        baseWeaponId: null,

        refinements: [],

        ammo: null,

        unlimitedAmmo: false,
    };
}

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default siegeWeapons;