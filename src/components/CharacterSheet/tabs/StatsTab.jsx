
import { useState } from 'react';

import {
    getFinalStat,
    getMaxHp,
    getMight,
    getPower,
    getHit,
    getAvoid,
    getCriticalAvoid,
    getMovement,
    getCon,
    getAid,
    getTri,
    getFate,
    getFinesse,
    getAcrobatics,
    getEquippedWeapon,
    getEquippedBaseWeapon,
} from '../../../rules/statCalculations';

import {
    RALLY_EFFECTS,
    getRallyBonus,
    getEffectiveMight,
    getMatchupHitBonus,
    getMatchupPower,
} from '../../../rules/sheetModifiers';

import { terrainTypes } from '../../../data/terrain';
import { statusEffects } from '../../../data/statusEffects';

const COMBAT_STATS = [
    ['hp', 'HP'],
    ['attack', 'Attack'],
    ['defense', 'Defense'],
    ['dexterity', 'Dexterity'],
    ['speed', 'Speed'],
    ['resistance', 'Resistance'],
    ['luck', 'Luck'],
];

const OOC_STATS = [
    ['strength', 'Strength'],
    ['intellect', 'Intellect'],
    ['perception', 'Perception'],
    ['charisma', 'Charisma'],
];

function StatGrid({ stats }) {
    return (
        <div className="sheet-stat-grid">
            {stats.map(([label, value]) => (
                <div className="sheet-stat" key={label}>
                    <span>{label}</span>
                    <strong>{value ?? '—'}</strong>
                </div>
            ))}
        </div>
    );
}

export default function StatsTab({
    character,
    updateCharacter,
}) {
    const [modifiersOpen, setModifiersOpen] = useState(false);

    // ------------------------------------
    // Combat modifier state
    // ------------------------------------

    const weaponMatchup =
        character.combatModifiers?.weaponMatchup ?? 'neutral';

    const activeRallies =
        character.combatModifiers?.rallies ?? [];

    const effective = Boolean(
        character.situational?.effective
    );

    const setWeaponMatchup = (value) => {
        updateCharacter((previous) => ({
            ...previous,
            combatModifiers: {
                ...previous.combatModifiers,
                weaponMatchup: value,
            },
        }));
    };

    const toggleRally = (rallyId, checked) => {
        updateCharacter((previous) => {
            const current =
                previous.combatModifiers?.rallies ?? [];

            return {
                ...previous,
                combatModifiers: {
                    ...previous.combatModifiers,
                    rallies: checked
                        ? [...new Set([...current, rallyId])]
                        : current.filter((id) => id !== rallyId),
                },
            };
        });
    };

    const updateField = (field, value) => {
        updateCharacter((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const updateSituational = (field, value) => {
        updateCharacter((previous) => ({
            ...previous,
            situational: {
                ...previous.situational,
                [field]: value,
            },
        }));
    };

    const toggleStatus = (statusId, checked) => {
        updateCharacter((previous) => ({
            ...previous,
            statuses: checked
                ? [
                    ...new Set([
                        ...(previous.statuses ?? []),
                        statusId,
                    ]),
                ]
                : (previous.statuses ?? []).filter(
                    (id) => id !== statusId
                ),
        }));
    };

    const selectSupport = (supportId) => {
        updateCharacter((previous) => ({
            ...previous,
            supports: (previous.supports ?? []).map(
                (support) => ({
                    ...support,
                    active:
                        supportId !== '' &&
                        String(support.id) === supportId,
                })
            ),
        }));
    };

    // ------------------------------------
    // Current character information
    // ------------------------------------

    const maxHp = getMaxHp(character);
    const currentHp = character.currentHp ?? maxHp;

    const weapon = getEquippedWeapon(character);
    const baseWeapon = getEquippedBaseWeapon(character);

    const activeSupport = (character.supports ?? []).find(
        (support) => support.active
    );

    const range = baseWeapon?.range
        ? baseWeapon.range.min === baseWeapon.range.max
            ? String(baseWeapon.range.min)
            : `${baseWeapon.range.min}–${baseWeapon.range.max}`
        : '—';

    // ------------------------------------
    // Might, Power, and Tri
    // ------------------------------------

    // Normal Might is kept separate from effective Might.

    const normalMight = getMight(character);

    const might = effective
        ? normalMight * 3
        : normalMight;

    const power = getPower(character);
    const tri = getTri(character);

    const adjustedPower = getMatchupPower(
        power,
        tri,
        weaponMatchup
    );

    const powerDisplay =
        weaponMatchup === 'neutral'
            ? power
            : `${power} (${adjustedPower})`;

    const hit =
        getHit(character) +
        getMatchupHitBonus(weaponMatchup);

    const avoid = getAvoid(character);
    const criticalAvoid = getCriticalAvoid(character);

    const combatStats = COMBAT_STATS.map(
        ([id, label]) => [
            label,
            getFinalStat(character, id),
        ]
    );

    const derivedStats = [
        ['Might', might],
        ['Power', powerDisplay],
        ['Tri', tri],
        ['Hit', hit],
        ['Avoid', avoid],
        ['Critical Avoid', criticalAvoid],
        ['Movement', getMovement(character)],
        ['Con', getCon(character)],
        ['Aid', getAid(character)],
    ];


    // ------------------------------------
    // Out-of-combat stats
    // ------------------------------------

    const outOfCombatStats = OOC_STATS.map(
        ([id, label]) => [
            label,
            character.outOfCombatStats?.[id] ?? 0,
        ]
    );

    const outOfCombatDerived = [
        ['Fate', getFate(character)],
        ['Finesse', getFinesse(character)],
        ['Acrobatics', getAcrobatics(character)],
    ];

    // ------------------------------------
    // Render
    // ------------------------------------

    return (
        <div className="sheet-sections">

            {/* COMBAT STATISTICS */}

            <section className="sheet-panel">
                <div className="sheet-panel-heading">
                    <div>
                        <h2>Combat statistics</h2>

                        <p className="sheet-muted">
                            Current values include applicable
                            character modifiers.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="sheet-secondary-button"
                        onClick={() =>
                            setModifiersOpen((open) => !open)
                        }
                        aria-expanded={modifiersOpen}
                    >
                        Combat Modifiers{' '}
                        {modifiersOpen ? '▲' : '▼'}
                    </button>
                </div>

                {/* COMBAT MODIFIERS */}

                {modifiersOpen && (
                    <div className="sheet-modifiers">
                        <h3>Active combat modifiers</h3>

                        <div className="sheet-control-grid">

                            {/* ACTIVE SUPPORT */}

                            <label className="sheet-field">
                                <span>Active support</span>

                                <select
                                    value={
                                        activeSupport
                                            ? String(activeSupport.id)
                                            : ''
                                    }
                                    onChange={(event) =>
                                        selectSupport(event.target.value)
                                    }
                                >
                                    <option value="">None</option>

                                    {(character.supports ?? []).map(
                                        (support) => (
                                            <option
                                                key={support.id}
                                                value={String(support.id)}
                                            >
                                                {support.characterName ||
                                                    'Unnamed Support'}
                                                {support.rank
                                                    ? ` — ${support.rank}`
                                                    : ''}
                                            </option>
                                        )
                                    )}
                                </select>
                            </label>

                            {/* TERRAIN */}

                            <label className="sheet-field">
                                <span>Terrain</span>

                                <select
                                    value={character.terrain ?? ''}
                                    onChange={(event) =>
                                        updateField(
                                            'terrain',
                                            event.target.value || null
                                        )
                                    }
                                >
                                    <option value="">None</option>

                                    {terrainTypes.map((terrain) => (
                                        <option
                                            key={terrain.id}
                                            value={terrain.id}
                                        >
                                            {terrain.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* WEAPON MATCHUP */}

                            <label className="sheet-field">
                                <span>Weapon matchup</span>

                                <select
                                    value={weaponMatchup}
                                    onChange={(event) =>
                                        setWeaponMatchup(event.target.value)
                                    }
                                >
                                    <option value="neutral">
                                        Neutral
                                    </option>

                                    <option value="advantage">
                                        Advantage
                                    </option>

                                    <option value="disadvantage">
                                        Disadvantage
                                    </option>
                                </select>
                            </label>

                            {/* SITUATIONAL TOGGLES */}

                            <div className="sheet-field">
                                <span>Situational toggles</span>

                                <label className="sheet-check">
                                    <input
                                        type="checkbox"
                                        checked={effective}
                                        onChange={(event) =>
                                            updateSituational(
                                                'effective',
                                                event.target.checked
                                            )
                                        }
                                    />

                                    Effective attack
                                </label>

                                <label className="sheet-check">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(
                                            character.situational?.rescuing
                                        )}
                                        onChange={(event) =>
                                            updateSituational(
                                                'rescuing',
                                                event.target.checked
                                            )
                                        }
                                    />

                                    Rescuing
                                </label>
                            </div>
                        </div>

                        {/* STATUS EFFECTS */}

                        <div className="sheet-statuses">
                            <h4>Status effects</h4>

                            <div className="sheet-status-grid">
                                {statusEffects.map((status) => (
                                    <label
                                        className="sheet-check"
                                        key={status.id}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={(
                                                character.statuses ?? []
                                            ).includes(status.id)}
                                            onChange={(event) =>
                                                toggleStatus(
                                                    status.id,
                                                    event.target.checked
                                                )
                                            }
                                        />

                                        <span>
                                            <strong>{status.name}</strong>

                                            {status.description && (
                                                <small className="sheet-effect-description">
                                                    {status.description}
                                                </small>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* RALLY EFFECTS */}

                        <div className="sheet-statuses">
                            <h4>Rally effects</h4>

                            <p className="sheet-muted">
                                Select the Rally effects currently
                                affecting this character.
                                Multiple effects may be active
                                simultaneously.
                            </p>

                            <div className="sheet-status-grid">
                                {RALLY_EFFECTS.map((rally) => (
                                    <label
                                        className="sheet-check"
                                        key={rally.id}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={activeRallies.includes(
                                                rally.id
                                            )}
                                            onChange={(event) =>
                                                toggleRally(
                                                    rally.id,
                                                    event.target.checked
                                                )
                                            }
                                        />

                                        <span>
                                            <strong>{rally.name}</strong>

                                            <small className="sheet-effect-description">
                                                {rally.description}
                                            </small>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <p className="sheet-muted">
                            Effectiveness triples weapon Might.
                            Advantage and disadvantage adjust
                            Hit by +2 or −2 and apply Tri
                            to Power after Tri is calculated.
                        </p>
                    </div>
                )}

                <StatGrid stats={combatStats} />
            </section>

            {/* COMBAT TRACKING */}

            <section className="sheet-panel">
                <h2>Combat tracking</h2>

                <div className="sheet-control-grid">

                    <label className="sheet-field">
                        <span>
                            Current HP (Maximum {maxHp})
                        </span>

                        <input
                            type="number"
                            min="0"
                            max={maxHp}
                            value={currentHp}
                            onChange={(event) => {
                                const value = Number(
                                    event.target.value
                                );

                                updateField(
                                    'currentHp',
                                    Math.max(
                                        0,
                                        Math.min(maxHp, value || 0)
                                    )
                                );
                            }}
                        />
                    </label>

                    <label className="sheet-field">
                        <span>Charge</span>

                        <input
                            type="number"
                            min="0"
                            value={character.charge ?? 0}
                            onChange={(event) => {
                                const value = Number(
                                    event.target.value
                                );

                                updateField(
                                    'charge',
                                    Math.max(0, value || 0)
                                );
                            }}
                        />
                    </label>

                    <label className="sheet-field">
                        <span>Transformation gauge</span>

                        <input
                            type="number"
                            min="0"
                            max="4"
                            value={
                                character.transformationGauge ?? 0
                            }
                            onChange={(event) => {
                                const value = Number(
                                    event.target.value
                                );

                                updateField(
                                    'transformationGauge',
                                    Math.max(
                                        0,
                                        Math.min(4, value || 0)
                                    )
                                );
                            }}
                        />
                    </label>
                </div>
            </section>

            {/* DERIVED COMBAT STATISTICS */}

            <section className="sheet-panel">
                <h2>Derived combat statistics</h2>

                <StatGrid stats={derivedStats} />
            </section>

            {/* EQUIPPED WEAPON */}

            <section className="sheet-panel">
                <h2>Equipped weapon</h2>

                {weapon ? (
                    <>
                        <div className="sheet-weapon-title">
                            <strong>
                                {weapon.name ||
                                    baseWeapon?.name ||
                                    'Weapon'}
                            </strong>

                            <span>Equipped</span>
                        </div>

                        <StatGrid
                            stats={[
                                ['Might', might],
                                ['Range', range],
                            ]}
                        />

                        <p className="sheet-muted">
                            Innate attributes:{' '}
                            {baseWeapon?.innateAttributes?.length
                                ? baseWeapon.innateAttributes.join(
                                    ', '
                                )
                                : 'None'}
                        </p>

                        <p className="sheet-muted">
                            Equipment changes will be handled
                            on the Inventory tab.
                        </p>
                    </>
                ) : (
                    <p className="sheet-muted">
                        No weapon equipped.
                    </p>
                )}
            </section>

            {/* OUT-OF-COMBAT STATISTICS */}

            <section className="sheet-panel">
                <h2>Out-of-combat statistics</h2>

                <StatGrid stats={outOfCombatStats} />

                <h3 className="sheet-subheading">
                    Derived attributes
                </h3>

                <StatGrid stats={outOfCombatDerived} />
            </section>

        </div>
    );
}
