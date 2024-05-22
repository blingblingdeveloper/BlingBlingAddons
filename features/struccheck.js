import { drawCustomEspBox } from "./util/drawCustomEspBox.js"
import Settings from "../settings"
import { findVein, genSphere, filterShape, getcoords } from "./util/world.js";
import { calcPlayerEyeDist } from "./util/player.js";
import { rgbToColorInt } from "./util/helperFunctions.js";

let route = [];
let missingRoute = [];
let missing = 0;

register('command', () => {
    loadRoute();
}).setName('loadroute').setAliases(['lr']);

register('command', () => {
    ChatLib.command(`ct copy ${JSON.stringify(route)}`, true)
}).setName('exportstruc').setAliases(['se']);

// TODO: convert to new block format thing
// TODO: add strucCheck settings
// TODO: block type filter in command?
register("command", () => {
    if (route.length == 0) {
        if (!loadRoute()) {
            return;
        }
    }

    route.forEach(waypoint => {
        let initialSearchRadius = 3;
        let waypointPos = new Vec3i(waypoint.x, waypoint.y + 2, waypoint.z);

        let searchStart = new Map();

        // Find the vein start
        filterShape(waypointPos, genSphere(initialSearchRadius)).forEach(newblock => {
            if (!searchStart.has(getcoords(newblock))) {
                searchStart.set(getcoords(newblock), newblock);
            }
        });

        waypoint.options.vein = findVein(searchStart);
    });

    ChatLib.chat("Loaded vein guesses");
}).setName('loadrouteguess').setAliases(['lrg']);

// TODO: add "add" overload
register("command", (message) => {
    if (isNaN(parseInt(message)) || parseInt(message) > route.length || parseInt(message) < 1) {
        ChatLib.chat("Invalid input. Please provide a valid number for vein number.");
        return;
    }

    if (filterBlock(Player.lookingAt())) {
        let searchStart = new Map();
        searchStart.set(getcoords(Player.lookingAt()), Player.lookingAt());
        route[parseInt(message) - 1].options.vein = findVein(searchStart);
    }

    ChatLib.chat("Vein size: " + veinWaypoints.length);
}).setName('setvein').setAliases(['sv']);

register("command", (message) => {
    if (isNaN(parseInt(message)) || parseInt(message) > route.length || parseInt(message) < 1) {
        ChatLib.chat("Invalid input. Please provide a valid number for vein number.");
        return;
    }

    let veinNum = parseInt(message);
    ChatLib.chat("removing vein " + veinNum);
    delete route[veinNum - 1].options.vein;
}).setName('removevein').setAliases(['rv']);

register('command', () => {
    missingRoute = JSON.parse(JSON.stringify(route));;
    ChatLib.chat("checking rn bro");

    missingRoute.forEach(waypoint => {
        missingBlocks = [];
        waypoint.options.vein.forEach(block => {
            if (block.blockId != World.getBlockAt(block.x, block.y, block.z).getType().getID()) {
                missingBlocks.push(block);
            }
        });
        waypoint.options.vein = missingBlocks;
    });

    if (missingRoute.length == 0) {
        ChatLib.chat("No structure grief!")
    } else {
        missing = 0;
        missingRoute.forEach(waypoint => {
            missing += waypoint.options.vein.length;
        });
        ChatLib.chat(`Missing ${missing} blocks`);
    }
}).setName('checkstruc').setAliases(['cs']);

register("renderWorld", () => {
    let color = rgbToColorInt(Settings.textColor.getRed(), Settings.textColor.getGreen(), Settings.textColor.getBlue());
    let color2 = rgbToColorInt(255, 0, 0); // TODO: use Settings

    // render route blocks (for setting up struc check)
    if (missing == 0) {
        route.forEach(waypoint => {
            if (waypoint.options.vein) {
                waypoint.options.vein.forEach(block => {
                    if (calcPlayerEyeDist(block.x, block.y, block.z) < 30) {
                        drawCustomEspBox(
                            Math.floor(block.x) + .5,
                            Math.floor(block.y),
                            Math.floor(block.z) + .5,
                            Settings.blockHighlightThickness, 1, 1,
                            Settings.blockHighlightColor.getRed() / 255,
                            Settings.blockHighlightColor.getGreen() / 255,
                            Settings.blockHighlightColor.getBlue() / 255,
                            Settings.blockHighlightColor.getAlpha() / 255, false
                        );
                    }
                });
            }

            let veinNum = waypoint.options.name;
            let labelScale = Math.min(calcPlayerEyeDist(waypoint.x, waypoint.y, waypoint.z), 50);
            Tessellator.drawString(
                veinNum,
                waypoint.x + .5,
                waypoint.y + 1.5,
                waypoint.z + .5,
                color,
                true,
                labelScale / 200,
                false
            );
        });
    }

    missingRoute.forEach(waypoint => {
        if (waypoint.options.vein) {
            waypoint.options.vein.forEach(block => {
                if (calcPlayerEyeDist(block.x, block.y, block.z) < 30) {
                    drawCustomEspBox(
                        Math.floor(block.x) + .5,
                        Math.floor(block.y),
                        Math.floor(block.z) + .5,
                        Settings.blockHighlightThickness, 1, 1,
                        255,
                        0,
                        0,
                        1, false
                    );

                }
            });

            if (waypoint.options.vein.length > 0) {
                let labelScale = Math.min(calcPlayerEyeDist(waypoint.x, waypoint.y, waypoint.z), 50);
                Tessellator.drawString(
                    `Missing blocks: ${waypoint.options.vein.length}, Vein ${waypoint.options.name}`,
                    waypoint.x + .5,
                    waypoint.y + 1.5,
                    waypoint.z + .5,
                    color2,
                    true,
                    Math.min(labelScale, 50) / 200,
                    false
                );
            }
        }
    });
});

// ==== helper functions ====

function loadRoute() {
    const Toolkit = Java.type("java.awt.Toolkit");
    const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
    try {
        route = JSON.parse(clipboardData);
        ChatLib.chat("Loaded!");
        return true;
    } catch (e) {
        if (!(e instanceof SyntaxError)) {
            console.log(e);
        }
        ChatLib.chat("Couldn't load route");
        return false;
    }
}