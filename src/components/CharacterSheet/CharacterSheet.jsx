
import { useState } from 'react';
import StatsTab from './tabs/StatsTab';
import './CharacterSheet.css';

const TABS = [
    { id: 'stats', label: 'Stats' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'skills', label: 'Skills' },
    { id: 'supports', label: 'Supports' },
    { id: 'info', label: 'Character Info' },
];

export default function CharacterSheet({ character: initialCharacter }) {
    const [character, setCharacter] = useState(initialCharacter);
    const [activeTab, setActiveTab] = useState('stats');

    const updateCharacter = (update) => {
        setCharacter((previous) =>
            typeof update === 'function' ? update(previous) : update
        );
    };

    return (
        <main className="sheet-page">
            <header className="sheet-header">
                <div>
                    <span className="eyebrow">Heroes of Lite</span>
                    <h1>{character.name || 'Unnamed Character'}</h1>
                    <p>
                        Level {character.level} ·{' '}
                        {character.movementType || 'No movement type'}
                    </p>
                </div>
            </header>

            <nav className="sheet-tabs" aria-label="Character sheet tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`sheet-tab ${activeTab === tab.id ? 'active' : ''
                            }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <div className="sheet-content">
                {activeTab === 'stats' ? (
                    <StatsTab
                        character={character}
                        updateCharacter={updateCharacter}
                    />
                ) : (
                    <section className="sheet-panel">
                        <h2>
                            {TABS.find((tab) => tab.id === activeTab)?.label}
                        </h2>
                        <p className="sheet-muted">
                            This section will be implemented next.
                        </p>
                    </section>
                )}
            </div>
        </main>
    );
}
