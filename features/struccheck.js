import { Color } from 'Vigilance';
import Settings from '../settings'
import Settings from "../settings"
import { findVein, genSphere, filterShape, getcoords, filterBlock, getInternalBlockAt } from "./util/world";
import { drawBlock, drawTrace, drawText } from './util/render';
import BlingPlayer from './util/BlingPlayer';

let route = [];

let chunkMap = new Map();
let checkedChunks = new Set();
let mapCreated = false;
let missingRoute = [];

// TODO: Settings.strucCheckGem
register('command', () => {
    loadRoute();
    resetVars();
}).setName('loadroute').setAliases(['lr']);

register('command', () => {
    route = [];
    resetVars();
}).setName('unloadroute').setAliases(['ur']);

register('command', () => {
    ChatLib.command(`ct copy ${JSON.stringify(route)}`, true);
    ChatLib.chat("§d[BlingBling Addons] §fExported route!");
}).setName('exportstruc').setAliases(['es']);

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
        resetVars();
        
        ChatLib.chat("§d[BlingBling Addons] §fLoaded vein guesses");
    }).start();
}).setName('loadrouteguess').setAliases(['lrg']);

register("command", (...args) => {
    try {
        let veinNum;
        if (args.length == 2 && args[0] == "add") {
            veinNum = parseInt(args[1]) - 1;
        } else {
            veinNum = parseInt(args[0]) - 1;
        }
        if (Player.lookingAt().pos?filterBlock(getInternalBlockAt(Player.lookingAt().pos)):false) {
            let searchStart = new Map();
            searchStart.set(getcoords(Player.lookingAt()), getInternalBlockAt(Player.lookingAt().pos));
            if (args.length == 2 && args[0] == "add") {
                let vein = new Set(route[veinNum].options.vein.concat(findVein(searchStart)));
                route[veinNum].options.vein = Array.from(vein);
            } else {
                route[veinNum].options.vein = findVein(searchStart);
            }
            resetVars();
        
            ChatLib.chat("§d[BlingBling Addons] §fVein size: " + route[veinNum].options.vein.length);
        } else {
            ChatLib.chat("§d[BlingBling Addons] §fPlease look at a block to set vein");
        }
    } catch (e) {
        console.log(e);
        ChatLib.chat("§d[BlingBling Addons] §fCouldn't add vein");
    }
}).setName('setvein').setAliases(['sv']);

register("command", (message) => {
    let veinNum = parseInt(message);
    delete route[veinNum - 1].options.vein;
    resetVars();
    
    ChatLib.chat("§d[BlingBling Addons] §fRemoved vein " + veinNum);
}).setName('removevein').setAliases(['rv']);

register("worldLoad", () => {
    resetVars();
});

register("step", () => {
    if (Settings.strucCheckAuto && isRouteReady()) {
        if (!mapCreated) {
            createChunkMapping();
        }
        if (chunkMap.size > 0) {
            checkLoaded();
        }
    }
}).setFps(1);

register("renderWorld", () => {
    if (!mapCreated) {
        route.forEach(waypoint => {
            if (Settings.strucCheckSetup && waypoint.options.vein) {
                waypoint.options.vein.forEach(block => {
                    if (BlingPlayer.calcEyeDist(waypoint.x, waypoint.y, waypoint.z) > Settings.renderLimit) {
                        return;
                    }
                    drawBlock(block, Settings.strucCheckSetupColor, false);
                });
            }

            drawText(waypoint.options.name, waypoint, Settings.waypointTextColor);
        });
    }

    if (Settings.strucCheckMissing && mapCreated) {
        missingRoute.forEach(waypoint => {
            if (waypoint.options.chunks.size > 0) {
                drawText(`Unchecked vein!`, waypoint, Color.RED);
                if (Settings.strucCheckTrace) {
                    drawTrace(waypoint, Settings.strucCheckTraceColor);
                }
            } else if (waypoint.options.vein.size > 0) {
                waypoint.options.vein.forEach(block => {
                    if (BlingPlayer.calcEyeDist(waypoint.x, waypoint.y, waypoint.z) > Settings.renderLimit) {
                        return;
                    }
                    drawBlock(block, Settings.strucCheckMissingColor, true);
                });
                drawText(`Missing blocks: ${waypoint.options.vein.size}, Vein ${waypoint.options.name}`, waypoint, Color.RED);
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

function checkLoaded() {
    new Thread(() => {
        const IChunkProvider = World.getWorld().func_72863_F();
        const ChunkProviderClass = IChunkProvider.class;
        const chunkListing = ChunkProviderClass.getDeclaredField('field_73237_c');
        chunkListing.setAccessible(true);
        const allChunksInWorld = chunkListing.get(IChunkProvider);
    
        allChunksInWorld.forEach(chunk => {
            let chunkName = `${chunk.field_76635_g}, ${chunk.field_76647_h}`;
            if (!checkedChunks.has(chunkName)) {
                checkChunk(chunkName);
            }
        });
    }).start();
}

function createChunkMapping() {
    missingRoute = JSON.parse(JSON.stringify(route));

    missingRoute.forEach(waypoint => {
        waypoint.options.chunks = new Set();
        waypoint.options.vein = new Set(waypoint.options.vein);
        waypoint.options.vein.forEach(block => {
            let chunkCoords = `${Math.floor(block.x / 16)}, ${Math.floor(block.z / 16)}`;
            if (chunkMap.has(chunkCoords)) {
                chunkMap.get(chunkCoords).push(block);
            } else {
                chunkMap.set(chunkCoords, [block]);
            }
            waypoint.options.chunks.add(chunkCoords);
        });
    });
    mapCreated = true;
}

function checkChunk(chunkName) {
    checkedChunks.add(chunkName);
    if (chunkMap.has(chunkName)) {
        chunkMap.get(chunkName).forEach(block => {
            if (filterBlock(getInternalBlockAt(new BlockPos(new Vec3i(block.x, block.y, block.z))), [block])) {
                missingRoute.forEach(waypoint => {
                    waypoint.options.vein.delete(block);
                });
            }
        });

        missingRoute.forEach(waypoint => {
            waypoint.options.chunks.delete(chunkName);
        });
        chunkMap.delete(chunkName);
    }
}

function isRouteReady() {
    if (route.length == 0) {
        return false;
    }

    for (let waypoint of route) {
        if (waypoint.options.vein == undefined) {
            return false;
        }
    }
    return true;
}

function resetVars() {
    chunkMap = new Map();
    checkedChunks = new Set();
    mapCreated = false;
    missingRoute = [];
}