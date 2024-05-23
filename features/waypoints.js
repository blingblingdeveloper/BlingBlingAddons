import RenderLib from "RenderLib";
import Settings from "../settings"
import { rgbToColorInt } from "./util/helperFunctions.js";
import BlingPlayer from "./util/BlingPlayer.js";

const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");

let route = [];
let currentWp = 0;
let nearbyWaypoints = [];

register('command', () => {
    loadRoute();
}).setName('load').setAliases(['l']);

register('command', () => {
    route = [];
}).setName('unload').setAliases(['unload']);

register('command', () => {
    exportRoute();
    ChatLib.chat(`§d[BlingBling Addons] §fSuccessfully exported to clipboard!`);
}).setName('export').setAliases(['e']);

register('command', () => {
    loadRoute()
    route = route.map(obj => {
        const { x, z, options } = obj;
        return { x, y: 63, z, r: obj.r, g: obj.g, b: obj.b, options };
    });

    exportRoute();
    ChatLib.chat(`§d[BlingBling Addons] §f${route.length} y64 waypoints successfully exported to clipboard!`);
}).setName('y64').setAliases(['y64']);

// register('command', (message) => {
//   ChatLib.chat(`&bSaved. Yay!`)
//   }).setName('waypointsave').setAliases(['s']);

function loadRoute() {
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
    route = JSON.parse(clipboardData);
    if (route[0].weight) {
        ChatLib.chat(`§d[BlingBling Addons] §fDetected DilloPro route. Converting to ColeWeight...`);
        route = route.map((obj, index) => {
            if (!obj.options) {
                obj.options = {};
            }
            obj.options.name = index + 1;
            return obj;
        });
        exportRoute();
    }

    ChatLib.chat(`§d[BlingBling Addons] §fRoute loaded!`);
}

function exportRoute() {
    ChatLib.command(`ct copy ${JSON.stringify(route)}`, true);
}

register('command', (message) => {
    if (message.includes(' ')) {
        return;
    }
    const index = parseInt(message);
    if (!Number.isInteger(index)) {
        ChatLib.chat("§d[BlingBling Addons] §cInvalid index, must be a number.");
        return;
    }

    const adjustedIndex = index - 1; // decrement index by 1
    route.splice(adjustedIndex, 1);
    for (let i = adjustedIndex; i < route.length; i++) {
        route[i].options.name--;
    }
    ChatLib.chat(`§d[BlingBling Addons] §fWaypoint ${index} removed successfully!`);
}).setName('ba rwp').setAliases(['rwp', 'barwp']);

// TODO: get coords overload working
register('command', (message) => {
    const [indexStr, ...coords] = message.split(' ');
    if (message.includes(' ')) {
        return;
    }
    const index = !Number.isInteger(parseInt(indexStr)) ? undefined : Math.max(0, Math.min(parseInt(indexStr) - 1, route.length)); // decrement index by 1 and clamp to route length
    if (index === undefined) {
        ChatLib.chat("§d[BlingBling Addons] §cInvalid index, must be a number.");
        return;
    }
    const x = Math.floor(Player.getX());
    const y = Math.floor(Player.getY()) - 1;
    const z = Math.floor(Player.getZ());
    const newWaypoint = {
        x,
        y,
        z,
        r: 0,
        g: 1,
        b: 0,
        options: { name: index + 1 }
    };
    route.splice(index, 0, newWaypoint); // insert the new waypoint at the index
    for (let i = index + 1; i < route.length; i++) { // update the names of all following waypoints (if needed)
        route[i].options.name++;
    }
    if (y > 63) {
        ChatLib.chat(`§d[BlingBling Addons] §4Waypoint ${index + 1} added successfully. §c(Outside MF!)`);
    } else {
        ChatLib.chat(`§d[BlingBling Addons] §4Waypoint ${index + 1} added successfully.`);
    }

}).setName('ba swp').setAliases(['swp', 'ba swp', 'ba insert']);

register('command', (message) => {
    currentWp = (currentWp + parseInt(message)) % route.length;
    ChatLib.chat(`§d[BlingBling Addons] §fwent forward ${message} waypoints`);
}).setName('skip').setAliases(['skip']);

register('command', (message) => {
    currentWp = (currentWp - parseInt(message) + route.length) % route.length; // modulo with length ensures we stay within bounds
    ChatLib.chat(`§d[BlingBling Addons] §fwent back ${message} waypoints`);
}).setName('unskip').setAliases(['unskip']);

register('command', (message) => {
    if (Client.getMinecraft().field_71442_b.func_178889_l().func_77145_d()) { // if creative mode
        ChatLib.chat(`§d[BlingBling Addons] §fPlacing blocks!`);
        for (let i = 0; i < route.length; i++) {
            ChatLib.command(`setblock ${route[i].x} ${route[i].y} ${route[i].z} ${message}`, false);
        }
    }
}).setName('setblocks').setAliases(['sb']);

// ====== functionality

register("worldLoad", () => {
    currentWp = 0;
});

register('tick', () => {
    if (route.length > 0) {
        let distance = BlingPlayer.calcDist(route[currentWp].x + 0.5, route[currentWp].y, route[currentWp].z + 0.5);

        if (currentWp === 0) {
            nearbyWaypoints = [];
        }
        if (distance <= 3 || (Settings.cactusThing && nearbyWaypoints.includes(currentWp))) {

            currentWp = (currentWp + 1) % route.length;
        }

        if (Settings.cactusThing && route.length > 3) {
            for (let wpIndex = 0; wpIndex < route.length; wpIndex++) {
                let wpDistance = BlingPlayer.calcDist(route[wpIndex].x + 0.5, route[wpIndex].y, route[wpIndex].z + 0.5);

                if (wpDistance < 3 && !nearbyWaypoints.includes(wpIndex) && wpIndex != currentWp - 1) {
                    nearbyWaypoints.push(wpIndex);
                }
            }
        }
    }
});

// ====== rendering

register('renderWorld', () => {
    if (route.length > 0) {
        if (Settings.waypoint) {
            for (let i = 0; i < route.length; i++) {
                drawFunc(route[i], route[(i + 1) % route.length], Settings.waypointLineColor, Settings.waypointLineThickness);
                drawInnerBlock(route[i], Settings.waypointFillColor);
                drawBlock(route[i], Settings.waypointOutlineColor);
                drawLabel(route[i])
            }
        } else {
            const nextWp = (currentWp + 1 + route.length) % route.length;
            const previousWp = (currentWp - 1 + route.length) % route.length;
            drawFunc(route[previousWp], route[currentWp], Settings.waypointLineColor, Settings.waypointLineThickness);
            drawFunc(route[currentWp], route[nextWp], Settings.waypointLineColor, Settings.waypointLineThickness);

            drawInnerBlock(route[nextWp], Settings.orderedColorAfter);
            drawInnerBlock(route[currentWp], Settings.waypointFillColor);
            drawInnerBlock(route[previousWp], Settings.orderedColorBefore);

            drawBlock(route[nextWp], Settings.orderedColorAfter);
            drawBlock(route[currentWp], Settings.waypointOutlineColor);
            drawBlock(route[previousWp], Settings.orderedColorBefore);

            drawLabel(route[nextWp])
            drawLabel(route[currentWp])
            drawLabel(route[previousWp])
            
            drawTrace(route[currentWp], Settings.orderedLineColor, Settings.orderedLineThickness);
        }
    }
})

function drawBlock(block, color) {
    if (Settings.waypointOutline) {
        RenderLib.drawEspBox(
            Math.floor(block.x) + .5,
            Math.floor(block.y),
            Math.floor(block.z) + .5,
            1, 1,
            color.getRed() / 255,
            color.getGreen() / 255,
            color.getBlue() / 255,
            color.getAlpha() / 255,
            true
        );
    }    
}

function drawLabel(block) {
    let textColor = rgbToColorInt(Settings.waypointTextColor.getRed(), Settings.waypointTextColor.getRed(), Settings.waypointTextColor.getRed());
    let labelScale = Math.min(BlingPlayer.calcEyeDist(block.x + .5, block.y + 1.5, block.z + .5), 50) / 200;
    Tessellator.drawString(block.options.name, block.x + .5, block.y + 1.5, block.z + .5, textColor, true, labelScale, false);
}

function drawInnerBlock(block, color) {
    if (Settings.waypointFill) {
        RenderLib.drawInnerEspBox(
            Math.floor(block.x) + .49,
            Math.floor(block.y) - 0.01,
            Math.floor(block.z) + 0.49,
            1, 1,
            color.getRed() / 255,
            color.getGreen() / 255,
            color.getBlue() / 255,
            color.getAlpha() / 255,
            true
        );

        RenderLib.drawInnerEspBox(
            Math.floor(block.x) + .51,
            Math.floor(block.y) + 0.01,
            Math.floor(block.z) + .51,
            1, 1,
            color.getRed() / 255,
            color.getGreen() / 255,
            color.getBlue() / 255,
            color.getAlpha() / 255,
            true
        );
    }
}

function drawFunc(pos1, pos2, color, lineWidth) {
    if (Settings.waypointExtraLine) {
        drawLine(
            pos1.x + 0.5,
            pos1.y + 0.5,
            pos1.z + 0.5,
            pos2.x + 0.5,
            pos2.y + 0.5,
            pos2.z + 0.5,
            color.getRed() / 255,
            color.getBlue() / 255,
            color.getGreen() / 255,
            color.getAlpha() / 100,
            lineWidth,
            false
        );
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
    if (Settings.orderedLine) {
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
}
