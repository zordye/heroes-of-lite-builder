
import { combatStats, nonCombatStats } from '../../../data/stats';
import {
    getNormalStatCap,
    getStartingStatPointsRemaining,
    getOutOfCombatPointsRemaining,
    getFate,
    getFinesse,
    getAcrobatics,
    getMight,
    getPower,
    getTri,
    getHit,
    getAvoid,
    getCriticalAvoid,
    getEquippedBaseWeapon,
} from '../../../rules/statCalculations';

const derivedCalculations = {
    fate: getFate,
    finesse: getFinesse,
    acrobatics: getAcrobatics,
};

export default function StatsStep({ character, updateCharacter }) {
    const combatRemaining = getStartingStatPointsRemaining(character);
    const nonCombatRemaining = getOutOfCombatPointsRemaining(character);
    const equippedWeapon = getEquippedBaseWeapon(character);

    const derivedCombatStats = [
        {
            id: 'might',
            name: 'Might',
            value: getMight(character),
            description: 'Might provided by your equipped weapon.',
        },
        {
            id: 'power',
            name: 'Power',
            value: getPower(character),
            description: 'Attack + Might, including relevant weapon effects.',
        },
        {
            id: 'tri',
            name: 'Tri',
            value: getTri(character),
            description: 'One fifth of Power, rounded down.',
        },
        {
            id: 'hit',
            name: 'Hit',
            value: getHit(character),
            description: 'Based on Dexterity and applicable bonuses.',
        },
        {
            id: 'avoid',
            name: 'Avoid',
            value: getAvoid(character),
            description: 'Based on Luck and applicable bonuses.',
        },
        {
            id: 'criticalAvoid',
            name: 'Critical Avoid',
            value: getCriticalAvoid(character),
            description: 'Avoid + 15, before applicable special effects.',
        },
    ];

    const allocatedNonCombatStats = nonCombatStats.filter(
        (stat) => stat.type === 'allocated'
    );

    const derivedNonCombatStats = nonCombatStats.filter(
        (stat) => stat.type === 'derived'
    );

    const changeCombatStat = (stat, amount) => {
        const current = character.combatStats[stat.id]?.base ?? stat.levelOneMinimum;
        const next = current + amount;
        const cap = getNormalStatCap(1, stat.id);

        if (next < stat.levelOneMinimum || next > cap) return;
        if (amount > 0 && combatRemaining < amount) return;

        updateCharacter((previous) => ({
            ...previous,
            combatStats: {
                ...previous.combatStats,
                [stat.id]: {
                    ...previous.combatStats[stat.id],
                    base: next,
                },
            },
        }));
    };

    const changeNonCombatStat = (stat, amount) => {
        const current = character.outOfCombatStats[stat.id] ?? 0;
        const next = current + amount;

        if (next < stat.minimum || next > stat.maximum) return;
        if (amount > 0 && nonCombatRemaining < amount) return;

        updateCharacter((previous) => ({
            ...previous,
            outOfCombatStats: {
                ...previous.outOfCombatStats,
                [stat.id]: next,
            },
        }));
    };

    return (
        <section className="creation-panel" aria-labelledby="stats-title">
            <div className="section-heading">
                <span className="eyebrow">Step 04</span>
                <h2 id="stats-title">Character stats</h2>
                <p>
                    Distribute your starting points. Use the plus and minus
                    buttons to adjust each stat.
                </p>
            </div>

            <div className="stats-section">
                <div className="stats-section-heading">
                    <div>
                        <h3>Combat stats</h3>
                        <p>Starting values are already included.</p>
                    </div>
                    <div className={`stats-points ${combatRemaining === 0 ? 'complete' : ''}`}>
                        <strong>{combatRemaining}</strong>
                        <span>of 12 remaining</span>
                    </div>
                </div>

                <div className="stat-allocation-list">
                    {combatStats.map((stat) => {
                        const current =
                            character.combatStats[stat.id]?.base ?? stat.levelOneMinimum;
                        const cap = getNormalStatCap(1, stat.id);

                        return (
                            <div className="stat-allocation-row" key={stat.id}>
                                <div className="stat-allocation-info">
                                    <strong>{stat.name}</strong>
                                    <small>{stat.description}</small>
                                </div>

                                <div className="stat-allocation-controls">
                                    <button
                                        type="button"
                                        aria-label={`Decrease ${stat.name}`}
                                        disabled={current <= stat.levelOneMinimum}
                                        onClick={() => changeCombatStat(stat, -1)}
                                    >
                                        −
                                    </button>

                                    <span className="stat-current-value">{current}</span>

                                    <button
                                        type="button"
                                        aria-label={`Increase ${stat.name}`}
                                        disabled={current >= cap || combatRemaining <= 0}
                                        onClick={() => changeCombatStat(stat, 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <span className="stat-cap">Max {cap}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="stats-section">
                <div className="stats-section-heading">
                    <div>
                        <h3>Out-of-combat stats</h3>
                        <p>Distribute 6 points, with a maximum of 3 per stat.</p>
                    </div>
                    <div className={`stats-points ${nonCombatRemaining === 0 ? 'complete' : ''}`}>
                        <strong>{nonCombatRemaining}</strong>
                        <span>of 6 remaining</span>
                    </div>
                </div>

                <div className="stat-allocation-list">
                    {allocatedNonCombatStats.map((stat) => {
                        const current = character.outOfCombatStats[stat.id] ?? 0;

                        return (
                            <div className="stat-allocation-row" key={stat.id}>
                                <div className="stat-allocation-info">
                                    <strong>{stat.name}</strong>
                                    <small>{stat.description}</small>
                                </div>

                                <div className="stat-allocation-controls">
                                    <button
                                        type="button"
                                        aria-label={`Decrease ${stat.name}`}
                                        disabled={current <= stat.minimum}
                                        onClick={() => changeNonCombatStat(stat, -1)}
                                    >
                                        −
                                    </button>

                                    <span className="stat-current-value">{current}</span>

                                    <button
                                        type="button"
                                        aria-label={`Increase ${stat.name}`}
                                        disabled={current >= stat.maximum || nonCombatRemaining <= 0}
                                        onClick={() => changeNonCombatStat(stat, 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <span className="stat-cap">Max {stat.maximum}</span>
                            </div>
                        );
                    })}
                </div>
            </div>


            <div className="stats-section">
                <div className="stats-section-heading">
                    <div>
                        <h3>Derived combat stats</h3>
                        <p>
                            Calculated automatically from your allocated stats and
                            equipped weapon.
                        </p>
                    </div>
                </div>

                <div className="equipped-weapon-summary">
                    <span>Equipped weapon</span>
                    <strong>{equippedWeapon?.name ?? 'None'}</strong>
                </div>

                <div className="derived-stat-grid combat-derived-grid">
                    {derivedCombatStats.map((stat) => (
                        <div className="derived-stat-card" key={stat.id}>
                            <strong>{stat.name}</strong>
                            <span>{stat.value}</span>
                            <small>{stat.description}</small>
                        </div>
                    ))}
                </div>
            </div>


            <div className="stats-section">
                <div className="stats-section-heading">
                    <div>
                        <h3>Derived out-of-combat stats</h3>
                        <p>
                            Calculated automatically from Luck, Dexterity, and Speed.
                            These do not consume allocation points.
                        </p>
                    </div>
                </div>

                <div className="derived-stat-grid">
                    {derivedNonCombatStats.map((stat) => {
                        const calculate = derivedCalculations[stat.id];
                        const value = calculate ? calculate(character) : 0;

                        return (
                            <div className="derived-stat-card" key={stat.id}>
                                <strong>{stat.name}</strong>
                                <span>{value}</span>
                                <small>{stat.description}</small>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
