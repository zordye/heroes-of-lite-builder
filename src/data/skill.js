const skills = [
    // =========================================================
    // PERSONAL SKILLS
    // =========================================================

    {
        id: 'figurehead',
        name: 'Figurehead',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in nobility or leadership',
        description:
            'When adjacent to at least two allies, the user’s Might is increased by their Charisma.',
    },
    {
        id: 'for-a-cause',
        name: 'For a Cause',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in nobility or leadership',
        description:
            'When the user’s HP reaches 0, they may make a Charisma check. On an 18+, they will instead become KO’d at the beginning of their next turn, assuming their HP is still 0.',
    },
    {
        id: 'chivalry',
        name: 'Chivalry',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in knighthood',
        description:
            'The user adds +2 to damage dealt and -2 to damage taken against enemies at full HP.',
    },
    {
        id: 'shining-armor',
        name: 'Shining Armor',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in knighthood',
        description:
            'When rescuing an ally at 1/4 or less of their max HP, the user does not take rescue penalties.',
    },
    {
        id: 'perfect-pitch',
        name: 'Perfect Pitch',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in the performance arts',
        description:
            'After using a Rally or Perform skill, any allies within 2 tiles of this unit restore 5 HP.',
    },
    {
        id: 'fancy-footwork',
        name: 'Fancy Footwork',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in the performance arts',
        description:
            'Attack+2 and Speed+2 to all adjacent allies for 1 turn when a Rally or Perform skill is used.',
    },
    {
        id: 'forager',
        name: 'Forager',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in farm life',
        description:
            'When standing in Forest terrain, the user regains 2 HP at the beginning of every turn.',
    },
    {
        id: 'animal-friend',
        name: 'Animal Friend',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in farm life',
        description:
            'When the user begins their turn adjacent to an ally with the Furred trait, they regain 2 HP.',
    },
    {
        id: 'hunters-grasp',
        name: 'Hunter’s Grasp',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in hunting',
        description:
            'After combat, the foe cannot use the skill Canter and suffers a -2 Movement penalty until the end of their next turn.',
    },
    {
        id: 'hunters-boon',
        name: 'Hunter’s Boon',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in hunting',
        description:
            'When in combat with an opponent with less than 50% HP, the user gains Hit+1.',
    },
    {
        id: 'opportunist',
        name: 'Opportunist',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in combat',
        description:
            'If the foe cannot Counterattack, the user adds +4 to their Attack.',
    },
    {
        id: 'in-extremis',
        name: 'In Extremis',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in combat',
        description:
            'When the user’s HP is 1/4 or under, gain Hit+2.',
    },
    {
        id: 'barter',
        name: 'Barter',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in merchant work',
        description:
            'The user can purchase an item for half its cost in exchange for an item in their inventory.',
    },
    {
        id: 'resourceful',
        name: 'Resourceful',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in merchant work',
        description:
            'When the user uses an item, any effects such as HP recovered, damage dealt, or stats gained are doubled.',
    },
    {
        id: 'tactically-minded',
        name: 'Tactically-Minded',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in research or academics',
        description:
            'At 1/2 HP or less, Defense+2 and Resistance+2, Attack-2.',
    },
    {
        id: 'peacebringer',
        name: 'Peacebringer',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background in religion',
        description:
            'All allies and enemies within 2 spaces of the user deal 2 less damage.',
    },
    {
        id: 'heritor-of-feathers',
        name: 'Heritor of Feathers',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background with flying creatures or shifters',
        grantsMovementSkillAccess: ['flier'],
        movementSkillAccessMaximumLevel: 10,
        excludedMovementSkills: ['canter'],
        description:
            'User has WTD against Wingclipping weapons. User has access to all Flier skills with a level requirement of 10 or less, not including Canter.',
    },
    {
        id: 'heritor-of-furs',
        name: 'Heritor of Furs',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background with furred creatures or shifters',
        grantsMovementSkillAccess: ['cavalry'],
        movementSkillAccessMaximumLevel: 10,
        excludedMovementSkills: ['canter'],
        description:
            'User has WTD against Furflaying weapons. User has access to all Cavalry skills with a level requirement of 10 or less, not including Canter.',
    },
    {
        id: 'heritor-of-scales',
        name: 'Heritor of Scales',
        category: 'personal',
        type: 'passive',
        prerequisiteText: 'A background with scaled creatures or shifters',
        grantsMovementSkillAccess: ['armor'],
        movementSkillAccessMaximumLevel: 10,
        description:
            'User has WTD against Scalerending weapons. User has access to all Armor skills with a level requirement of 10 or less.',
    },

    // =========================================================
    // ALL-ACCESS SKILLS
    // =========================================================

    {
        id: 'draw-back',
        name: 'Draw Back',
        category: 'all-access',
        type: 'action',
        prerequisiteText: 'None',
        description:
            'The user moves themself and an adjacent ally back 1 space.',
    },
    {
        id: 'obstruct',
        name: 'Obstruct',
        category: 'all-access',
        type: 'passive',
        prerequisiteText: 'None',
        description:
            'When the user has 1/2 or more HP, any opponent that moves onto a space adjacent to the user immediately ends their movement.',
    },
    {
        id: 'pass',
        name: 'Pass',
        category: 'all-access',
        type: 'passive',
        prerequisiteText: 'None',
        description:
            'The user can move through enemies. Ignores Obstruct.',
    },
    {
        id: 'pivot',
        name: 'Pivot',
        category: 'all-access',
        type: 'action',
        prerequisiteText: 'None',
        description:
            'The user moves themself to the other side of an ally.',
    },
    {
        id: 'reposition',
        name: 'Reposition',
        category: 'all-access',
        type: 'action',
        prerequisiteText: 'None',
        description:
            'The user moves an ally to the other side of them.',
    },
    {
        id: 'swap',
        name: 'Swap',
        category: 'all-access',
        type: 'action',
        prerequisiteText: 'None',
        description:
            'The user swaps places with an adjacent ally.',
    },
    {
        id: 'guard',
        name: 'Guard',
        category: 'all-access',
        type: 'passive',
        prerequisiteText: 'None',
        description:
            'Opponents do not gain Charge through combat with the user.',
    },
    {
        id: 'solidarity',
        name: 'Solidarity',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Hit+1 and Avoid+1 to all adjacent allies.',
    },
    {
        id: 'celerity',
        name: 'Celerity',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        movementModifier: 1,
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s Movement stat by 1.',
    },
    {
        id: 'hp-plus-3',
        name: 'HP+3',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s HP stat by 3.',
    },
    {
        id: 'attack-plus-2',
        name: 'Attack+2',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s Attack stat by 2.',
    },
    {
        id: 'defense-plus-2',
        name: 'Defense+2',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s Defense stat by 2.',
    },
    {
        id: 'luck-plus-2',
        name: 'Luck+2',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s Luck stat by 2.',
    },
    {
        id: 'speed-plus-2',
        name: 'Speed+2',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s Speed stat by 2.',
    },
    {
        id: 'dexterity-plus-2',
        name: 'Dexterity+2',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s Dexterity stat by 2.',
    },
    {
        id: 'resistance-plus-2',
        name: 'Resistance+2',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 5,
        },
        prerequisiteText: 'Lv 5',
        description:
            'Permanently raise the user’s Resistance stat by 2.',
    },
    {
        id: 'escape-route',
        name: 'Escape Route',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 10,
        },
        prerequisiteText: 'Lv 10',
        description:
            'If the user is at 1/2 HP or less, they may move adjacent to any ally, spending all of their Movement doing this. The user can perform their action after moving.',
    },
    {
        id: 'wings-of-mercy',
        name: 'Wings of Mercy',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 10,
        },
        prerequisiteText: 'Lv 10',
        description:
            'If an ally is at 1/2 HP or less, the user may move adjacent to that ally, spending all of their Movement doing this. The user can perform their action after moving.',
    },
    {
        id: 'cancel-affinity',
        name: 'Cancel Affinity',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 10,
        },
        prerequisiteText: 'Lv 10',
        description:
            'Both the user and the opponent ignore Weapon Triangle bonuses and penalties during combat.',
    },
    {
        id: 'triangle-adept',
        name: 'Triangle Adept',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 10,
        },
        prerequisiteText: 'Lv 10',
        description:
            'When the user has WTA, they gain Advantage on all of their attacks. When they have WTD, they take Disadvantage on all of their attacks.',
    },
    {
        id: 'rally-offenses',
        name: 'Rally Offenses',
        category: 'all-access',
        type: 'action',
        requirements: {
            level: 10,
        },
        prerequisiteText: 'Lv 10',
        description:
            'The user gives an adjacent ally +3 Attack and +1 Hit until the start of the user’s next phase. If this skill is activated, all other Rally skills that the user has may be activated on that same ally simultaneously.',
    },
    {
        id: 'rally-reflexes',
        name: 'Rally Reflexes',
        category: 'all-access',
        type: 'action',
        requirements: {
            level: 10,
        },
        prerequisiteText: 'Lv 10',
        description:
            'The user gives an adjacent ally +3 Speed and +1 Avoid until the start of the user’s next phase. If this skill is activated, all other Rally skills that the user has may be activated on that same ally simultaneously.',
    },
    {
        id: 'rally-defenses',
        name: 'Rally Defenses',
        category: 'all-access',
        type: 'action',
        requirements: {
            level: 10,
        },
        prerequisiteText: 'Lv 10',
        description:
            'The user gives an adjacent ally +2 Defense and +2 Resistance until the start of the user’s next phase. If this skill is activated, all other Rally skills that the user has may be activated on that same ally simultaneously.',
    },
    {
        id: 'dual-wield',
        name: 'Dual Wield',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            excludedSkills: ['expertise', 'master-of-arms'],
        },
        grantsWeaponProficiencyCount: 1,
        prerequisiteText:
            'Lv 15; User does not have Expertise or Master of Arms',
        description:
            'The user gains another Weapon Proficiency.',
    },
    {
        id: 'hardy-bearing',
        name: 'Hardy Bearing',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
        },
        prerequisiteText: 'Lv 15',
        description:
            'Both the user and foe cannot use skills that affect priority or frequency of attacks.',
    },
    {
        id: 'vantage',
        name: 'Vantage',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            excludedSkills: [
                'brash-assault',
                'desperation',
                'quick-riposte',
            ],
        },
        prerequisiteText:
            'Lv 15; User does not have Brash Assault, Desperation, or Quick Riposte',
        description:
            'If the user has 1/2 or under HP, they can attack first regardless of who initiates combat.',
    },
    {
        id: 'brash-assault',
        name: 'Brash Assault',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            excludedSkills: [
                'desperation',
                'quick-riposte',
                'vantage',
            ],
        },
        prerequisiteText:
            'Lv 15; User does not have Desperation, Quick Riposte, or Vantage',
        description:
            'If the user has 1/2 or less HP and initiates combat against an opponent that can counterattack, the user performs a Follow-Up Attack regardless of Speed.',
    },
    {
        id: 'quick-riposte',
        name: 'Quick Riposte',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            excludedSkills: [
                'brash-assault',
                'desperation',
                'vantage',
            ],
        },
        prerequisiteText:
            'Lv 15; User does not have Brash Assault, Desperation, or Vantage',
        description:
            'If the user has 3/4 or more HP, the user can make a Follow-Up Attack if the foe initiates combat.',
    },
    {
        id: 'desperation',
        name: 'Desperation',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            excludedSkills: [
                'brash-assault',
                'quick-riposte',
                'vantage',
            ],
        },
        prerequisiteText:
            'Lv 15; User does not have Brash Assault, Quick Riposte, or Vantage',
        description:
            'If the user attacks at 1/2 or less HP, they can perform their Follow-Up Attack, if viable, before the opponent does a Counterattack.',
    },
    {
        id: 'poison-body',
        name: 'Poison Body',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
        },
        prerequisiteText: 'Lv 15',
        description:
            'If an opponent attacking the user would recover HP from their attack through a Skill or Refine, that opponent loses that HP instead of recovering it.',
    },
    {
        id: 'wrath',
        name: 'Wrath',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
        },
        prerequisiteText: 'Lv 15',
        description:
            'While the user is at 1/2 HP or less, the opponent’s Critical Avoid is treated as though it is 5 lower.',
    },
    {
        id: 'rally-movement',
        name: 'Rally Movement',
        category: 'all-access',
        type: 'action',
        requirements: {
            level: 15,
        },
        prerequisiteText: 'Lv 15',
        description:
            'The user gives an adjacent ally +1 Movement until the start of the user’s next phase. If this skill is activated, all other Rally skills that the user has may be activated on that same ally simultaneously.',
    },
    {
        id: 'flashing-blade',
        name: 'Flashing Blade',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            excludedSkills: ['heavy-blade'],
        },
        prerequisiteText:
            'Lv 15; User does not have Heavy Blade',
        description:
            'If the user’s Speed is greater than the opponent’s Speed and the user initiates combat, the user gains an additional +1 Charge after combat.',
    },
    {
        id: 'heavy-blade',
        name: 'Heavy Blade',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            excludedSkills: ['flashing-blade'],
        },
        prerequisiteText:
            'Lv 15; User does not have Flashing Blade',
        description:
            'If the user’s Attack is greater than the opponent’s Attack and the user initiates combat, the user gains an additional +1 Charge after combat.',
    },
    {
        id: 'expertise',
        name: 'Expertise',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 20,
            excludedSkills: ['dual-wield', 'master-of-arms'],
        },
        prerequisiteText:
            'Lv 20; User does not have Dual Wield or Master of Arms',
        description:
            'Attack+3 and Hit+1.',
    },
    {
        id: 'fortune',
        name: 'Fortune',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 25,
        },
        prerequisiteText: 'Lv 25',
        description:
            'User does not take double nor triple damage from Critical Hits.',
    },
    {
        id: 'quickened-pulse',
        name: 'Quickened Pulse',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 25,
            requiresCombatArt: true,
        },
        prerequisiteText:
            'Lv 25; User has a Combat Art',
        description:
            'All Combat Arts requiring 3 or more base Charge to use require one less Charge to activate.',
    },
    {
        id: 'steal',
        name: 'Steal',
        category: 'all-access',
        type: 'action',
        prerequisiteText: 'None',
        description:
            'The user can use their action to unlock doors, chests, and anything else locked; steal an unequipped item if their Speed is higher than the opponent’s; or steal money equal to the opponent’s level times 10.',
    },
    {
        id: 'keen-vision',
        name: 'Keen Vision',
        category: 'all-access',
        type: 'passive',
        prerequisiteText: 'None',
        description:
            'User can see into areas up to 4 spaces away in Fog of War.',
    },
    {
        id: 'perform',
        name: 'Perform',
        category: 'all-access',
        type: 'action',
        prerequisiteText: 'None',
        description:
            'User refreshes an adjacent non-performing ally’s Movement and actions. User takes -3 to HP and -2 to four additional combat stats of their choice.',
    },
    {
        id: 'performance-of-the-focused',
        name: 'Performance of the Focused',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            requiredSkills: ['perform'],
        },
        prerequisiteText: 'Lv 15; Perform',
        description:
            'When Perform is used, the target takes Advantage on their next attack. Wears off at the start of the user’s next phase.',
    },
    {
        id: 'performance-of-the-fortunate',
        name: 'Performance of the Fortunate',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            requiredSkills: ['perform'],
        },
        prerequisiteText: 'Lv 15; Perform',
        description:
            'When Perform is used, during the target’s next combat, their opponent takes Disadvantage on their first attack. Wears off at the start of the user’s next phase.',
    },
    {
        id: 'performance-of-the-stalwart',
        name: 'Performance of the Stalwart',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 15,
            requiredSkills: ['perform'],
        },
        prerequisiteText: 'Lv 15; Perform',
        description:
            'When Perform is used, during the target’s next combat, their opponent may not Follow-Up. Wears off at the start of the user’s next phase.',
    },
    {
        id: 'inspiring-performance',
        name: 'Inspiring Performance',
        category: 'all-access',
        type: 'passive',
        requirements: {
            level: 20,
            requiredSkills: ['perform'],
        },
        prerequisiteText: 'Lv 20; Perform',
        description:
            'When Perform is used, the target is also granted Attack, Speed, Defense, and Resistance+2 until the start of the user’s phase.',
    },

    // =========================================================
    // SWORD, LANCE, AND AXE SKILLS
    // =========================================================

    {
        id: 'drag-back',
        name: 'Drag Back',
        category: 'weapon',
        type: 'strategy',
        requirements: {
            anyWeaponProficiency: [
                'sword',
                'lance',
                'axe',
                'shifting-stone',
                'strike',
                'talon',
                'breath',
            ],
        },
        prerequisiteText:
            'Sword, Lance, Axe, Shifting Stone, Strike, Talon, or Breath Proficiency',
        description:
            'After combat, the user moves back 1 space with their opponent. If there is no room for the user to move back, this skill fails.',
    },
    {
        id: 'quixotic',
        name: 'Quixotic',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['sword', 'lance', 'axe'],
        },
        prerequisiteText:
            'Lv 5; Sword, Lance, or Axe Proficiency',
        description:
            'Hit+3 and Avoid-3 for the user.',
    },
    {
        id: 'parity',
        name: 'Parity',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['sword', 'lance', 'axe'],
        },
        prerequisiteText:
            'Lv 10; Sword, Lance, or Axe Proficiency',
        description:
            'Neither the user nor their opponent can activate any Strategy, Reflex, or Technique skills.',
    },
    {
        id: 'swordbreaker',
        name: 'Swordbreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['lance'],
        },
        prerequisiteText: 'Lv 10; Lance Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with a Sword.',
    },
    {
        id: 'lancebreaker',
        name: 'Lancebreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['axe'],
        },
        prerequisiteText: 'Lv 10; Axe Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with a Lance.',
    },
    {
        id: 'axebreaker',
        name: 'Axebreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['sword'],
        },
        prerequisiteText: 'Lv 10; Sword Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with an Axe.',
    },

    // =========================================================
    // DAGGER AND BOW SKILLS
    // =========================================================

    {
        id: 'focus',
        name: 'Focus',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['dagger', 'bow'],
        },
        prerequisiteText:
            'Lv 5; Dagger or Bow Proficiency',
        description:
            'Hit+2 when there are no allies within a 2-tile radius.',
    },
    {
        id: 'physical-specialist',
        name: 'Physical Specialist',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['dagger', 'bow'],
        },
        prerequisiteText:
            'Lv 5; Dagger or Bow Proficiency',
        description:
            'Hit+1 against opponents equipped with weapons that deal Physical damage. Avoid-1 against opponents equipped with weapons that deal Magical damage.',
    },
    {
        id: 'bowbreaker',
        name: 'Bowbreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['dagger'],
        },
        prerequisiteText: 'Lv 10; Dagger Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with a Bow.',
    },
    {
        id: 'daggerbreaker',
        name: 'Daggerbreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['bow'],
        },
        prerequisiteText: 'Lv 10; Bow Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with a Dagger.',
    },

    // =========================================================
    // ANIMA, LIGHT, AND DARK SKILLS
    // =========================================================

    {
        id: 'heartseeker',
        name: 'Heartseeker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['anima', 'light', 'dark'],
        },
        prerequisiteText:
            'Lv 5; Anima, Light, or Dark Proficiency',
        description:
            'Avoid-2 to enemies adjacent to the user during combat.',
    },
    {
        id: 'magical-specialist',
        name: 'Magical Specialist',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['anima', 'light', 'dark'],
        },
        prerequisiteText:
            'Lv 5; Anima, Light, or Dark Proficiency',
        description:
            'Hit+1 against opponents equipped with weapons that deal Magical damage. Avoid-1 against opponents equipped with weapons that deal Physical damage.',
    },
    {
        id: 'animabreaker',
        name: 'Animabreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['dark'],
        },
        prerequisiteText: 'Lv 10; Dark Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with Anima Magic.',
    },
    {
        id: 'lightbreaker',
        name: 'Lightbreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['anima'],
        },
        prerequisiteText: 'Lv 10; Anima Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with Light Magic.',
    },
    {
        id: 'darkbreaker',
        name: 'Darkbreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['light'],
        },
        prerequisiteText: 'Lv 10; Light Proficiency',
        description:
            'Hit+3 and Avoid+3 when in combat with an opponent equipped with Dark Magic.',
    },

    // =========================================================
    // GAUNTLET SKILLS
    // =========================================================

    {
        id: 'linked-attack',
        name: 'Linked Attack',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['gauntlets'],
        },
        prerequisiteText: 'Lv 5; Gauntlet Proficiency',
        description:
            'If this unit is within 2 spaces of their Support Partner, that partner adds this unit’s weapon’s Might to their Power and +1 to their Hit.',
    },
    {
        id: 'cursebreaker',
        name: 'Cursebreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['gauntlets'],
            excludedSkills: ['staffbreaker'],
        },
        prerequisiteText:
            'Lv 10; User does not have Staffbreaker; Gauntlet Proficiency',
        description:
            'Hit+3 and Avoid+3 when fighting an opponent equipped with a Curse.',
    },
    {
        id: 'staffbreaker',
        name: 'Staffbreaker',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['gauntlets'],
            excludedSkills: ['cursebreaker'],
        },
        prerequisiteText:
            'Lv 10; User does not have Cursebreaker; Gauntlet Proficiency',
        description:
            'Hit+3 and Avoid+3 when fighting an opponent equipped with a Staff. Being targeted by a Staff Effect counts toward activating this skill.',
    },

    // =========================================================
    // SHIFTING STONE SKILLS
    // =========================================================

    {
        id: 'even-rhythm',
        name: 'Even Rhythm',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['shifting-stone'],
            excludedSkills: ['odd-rhythm'],
        },
        prerequisiteText:
            'Lv 5; Shifting Stone Proficiency; User does not have Odd Rhythm',
        description:
            'On even turns, the opponent’s Critical Avoid is treated as though it is 2 lower.',
    },
    {
        id: 'odd-rhythm',
        name: 'Odd Rhythm',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['shifting-stone'],
            excludedSkills: ['even-rhythm'],
        },
        prerequisiteText:
            'Lv 5; Shifting Stone Proficiency; User does not have Even Rhythm',
        description:
            'On odd turns, the opponent’s Critical Avoid is treated as though it is 2 lower.',
    },
    {
        id: 'blessed-strike',
        name: 'Blessed Strike',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['shifting-stone'],
        },
        grantsTraits: ['Furred'],
        prerequisiteText:
            'Lv 10; Shifting Stone Proficiency',
        description:
            'Attacks made with a Shifting Stone calculate damage using the lower of the foe’s Defense or Resistance. User gains the Furred Trait.',
    },
    {
        id: 'distant-shot',
        name: 'Distant Shot',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 15,
            anyWeaponProficiency: ['shifting-stone'],
        },
        grantsTraits: ['Scaled'],
        prerequisiteText:
            'Lv 15; Shifting Stone Proficiency',
        description:
            'User’s Max Range is increased by 1 when equipped with a Shifting Stone. User gains the Scaled Trait.',
    },
    {
        id: 'grisly-wound',
        name: 'Grisly Wound',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 15,
            anyWeaponProficiency: ['shifting-stone'],
        },
        prerequisiteText:
            'Lv 15; Shifting Stone Proficiency',
        description:
            'The opponent takes 5 Post-Combat damage after any combat with the user.',
    },

    // =========================================================
    // STRIKE, TALON, AND BREATH SKILLS
    // =========================================================

    {
        id: 'boon',
        name: 'Boon',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['strike', 'talon', 'breath'],
        },
        prerequisiteText:
            'Lv 5; Strike, Talon, or Breath Proficiency',
        description:
            'Heals the status conditions of allies adjacent to the user at the beginning of each turn.',
    },
    {
        id: 'vigor',
        name: 'Vigor',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['strike', 'talon', 'breath'],
        },
        prerequisiteText:
            'Lv 10; Strike, Talon, or Breath Proficiency',
        description:
            'At the start of their turn, all adjacent transformed allies gain +1 to their Gauge.',
    },
    {
        id: 'blood-tide',
        name: 'Blood Tide',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 20,
            anyWeaponProficiency: ['strike', 'talon', 'breath'],
        },
        prerequisiteText:
            'Lv 20; Strike, Talon, or Breath Proficiency',
        description:
            'Attack+3 and Hit+1 to all adjacent allies.',
    },
    {
        id: 'white-tide',
        name: 'White Tide',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 20,
            anyWeaponProficiency: ['strike', 'talon', 'breath'],
        },
        prerequisiteText:
            'Lv 20; Strike, Talon, or Breath Proficiency',
        description:
            'Avoid+1 and Speed+3 to all adjacent allies.',
    },
    {
        id: 'night-tide',
        name: 'Night Tide',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 20,
            anyWeaponProficiency: ['strike', 'talon', 'breath'],
        },
        prerequisiteText:
            'Lv 20; Strike, Talon, or Breath Proficiency',
        description:
            'Defense+3 and Resistance+3 to all adjacent allies.',
    },

    // =========================================================
    // STAFF SKILLS
    // =========================================================

    {
        id: 'charm',
        name: 'Charm',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['staff'],
        },
        prerequisiteText: 'Lv 5; Staff Proficiency',
        description:
            'Avoid+1 to all allies within a 3-tile radius.',
    },
    {
        id: 'wrathful-staff',
        name: 'Wrathful Staff',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['staff'],
        },
        prerequisiteText: 'Lv 10; Staff Proficiency',
        description:
            'User can now initiate combat with Staves. When attacking with a Staff, the user calculates the attack’s Power as one would with any other physical weapon, factoring in the Staff’s Might accordingly.',
    },
    {
        id: 'live-to-serve',
        name: 'Live to Serve',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['staff'],
        },
        prerequisiteText: 'Lv 10; Staff Proficiency',
        description:
            'When healing allies with a Staff, the user also recovers the same amount.',
    },
    {
        id: 'dazzling-staff',
        name: 'Dazzling Staff',
        category: 'weapon',
        type: 'passive',
        requirements: {
            level: 25,
            anyWeaponProficiency: ['staff'],
        },
        prerequisiteText: 'Lv 25; Staff Proficiency',
        description:
            'User cannot counterattack. User’s opponent cannot counterattack.',
    },

    // =========================================================
    // FIEND SKILLS
    // =========================================================

    {
        id: 'monstrous',
        name: 'Monstrous',
        category: 'fiend',
        type: 'passive',
        grantsTraits: ['Fiendish'],
        prerequisiteText: 'None',
        description:
            'The user gains the Fiendish trait. If targeted by a status-inflicting Staff, weapon, or Combat Art, the opponent must roll twice for accuracy and use the lower result to determine whether the user is inflicted with a status. For weapons, the first roll is still used to determine whether the attack hits and deals damage.',
    },
    {
        id: 'vengeful-cry',
        name: 'Vengeful Cry',
        category: 'fiend',
        type: 'passive',
        requirements: {
            level: 10,
            anyOf: [
                { skill: 'monstrous' },
                { weaponProficiency: 'curse' },
            ],
        },
        prerequisiteText:
            'Lv 10; User has Monstrous or Curse Proficiency',
        description:
            'User gains +2 Attack and +2 Hit when in combat with an opponent they have already been in combat with.',
    },
    {
        id: 'coral-cover',
        name: 'Coral Cover',
        category: 'fiend',
        type: 'passive',
        requirements: {
            level: 15,
            anyOf: [
                { skill: 'monstrous' },
                { weaponProficiency: 'curse' },
            ],
        },
        prerequisiteText:
            'Lv 15; User has Monstrous or Curse Proficiency',
        description:
            'User doubles all terrain Effects and Movement penalties, both beneficial and not.',
    },
    {
        id: 'shadow-gambit',
        name: 'Shadow Gambit',
        category: 'fiend',
        type: 'passive',
        requirements: {
            level: 15,
            anyOf: [
                { skill: 'monstrous' },
                { weaponProficiency: 'curse' },
            ],
        },
        prerequisiteText:
            'Lv 15; User has Monstrous or Curse Proficiency',
        description:
            'User ignores all terrain Effects and Movement penalties, both beneficial and not.',
    },
    {
        id: 'anathema',
        name: 'Anathema',
        category: 'fiend',
        type: 'passive',
        requirements: {
            level: 20,
            anyOf: [
                { skill: 'monstrous' },
                { weaponProficiency: 'curse' },
            ],
        },
        prerequisiteText:
            'Lv 20; User has Monstrous or Curse Proficiency',
        description:
            'User takes 1/2 Damage from Anima and Dark Magic and takes double Damage from Light Magic.',
    },

    // =========================================================
    // INFANTRY / ARMOR SHARED SKILLS
    // =========================================================

    {
        id: 'shove',
        name: 'Shove',
        category: 'movement',
        type: 'action',
        requirements: {
            movementTypes: ['infantry', 'armor'],
        },
        prerequisiteText: 'Infantry or Armor',
        description:
            'User pushes an ally 1 space away from the user.',
    },
    {
        id: 'mountain-climber',
        name: 'Mountain Climber',
        category: 'movement',
        type: 'passive',
        requirements: {
            movementTypes: ['infantry', 'armor'],
        },
        prerequisiteText: 'Infantry or Armor',
        description:
            'Mountains and Sandbags become Rough Terrain for the user.',
    },

    // =========================================================
    // INFANTRY SKILLS
    // =========================================================

    {
        id: 'hit-and-run',
        name: 'Hit and Run',
        category: 'movement',
        type: 'strategy',
        requirements: {
            movementTypes: ['infantry'],
        },
        prerequisiteText: 'Infantry',
        description:
            'After combat, the user moves 1 space back regardless of remaining Movement. Fails if the user would move into a space they cannot land on.',
    },
    {
        id: 'lunge',
        name: 'Lunge',
        category: 'movement',
        type: 'strategy',
        requirements: {
            movementTypes: ['infantry'],
        },
        prerequisiteText: 'Infantry',
        description:
            'After combat, the user can move forward 1 space and can swap with the opponent in this way.',
    },
    {
        id: 'knock-back',
        name: 'Knock Back',
        category: 'movement',
        type: 'strategy',
        requirements: {
            movementTypes: ['infantry'],
        },
        prerequisiteText: 'Infantry',
        description:
            'After combat, the opponent is pushed 1 space away from the user. If there is no room for the opponent to move into that space, this skill fails.',
    },
    {
        id: 'seafarer',
        name: 'Seafarer',
        category: 'movement',
        type: 'passive',
        requirements: {
            movementTypes: ['infantry'],
        },
        prerequisiteText: 'Infantry',
        description:
            'Water becomes Rough Terrain to the user.',
    },
    {
        id: 'acrobat',
        name: 'Acrobat',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['infantry'],
        },
        prerequisiteText: 'Lv 10; Infantry',
        description:
            'All Rough Terrain becomes Standard Terrain to the user.',
    },
    {
        id: 'master-of-arms',
        name: 'Master of Arms',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 20,
            movementTypes: ['infantry'],
            excludedSkills: ['dual-wield', 'expertise'],
        },
        grantsWeaponProficiencyCount: 2,
        prerequisiteText:
            'Lv 20; Infantry; User does not have Dual Wield or Expertise',
        description:
            'The user gains two more Weapon Proficiencies.',
    },

    // =========================================================
    // ARMOR SKILLS
    // =========================================================

    {
        id: 'smite',
        name: 'Smite',
        category: 'movement',
        type: 'action',
        requirements: {
            movementTypes: ['armor'],
        },
        prerequisiteText: 'Armor',
        description:
            'User pushes an ally 2 spaces away from the user.',
    },
    {
        id: 'natural-cover',
        name: 'Natural Cover',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['armor'],
        },
        prerequisiteText: 'Lv 10; Armor',
        description:
            'When the user fights in terrain with terrain effects, all damage taken is reduced by 3, down to a minimum of 1.',
    },
    {
        id: 'defender',
        name: 'Defender',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['armor'],
        },
        prerequisiteText: 'Lv 10; Armor',
        description:
            'When rescuing, the user gains Defense+2 and Resistance+2.',
    },
    {
        id: 'steady-stance',
        name: 'Steady Stance',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['armor'],
        },
        prerequisiteText: 'Lv 15; Armor',
        description:
            'If the user has 1/2 or more HP when the opponent initiates battle, physical damage received is reduced by 3, down to a minimum of 1.',
    },
    {
        id: 'warding-stance',
        name: 'Warding Stance',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['armor'],
        },
        prerequisiteText: 'Lv 15; Armor',
        description:
            'If the user has 1/2 or more HP when the opponent initiates battle, magical damage received is reduced by 3, down to a minimum of 1.',
    },
    {
        id: 'vengeful-fighter',
        name: 'Vengeful Fighter',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['armor'],
            excludedSkills: ['wary-fighter'],
        },
        prerequisiteText:
            'Lv 15; Armor; User does not have Wary Fighter',
        description:
            'If the user has 1/2 or above HP and the foe initiates combat, the user makes a guaranteed Follow-Up Attack.',
    },
    {
        id: 'wary-fighter',
        name: 'Wary Fighter',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['armor'],
            excludedSkills: ['vengeful-fighter'],
        },
        prerequisiteText:
            'Lv 15; Armor; User does not have Vengeful Fighter',
        description:
            'If the user has 1/2 or above HP, neither combatant can perform a Follow-Up Attack.',
    },
    {
        id: 'svalinn-shield',
        name: 'Svalinn Shield',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 25,
            movementTypes: ['armor'],
            requiresGMPermission: true,
        },
        prerequisiteText:
            'Lv 25; Armor; GM’s permission',
        description:
            'The user does not take effective damage from Scalerending weapons.',
    },

    // =========================================================
    // CAVALRY / FLIER SHARED SKILLS
    // =========================================================

    {
        id: 'canter',
        name: 'Canter',
        category: 'movement',
        type: 'passive',
        requirements: {
            movementTypes: ['cavalry', 'flier'],
        },
        prerequisiteText: 'Cavalry or Flier',
        description:
            'After performing all actions, the user may move again up to 2 spaces.',
    },

    // =========================================================
    // CAVALRY SKILLS
    // =========================================================

    {
        id: 'savior',
        name: 'Savior',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['cavalry'],
        },
        prerequisiteText: 'Lv 10; Cavalry',
        description:
            'When rescuing, the user does not take any penalties.',
    },
    {
        id: 'elbow-room',
        name: 'Elbow Room',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['cavalry'],
        },
        prerequisiteText: 'Lv 10; Cavalry',
        description:
            'When the user fights in terrain with no terrain effects, they deal +2 Damage during combat.',
    },
    {
        id: 'death-blow',
        name: 'Death Blow',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['cavalry'],
        },
        prerequisiteText: 'Lv 15; Cavalry',
        description:
            'If the user has 1/2 or more HP when they initiate battle, they deal +3 Damage.',
    },
    {
        id: 'certain-blow',
        name: 'Certain Blow',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['cavalry'],
        },
        prerequisiteText: 'Lv 15; Cavalry',
        description:
            'If the user has 1/2 or more HP when they initiate battle, they gain +1 Hit.',
    },
    {
        id: 'granis-shield',
        name: 'Grani’s Shield',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 25,
            movementTypes: ['cavalry'],
            requiresGMPermission: true,
        },
        prerequisiteText:
            'Lv 25; Cavalry; GM’s permission',
        description:
            'The user does not take effective damage from Furflaying weapons.',
    },

    // =========================================================
    // FLIER SKILLS
    // =========================================================

    {
        id: 'camaraderie',
        name: 'Camaraderie',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['flier'],
        },
        prerequisiteText: 'Lv 10; Flier',
        description:
            'Recover 5 HP at the beginning of the user’s turn if there is at least 1 ally within 2 spaces.',
    },
    {
        id: 'deliverer',
        name: 'Deliverer',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['flier'],
        },
        prerequisiteText: 'Lv 10; Flier',
        description:
            'When rescuing, the user gains Movement+2.',
    },
    {
        id: 'air-superiority',
        name: 'Air Superiority',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 10,
            movementTypes: ['flier'],
        },
        prerequisiteText: 'Lv 10; Flier',
        description:
            'Hit+3 and Avoid+3 when in combat with other Fliers.',
    },
    {
        id: 'trample',
        name: 'Trample',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['flier'],
        },
        prerequisiteText: 'Lv 15; Flier',
        description:
            'If the opponent is not a Cavalry or Flier, the user deals +3 Damage.',
    },
    {
        id: 'duelists-stance',
        name: 'Duelist’s Stance',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['flier'],
        },
        prerequisiteText: 'Lv 15; Flier',
        description:
            'If the user has 1/2 or more HP when the opponent initiates battle, the user gains +1 Avoid.',
    },
    {
        id: 'darting-blow',
        name: 'Darting Blow',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 15,
            movementTypes: ['flier'],
        },
        prerequisiteText: 'Lv 15; Flier',
        description:
            'If the user has 1/2 or more HP when they initiate battle, they gain +3 Speed.',
    },
    {
        id: 'guidance',
        name: 'Guidance',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 20,
            movementTypes: ['flier'],
        },
        prerequisiteText: 'Lv 20; Flier',
        description:
            'Infantry and Armor allies within the user’s Movement Range can move to a space adjacent to the user, spending all of their Movement doing this. The moving ally can perform their action after moving.',
    },
    {
        id: 'iotes-shield',
        name: 'Iote’s Shield',
        category: 'movement',
        type: 'passive',
        requirements: {
            level: 25,
            movementTypes: ['flier'],
            requiresGMPermission: true,
        },
        prerequisiteText:
            'Lv 25; Flier; GM’s permission',
        description:
            'The user does not take effective damage from Wingclipping weapons.',
    },

    // =========================================================
    // OPTIONAL MOVEMENT TYPE SKILLS
    // =========================================================

    {
        id: 'class-change-cavalry',
        name: 'Class Change - Cavalry',
        category: 'movement-type',
        type: 'passive',
        optionalRule: 'movementTypeSkills',
        requirements: {
            level: 15,
            movementTypes: ['infantry', 'flier', 'armor'],
        },
        grantsTraits: ['Furred'],
        grantsMovementSkillAccess: ['cavalry'],
        movementModifier: 1,
        prerequisiteText:
            'Lv 15; Infantry, Flier, or Armor',
        description:
            'User gains +1 Movement and the Furred trait. User gains access to Cavalry skills.',
    },
    {
        id: 'class-change-flier',
        name: 'Class Change - Flier',
        category: 'movement-type',
        type: 'passive',
        optionalRule: 'movementTypeSkills',
        requirements: {
            level: 15,
            movementTypes: ['infantry', 'cavalry', 'armor'],
        },
        grantsTraits: ['Winged'],
        grantsMovementSkillAccess: ['flier'],
        ignoresRoughTerrain: true,
        ignoresDifficultTerrain: true,
        prerequisiteText:
            'Lv 15; Infantry, Cavalry, or Armor',
        description:
            'User becomes unhindered by Rough or Difficult terrain. User gains the Winged trait. User gains access to Flier skills.',
    },
    {
        id: 'class-change-armor',
        name: 'Class Change - Armor',
        category: 'movement-type',
        type: 'passive',
        optionalRule: 'movementTypeSkills',
        requirements: {
            level: 15,
            movementTypes: ['infantry', 'cavalry', 'flier'],
        },
        grantsTraits: ['Scaled'],
        grantsMovementSkillAccess: ['armor'],
        skillLevelOffset: 5,
        prerequisiteText:
            'Lv 15; Infantry, Cavalry, or Flier',
        description:
            'User gains access to all skills 5 levels earlier than the level prerequisite listed. User gains the Scaled trait. User gains access to Armor skills.',
    },

    // =========================================================
    // COMBAT ARTS
    // =========================================================

    {
        id: 'beastly-ward',
        name: 'Beastly Ward',
        category: 'combat-art',
        type: 'reflex',
        requirements: {
            anyWeaponProficiency: ['shifting-stone'],
        },
        chargeCost: {
            base: 1,
        },
        prerequisiteText: 'Shifting Stone Proficiency',
        chargeText: '1 Charge',
        description:
            'When an adjacent ally is hit by an attack, the user may activate this skill to reduce the damage of that attack by 1/2.',
    },
    {
        id: 'pickpocket',
        name: 'Pickpocket',
        category: 'combat-art',
        type: 'strategy',
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'None',
        chargeText: '3 Charge',
        description:
            'After combat, the user can obtain one unequipped item from the opponent’s inventory, or gold equal to half the value of the opponent’s equipped weapon. Can only be used if the user is adjacent to their opponent.',
    },
    {
        id: 'bliss',
        name: 'Bliss',
        category: 'combat-art',
        type: 'action',
        requirements: {
            anyWeaponProficiency: ['strike', 'talon', 'breath'],
        },
        chargeCost: {
            base: 1,
        },
        prerequisiteText:
            'Strike, Talon, or Breath Proficiency',
        chargeText: '1 Charge',
        description:
            'The user transfers all Charge, minus the Charge spent activating this skill, to an adjacent ally.',
    },
    {
        id: 'guardian',
        name: 'Guardian',
        category: 'combat-art',
        type: 'reflex',
        chargeCost: {
            base: 1,
        },
        prerequisiteText: 'None',
        chargeText: '1 Charge',
        description:
            'When an adjacent ally is hit, the user can take the Damage that ally would have taken, after factoring in that ally’s Defense or Resistance, instead.',
    },
    {
        id: 'curved-shot',
        name: 'Curved Shot',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['bow'],
        },
        chargeCost: {
            base: 1,
            variable: true,
            variableMaximum: 5,
        },
        prerequisiteText: 'Lv 5; Bow Proficiency',
        chargeText: '1+X Charge',
        description:
            'The Max Range of the user’s equipped Bow is increased by 1 per X Charge spent, up to a maximum of 5 additional Range. If the user can attack multiple times and wants to, the user must spend the required Charge per attack before combat starts.',
    },
    {
        id: 'bane',
        name: 'Bane',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 5,
            anyWeaponProficiency: ['dagger'],
        },
        chargeCost: {
            base: 1,
            variable: true,
            variableMaximum: 5,
        },
        prerequisiteText: 'Lv 5; Dagger Proficiency',
        chargeText: '1+X Charge',
        description:
            'The user’s Dagger attacks gain an additional +1 Hit per X Charge spent for this combat, up to a maximum of 5 extra Hit.',
    },
    {
        id: 'gamble',
        name: 'Gamble',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 5,
        },
        chargeCost: {
            base: 1,
        },
        prerequisiteText: 'Lv 5',
        chargeText: '1 Charge',
        description:
            'The user gains +5 Hit. However, all attacks made by the user that are not Critical Hits are treated as misses.',
    },
    {
        id: 'imbue',
        name: 'Imbue',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['staff'],
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText: 'Lv 10; Staff Proficiency',
        chargeText: '2 Charge',
        description:
            'Increase the amount of HP restored by a healing Staff Effect by 5.',
    },
    {
        id: 'multitask',
        name: 'Multitask',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['staff'],
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText: 'Lv 10; Staff Proficiency',
        chargeText: '2 Charge',
        description:
            'After using a non-healing Staff Effect on an ally, that ally also recovers 5 HP.',
    },
    {
        id: 'sorcery-blade',
        name: 'Sorcery Blade',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['sword', 'lance', 'axe'],
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText:
            'Lv 10; Sword, Lance, or Axe Proficiency',
        chargeText: '2 Charge',
        description:
            'The user’s attack targets Resistance instead of Defense.',
    },
    {
        id: 'cease-conflict',
        name: 'Cease Conflict',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['staff'],
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText: 'Lv 10; Staff Proficiency',
        chargeText: '2 Charge',
        description:
            'The opponent’s weapon immediately becomes unequipped and combat immediately ends. Only works on opponents whose level is equal to or lower than the user’s.',
    },
    {
        id: 'knightkneeler',
        name: 'Knightkneeler',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 10,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 10',
        chargeText: '3 Charge',
        description:
            'The user’s attack gains the Furflaying attribute.',
    },
    {
        id: 'helmsplitter',
        name: 'Helmsplitter',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 10,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 10',
        chargeText: '3 Charge',
        description:
            'The user’s attack gains the Scalerending attribute.',
    },
    {
        id: 'grounder',
        name: 'Grounder',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 10,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 10',
        chargeText: '3 Charge',
        description:
            'The user’s attack gains the Wingclipping attribute.',
    },
    {
        id: 'bane-of-monsters',
        name: 'Bane of Monsters',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 10,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 10',
        chargeText: '3 Charge',
        description:
            'The user’s attack gains the Fiendslaying attribute.',
    },

    // =========================================================
    // GAUNTLET COMBAT ARTS
    // =========================================================

    {
        id: 'adjutant-follow-up',
        name: 'Adjutant Follow-Up',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['gauntlets'],
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText:
            'Lv 10; Gauntlet Proficiency',
        chargeText: '2 Charge',
        description:
            'When this unit is being rescued by another, they may spend the required Charge upon the rescuing unit’s attack to make an additional attack of their own. This does not count as participating in combat for the purpose of accruing Charge.',
    },
    {
        id: 'adjutant-guard',
        name: 'Adjutant Guard',
        category: 'combat-art',
        type: 'reflex',
        requirements: {
            level: 10,
            anyWeaponProficiency: ['gauntlets'],
        },
        chargeCost: {
            base: 1,
        },
        prerequisiteText:
            'Lv 10; Gauntlet Proficiency',
        chargeText: '1 Charge',
        description:
            'When this unit is being rescued by another, they may spend the required Charge upon the rescuing unit being attacked in order to halve the damage taken. This does not count as participating in combat for the purpose of accruing Charge.',
    },
    {
        id: 'draining-blow',
        name: 'Draining Blow',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 15,
            anyWeaponProficiency: ['gauntlets'],
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText:
            'Lv 15; Gauntlet Proficiency',
        chargeText: '3 Charge',
        description:
            'The user’s Gauntlet attack restores HP equal to half of the damage dealt to the opponent. If the user can strike multiple times and wants to, the user must spend the required Charge per strike before combat starts.',
    },

    // =========================================================
    // HIGHER-LEVEL COMBAT ARTS
    // =========================================================

    {
        id: 'pavise',
        name: 'Pavise',
        category: 'combat-art',
        type: 'reflex',
        requirements: {
            level: 15,
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText: 'Lv 15',
        chargeText: '2 Charge',
        description:
            'When the user is attacked from 1 space away, reduce Damage by 1/2.',
    },
    {
        id: 'aegis',
        name: 'Aegis',
        category: 'combat-art',
        type: 'reflex',
        requirements: {
            level: 15,
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText: 'Lv 15',
        chargeText: '2 Charge',
        description:
            'When the user is attacked from 2 or more spaces away, reduce Damage by 1/2.',
    },
    {
        id: 'counter',
        name: 'Counter',
        category: 'combat-art',
        type: 'reflex',
        requirements: {
            level: 15,
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText: 'Lv 15',
        chargeText: '2 Charge',
        description:
            'When the user is attacked from 1 space away, the opponent also takes Damage equal to the amount of Damage the user took.',
    },
    {
        id: 'countermagic',
        name: 'Countermagic',
        category: 'combat-art',
        type: 'reflex',
        requirements: {
            level: 15,
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText: 'Lv 15',
        chargeText: '2 Charge',
        description:
            'When the user is attacked from 2 or more spaces away, the opponent also takes Damage equal to the amount of Damage the user took.',
    },
    {
        id: 'miracle',
        name: 'Miracle',
        category: 'combat-art',
        type: 'reflex',
        requirements: {
            level: 15,
        },
        chargeCost: {
            base: 4,
        },
        prerequisiteText: 'Lv 15',
        chargeText: '4 Charge',
        description:
            'Allows the user to survive an otherwise lethal blow, instead being left with 1 HP.',
    },
    {
        id: 'astra',
        name: 'Astra',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
            anyWeaponProficiency: ['sword', 'talon'],
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText:
            'Lv 20; Sword or Talon Proficiency',
        chargeText: '3 Charge',
        description:
            'Doubles the total Damage dealt to an opponent.',
    },
    {
        id: 'sol',
        name: 'Sol',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
            anyWeaponProficiency: ['axe', 'breath'],
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText:
            'Lv 20; Axe or Breath Proficiency',
        chargeText: '3 Charge',
        description:
            'After attacking, the user heals themself 1/2 of the Damage they just dealt to the opponent.',
    },
    {
        id: 'luna',
        name: 'Luna',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
            anyWeaponProficiency: ['lance', 'strike'],
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText:
            'Lv 20; Lance or Strike Proficiency',
        chargeText: '3 Charge',
        description:
            'When dealing Damage to an opponent, calculate as if they had 1/2 less Defense or Resistance.',
    },
    {
        id: 'deep-bite',
        name: 'Deep Bite',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 20,
            anyWeaponProficiency: ['shifting-stone'],
        },
        chargeCost: {
            base: 2,
        },
        prerequisiteText:
            'Lv 20; Shifting Stone Proficiency',
        chargeText: '2 Charge',
        description:
            'The user doubles all Post-Combat damage they would deal to the opponent after this combat.',
    },
    {
        id: 'subdue',
        name: 'Subdue',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'The user automatically hits and does a Critical Hit. However, the user cannot Follow-Up Attack, and if the attack would bring the opponent’s HP to 0, they are left with 1 HP instead.',
    },
    {
        id: 'dragon-fang',
        name: 'Dragon Fang',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'Add 1/2 of the user’s Attack to the total Damage dealt.',
    },
    {
        id: 'finesse-blade',
        name: 'Finesse Blade',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'Add 1/2 of the user’s Dexterity to the total Damage dealt.',
    },
    {
        id: 'ignis',
        name: 'Ignis',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'Add 1/2 of the user’s Defense to the total Damage dealt.',
    },
    {
        id: 'glacies',
        name: 'Glacies',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'Add 1/2 of the user’s Resistance to the total Damage dealt.',
    },
    {
        id: 'vengeance',
        name: 'Vengeance',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'Add Damage equal to 1/2 of the HP the user is missing to the total Damage dealt.',
    },
    {
        id: 'revitalize',
        name: 'Revitalize',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'When the user heals an ally’s status, all other allies recover status as well.',
    },
    {
        id: 'alert-stance',
        name: 'Alert Stance',
        category: 'combat-art',
        type: 'action',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '3 Charge',
        description:
            'Until the beginning of the user’s next turn, the user is treated as though they have 5 higher Avoid.',
    },
    {
        id: 'triangle-attack',
        name: 'Triangle Attack',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 20,
        },
        chargeCost: {
            base: 0,
        },
        prerequisiteText: 'Lv 20',
        chargeText: '0 Charge',
        description:
            'The user’s next attack automatically hits and Critical Hits, but cannot perform a Follow-Up Attack. This skill can only be used when two other allies with Triangle Attack are each in a Cardinal Direction of the target, are all of equal distance from the target, and are all no further than 2 spaces away from the target.',
    },
    {
        id: 'dark-spikes',
        name: 'Dark Spikes',
        category: 'combat-art',
        type: 'action',
        requirements: {
            level: 25,
            anyOf: [
                { skill: 'monstrous' },
                { weaponProficiency: 'curse' },
            ],
        },
        chargeCost: {
            base: 4,
        },
        prerequisiteText:
            'Lv 25; User has Monstrous or Curse Proficiency',
        chargeText: '4 Charge',
        description:
            'Each opponent within 2 spaces takes 10 Damage.',
    },
    {
        id: 'heavenly-light',
        name: 'Heavenly Light',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 25,
        },
        chargeCost: {
            base: 3,
        },
        prerequisiteText: 'Lv 25',
        chargeText: '3 Charge',
        description:
            'When healing an ally with a Staff, all other allies recover 10 HP.',
    },
    {
        id: 'galeforce',
        name: 'Galeforce',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 25,
        },
        chargeCost: {
            base: 4,
        },
        prerequisiteText: 'Lv 25',
        chargeText: '4 Charge',
        description:
            'After the user attacks, refresh the user’s Movement and Actions once per phase.',
    },
    {
        id: 'eclipse',
        name: 'Eclipse',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 25,
        },
        chargeCost: {
            base: 4,
        },
        prerequisiteText: 'Lv 25',
        chargeText: '4 Charge',
        description:
            'When dealing Damage to an opponent, treat it as if they have no Defense or Resistance.',
    },
    {
        id: 'aether',
        name: 'Aether',
        category: 'combat-art',
        type: 'technique',
        requirements: {
            level: 25,
        },
        chargeCost: {
            base: 4,
        },
        prerequisiteText: 'Lv 25',
        chargeText: '4 Charge',
        description:
            'When dealing Damage to an opponent, treat it as if they had 1/2 less Defense or Resistance. Then, the user heals themself 1/2 of the Damage they just dealt.',
    },
    {
        id: 'fire-emblem',
        name: 'Fire Emblem',
        category: 'combat-art',
        type: 'strategy',
        requirements: {
            level: 25,
        },
        chargeCost: {
            base: 4,
        },
        prerequisiteText: 'Lv 25',
        chargeText: '4 Charge',
        description:
            'After combat, this character and all allies gain +2 to all stats until the start of the user’s phase.',
    },
];

export default skills;