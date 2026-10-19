export default function BasicInfoStep({ character, updateCharacter }) {
  const info = character.characterInfo;

  const updateInfo = (field, value) => {
    updateCharacter((previous) => ({
      ...previous,
      characterInfo: { ...previous.characterInfo, [field]: value },
    }));
  };

  return (
    <section className="creation-panel" aria-labelledby="basic-info-title">
      <div className="section-heading">
        <span className="eyebrow">Step 01</span>
        <h2 id="basic-info-title">Basic information</h2>
        <p>Start with who your character is. These details can be edited later.</p>
      </div>

      <div className="form-grid">
        <label className="field field-wide">
          <span>Character name <span className="required">*</span></span>
          <input
            type="text"
            value={character.name}
            maxLength={80}
            placeholder="Enter character name"
            onChange={(event) => updateCharacter((previous) => ({
              ...previous,
              name: event.target.value,
            }))}
          />
        </label>

        <label className="field">
          <span>Character type</span>
          <select
            value={character.characterType}
            onChange={(event) => updateCharacter((previous) => ({
              ...previous,
              characterType: event.target.value,
            }))}
          >
            <option value="player">Player character</option>
            <option value="npc">NPC</option>
          </select>
        </label>

        <label className="field">
          <span>Player name</span>
          <input
            type="text"
            value={character.playerName}
            maxLength={80}
            placeholder="Optional"
            onChange={(event) => updateCharacter((previous) => ({
              ...previous,
              playerName: event.target.value,
            }))}
          />
        </label>

        <label className="field">
          <span>Race</span>
          <input
            type="text"
            value={info.race}
            maxLength={80}
            placeholder="Optional"
            onChange={(event) => updateInfo('race', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Pronouns</span>
          <input
            type="text"
            value={info.pronouns}
            maxLength={80}
            placeholder="Optional"
            onChange={(event) => updateInfo('pronouns', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Age</span>
          <input
            type="text"
            value={info.age}
            maxLength={40}
            placeholder="Optional"
            onChange={(event) => updateInfo('age', event.target.value)}
          />
        </label>

        <label className="field">
          <span>Size</span>
          <select
            value={character.size}
            onChange={(event) => updateCharacter((previous) => ({
              ...previous,
              size: Number(event.target.value),
            }))}
          >
            <option value={1}>Small (1)</option>
            <option value={2}>Medium (2)</option>
            <option value={3}>Large (3)</option>
            <option value={4}>Extra Large (4)</option>
          </select>
        </label>
      </div>
    </section>
  );
}
