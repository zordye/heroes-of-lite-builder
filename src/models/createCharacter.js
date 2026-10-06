import { createEmptySiegeWeaponState } from '../data/siegeWeapons';

const createEmptyCombatStats = () => ({
  hp: {
    base: 15,
    levelUp: 0,
    temporary: 0,
  },

  attack: {
    base: 3,
    levelUp: 0,
    temporary: 0,
  },

  defense: {
    base: 3,
    levelUp: 0,
    temporary: 0,
  },

  dexterity: {
    base: 3,
    levelUp: 0,
    temporary: 0,
  },

  speed: {
    base: 3,
    levelUp: 0,
    temporary: 0,
  },

  resistance: {
    base: 3,
    levelUp: 0,
    temporary: 0,
  },

  luck: {
    base: 3,
    levelUp: 0,
    temporary: 0,
  },
});

const createEmptyOutOfCombatStats = () => ({
  strength: 0,
  intellect: 0,
  perception: 0,
  charisma: 0,
});

const createEmptySkillSlots = () => ({
  movement: null,
  level1: null,
  level5: null,
  level10: null,
  level15: null,
  level20: null,
  level25: null,
  level30: null,
});

const createEmptyCharacterInfo = () => ({
  age: '',
  race: '',
  pronouns: '',
  personality: '',
  background: '',
  image: null,
});

const createEmptyInventory = () => [];

const createEmptySupportRelationships = () => [];

const createEmptyGoldHistory = () => [];

export default function createCharacter() {
  return {
    // =====================================================
    // IDENTITY
    // =====================================================

    id: null,

    characterType: 'player',

    name: '',

    playerName: '',

    level: 1,

    // =====================================================
    // MOVEMENT
    // =====================================================

    movementType: null,

    /*
      Infantry chooses its support type.
      Other movement types will normally determine this
      automatically through their movement data.
    */
    supportType: null,

    // =====================================================
    // WEAPON PROFICIENCIES
    // =====================================================

    /*
      Weapon type IDs, for example:
 
      ['sword']
      ['sword', 'bow']
    */
    weaponProficiencies: [],

    // =====================================================
    // WEAPONS
    // =====================================================

    /*
      Every carried weapon has this general structure:
 
      {
        id: 'unique-id',
        name: 'Custom Weapon Name',
        baseWeaponId: 'iron-sword',
        refinements: [
          'steel',
          'long',
        ],
      }
 
      The weapon's base Might, Range, weapon type, innate
      attributes, etc. come from baseWeapons.js.
 
      Refinement definitions come from weaponRefinements.js.
    */
    weapons: [],

    /*
      References the ID of an entry in weapons[].
 
      We do NOT duplicate the equipped weapon object here.
    */
    equippedWeaponId: null,

    // =========================================================
    // WEAPONS
    // =========================================================

    weaponProficiencies: [],

    weapons: [],

    equippedWeaponId: null,

    // =========================================================
    // SIEGE WEAPON
    // =========================================================
    //
    // This is a separate reference section for a Siege Weapon
    // the character is currently using.
    //
    // It is NOT:
    // - A carried weapon
    // - An equipped character weapon
    // - A weapon proficiency
    //
    // It does not interact with character stats, traits,
    // skills, Power, Tri, Hit, etc.
    //
    // The shared character.situational.effective toggle may be
    // passed into Siege Weapon calculations by the UI.
    // =========================================================

    siegeWeapon: createEmptySiegeWeaponState(),

    // =====================================================
    // TRANSFORMATION
    // =====================================================

    /*
      This is the ONLY transformation state stored on the
      character.
 
      0 = not transformed
      1-4 = transformed with that current Gauge
 
      The sheet does not automatically reduce Gauge.
    */
    transformationGauge: 0,

    // =====================================================
    // COMBAT STATS
    // =====================================================

    combatStats: createEmptyCombatStats(),

    /*
      Current HP is separate from the HP stat itself.
 
      The combatStats.hp values determine maximum HP.
      currentHp records the character's current state.
 
      null allows the UI to initialize it to calculated
      maximum HP when appropriate.
    */
    currentHp: null,

    /*
      Charge is manually controlled by the player.
      The sheet does not automatically gain or spend it.
    */
    charge: 0,

    // =====================================================
    // OUT-OF-COMBAT STATS
    // =====================================================

    outOfCombatStats: createEmptyOutOfCombatStats(),

    // =====================================================
    // SIZE
    // =====================================================

    /*
      1 = Small
      2 = Medium
      3 = Large
      4+ = Extra Large
 
      Transformation may add +2 Total Size through the
      calculation rules, but the selected Size itself does
      not change.
    */
    size: 2,

    // =====================================================
    // STATUS
    // =====================================================

    // Multiple different Status Effects may be active simultaneously.
    statuses: [],

    // =====================================================
    // TERRAIN
    // =====================================================

    // ID from terrain.js.
    // null means no terrain is currently selected.
    terrain: null,

    // =====================================================
    // SITUATIONAL CONTROLS
    // =====================================================

    /*
      These are sheet controls rather than combat automation.
 
      Effective tells the sheet to apply the x3 Might rule.
 
      Rescuing can be used by later calculations/display
      rules where appropriate.
    */
    situational: {
      effective: false,
      rescuing: false,
    },

    // =====================================================
    // SKILLS
    // =====================================================

    skillSlots: createEmptySkillSlots(),

    /*
      Useful for any skills that do not belong in the normal
      milestone slots, including future homebrew support.
    */
    additionalSkills: [],

    // =====================================================
    // PERSONAL SKILL
    // =====================================================

    /*
      Personal Skills are optional and subject to GM
      approval in tabletop play.
 
      The builder records the skill but does not attempt to
      enforce GM approval.
    */
    personalSkill: null,

    // =====================================================
    // INVENTORY
    // =====================================================

    inventory: createEmptyInventory(),

    // =====================================================
    // GOLD
    // =====================================================

    /*
      Creation will grant 1000 starting Gold.
 
      The empty model remains at 0 so that creation rules,
      rather than the generic model, are responsible for
      granting starting resources.
    */
    gold: 0,

    goldHistory: createEmptyGoldHistory(),

    // =====================================================
    // SUPPORTS
    // =====================================================

    /*
      Example later:
 
      {
        id: 'unique-id',
        characterName: 'Faye',
        rank: 'C',
        supportType: 'flier',
      }
 
      The partner's Support Type determines what bonuses
      this character receives from them.
    */
    supports: createEmptySupportRelationships(),

    // =====================================================
    // OPTIONAL RULES
    // =====================================================

    optionalRules: {
      connectedStatCaps: false,
      movementTypeSkills: false,
    },

    // =====================================================
    // CHARACTER INFORMATION
    // =====================================================

    characterInfo: createEmptyCharacterInfo(),
  };
}

// =========================================================
// OPTIONAL FACTORY EXPORTS
// =========================================================
//
// These are exported in case character creation forms or
// reset controls need fresh copies of individual sections.
// =========================================================

export {
  createEmptyCombatStats,
  createEmptyOutOfCombatStats,
  createEmptySkillSlots,
  createEmptyCharacterInfo,
  createEmptyInventory,
  createEmptySupportRelationships,
  createEmptyGoldHistory,
};