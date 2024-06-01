import Settings from "../settings";
import BlingPlayer from '../util/BlingPlayer';
import { getTicks, blockStrength, getTotalMined } from "../util/mininginfo";

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
            if (currentBreakTick >= getTicks(targetGem, BlingPlayer.getMiningSpeed()*3)) {
                currentBreakTick -= getTicks(targetGem, BlingPlayer.getMiningSpeed()*3);
                maxMined[targetGem]['boost']++;
            }
            msbTicks--;
        } else {
            if (currentBreakTick >= getTicks(targetGem, BlingPlayer.getMiningSpeed())) {
                currentBreakTick -= getTicks(targetGem, BlingPlayer.getMiningSpeed());
                maxMined[targetGem]['regular']++;
            }
        }

        efficiency = getTotalMined(BlingPlayer.getBlocksMined()) / getTotalMined(maxMined);
    } else if (isTracking) {
        resetVars();
    }
});

register("chat", () => {
    msbTicks = Settings.blueCheese ? 500 : 400;
}).setChatCriteria(/&r&a&r&6Mining Speed Boost &r&ais now available!&r/g);

register("chat", () => {
    let count = 0;
    Object.keys(maxMined).forEach(gem => {
        count += maxMined[gem]['boost'];
    });
    if (count == 0) {
        msbTicks = Settings.blueCheese ? 500 : 400;
    }
}).setChatCriteria(/&r&aYou used your &r&6Mining Speed Boost &r&aPickaxe Ability!&r/g);

register("worldLoad", () => {
    resetVars();
});

function getEfficiency() {
    return efficiency;
}

export { getEfficiency };