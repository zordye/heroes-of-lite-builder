
import { useState } from 'react';

import CharacterCreation from './components/CharacterCreation/CharacterCreation';
import CharacterSheet from './components/CharacterSheet/CharacterSheet';

export default function App() {
  const [completedCharacter, setCompletedCharacter] = useState(null);

  if (completedCharacter) {
    return <CharacterSheet character={completedCharacter} />;
  }

  return (
    <CharacterCreation
      onComplete={setCompletedCharacter}
    />
  );
}
