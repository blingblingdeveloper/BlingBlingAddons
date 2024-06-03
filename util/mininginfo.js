import request from "requestV2";
import settings from '../settings/settings';

const gemCosts = {};

const blockStrength = {
    'Ruby': 2300,
    'Amethyst': 3000,
    'Jade': 3000,
    'Sapphire': 3000,
    'Amber': 3000,
    'Topaz': 3800,
    'Jasper': 4800
}

function getGemCost(gem, tier) {
    let npc = 3 * Math.pow(80, tier);
    if (settings.forceNPC) {
        return npc;
    }
    let type;
    switch (tier) {
        case 0:
            type = "ROUGH";
            break;
        case 1:
            type = "FLAWED";
            break;
        case 2:
            type = "FINE";
            break;
        case 3:
            type = "FLAWLESS";
            break;
        case 4:
            type = "PERFECT";
            break;
    }
    let id = type + "_" + gem.toUpperCase() + "_GEM";

    return Math.max(npc, gemCosts[id]?gemCosts[id]:0);
}

function updateGemCosts() {
    if (settings.forceNPC) {
        return true;
    }
    return request({
        url: "https://api.hypixel.net/skyblock/bazaar",
        json: true
    }).then((res, resolve) => {
        Object.keys(res.products).filter(i => {
            if (i.startsWith("FLAWED") || i.startsWith("FINE") || i.startsWith("FLAWLESS") || i.startsWith("PERFECT") || i.startsWith("ROUGH")) return true
        }).forEach(i => {
            let tier;
            if (i.startsWith("ROUGH")) {
                tier = 0;
            }
            else if (i.startsWith("FLAWED")) {
                tier = 1;
            }
            else if (i.startsWith("FINE")) {
                tier = 2;
            }
            else if (i.startsWith("FLAWLESS")) {
                tier = 3;
            }
            else if (i.startsWith("PERFECT")) {
                tier = 4;
            }
            let npc = 3 * Math.pow(80, tier);
            if (settings.sellOffer) {
                gemCosts[i] = Math.max(npc, res.products[i].quick_status.buyPrice);
            }
            else {
                gemCosts[i] = Math.max(npc, res.products[i].quick_status.sellPrice);
            }
        });
        resolve(true);
    }).catch((err, reject) => {
        if (settings.debug)
            console.log("Coin tracker: " + err);
        reject(false);
    });
}

function getTicks(gemType, miningSpeed) {
    return Math.round(30 * blockStrength[gemType] / miningSpeed) < 4 ? 4 : Math.round(30 * blockStrength[gemType] / miningSpeed);
}

function getGemType(glassType) {
    switch (glassType) {
        case 1:
        case 'orange':
            return 'Amber';
        case 2:
        case 'magenta':
            return 'Jasper';
        case 3:
        case 'lightBlue':
            return 'Sapphire';
        case 4:
        case 'yellow':
            return 'Topaz';
        case 5:
        case 'lime':
            return 'Jade';
        case 10:
        case 'purple':
            return 'Amethyst';
        case 14:
        case 'red':
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

export { blockStrength, getGemCost, updateGemCosts, getTicks, getGemType, getTotalMined }