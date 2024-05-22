import Settings from "../settings"

register('command', () => Settings.openGUI()).setName('bling').setAliases(['b']);
let recentTimeout;
let msbActive = false;
let timeoutId = 0;

register("packetSent", (packet, event) => {
    if (Settings.pingGlide && !(msbActive && !Settings.pingSpeedBoost)) {
        if (packet.func_180762_c().toString().includes("START") && Player.lookingAt().toString().includes('glass')) {
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

register("chat", () => {
    msbActive = true;
}).setChatCriteria(/&r&aYou used your &r&6Mining Speed Boost &r&aPickaxe Ability!&r/g);

register("chat", () => {
    msbActive = false;
}).setChatCriteria(/&r&cYour Mining Speed Boost has expired!&r/g);

register("worldLoad", () => {
    msbActive = false;
})