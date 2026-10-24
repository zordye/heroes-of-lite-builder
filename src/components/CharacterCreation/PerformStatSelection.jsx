
import {
    PERFORM_STATS,
    validPerformSelection,
} from '../../rules/sheetModifiers';

import {
    getFinalStat,
} from '../../rules/statCalculations';

const COMBAT_STATS = [
    { id: 'hp', name: 'HP' },
    ...PERFORM_STATS,
];

export default function PerformStatSelection({
    character,
    selected = [],
    onChange,
}) {
    const selectedStats = Array.isArray(selected)
        ? selected
        : [];

    const isComplete = validPerformSelection(
        selectedStats
    );

    const toggleStat = (statId) => {
        if (selectedStats.includes(statId)) {
            onChange(
                selectedStats.filter((id) => id !== statId)
            );
            return;
        }

        if (selectedStats.length >= 4) {
            return;
        }

        onChange([...selectedStats, statId]);
    };

    // Calculate stats without Perform's penalties.
    // This preserves all other bonuses and modifiers.
    const characterWithoutPerform = character
        ? {
            ...character,
            skillSlots: Object.fromEntries(
                Object.entries(character.skillSlots ?? {}).map(
                    ([slot, skillId]) => [
                        slot,
                        skillId === 'perform' ? null : skillId,
                    ]
                )
            ),
            additionalSkills: (
                character.additionalSkills ?? []
            ).filter(
                (skill) =>
                    skill !== 'perform' &&
                    skill?.id !== 'perform'
            ),
        }
        : null;

    const stats = COMBAT_STATS.map((stat) => {
        const current = character
            ? getFinalStat(character, stat.id)
            : 0;

        const original = characterWithoutPerform
            ? getFinalStat(
                characterWithoutPerform,
                stat.id
            )
            : current;

        return {
            ...stat,
            current,
            original,
            reduced: current < original,
        };
    });

    return (
        <div className="perform-selection">
            <h4>Perform — Permanent stat reductions</h4>

            <p>
                Learning Perform permanently reduces HP by 3
                and four different combat stats by 2 each.
                Select the four stats you wish to reduce.
            </p>

            {/* COMPACT STAT PREVIEW */}

            <div className="perform-stat-preview">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className={`perform-preview-box ${stat.reduced ? 'reduced' : ''
                            }`}
                    >
                        <span className="perform-preview-label">
                            {stat.name}
                        </span>

                        <strong className="perform-preview-value">
                            {stat.current}
                        </strong>

                        {stat.reduced && (
                            <small className="perform-preview-change">
                                {stat.original} → {stat.current}
                            </small>
                        )}
                    </div>
                ))}
            </div>

            {/* STAT SELECTION */}

            <div className="perform-selection-heading">
                <strong>Choose four stats</strong>

                <span>
                    {selectedStats.length} / 4 selected
                </span>
            </div>

            <div className="perform-stat-options">
                {PERFORM_STATS.map((stat) => {
                    const checked = selectedStats.includes(
                        stat.id
                    );

                    return (
                        <label
                            key={stat.id}
                            className="perform-stat-option"
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                disabled={
                                    !checked &&
                                    selectedStats.length >= 4
                                }
                                onChange={() =>
                                    toggleStat(stat.id)
                                }
                            />

                            <span>
                                {stat.name} (−2)
                            </span>
                        </label>
                    );
                })}
            </div>

            {!isComplete && (
                <p className="perform-selection-warning">
                    Select exactly four different stats.
                </p>
            )}

            {isComplete && (
                <p className="perform-selection-success">
                    All four stat reductions selected.
                </p>
            )}
        </div>
    );
}
