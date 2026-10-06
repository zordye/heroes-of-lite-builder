// src/data/items.js

// =========================================================
// ITEM CATEGORIES
// =========================================================

export const ITEM_CATEGORIES = {
    HEALING: 'healing',
    STATUS: 'status',
    TONIC: 'tonic',
    UTILITY: 'utility',
    KEY: 'key',
    GEM: 'gem',
};

// =========================================================
// GENERAL ITEMS
// =========================================================
//
// Items are intentionally DATA ONLY.
//
// The character sheet does not:
// - automatically use items
// - automatically heal HP
// - automatically remove statuses
// - automatically apply temporary stat bonuses
// - automatically decrement uses
//
// The player controls the current state of the character
// and inventory.
//
// "range" is stored as text because item ranges are simple
// reference information rather than something we need to
// calculate.
// =========================================================

export const items = [
    // -------------------------------------------------------
    // HEALING
    // -------------------------------------------------------

    {
        id: 'herb',
        name: 'Herb',
        category: ITEM_CATEGORIES.HEALING,
        range: 'Self',
        uses: 6,
        cost: 400,
        description: 'User regains 10 HP.',
    },

    {
        id: 'vulnerary',
        name: 'Vulnerary',
        category: ITEM_CATEGORIES.HEALING,
        range: 'Self',
        uses: 5,
        cost: 800,
        description: 'User regains 20 HP.',
    },

    {
        id: 'concoction',
        name: 'Concoction',
        category: ITEM_CATEGORIES.HEALING,
        range: 'Self',
        uses: 4,
        cost: 1200,
        description: 'User regains 40 HP.',
    },

    {
        id: 'elixir',
        name: 'Elixir',
        category: ITEM_CATEGORIES.HEALING,
        range: 'Self',
        uses: 3,
        cost: 2000,
        description: 'User regains all missing HP.',
    },

    // -------------------------------------------------------
    // STATUS RECOVERY
    // -------------------------------------------------------

    {
        id: 'antitoxin',
        name: 'Antitoxin',
        category: ITEM_CATEGORIES.STATUS,
        range: 'Self',
        uses: 3,
        cost: 150,
        description: 'Removes Poisoned status from user.',
    },

    {
        id: 'panacea',
        name: 'Panacea',
        category: ITEM_CATEGORIES.STATUS,
        range: 'Self',
        uses: 3,
        cost: 1300,
        description: 'Removes all statuses from user.',
    },

    // -------------------------------------------------------
    // TONICS
    // -------------------------------------------------------
    //
    // Only one stat-boosting consumable may benefit a unit
    // at a time.
    //
    // We do NOT automatically apply these bonuses.
    // The player can enter the bonus into the appropriate
    // Temporary stat field while it is active.
    // -------------------------------------------------------

    {
        id: 'attack-tonic',
        name: 'Attack Tonic',
        category: ITEM_CATEGORIES.TONIC,
        range: 'Self',
        uses: 3,
        cost: 700,
        description:
            'User gains +2 Attack until the end of the map.',
    },

    {
        id: 'speed-tonic',
        name: 'Speed Tonic',
        category: ITEM_CATEGORIES.TONIC,
        range: 'Self',
        uses: 3,
        cost: 700,
        description:
            'User gains +2 Speed until the end of the map.',
    },

    {
        id: 'dexterity-tonic',
        name: 'Dexterity Tonic',
        category: ITEM_CATEGORIES.TONIC,
        range: 'Self',
        uses: 3,
        cost: 700,
        description:
            'User gains +2 Dexterity until the end of the map.',
    },

    {
        id: 'luck-tonic',
        name: 'Luck Tonic',
        category: ITEM_CATEGORIES.TONIC,
        range: 'Self',
        uses: 3,
        cost: 700,
        description:
            'User gains +2 Luck until the end of the map.',
    },

    {
        id: 'defense-tonic',
        name: 'Defense Tonic',
        category: ITEM_CATEGORIES.TONIC,
        range: 'Self',
        uses: 3,
        cost: 700,
        description:
            'User gains +2 Defense until the end of the map.',
    },

    {
        id: 'resistance-tonic',
        name: 'Resistance Tonic',
        category: ITEM_CATEGORIES.TONIC,
        range: 'Self',
        uses: 3,
        cost: 700,
        description:
            'User gains +2 Resistance until the end of the map.',
    },

    // -------------------------------------------------------
    // UTILITY
    // -------------------------------------------------------

    {
        id: 'shine-barrier',
        name: 'Shine Barrier',
        category: ITEM_CATEGORIES.UTILITY,
        range: '1',
        uses: 5,
        cost: 500,
        description:
            'Creates 1 impassable space adjacent to the user that lasts for three turns.',
    },

    {
        id: 'mine',
        name: 'Mine',
        category: ITEM_CATEGORIES.UTILITY,
        range: '1',
        uses: 3,
        cost: 600,
        description:
            'Can be set on an adjacent space. When a unit ends their move action on that space, that unit takes 10 damage and the Mine disappears.',
    },

    {
        id: 'torch',
        name: 'Torch',
        category: ITEM_CATEGORIES.UTILITY,
        range: 'Self',
        uses: 5,
        cost: 500,
        description:
            'Increases sight in Fog of War, allowing the party to see their current area and all adjacent areas for 2 turns.',
    },

    // -------------------------------------------------------
    // KEYS
    // -------------------------------------------------------

    {
        id: 'door-key',
        name: 'Door Key',
        category: ITEM_CATEGORIES.KEY,
        range: '1',
        uses: 2,
        cost: 600,
        description:
            'Opens an adjacent Door or Gate.',
    },

    {
        id: 'chest-key',
        name: 'Chest Key',
        category: ITEM_CATEGORIES.KEY,
        range: '1',
        uses: 2,
        cost: 200,
        description:
            'Opens an adjacent Chest or Crate.',
    },

    // -------------------------------------------------------
    // GEMS
    // -------------------------------------------------------

    {
        id: 'red-gem',
        name: 'Red Gem',
        category: ITEM_CATEGORIES.GEM,
        range: 'N/A',
        uses: 1,
        cost: 2500,
        description: 'Sells for 2500g.',
    },

    {
        id: 'blue-gem',
        name: 'Blue Gem',
        category: ITEM_CATEGORIES.GEM,
        range: 'N/A',
        uses: 1,
        cost: 5000,
        description: 'Sells for 5000g.',
    },

    {
        id: 'white-gem',
        name: 'White Gem',
        category: ITEM_CATEGORIES.GEM,
        range: 'N/A',
        uses: 1,
        cost: 10000,
        description: 'Sells for 10000g.',
    },
];

// =========================================================
// LOOKUP HELPERS
// =========================================================

export function getItemById(itemId) {
    return (
        items.find(
            (item) => item.id === itemId
        ) ?? null
    );
}

export function getItemsByCategory(category) {
    return items.filter(
        (item) =>
            item.category === category
    );
}

export function isValidItemId(itemId) {
    return getItemById(itemId) !== null;
}

export function getItemStartingUses(itemId) {
    return getItemById(itemId)?.uses ?? 0;
}

// =========================================================
// INVENTORY ENTRY FACTORY
// =========================================================
//
// This creates the STATE stored on a character.
//
// Example:
//
// character.inventory = [
//   {
//     id: 'inventory-1',
//     itemId: 'herb',
//     usesRemaining: 6,
//   },
// ];
//
// The unique ID should ultimately be generated by the UI
// when an item is added. We therefore don't generate one
// here.
// =========================================================

export function createInventoryItem(
    itemId,
    id = null
) {
    const item = getItemById(itemId);

    if (!item) {
        return null;
    }

    return {
        id,
        itemId: item.id,
        usesRemaining: item.uses,
    };
}

export default items;