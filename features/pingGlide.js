import Settings from "../settings"
import BlingPlayer from '../util/BlingPlayer';
import { getGemType } from "../util/mininginfo";
import { filterBlock, getInternalBlockAt } from "../util/world";

let recentTimeout;
let timeoutId = 0;

register("packetSent", (packet, event) => {
    if (Settings.pingGlide && !(BlingPlayer.isMsbActive() && !Settings.pingGlideMsb)) {
        if (packet.func_180762_c().toString().includes("START") && Player.lookingAt().pos?filterBlock(getInternalBlockAt(Player.lookingAt().pos)):false) {
            let lastHit = getInternalBlockAt(Player.lookingAt().pos);
            let currentId = ++timeoutId; // Increment the timeoutId for each new timeout set

            if (recentTimeout) {
                clearTimeout(recentTimeout); // Clear the previous timeout
            }

            recentTimeout = setTimeout(function (id) {
                return function () {
                    if (id === timeoutId) {
                        World.playSound(Settings.pingGlideSound, parseFloat(Settings.pingGlideVolume) / 100, 1);
                    }
                    else {
                        cancel(event)
                    }
                };
            }(currentId), getTicks(getGemType(lastHit.color), BlingPlayer.isMsbActive()?BlingPlayer.getMiningSpeed()*3:BlingPlayer.getMiningSpeed())*50 + Settings.pingGlideDelay);
        }
    }
}).setFilteredClass(net.minecraft.network.play.client.C07PacketPlayerDigging);
