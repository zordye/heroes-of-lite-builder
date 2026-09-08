import {
    connectedStatPairs,
    connectedStatCapBands,
} from '../data/optionalRules';

function getConnectedStatCap(level) {
    const band = connectedStatCapBands.find(
        (item) => level >= item.minLevel && level <= item.maxLevel
    );

    return band?.cap ?? null;
}

function getConnectedStatPair(pairId) {
    return connectedStatPairs.find(
        (pair) => pair.id === pairId
    ) ?? null;
}

function getConnectedStatTotal(character, pairId) {
    const pair = getConnectedStatPair(pairId);

    if (!pair) {
        return null;
    }

    return pair.stats.reduce((total, statId) => {
        const base = character.stats?.base?.[statId] ?? 0;
        const levelUp = character.stats?.levelUp?.[statId] ?? 0;

        return total + base + levelUp;
    }, 0);
}

function isConnectedStatPairWithinCap(character, pairId) {
    const cap = getConnectedStatCap(character.level);
    const total = getConnectedStatTotal(character, pairId);

    if (cap === null || total === null) {
        return true;
    }

    return total <= cap;
}

function getConnectedStatPairStatus(character, pairId) {
    const pair = getConnectedStatPair(pairId);
    const cap = getConnectedStatCap(character.level);
    const total = getConnectedStatTotal(character, pairId);

    if (!pair || cap === null || total === null) {
        return null;
    }

    return {
        pairId: pair.id,
        stats: pair.stats,
        total,
        cap,
        remaining: cap - total,
        isWithinCap: total <= cap,
    };
}

function getAllConnectedStatPairStatuses(character) {
    return connectedStatPairs.map((pair) =>
        getConnectedStatPairStatus(character, pair.id)
    );
}

function isWithinAllConnectedStatCaps(character) {
    return connectedStatPairs.every((pair) =>
        isConnectedStatPairWithinCap(character, pair.id)
    );
}

export {
    getConnectedStatCap,
    getConnectedStatPair,
    getConnectedStatTotal,
    isConnectedStatPairWithinCap,
    getConnectedStatPairStatus,
    getAllConnectedStatPairStatuses,
    isWithinAllConnectedStatCaps,
};