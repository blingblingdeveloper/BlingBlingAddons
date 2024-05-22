import Settings from "../settings"
import BlingPlayer from './util/BlingPlayer';
import { filterBlock, getInternalBlockAt } from "./util/world";

let recentTimeout;
let timeoutId = 0;

register("packetSent", (packet, event) => {
    if (Settings.pingGlide && !(BlingPlayer.isMsbActive() && !Settings.pingSpeedBoost)) {
        if (packet.func_180762_c().toString().includes("START") && Player.lookingAt().pos?filterBlock(getInternalBlockAt(Player.lookingAt().pos)):false) {
            let currentId = ++timeoutId; // Increment the timeoutId for each new timeout set

            if (recentTimeout) {
                clearTimeout(recentTimeout); // Clear the previous timeout
            }

            recentTimeout = setTimeout(function (id) {
                return function () {
                    if (id === timeoutId) {
                        World.playSound(Settings.pingGlideSound, parseFloat(Settings.vol) / 100, 1);
                    }
                    else {
                        cancel(event)
                    }
                };
            }(currentId), Settings.pingDelay);
        }
    }
}).setFilteredClass(net.minecraft.network.play.client.C07PacketPlayerDigging);
