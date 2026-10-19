
import { movementTypes } from '../../../data/movementTypes';
import { supportTypes } from '../../../data/supportTypes';

export default function MovementStep({ character, updateCharacter }) {
  const selectedMovement = movementTypes.find(
    (movement) => movement.id === character.movementType
  );

  const chooseMovement = (movement) => {
    updateCharacter((previous) => ({
      ...previous,
      movementType: movement.id,
      supportType: movement.supportTypeChoice
        ? null
        : movement.supportType,
      skillSlots: {
        ...previous.skillSlots,
        movement: null,
      },
    }));
  };

  return (
    <section className="creation-panel" aria-labelledby="movement-title">
      <div className="section-heading">
        <span className="eyebrow">Step 02</span>
        <h2 id="movement-title">Movement type</h2>
        <p>
          Movement type affects mobility, terrain, traits,
          support type, and starting skills.
        </p>
      </div>

      <div className="movement-grid" role="group" aria-label="Movement type">
        {movementTypes.map((movement) => (
          <button
            type="button"
            key={movement.id}
            className={`movement-card ${
              character.movementType === movement.id ? 'selected' : ''
            }`}
            aria-pressed={character.movementType === movement.id}
            onClick={() => chooseMovement(movement)}
          >
            <span className="movement-card-top">
              <strong>{movement.name}</strong>
              <span className="movement-value">
                Move {movement.movement}
              </span>
            </span>

            <span className="movement-description">
              {movement.description}
            </span>

            <span className="movement-stat-list">
              <span>
                <span>Rough terrain</span>
                <strong>{movement.roughTerrainCost} / space</strong>
              </span>

              <span>
                <span>Difficult terrain</span>
                <strong>
                  {movement.canTraverseDifficultTerrain
                    ? 'Can traverse'
                    : 'Cannot traverse'}
                </strong>
              </span>

              <span>
                <span>Base Aid</span>
                <strong>{movement.baseAid}</strong>
              </span>

              <span>
                <span>Trait</span>
                <strong>
                  {movement.traits.length
                    ? movement.traits.join(', ')
                    : 'None'}
                </strong>
              </span>

              {movement.skillLevelOffset > 0 && (
                <span>
                  <span>Skill level requirement</span>
                  <strong>-{movement.skillLevelOffset}</strong>
                </span>
              )}

              {movement.ignoresTerrainBonuses &&
                movement.ignoresTerrainPenalties && (
                  <span>
                    <span>Terrain effects</span>
                    <strong>Ignored (except HP)</strong>
                  </span>
                )}
            </span>
          </button>
        ))}
      </div>

      {selectedMovement && (
        <div className="movement-extra">
          <h3>{selectedMovement.name} details</h3>

          <p>
            Starting movement skill:{' '}
            <strong>{selectedMovement.bonusSkills.join(' / ')}</strong>
          </p>

          {selectedMovement.supportTypeChoice ? (
            <label className="field support-field">
              <span>
                Choose support type <span className="required">*</span>
              </span>
              <select
                value={character.supportType ?? ''}
                onChange={(event) =>
                  updateCharacter((previous) => ({
                    ...previous,
                    supportType: event.target.value || null,
                  }))
                }
              >
                <option value="">Select support type</option>
                {supportTypes.map((support) => (
                  <option key={support.id} value={support.id}>
                    {support.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p>
              Support type:{' '}
              <strong>
                {supportTypes.find(
                  (support) => support.id === character.supportType
                )?.name ?? '—'}
              </strong>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
