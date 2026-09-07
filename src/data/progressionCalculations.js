import {
    statCapBands,
    levelMilestones,
    progressionRules,
} from '../data/levelProgression';

function getStatCap(level, statId) {
    const band = statCapBands.find(
        (item) => level >= item.minLevel && level <= item.maxLevel
    );

    if (!band) {
        return null;
    }

    return statId === 'hp' ? band.hpCap : band.otherStatCap;
}

function getLevelUpPointsEarned(level) {
    if (level <= 1) {
        return 0;
    }

    return (level - 1) * progressionRules.statPointsPerLevel;
}

function getMilestonesAtLevel(level) {
    return levelMilestones.filter((milestone) => milestone.level === level);
}

function getMilestonesUpToLevel(level) {
    return levelMilestones.filter((milestone) => milestone.level <= level);
}

function getNextMilestone(level) {
    return (
        levelMilestones.find((milestone) => milestone.level > level) ?? null
    );
}

export {
    getStatCap,
    getLevelUpPointsEarned,
    getMilestonesAtLevel,
    getMilestonesUpToLevel,
    getNextMilestone,
};