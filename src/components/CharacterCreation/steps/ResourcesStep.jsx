
import { getItemById } from '../../../data/items';
import { getBaseWeaponById } from '../../../data/baseWeapons';

export default function ResourcesStep({ character }) {
    const equippedWeapon = character.weapons?.find(
        (weapon) => weapon.id === character.equippedWeaponId
    );

    const startingWeapon = character.weapons?.find(
        (weapon) => weapon.id === 'starting-weapon'
    );

    const startingBase = startingWeapon
        ? getBaseWeaponById(startingWeapon.baseWeaponId)
        : null;

    const herb = getItemById('herb');

    const startingHerb = character.inventory?.find(
        (item) => item.id === 'starting-herb'
    );

    const range = startingBase?.range
        ? startingBase.range.min === startingBase.range.max
            ? `${startingBase.range.min}`
            : `${startingBase.range.min}–${startingBase.range.max}`
        : '—';

    return (
        <section
            className="creation-panel"
            aria-labelledby="resources-title"
        >
            <div className="section-heading">
                <span className="eyebrow">Step 06</span>
                <h2 id="resources-title">Starting resources</h2>
                <p>
                    Every new character receives starting Gold,
                    a healing item, and the basic weapon associated
                    with their chosen proficiency.
                </p>
            </div>

            <div className="resource-grid">
                <div className="resource-card">
                    <span className="resource-label">Starting Gold</span>
                    <strong className="resource-value">
                        {character.gold.toLocaleString()}
                    </strong>
                    <span className="resource-unit">Gold</span>
                    <p>
                        Your starting funds. You can manage Gold
                        and track transactions on your character sheet.
                    </p>
                </div>

                <div className="resource-card">
                    <span className="resource-label">Starting Item</span>
                    <strong className="resource-value resource-item-name">
                        {herb?.name ?? 'Herb'}
                    </strong>
                    <span className="resource-unit">
                        {startingHerb?.usesRemaining ?? 0} uses
                    </span>
                    <p>{herb?.description}</p>
                </div>
            </div>

            <div className="stats-section">
                <div className="stats-section-heading">
                    <div>
                        <h3>Starting weapon</h3>
                        <p>
                            Your selected weapon has already been added
                            to your carried weapons.
                        </p>
                    </div>
                </div>

                {startingWeapon && startingBase ? (
                    <div className="starting-weapon-card">
                        <div className="starting-weapon-heading">
                            <div>
                                <span className="resource-label">Weapon</span>
                                <h4>{startingWeapon.name}</h4>
                            </div>

                            {equippedWeapon?.id === startingWeapon.id && (
                                <span className="starting-equipped">
                                    Equipped
                                </span>
                            )}
                        </div>

                        <div className="starting-weapon-stats">
                            <div>
                                <span>Might</span>
                                <strong>{startingBase.might}</strong>
                            </div>

                            <div>
                                <span>Range</span>
                                <strong>{range}</strong>
                            </div>
                        </div>

                        <div className="starting-weapon-attributes">
                            <span className="resource-label">
                                Innate attributes
                            </span>

                            <div className="weapon-attribute-list">
                                {startingBase.innateAttributes?.length ? (
                                    startingBase.innateAttributes.map((attribute) => (
                                        <span
                                            key={attribute}
                                            className="weapon-attribute"
                                        >
                                            {attribute
                                                .split(/[-_]/)
                                                .map(
                                                    (word) =>
                                                        word.charAt(0).toUpperCase() +
                                                        word.slice(1)
                                                )
                                                .join(' ')}
                                        </span>
                                    ))
                                ) : (
                                    <span className="weapon-no-attributes">
                                        None
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="skill-empty">
                        No starting weapon has been selected.
                        Return to Weapon Proficiency to choose one.
                    </p>
                )}
            </div>

            <div className="stats-section">
                <h3>Starting inventory summary</h3>

                <div className="resource-summary-list">
                    <div>
                        <span>Gold</span>
                        <strong>{character.gold.toLocaleString()}</strong>
                    </div>

                    <div>
                        <span>Herb</span>
                        <strong>
                            {startingHerb?.usesRemaining ?? 0} uses
                        </strong>
                    </div>

                    <div>
                        <span>Weapon</span>
                        <strong>{startingWeapon?.name ?? 'None'}</strong>
                    </div>

                    <div>
                        <span>Starting proficiency</span>
                        <strong>
                            {character.weaponProficiencies?.[0] ?? 'None'}
                        </strong>
                    </div>
                </div>

                <p className="resource-note">
                    These resources are granted automatically.
                    Item use, Gold spending, and equipment changes
                    will be managed manually on the character sheet.
                </p>
            </div>
        </section>
    );
}
