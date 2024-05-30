import Settings from "../settings";
import BlingPlayer from './util/BlingPlayer';
import { getTicks, blockStrength, getTotalMined } from "./util/mininginfo";

let msbAvailable = false;
let ticks = 0;
let msbTicks = 0;
let currentBreakTick = 0;
let efficiency = 0;
let maxMined = {}
let isTracking = false;

resetVars();

function resetVars() {
    ticks = 0;
    msbTicks = 0;
    currentBreakTick = 0;
    efficiency = 0;
    isTracking = false;
    
    Object.keys(blockStrength).forEach((gem) => {
        maxMined[gem] = {
            'regular': 0,
            'boost': 0
        }
    });
}

// TODO: math with time instead for slower update?
register("tick", () => {
    if (BlingPlayer.isCurrentlyMining()) {
        let targetGem = BlingPlayer.getLastMinedBlock();
        if (!isTracking) {
            maxMined[targetGem][BlingPlayer.isMsbActive() ? 'boost' : 'regular']++;
            isTracking = true;
        }

        ticks++;
        currentBreakTick++;
        if (msbTicks > 0) {
            msbTicks--;
        } else {
            msbAvailable = false;
        }

        if (currentBreakTick >= getTicks(targetGem, msbAvailable?BlingPlayer.getMiningSpeed()*3:BlingPlayer.getMiningSpeed())) { // TODO: remove once stats are dynamic
            currentBreakTick = currentBreakTick - getTicks(targetGem, msbAvailable?BlingPlayer.getMiningSpeed()*3:BlingPlayer.getMiningSpeed());
            maxMined[targetGem][msbAvailable ? 'boost' : 'regular']++;
        }
        efficiency = getTotalMined(BlingPlayer.getBlocksMined()) / getTotalMined(maxMined);
    } else if (isTracking) {
        resetVars();
    }
});

register("chat", () => {
    msbAvailable = true;
    msbTicks = Settings.blueCheese ? 500 : 400;
}).setChatCriteria(/&r&a&r&6Mining Speed Boost &r&ais now available!&r/g);

register("worldLoad", () => {
    msbAvailable = false;
    resetVars();
});

function getEfficiency() {
    return efficiency;
}

export { getEfficiency };