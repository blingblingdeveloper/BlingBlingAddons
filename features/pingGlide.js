import settings from "../settings/settings"
import BlingPlayer from '../util/BlingPlayer';
import { getGemType, getTicks } from "../util/mininginfo";
import { filterBlock, getInternalBlockAt, getcoords } from "../util/world";

let recentTimeout;
let timeoutId = 0;

let lastHit;

register("hitBlock", (hitBlock, event) => {
    if (settings().pingGlide && !(BlingPlayer.isMsbActive() && !settings().pingGlideMsb)) {
        let block = getInternalBlockAt(hitBlock.pos);
        if (filterBlock(block)) {
            let timeToBreak = getTicks(getGemType(block.color), BlingPlayer.isMsbActive()?BlingPlayer.getMiningSpeed()*3:BlingPlayer.getMiningSpeed())*50;
            let currentId = ++timeoutId;

            recentTimeout = setTimeout(function (id) {
                return function () {
                    if (id === timeoutId && Player.lookingAt().pos) {
                        World.playSound(settings().pingGlideSound, parseFloat(settings().pingGlideVolume) / 100, 0.7936508059501648);
                        lastHit = block;
                    }
                    else {
                        lastHit = null;
                        cancel(event)
                    }
                };
            }(currentId), timeToBreak - settings().pingGlideDelay/2);
        }
    }
});

register("soundPlay", (pos, name, vol, pitch, category, event) => {
    if (settings().pingGlide && settings().disableVanillaSound) {
        if (name == "dig.glass" && lastHit) {
            if ((pos.x == lastHit.x+0.5 && pos.y == lastHit.y+0.5 && pos.y == lastHit.y+0.5) ||
            (pos.x == Math.floor(Player.x) + 0.5 && pos.y == Math.floor(Player.y) + 0.5 && pos.z == Math.floor(Player.z) + 0.5)) {
                cancel(event);
            }
        }
    }
});