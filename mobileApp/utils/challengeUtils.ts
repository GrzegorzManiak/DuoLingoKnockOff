const getChallengeTypeName = (type: number | undefined): string => {
    switch (type) {
        case 0: return 'Multiple Choice';
        case 1: return 'Fill Blanks';
        case 2: return 'Conversation';
        case 3: return 'Word Matching';
        case 4: return 'Audio Challenge';
        default: return 'Unknown';
    }
};

const getDifficultyName = (difficulty: number | undefined): string => {
    switch (difficulty) {
        case 0: return 'Easy';
        case 1: return 'Medium';
        case 2: return 'Hard';
        default: return 'Unknown';
    }
};

export {
    getChallengeTypeName,
    getDifficultyName,
}