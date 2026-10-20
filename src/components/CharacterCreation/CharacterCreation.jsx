
import { useState, useEffect } from 'react';

import createCharacter from '../../models/createCharacter';

import {
  getStartingStatPointsRemaining,
  getOutOfCombatPointsRemaining,
} from '../../rules/statCalculations';

import { clearIneligibleSelectedSkills } from '../../rules/skillEligibility';

import { movementTypes } from '../../data/movementTypes';
import { skills } from '../../data/skills';
import { createInventoryItem } from '../../data/items';

import BasicInfoStep from './steps/BasicInfoStep';
import MovementStep from './steps/MovementStep';
import WeaponStep from './steps/WeaponStep';
import StatsStep from './steps/StatsStep';
import SkillsStep from './steps/SkillsStep';
import ResourcesStep from './steps/ResourcesStep';
import ReviewStep from './steps/ReviewStep';

import './CharacterCreation.css';

const STEPS = [
  { id: 'basic', label: 'Basic information' },
  { id: 'movement', label: 'Movement type' },
  { id: 'weapon', label: 'Weapon proficiency' },
  { id: 'stats', label: 'Stats' },
  { id: 'skills', label: 'Skills' },
  { id: 'resources', label: 'Starting resources' },
  { id: 'review', label: 'Review' },
];

const LAST_AVAILABLE_STEP = 6;

const nextLabels = [
  'Continue to movement →',
  'Continue to weapons →',
  'Continue to stats →',
  'Continue to skills →',
  'Continue to resources →',
  'Continue to review →',
];

export default function CharacterCreation() {
  // --------------------------------------------------
  // Character state
  // --------------------------------------------------

  const [character, setCharacterState] = useState(createCharacter);

  // Validate selected skills whenever the character changes.
  // This prevents characters from retaining skills whose
  // prerequisites are no longer satisfied.
  const setCharacter = (update) => {
    setCharacterState((previous) => {
      const next =
        typeof update === 'function'
          ? update(previous)
          : update;

      return clearIneligibleSelectedSkills(next);
    });
  };

  // --------------------------------------------------
  // Creation navigation state
  // --------------------------------------------------

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  // Scroll to the top whenever the creation step changes.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [stepIndex, completed]);

  // --------------------------------------------------
  // Navigation: Next
  // --------------------------------------------------

  const goNext = () => {
    // Step 1: Basic information
    if (stepIndex === 0) {
      if (!character.name?.trim()) {
        setError('Please enter a character name to continue.');
        return;
      }
    }

    // Step 2: Movement type
    if (stepIndex === 1) {
      if (!character.movementType) {
        setError('Please choose a movement type.');
        return;
      }

      if (!character.supportType) {
        setError('Please choose a support type.');
        return;
      }
    }

    // Step 3: Weapon proficiency
    if (stepIndex === 2) {
      if (
        !character.weaponProficiencies?.length ||
        !character.equippedWeaponId
      ) {
        setError('Please choose a starting weapon proficiency.');
        return;
      }
    }

    // Step 4: Stats
    if (stepIndex === 3) {
      if (getStartingStatPointsRemaining(character) !== 0) {
        setError('Please allocate all 12 combat stat points.');
        return;
      }

      if (getOutOfCombatPointsRemaining(character) !== 0) {
        setError('Please allocate all 6 out-of-combat stat points.');
        return;
      }
    }

    // Step 5: Skills
    if (stepIndex === 4) {
      const movement = movementTypes.find(
        (type) => type.id === character.movementType
      );

      // Fixed movement skills, such as Canter, must be
      // recorded in the character's movement skill slot.
      const fixedMovementSkillId =
        movement?.bonusSkillType === 'fixed'
          ? skills.find(
            (skill) =>
              skill.name.toLowerCase() ===
              movement.bonusSkills?.[0]?.toLowerCase()
          )?.id
          : null;

      const movementSkillId =
        fixedMovementSkillId ??
        character.skillSlots?.movement;

      if (!movementSkillId) {
        setError('Please choose your starting movement skill.');
        return;
      }

      if (!character.skillSlots?.level1) {
        setError('Please choose your level-one skill.');
        return;
      }

      // Grant starting resources once.
      // Navigating backward and forward must not
      // duplicate the starting Herb or reset Gold.
      setCharacter((previous) => {
        const hasStartingHerb = previous.inventory?.some(
          (item) => item.id === 'starting-herb'
        );

        const startingHerb = createInventoryItem(
          'herb',
          'starting-herb'
        );

        return {
          ...previous,

          gold: hasStartingHerb
            ? previous.gold
            : 1000,

          inventory:
            hasStartingHerb || !startingHerb
              ? previous.inventory ?? []
              : [
                ...(previous.inventory ?? []),
                startingHerb,
              ],

          skillSlots: {
            ...previous.skillSlots,
            movement: movementSkillId,
          },
        };
      });
    }

    setError('');

    if (stepIndex < LAST_AVAILABLE_STEP) {
      setStepIndex((current) => current + 1);
    }
  };

  // --------------------------------------------------
  // Navigation: Back
  // --------------------------------------------------

  const goBack = () => {
    setError('');

    setStepIndex((current) =>
      Math.max(0, current - 1)
    );
  };

  // --------------------------------------------------
  // Navigation: Edit from Review
  // --------------------------------------------------

  const goToStep = (index) => {
    if (
      index < 0 ||
      index > LAST_AVAILABLE_STEP
    ) {
      return;
    }

    setError('');
    setStepIndex(index);
  };

  // --------------------------------------------------
  // Reset character creation
  // --------------------------------------------------

  const resetCharacter = () => {
    if (
      !window.confirm(
        'Start over? Your current character entries will be cleared.'
      )
    ) {
      return;
    }

    setCharacter(createCharacter());
    setStepIndex(0);
    setError('');
    setCompleted(false);
  };

  // --------------------------------------------------
  // Finish character creation
  // --------------------------------------------------

  const finishCharacter = () => {
    // Basic information
    if (!character.name?.trim()) {
      setError('A character name is required.');
      return;
    }

    // Movement and support
    if (
      !character.movementType ||
      !character.supportType
    ) {
      setError(
        'Movement and support type must be selected.'
      );
      return;
    }

    // Weapon proficiency and starting weapon
    if (
      !character.weaponProficiencies?.length ||
      !character.equippedWeaponId
    ) {
      setError('A starting weapon is required.');
      return;
    }

    // Stat allocation
    if (
      getStartingStatPointsRemaining(character) !== 0 ||
      getOutOfCombatPointsRemaining(character) !== 0
    ) {
      setError(
        'All starting stat points must be allocated.'
      );
      return;
    }

    // Starting skills
    if (
      !character.skillSlots?.movement ||
      !character.skillSlots?.level1
    ) {
      setError(
        'Both starting skill slots must be filled.'
      );
      return;
    }

    // Starting resources
    const hasStartingHerb =
      character.inventory?.some(
        (item) => item.id === 'starting-herb'
      );

    if (!hasStartingHerb) {
      setError(
        'Starting resources are incomplete.'
      );
      return;
    }

    // Character creation is complete.
    // Permanent saving will be implemented later.
    setError('');
    setCompleted(true);
  };

  // --------------------------------------------------
  // Render the current creation step
  // --------------------------------------------------

  const renderStep = () => {
    const props = {
      character,
      updateCharacter: setCharacter,
    };

    switch (stepIndex) {
      case 0:
        return <BasicInfoStep {...props} />;

      case 1:
        return <MovementStep {...props} />;

      case 2:
        return <WeaponStep {...props} />;

      case 3:
        return <StatsStep {...props} />;

      case 4:
        return <SkillsStep {...props} />;

      case 5:
        return <ResourcesStep {...props} />;

      case 6:
        return (
          <ReviewStep
            character={character}
            onEdit={goToStep}
          />
        );

      default:
        return null;
    }
  };

  // --------------------------------------------------
  // Completion screen
  // --------------------------------------------------

  if (completed) {
    return (
      <main className="creation-page">
        <div className="creation-complete">
          <span className="eyebrow">
            Heroes of Lite
          </span>

          <h1>Character created!</h1>

          <p>
            <strong>{character.name}</strong> has
            completed the character creation process.
          </p>

          <p>
            Your character is currently stored in the
            application's React state. Permanent saving
            and the character sheet will be added next.
          </p>

          <div className="creation-complete-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setCompleted(false);
                setStepIndex(6);
                setError('');
              }}
            >
              Return to review
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setCharacter(createCharacter());
                setStepIndex(0);
                setError('');
                setCompleted(false);
              }}
            >
              Create another character
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Main character creation interface
  // --------------------------------------------------

  return (
    <main className="creation-page">
      <header className="creation-header">
        <div>
          <span className="eyebrow">
            Heroes of Lite
          </span>

          <h1>Character creator</h1>

          <p>
            Build a character using the Heroes of Lite rules.
          </p>
        </div>

        <button
          type="button"
          className="reset-button"
          onClick={resetCharacter}
        >
          Start over
        </button>
      </header>

      <div className="creation-layout">
        {/* Step navigation */}
        <nav
          className="step-nav"
          aria-label="Character creation steps"
        >
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`step-link ${index === stepIndex ? 'current' : ''
                } ${index > LAST_AVAILABLE_STEP
                  ? 'upcoming'
                  : ''
                }`}
              aria-current={
                index === stepIndex
                  ? 'step'
                  : undefined
              }
            >
              <span className="step-number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span>{step.label}</span>

              {index > LAST_AVAILABLE_STEP && (
                <small>Coming next</small>
              )}
            </div>
          ))}
        </nav>

        {/* Active step */}
        <div className="creation-content">
          {renderStep()}

          {/* Validation errors */}
          {error && (
            <p
              className="creation-error"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Navigation buttons */}
          <footer className="creation-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Back
            </button>

            {stepIndex < LAST_AVAILABLE_STEP ? (
              <button
                type="button"
                className="primary-button"
                onClick={goNext}
              >
                {nextLabels[stepIndex]}
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={finishCharacter}
              >
                Finish character creation
              </button>
            )}
          </footer>
        </div>
      </div>
    </main>
  );
}
