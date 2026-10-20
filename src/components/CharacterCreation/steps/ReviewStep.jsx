
import { movementTypes } from '../../../data/movementTypes';
import { weaponTypes } from '../../../data/weaponTypes';
import { supportTypes } from '../../../data/supportTypes';
import { skills } from '../../../data/skills';
import { getBaseWeaponById } from '../../../data/baseWeapons';
import { getItemById } from '../../../data/items';

import {
    getFinalStat,
    getMight,
    getPower,
    getTri,
    getHit,
    getAvoid,
    getCriticalAvoid,
    getFate,
    getFinesse,
    getAcrobatics,
    getStartingStatPointsRemaining,
    getOutOfCombatPointsRemaining,
} from '../../../rules/statCalculations';

const combatStatLabels = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    dexterity: 'Dexterity',
    speed: 'Speed',
    resistance: 'Resistance',
    luck: 'Luck',
};

const outOfCombatLabels = {
    strength: 'Strength',
    intellect: 'Intellect',
    perception: 'Perception',
    charisma: 'Charisma',
};

const findEntry = (collection, id) => {
    if (!id) return null;

    return Array.isArray(collection)
        ? collection.find((entry) => entry.id === id) ?? null
        : collection?.[id] ?? null;
};

function ReviewSection({ title, step, onEdit, children }) {
    return (
        <section className="review-section">
            <div className="review-section-header">
                <h3>{title}</h3>

                <button
                    type="button"
                    className="review-edit-button"
                    onClick={() => onEdit(step)}
                >
                    Edit
                </button>
            </div>

            {children}
        </section>
    );
}

function ReviewRow({ label, value }) {
    return (
        <div className="review-row">
            <span>{label}</span>
            <strong>{value ?? '—'}</strong>
        </div>
    );
}

export default function ReviewStep({ character, onEdit }) {
    const info = character.characterInfo ?? {};

    const movement = findEntry(
        movementTypes,
        character.movementType
    );

    const support = findEntry(
        supportTypes,
        character.supportType
    );

    const equippedWeapon = character.weapons?.find(
        (weapon) => weapon.id === character.equippedWeaponId
    );

    const baseWeapon = equippedWeapon
        ? getBaseWeaponById(equippedWeapon.baseWeaponId)
        : null;

    const movementSkill = findEntry(
        skills,
        character.skillSlots?.movement
    );

    const levelOneSkill = findEntry(
        skills,
        character.skillSlots?.level1
    );

    const proficiencyNames = (
        character.weaponProficiencies ?? []
    ).map((id) => findEntry(weaponTypes, id)?.name ?? id);

    const combatRemaining =
        getStartingStatPointsRemaining(character);

    const outOfCombatRemaining =
        getOutOfCombatPointsRemaining(character);

    const derivedCombat = [
        ['Might', getMight(character)],
        ['Power', getPower(character)],
        ['Tri', getTri(character)],
        ['Hit', getHit(character)],
        ['Avoid', getAvoid(character)],
        ['Critical Avoid', getCriticalAvoid(character)],
    ];

    const derivedOutOfCombat = [
        ['Fate', getFate(character)],
        ['Finesse', getFinesse(character)],
        ['Acrobatics', getAcrobatics(character)],
    ];

    const inventory = character.inventory ?? [];

    const range = baseWeapon?.range
        ? baseWeapon.range.min === baseWeapon.range.max
            ? String(baseWeapon.range.min)
            : `${baseWeapon.range.min}–${baseWeapon.range.max}`
        : '—';

    return (
        <section
            className="creation-panel"
            aria-labelledby="review-title"
        >
            <div className="section-heading">
                <span className="eyebrow">Step 07</span>
                <h2 id="review-title">Review your character</h2>
                <p>
                    Check your choices before completing character creation.
                    Use Edit to return to any section.
                </p>
            </div>

            <ReviewSection
                title="Basic information"
                step={0}
                onEdit={onEdit}
            >
                <div className="review-details">
                    <ReviewRow label="Character" value={character.name} />
                    <ReviewRow
                        label="Player"
                        value={character.playerName || '—'}
                    />
                    <ReviewRow
                        label="Character type"
                        value={character.characterType}
                    />
                    <ReviewRow label="Level" value={character.level} />
                    <ReviewRow label="Race" value={info.race || '—'} />
                    <ReviewRow label="Age" value={info.age || '—'} />
                    <ReviewRow
                        label="Pronouns"
                        value={info.pronouns || '—'}
                    />
                    <ReviewRow label="Size" value={character.size} />
                </div>
            </ReviewSection>

            <ReviewSection
                title="Movement and support"
                step={1}
                onEdit={onEdit}
            >
                <div className="review-details">
                    <ReviewRow
                        label="Movement type"
                        value={movement?.name}
                    />
                    <ReviewRow
                        label="Movement"
                        value={movement?.movement}
                    />
                    <ReviewRow
                        label="Base Aid"
                        value={movement?.baseAid}
                    />
                    <ReviewRow
                        label="Support type"
                        value={support?.name}
                    />
                    <ReviewRow
                        label="Movement traits"
                        value={movement?.traits?.join(', ') || 'None'}
                    />
                    {movement?.skillLevelOffset > 0 && (
                        <ReviewRow
                            label="Skill qualification benefit"
                            value={`${movement.skillLevelOffset} levels earlier`}
                        />
                    )}
                </div>
            </ReviewSection>

            <ReviewSection
                title="Weapon proficiency"
                step={2}
                onEdit={onEdit}
            >
                <div className="review-details">
                    <ReviewRow
                        label="Proficiency"
                        value={proficiencyNames.join(', ') || '—'}
                    />
                    <ReviewRow
                        label="Equipped weapon"
                        value={equippedWeapon?.name ?? baseWeapon?.name}
                    />
                    <ReviewRow label="Might" value={getMight(character)} />
                    <ReviewRow label="Range" value={range} />
                    <ReviewRow
                        label="Innate attributes"
                        value={
                            baseWeapon?.innateAttributes?.length
                                ? baseWeapon.innateAttributes.join(', ')
                                : 'None'
                        }
                    />
                </div>
            </ReviewSection>

            <ReviewSection
                title="Combat stats"
                step={3}
                onEdit={onEdit}
            >
                <div className="review-stat-grid">
                    {Object.entries(combatStatLabels).map(([id, label]) => (
                        <div className="review-stat" key={id}>
                            <span>{label}</span>
                            <strong>{getFinalStat(character, id)}</strong>
                        </div>
                    ))}
                </div>

                <div className="review-subheading">
                    <h4>Derived combat stats</h4>
                </div>

                <div className="review-stat-grid">
                    {derivedCombat.map(([label, value]) => (
                        <div className="review-stat" key={label}>
                            <span>{label}</span>
                            <strong>{value}</strong>
                        </div>
                    ))}
                </div>

                <p className="review-allocation-note">
                    Combat points remaining: {combatRemaining}
                </p>
            </ReviewSection>

            <ReviewSection
                title="Out-of-combat stats"
                step={3}
                onEdit={onEdit}
            >
                <div className="review-stat-grid">
                    {Object.entries(outOfCombatLabels).map(([id, label]) => (
                        <div className="review-stat" key={id}>
                            <span>{label}</span>
                            <strong>
                                {character.outOfCombatStats?.[id] ?? 0}
                            </strong>
                        </div>
                    ))}
                </div>

                <div className="review-subheading">
                    <h4>Derived out-of-combat stats</h4>
                </div>

                <div className="review-stat-grid">
                    {derivedOutOfCombat.map(([label, value]) => (
                        <div className="review-stat" key={label}>
                            <span>{label}</span>
                            <strong>{value}</strong>
                        </div>
                    ))}
                </div>

                <p className="review-allocation-note">
                    Out-of-combat points remaining: {outOfCombatRemaining}
                </p>
            </ReviewSection>

            <ReviewSection
                title="Starting skills"
                step={4}
                onEdit={onEdit}
            >
                <div className="review-skill-list">
                    <div>
                        <span>Movement skill</span>
                        <strong>{movementSkill?.name ?? 'Not selected'}</strong>
                        {movementSkill?.description && (
                            <p>{movementSkill.description}</p>
                        )}
                    </div>

                    <div>
                        <span>Level-one skill</span>
                        <strong>{levelOneSkill?.name ?? 'Not selected'}</strong>
                        {levelOneSkill?.description && (
                            <p>{levelOneSkill.description}</p>
                        )}
                    </div>
                </div>
            </ReviewSection>

            <ReviewSection
                title="Starting resources"
                step={5}
                onEdit={onEdit}
            >
                <div className="review-details">
                    <ReviewRow
                        label="Gold"
                        value={Number(character.gold ?? 0).toLocaleString()}
                    />

                    {inventory.map((entry, index) => {
                        const item = getItemById(entry.itemId);

                        return (
                            <ReviewRow
                                key={entry.id ?? `${entry.itemId}-${index}`}
                                label={item?.name ?? entry.itemId}
                                value={
                                    entry.usesRemaining != null
                                        ? `${entry.usesRemaining} uses`
                                        : 'In inventory'
                                }
                            />
                        );
                    })}

                    <ReviewRow
                        label="Starting weapon"
                        value={equippedWeapon?.name ?? '—'}
                    />
                </div>
            </ReviewSection>
        </section>
    );
}
