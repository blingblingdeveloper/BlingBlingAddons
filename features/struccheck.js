import { Color } from 'Vigilance';
import Settings from '../settings.js'
import { drawCustomEspBox } from "./util/drawCustomEspBox.js"
import Settings from "../settings"
import { findVein, genSphere, filterShape, getcoords, filterBlock, getInternalBlockAt } from "./util/world.js";
import BlingPlayer from "./util/BlingPlayer.js";
import { rgbToColorInt } from "./util/helperFunctions.js";

let route = [];
let missingRoute = [];
let missing = 0;

// strucCheckAuto
// strucCheckGem
// strucCheckInitialRadius

// strucCheckTracer
// strucCheckTracerColor
// strucCheckTracerThickness

register('command', () => {
    loadRoute();
}).setName('loadroute').setAliases(['lr']);

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
                    drawBox(block, Settings.strucCheckSetupColor, false);
                });
            }

            drawText(waypoint.options.name, waypoint, Settings.waypointTextColor);
        });
    }

    if (Settings.strucCheckMissing) {
        missingRoute.forEach(waypoint => {
            if (waypoint.options.vein) {
                waypoint.options.vein.forEach(block => {
                    drawBox(block, Settings.strucCheckMissingColor, true);
                });
                if (waypoint.options.vein.length > 0) {
                    drawText(`Missing blocks: ${waypoint.options.vein.length}, Vein ${waypoint.options.name}`, waypoint, Color.RED);
                    if (Settings.strucCheckTracer) {
                        drawTrace(waypoint, Settings.strucCheckTracerColor, Settings.strucCheckTracerThickness);
                    }
                }
            }
        });
    }
});

function drawText(text, block, color) {
    let labelColor = rgbToColorInt(color.getRed(), color.getGreen(), color.getBlue());
    let labelScale = Math.min(BlingPlayer.calcEyeDist(block.x, block.y, block.z), 50) / 200;
    Tessellator.drawString(
        text,
        block.x + .5,
        block.y + 1.5,
        block.z + .5,
        labelColor,
        true,
        labelScale,
        false
    );
}

function drawBox(block, color, phase) {
    drawCustomEspBox(
        Math.floor(block.x) + .5,
        Math.floor(block.y),
        Math.floor(block.z) + .5,
        Settings.strucCheckOutlineThickness, 1, 1,
        color.getRed() / 255,
        color.getGreen() / 255,
        color.getBlue() / 255,
        color.getAlpha() / 255,
        phase
    );
}

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

function drawLine(x1, y1, z1, x2, y2, z2, red, green, blue, alpha, width, phase) {
    if (phase) {
        GlStateManager.func_179097_i() // disableDepth
    }
    GL11.glLineWidth(width);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glBlendFunc(770, 771);
    GL11.glDepthMask(false);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GlStateManager.func_179094_E(); // pushMatrix()

    Tessellator.begin(3).colorize(red, green, blue, alpha);

    Tessellator.pos(x1, y1, z1);
    Tessellator.pos(x2, y2, z2);

    Tessellator.draw();

    GlStateManager.func_179121_F(); // popMatrix()
    GL11.glDisable(GL11.GL_BLEND);
    GL11.glDepthMask(true);
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    if (phase) {
        GlStateManager.func_179126_j(); // enableDepth
    }
}

function drawTrace(block, color, lineWidth) {
    drawLine(
        Player.getRenderX(),
        Player.getRenderY() + Player.getPlayer()["func_70047_e"](),
        Player.getRenderZ(),
        block.x + 0.5,
        block.y + 0.5,
        block.z + 0.5,
        color.getRed() / 255,
        color.getBlue() / 255,
        color.getGreen() / 255,
        color.getAlpha() / 255,
        lineWidth,
        true
    );
}