import { weaponTypes } from '../../../data/weaponTypes';
import { getStartingBaseWeaponForType } from '../../../data/baseWeapons';

const STARTER_ID = 'starting-weapon';

export default function WeaponStep({ character, updateCharacter }) {
    const selectedType = character.weaponProficiencies?.[0] ?? null;
    const starter = selectedType ? getStartingBaseWeaponForType(selectedType) : null;

    const chooseWeaponType = (typeId) => {
        const base = getStartingBaseWeaponForType(typeId);
        if (!base) return;
        updateCharacter((previous) => {
            const otherWeapons = (previous.weapons ?? []).filter((weapon) => weapon.id !== STARTER_ID);
            const oldStarterEquipped = previous.equippedWeaponId === STARTER_ID;
            return {
                ...previous,
                weaponProficiencies: [typeId],
                weapons: [
                    ...otherWeapons,
                    { id: STARTER_ID, name: base.name, baseWeaponId: base.id, refinements: [] },
                ],
                equippedWeaponId: !previous.equippedWeaponId || oldStarterEquipped
                    ? STARTER_ID
                    : previous.equippedWeaponId,
            };
        });
    };

    return (
        <section className="creation-panel" aria-labelledby="weapon-title">
            <div className="section-heading">
                <span className="eyebrow">Step 03</span>
                <h2 id="weapon-title">Starting weapon proficiency</h2>
                <p>Choose one weapon type. Your character receives its basic weapon, equipped automatically. You can customize weapons later.</p>
            </div>

            <div className="weapon-type-grid" role="group" aria-label="Starting weapon proficiency">
                {weaponTypes.map((type) => {
                    const base = getStartingBaseWeaponForType(type.id);
                    const selected = selectedType === type.id;
                    return (
                        <button
                            key={type.id}
                            type="button"
                            className={`weapon-type-card ${selected ? 'selected' : ''}`}
                            aria-pressed={selected}
                            onClick={() => chooseWeaponType(type.id)}
                        >
                            <strong>{type.name}</strong>

                            <span>{base?.name ?? 'No starting weapon'}</span>


                            {base && (
                                <>
                                    <span className="weapon-card-stats">
                                        <span>
                                            <small>Might</small>
                                            <strong>{base.might}</strong>
                                        </span>

                                        <span>
                                            <small>Range</small>
                                            <strong>
                                                {base.range.min === base.range.max
                                                    ? base.range.min
                                                    : `${base.range.min}–${base.range.max}`}
                                            </strong>
                                        </span>
                                    </span>

                                    <span className="weapon-card-attributes">
                                        <small>Innate Attributes</small>

                                        <span className="weapon-attribute-list">
                                            {base.innateAttributes?.length > 0 ? (
                                                base.innateAttributes.map((attribute) => (
                                                    <span key={attribute} className="weapon-attribute">
                                                        {attribute
                                                            .split(/[-_]/)
                                                            .map((word) =>
                                                                word.charAt(0).toUpperCase() + word.slice(1)
                                                            )
                                                            .join(' ')}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="weapon-no-attributes">None</span>
                                            )}
                                        </span>
                                    </span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {starter && (
                <div className="weapon-selection-summary" aria-live="polite">
                    <h3>Starting equipment: {starter.name}</h3>
                    <div className="weapon-summary-stats">
                        <span><strong>{starter.might}</strong> Might</span>
                        <span><strong>{starter.range.min === starter.range.max ? starter.range.min : `${starter.range.min}–${starter.range.max}`}</strong> Range</span>
                        <span><strong>{starter.innateAttributes?.length ? starter.innateAttributes.join(', ') : 'None'}</strong> Innate attributes</span>
                    </div>
                    <p>This weapon is added to your carried weapons and equipped. Choosing another proficiency replaces this starting weapon.</p>
                </div>
            )}
        </section>
    );
}
