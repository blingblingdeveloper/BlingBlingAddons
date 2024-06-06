import settings from "../settings/settings";
import BlingPlayer from "../util/BlingPlayer";
import { drawTrace, drawText, drawDistText, drawBlock, drawBlockFill, drawBlockConnection } from "../util/render";

const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");

let route = [];
let currentWp = 0;
let nearbyWaypoints = [];

let wpKey = new KeyBind("Draw line to first Waypoint", settings().wpKeybind, "BlingBling Addons");

register('command', () => {
    loadRoute();
}).setName('load');

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
        if (distance <= 3 || (settings().cactusThing && nearbyWaypoints.includes(currentWp))) {

            currentWp = (currentWp + 1) % route.length;
        }

        if (settings().cactusThing && route.length > 3) {
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
        if (settings().waypoint) {
            for (let i = 0; i < route.length; i++) {
                if (settings().waypointExtraLine) {
                    drawBlockConnection(route[i], route[(i + 1) % route.length], settings().waypointLineColor);
                }
                if (settings().waypointFill) {
                    drawBlockFill(route[i], settings().waypointFillColor);
                }
                if (settings().waypointOutline) {
                    drawBlock(route[i], settings().waypointOutlineColor);
                }
                drawText(route[i].options.name, route[i], settings().waypointTextColor);
            }
        } else {
            const nextWp = (currentWp + 1 + route.length) % route.length;
            const previousWp = (currentWp - 1 + route.length) % route.length;
            if (settings().waypointExtraLine) {
                drawBlockConnection(route[previousWp], route[currentWp], settings().waypointLineColor);
                drawBlockConnection(route[currentWp], route[nextWp], settings().waypointLineColor);
            }
            if (settings().waypointFill) {
                drawBlockFill(route[nextWp], settings().orderedColorAfter);
                drawBlockFill(route[currentWp], settings().waypointFillColor);
                drawBlockFill(route[previousWp], settings().orderedColorBefore);
            }
            if (settings().waypointOutline) {
                drawBlock(route[nextWp], settings().orderedColorAfter);
                drawBlock(route[currentWp], settings().waypointOutlineColor);
                drawBlock(route[previousWp], settings().orderedColorBefore);
            }

            if (settings().orderedLine) {
                drawTrace(route[currentWp], settings().orderedLineColor);
            }

            drawText(route[nextWp].options.name, route[nextWp], settings().waypointTextColor);
            drawText(route[currentWp].options.name, route[currentWp], settings().waypointTextColor);
            drawText(route[previousWp].options.name, route[previousWp], settings().waypointTextColor);
        }

        if (wpKey.isKeyDown()) {
            drawTrace(route[0], settings().orderedLineColor);
            drawDistText(Math.round(BlingPlayer.calcDist(route[0].x + 0.5, route[0].y, route[0].z + 0.5)) + "m", route[0], settings().waypointTextColor);
        }
    }
})

