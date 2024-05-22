const blockStrength = {
    'Ruby': 2300,
    'Amethyst': 3000,
    'Jade': 3000,
    'Sapphire': 3000,
    'Amber': 3000,
    'Topaz': 3800,
    'Jasper': 4800
}

function getTicks(gemType, miningSpeed) {
    return Math.round(30 * blockStrength[gemType] / miningSpeed) < 4 ? 4 : Math.round(30 * blockStrength[gemType] / miningSpeed);
}

function getGemType(glassType) {
    switch (glassType) {
        case 1:
            return 'Amber';
        case 2:
            return 'Jasper';
        case 3:
            return 'Sapphire';
        case 4:
            return 'Topaz';
        case 5:
            return 'Jade';
        case 10:
            return 'Amethyst';
        case 14:
            return 'Ruby';
        default:
            return;
    }
}

function getTotalMined(minedList) {
    let count = 0;
    Object.keys(minedList).forEach(gem => {
        count += minedList[gem]['regular'];
        count += minedList[gem]['boost'];
    });
    return count;
}

export { blockStrength, getTicks, getGemType, getTotalMined }