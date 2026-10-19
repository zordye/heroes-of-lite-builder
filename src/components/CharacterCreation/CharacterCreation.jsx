
import { useState } from 'react';
import createCharacter from '../../models/createCharacter';
import {
  getStartingStatPointsRemaining,
  getOutOfCombatPointsRemaining,
} from '../../rules/statCalculations';

import BasicInfoStep from './steps/BasicInfoStep';
import MovementStep from './steps/MovementStep';
import WeaponStep from './steps/WeaponStep';
import StatsStep from './steps/StatsStep';
import SkillsStep from './steps/SkillsStep';
import { movementTypes } from '../../data/movementTypes';
import { skills } from '../../data/skills';

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

const LAST_AVAILABLE_STEP = 4;

export default function CharacterCreation() {
  const [character, setCharacter] = useState(createCharacter);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');

  const goNext = () => {
    if (stepIndex === 0 && !character.name.trim()) {
      setError('Please enter a character name to continue.');
      return;
    }

    if (stepIndex === 1 && !character.movementType) {
      setError('Please choose a movement type.');
      return;
    }

    if (stepIndex === 1 && !character.supportType) {
      setError('Please choose a support type.');
      return;
    }

    if (
      stepIndex === 2 &&
      (!character.weaponProficiencies?.length ||
        !character.equippedWeaponId)
    ) {
      setError('Please choose a starting weapon proficiency.');
      return;
    }

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


    if (stepIndex === 4) {
      const movement = movementTypes.find(
        (type) => type.id === character.movementType
      );

      const movementSkillId =
        movement?.bonusSkillType === 'fixed'
          ? skills.find(
            (skill) =>
              skill.name.toLowerCase() ===
              movement.bonusSkills[0]?.toLowerCase()
          )?.id
          : character.skillSlots?.movement;

      if (!movementSkillId) {
        setError('Please choose your starting movement skill.');
        return;
      }

      if (!character.skillSlots?.level1) {
        setError('Please choose your level-one skill.');
        return;
      }

      // Ensure automatically granted skills are actually stored.
      if (
        movement?.bonusSkillType === 'fixed' &&
        character.skillSlots?.movement !== movementSkillId
      ) {
        setCharacter((previous) => ({
          ...previous,
          skillSlots: {
            ...previous.skillSlots,
            movement: movementSkillId,
          },
        }));
      }
    }


    setError('');

    if (stepIndex < LAST_AVAILABLE_STEP) {
      setStepIndex((current) => current + 1);
    }
  };

  const goBack = () => {
    setError('');
    setStepIndex((current) => Math.max(0, current - 1));
  };

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
  };

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
      default:
        return null;
    }
  };

  const nextLabels = [
    'Continue to movement →',
    'Continue to weapons →',
    'Continue to stats →',
    'Continue to skills →',
  ];

  return (
    <main className="creation-page">
      <header className="creation-header">
        <div>
          <span className="eyebrow">Heroes of Lite</span>
          <h1>Character creator</h1>
          <p>Build a character using the Heroes of Lite rules.</p>
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
        <nav className="step-nav" aria-label="Character creation steps">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`step-link ${index === stepIndex ? 'current' : ''
                } ${index > LAST_AVAILABLE_STEP ? 'upcoming' : ''}`}
              aria-current={index === stepIndex ? 'step' : undefined}
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

        <div className="creation-content">
          {renderStep()}

          {error && (
            <p className="creation-error" role="alert">
              {error}
            </p>
          )}

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
              <p className="next-note">
                Next: Skills — coming in the next step.
              </p>
            )}
          </footer>
        </div>
      </div>
    </main>
  );
}
