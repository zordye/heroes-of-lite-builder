
import { useState } from 'react';
import { skills } from '../../../data/skills';
import { movementTypes } from '../../../data/movementTypes';
import { getSkillEligibility } from '../../../rules/skillEligibility';

import PerformStatSelection from '../PerformStatSelection';

function getSkillByName(name) {
    return skills.find(
        (skill) =>
            skill.name.toLowerCase() === name.toLowerCase()
    );
}

function SkillOption({
    skill,
    selected,
    onSelect,
    disabled = false,
}) {
    return (
        <button
            type="button"
            className={`skill-option ${selected ? 'selected' : ''}`}
            aria-pressed={selected}
            disabled={disabled}
            onClick={onSelect}
        >
            <span className="skill-option-header">
                <strong>{skill.name}</strong>

                <span className="skill-option-type">
                    {skill.type ?? 'Skill'}
                </span>
            </span>

            <span className="skill-option-description">
                {skill.description}
            </span>

            {skill.prerequisiteText && (
                <span className="skill-option-requirements">
                    <strong>Prerequisites:</strong>{' '}
                    {skill.prerequisiteText}
                </span>
            )}
        </button>
    );
}

export default function SkillsStep({
    character,
    updateCharacter,
}) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    const movement = movementTypes.find(
        (type) => type.id === character.movementType
    );

    const movementSkills = (
        movement?.bonusSkills ?? []
    )
        .map(getSkillByName)
        .filter(Boolean);

    const fixedMovementSkill =
        movement?.bonusSkillType === 'fixed'
            ? movementSkills[0]
            : null;

    const selectedMovementSkill =
        fixedMovementSkill?.id ??
        character.skillSlots?.movement ??
        null;

    const selectedLevelOneSkill =
        character.skillSlots?.level1 ?? null;

    // Include the automatically granted movement skill
    // when evaluating eligibility.
    //
    // Exclude the current Level 1 skill so it cannot
    // satisfy prerequisites for its own replacement.

    const candidateCharacter = {
        ...character,

        skillSlots: {
            ...character.skillSlots,
            movement: selectedMovementSkill,
            level1: null,
        },

        personalSkill: null,
    };


    const selectableSkills = skills
        .filter((skill) => {
            // A skill cannot occupy both starting skill slots.
            if (skill.id === selectedMovementSkill) {
                return false;
            }

            // Personal skills only.
            if (category === 'personal') {
                return skill.category === 'personal';
            }

            // Combat Arts only.
            if (category === 'combat-art') {
                return skill.category === 'combat-art';
            }

            // Regular skills include Combat Arts,
            // but exclude Personal skills.
            if (category === 'regular') {
                return skill.category !== 'personal';
            }

            // All eligible skills.
            return true;
        })
        .filter((skill) =>
            getSkillEligibility(
                candidateCharacter,
                skill
            ).eligible
        )
        .filter((skill) =>
            skill.name
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        )
        .sort((a, b) => {
            // Personal skills always appear last.
            const aPersonal = a.category === 'personal';
            const bPersonal = b.category === 'personal';

            if (aPersonal && !bPersonal) return 1;
            if (!aPersonal && bPersonal) return -1;

            // Preserve original order within each group.
            return 0;
        });

    const selectedSkillData = skills.find(
        (skill) =>
            skill.id === selectedLevelOneSkill
    );

    const performSkill = getSkillByName('Perform');

    const hasSelectedPerform =
        selectedLevelOneSkill === performSkill?.id;

    const selectedPerformStats =
        character.performStats ?? [];

    const chooseMovementSkill = (skillId) => {
        updateCharacter((previous) => ({
            ...previous,

            skillSlots: {
                ...previous.skillSlots,
                movement: skillId,
            },
        }));
    };

    const chooseLevelOneSkill = (skillId) => {
        updateCharacter((previous) => ({
            ...previous,

            skillSlots: {
                ...previous.skillSlots,
                level1: skillId,
            },

            personalSkill: null,

            // Clear the Perform choices when replacing
            // Perform with a different Level 1 skill.
            performStats:
                skillId === performSkill?.id
                    ? previous.performStats ?? []
                    : [],
        }));
    };

    const updatePerformStats = (selectedStats) => {
        updateCharacter((previous) => ({
            ...previous,
            performStats: selectedStats,
        }));
    };

    return (
        <section
            className="creation-panel"
            aria-labelledby="skills-title"
        >
            <div className="section-heading">
                <span className="eyebrow">Step 05</span>

                <h2 id="skills-title">Starting skills</h2>

                <p>
                    Choose your movement skill and one level-one
                    skill. Only skills for which your character
                    meets the mechanical prerequisites are shown.
                </p>
            </div>

            {/* MOVEMENT SKILL */}

            <div className="stats-section">
                <div className="stats-section-heading">
                    <div>
                        <h3>Movement skill</h3>

                        <p>
                            {fixedMovementSkill
                                ? 'This skill is automatically granted by your movement type.'
                                : 'Choose one of the skills granted by your movement type.'}
                        </p>
                    </div>
                </div>

                <div className="skill-options-grid">
                    {movementSkills.map((skill) => (
                        <SkillOption
                            key={skill.id}
                            skill={skill}
                            selected={
                                selectedMovementSkill === skill.id
                            }
                            disabled={Boolean(fixedMovementSkill)}
                            onSelect={() =>
                                chooseMovementSkill(skill.id)
                            }
                        />
                    ))}
                </div>

                {movementSkills.length === 0 && (
                    <p className="skill-empty">
                        No movement skills were found for this
                        movement type.
                    </p>
                )}
            </div>

            {/* LEVEL ONE SKILL */}

            <div className="stats-section">
                <div className="stats-section-heading">
                    <div>
                        <h3>Level-one skill</h3>

                        <p>
                            Select one skill that your character
                            qualifies for. Personal skills have
                            background requirements that must be
                            approved by the GM.
                        </p>
                    </div>
                </div>

                {selectedSkillData && (
                    <div className="selected-skill-summary">
                        <span>Currently selected</span>

                        <strong>
                            {selectedSkillData.name}
                        </strong>
                    </div>
                )}

                <div className="skill-filters">
                    <input
                        type="search"
                        value={search}
                        placeholder="Search eligible skills..."
                        aria-label="Search eligible skills"
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />


                    <select
                        value={category}
                        aria-label="Filter skill category"
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >
                        <option value="all">
                            All eligible skills
                        </option>

                        <option value="regular">
                            Regular skills
                        </option>

                        <option value="combat-art">
                            Combat Arts
                        </option>

                        <option value="personal">
                            Personal skills
                        </option>
                    </select>

                </div>

                <div className="skill-options-grid">
                    {selectableSkills.map((skill) => (
                        <SkillOption
                            key={skill.id}
                            skill={skill}
                            selected={
                                selectedLevelOneSkill === skill.id
                            }
                            onSelect={() =>
                                chooseLevelOneSkill(skill.id)
                            }
                        />
                    ))}
                </div>

                {selectableSkills.length === 0 && (
                    <p className="skill-empty">
                        No eligible skills match your current
                        selection.
                    </p>
                )}

                {/* PERFORM STAT SELECTION */}

                {hasSelectedPerform && (

                    <PerformStatSelection
                        character={character}
                        selected={selectedPerformStats}
                        onChange={updatePerformStats}
                    />

                )}
            </div>
        </section>
    );
}
