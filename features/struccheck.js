import { Color } from 'Vigilance';
import Settings from '../settings.js'
import Settings from "../settings"
import { findVein, genSphere, filterShape, getcoords, filterBlock, getInternalBlockAt } from "./util/world.js";
import { drawBlock, drawTrace, drawText } from './util/render.js';
import BlingPlayer from './util/BlingPlayer.js';

let route = [];
let missingRoute = [];
let missing = 0;

// strucCheckAuto
// strucCheckGem
// strucCheckInitialRadius

register('command', () => {
    loadRoute();
}).setName('loadroute').setAliases(['lr']);

register('command', () => {
    route = [];
    missingRoute = [];
    missing = 0;
}).setName('unloadroute').setAliases(['ur']);

register('command', () => {
    ChatLib.command(`ct copy ${JSON.stringify(route)}`, true)
}).setName('exportstruc').setAliases(['es']);

// TODO: block type filter in command?
register("command", () => {
    if (route.length == 0) {
        if (!loadRoute()) {
            return;
        }
    }

    new Thread(() => {
        route.forEach(waypoint => {
            let waypointPos = new Vec3i(waypoint.x, waypoint.y + 2, waypoint.z);

            let searchStart = new Map();
            // Find the vein start
            filterShape(waypointPos, genSphere(Settings.strucCheckInitialRadius)).forEach(newblock => {
                if (!searchStart.has(getcoords(newblock))) {
                    searchStart.set(getcoords(newblock), newblock);
                }
            });

            waypoint.options.vein = findVein(searchStart);
        });

        ChatLib.chat("§d[BlingBling Addons] §fLoaded vein guesses");
    }).start();
}).setName('loadrouteguess').setAliases(['lrg']);

// TODO: add "add" overload
register("command", (message) => {
    if (filterBlock(Player.lookingAt())) {
        let searchStart = new Map();
        searchStart.set(getcoords(Player.lookingAt()), Player.lookingAt());
        route[parseInt(message) - 1].options.vein = findVein(searchStart);
    }

    ChatLib.chat("§d[BlingBling Addons] §fVein size: " + veinWaypoints.length);
}).setName('setvein').setAliases(['sv']);

register("command", (message) => {
    let veinNum = parseInt(message);
    delete route[veinNum - 1].options.vein;
    ChatLib.chat("§d[BlingBling Addons] §fRemoved vein " + veinNum);
}).setName('removevein').setAliases(['rv']);

register('command', () => {
    missingRoute = JSON.parse(JSON.stringify(route));

    missingRoute.forEach(waypoint => {
        missingBlocks = [];
        waypoint.options.vein.forEach(block => {
            if (!filterBlock(getInternalBlockAt(new BlockPos(new Vec3i(block.x, block.y, block.z))), [block])) {
                missingBlocks.push(block);
            }
        });
        waypoint.options.vein = missingBlocks;
    });

    if (missingRoute.length == 0) {
        ChatLib.chat("§d[BlingBling Addons] §fNo structure grief!")
    } else {
        missing = 0;
        missingRoute.forEach(waypoint => {
            missing += waypoint.options.vein.length;
        });
        ChatLib.chat(`§d[BlingBling Addons] §fMissing ${missing} blocks`);
    }
}).setName('checkstruc').setAliases(['cs']);

register("renderWorld", () => {
    if (missing == 0 && Settings.strucCheckSetup) {
        route.forEach(waypoint => {
            if (waypoint.options.vein) {
                waypoint.options.vein.forEach(block => {
                    if (BlingPlayer.calcEyeDist(waypoint.x,waypoint.y,waypoint.z) > Settings.renderLimit) {
                        return;
                    }
                    drawBlock(block, Settings.strucCheckSetupColor, false);
                });
            }

            drawText(waypoint.options.name, waypoint, Settings.waypointTextColor);
        });
    }

    if (Settings.strucCheckMissing) {
        missingRoute.forEach(waypoint => {
            if (waypoint.options.vein) {
                waypoint.options.vein.forEach(block => {
                    if (BlingPlayer.calcEyeDist(waypoint.x,waypoint.y,waypoint.z) > Settings.renderLimit) {
                        return;
                    }
                    drawBlock(block, Settings.strucCheckMissingColor, true);
                });
                if (waypoint.options.vein.length > 0) {
                    drawText(`Missing blocks: ${waypoint.options.vein.length}, Vein ${waypoint.options.name}`, waypoint, Color.RED);
                    if (Settings.strucCheckTrace) {
                        drawTrace(waypoint, Settings.strucCheckTraceColor);
                    }
                }
            }
        });
    }
});

function loadRoute() {
    const Toolkit = Java.type("java.awt.Toolkit");
    const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
    try {
        route = JSON.parse(clipboardData);
        ChatLib.chat("§d[BlingBling Addons] §fLoaded route!");
        return true;
    } catch (e) {
        if (!(e instanceof SyntaxError)) {
            console.log(e);
        }
        ChatLib.chat("§d[BlingBling Addons] §fCouldn't load route");
        return false;
    }
}
