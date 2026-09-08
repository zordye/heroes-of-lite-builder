const createCharacter = () => ({
    // Identity
    id: crypto.randomUUID(),
    characterType: 'player',
    name: '',
    playerName: '',
    age: '',
    race: '',
    pronouns: '',
    personality: '',
    background: '',
    image: null,

    // Progression
    level: 1,
    movementType: null,
    supportType: null,

    // Weapon access
    weaponProficiencies: [],

    // Combat stats
    stats: {
        base: {
            hp: 15,
            attack: 3,
            defense: 3,
            dexterity: 3,
            speed: 3,
            resistance: 3,
            luck: 3,
        },

        levelUp: {
            hp: 0,
            attack: 0,
            defense: 0,
            dexterity: 0,
            speed: 0,
            resistance: 0,
            luck: 0,
        },

        temporary: {
            hp: 0,
            attack: 0,
            defense: 0,
            dexterity: 0,
            speed: 0,
            resistance: 0,
            luck: 0,
        },
    },

    // Non-combat stats
    nonCombatStats: {
        strength: 0,
        intellect: 0,
        perception: 0,
        charisma: 0,
    },

    // Current battle/state values
    currentHP: 15,
    charge: 0,
    gauge: null,
    size: null,

    // Skills
    skills: {
        movementSkill: null,
        levelOneSkill: null,
        additionalSkills: [],
    },

    personalSkill: null,

    // Weapons
    weapons: [],
    equippedWeaponId: null,

    // General inventory
    inventory: [],

    // Current conditions
    status: null,
    terrain: null,
    isEffective: false,
    isRescuing: false,
    isSupported: false,
    isTransformed: false,

    // Support currently being used
    activeSupportId: null,

    // Character support relationships
    supports: [],

    // Currency
    gold: {
        current: 1000,
        transactions: [
            {
                id: crypto.randomUUID(),
                type: 'income',
                amount: 1000,
                source: 'Starting Gold',
            },
        ],
    },

    // Optional campaign rules
    optionalRules: {
        connectedStatCaps: false,
    },
});

export default createCharacter;