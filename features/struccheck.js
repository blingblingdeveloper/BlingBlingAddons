import {drawCustomEspBox} from "./util/drawCustomEspBox.js"
import Settings from "../settings"

let blockStatesToFind = [
    {name: "minecraft:stained_glass", variants: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]},
    {name: "minecraft:stained_glass_pane", variants: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]},
]

let route = [];
let missingRoute = [];
let missing = 0;

register('command', () => {
    loadRoute();
}).setName('loadroute').setAliases(['lr']);

register('command', () => {
    ChatLib.command(`ct copy ${JSON.stringify(route)}`, true)
}).setName('exportstruc').setAliases(['se']);

// TODO: block type filter in command?
register("command", () => {
    if (route.length == 0) {
        loadRoute();
    }

    route.forEach(waypoint => {
        let initialSearchRadius = 3;
        let waypointBlock = World.getBlockAt(waypoint.x, waypoint.y + 2, waypoint.z);

        let searchStart = new Map();

        // Find the vein start
        filterShape(waypointBlock, genSphere(initialSearchRadius)).forEach(newblock => {
            if (!searchStart.has(getcoords(newblock))) {
                searchStart.set(getcoords(newblock), newblock);
            }
        });

        waypoint.options.vein = findVein(searchStart);
    });
    ChatLib.chat("Loaded vein guesses");
}).setName('loadrouteguess').setAliases(['lrg']);

register("command", (message) => {
    if (isNaN(parseInt(message)) || parseInt(message) > route.length || parseInt(message) < 1) {
        ChatLib.chat("Invalid input. Please provide a valid number for vein number.");
        return;
    }
    
    if(filterBlock(Player.lookingAt())) {
        let searchStart = new Map();
        searchStart.set(getcoords(Player.lookingAt()), Player.lookingAt());
        route[parseInt(message) - 1].options.vein = findVein(searchStart);
    }

    ChatLib.chat("Vein size: "+veinWaypoints.length);
}).setName('setvein').setAliases(['sv']);

register("command", (message) => {
    if (isNaN(parseInt(message)) || parseInt(message) > route.length || parseInt(message) < 1) {
        ChatLib.chat("Invalid input. Please provide a valid number for vein number.");
        return;
    }
    let veinNum = parseInt(message);
    ChatLib.chat("removing vein "+veinNum);
    delete route[veinNum - 1].options.vein;
}).setName('removevein').setAliases(['rv']);

register('command', () => {
    missingRoute = JSON.parse(JSON.stringify(route));;
    ChatLib.chat("checking rn bro");

    missingRoute.forEach(waypoint =>  {
        missingBlocks = [];
        waypoint.options.vein.forEach(block => {
            if (block.blockId != World.getBlockAt(block.x, block.y, block.z).getType().getID()) {
                missingBlocks.push(block);
            }
        });
        waypoint.options.vein = missingBlocks;
    });

    if (missingRoute.length == 0){
        ChatLib.chat("No structure grief!")
    } else {
        missing = 0;
        missingRoute.forEach(waypoint =>  {
            missing += waypoint.options.vein.length;
        });
        ChatLib.chat(`Missing ${missing} blocks`);
    }
}).setName('checkstruc').setAliases(['cs']);

register("renderWorld", () => {
    let color = rgbToColorInt(Settings.textColor.getRed(),Settings.textColor.getGreen(),Settings.textColor.getBlue());
    let color2 = rgbToColorInt(255,0,0); // TODO: use Settings

    // render route blocks (for setting up struc check)
    if(missing == 0) {
        route.forEach(waypoint => {
            if (waypoint.options.vein) {
                waypoint.options.vein.forEach(block => {
                    let distToPlayer = calcPlayerDist(block.x, block.y, block.z);
        
                    if(distToPlayer < 30) {
                        drawCustomEspBox(
                            Math.floor(block.x)+.5,
                            Math.floor(block.y),
                            Math.floor(block.z)+.5,
                            Settings.blockHighlightThickness, 1, 1,
                            Settings.blockHighlightColor.getRed()/255,
                            Settings.blockHighlightColor.getGreen()/255,
                            Settings.blockHighlightColor.getBlue()/255,
                            Settings.blockHighlightColor.getAlpha()/255, false
                        );
                    }
                });
            }
            
            let veinNum = waypoint.options.name;
            let distToPlayer = calcPlayerDist(waypoint.x, waypoint.y, waypoint.z);
            let distRender = Math.min(distToPlayer, 50);
            Tessellator.drawString(
                veinNum,
                waypoint.x+.5,
                waypoint.y+1.5,
                waypoint.z+.5,
                color,
                true,
                distRender/200,
                false
            );
        });
    }

    missingRoute.forEach(waypoint => {
        if (waypoint.options.vein) {
            waypoint.options.vein.forEach(block => {
                let distToPlayer = calcPlayerDist(block.x, block.y, block.z);
    
                if(distToPlayer < 30) {
                    drawCustomEspBox(
                        Math.floor(block.x)+.5,
                        Math.floor(block.y),
                        Math.floor(block.z)+.5,
                        Settings.blockHighlightThickness, 1, 1,
                        255,
                        0,
                        0,
                        1, false
                    );
    
                }
            });

            if (waypoint.options.vein.length > 0) {     
                let distToPlayer = calcPlayerDist(waypoint.x, waypoint.y, waypoint.z);    
                Tessellator.drawString(
                    `Missing blocks: ${waypoint.options.vein.length}, Vein ${waypoint.options.name}`,
                    waypoint.x+.5,
                    waypoint.y+1.5,
                    waypoint.z+.5,
                    color2,
                    true,
                    Math.min(distToPlayer, 50)/200,
                    false
                );
            }
        }
    });
});

// ==== helper functions ====

function loadRoute() {
    // TODO: add check for if it's a valid route
    const Toolkit = Java.type("java.awt.Toolkit");
    const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
    route = JSON.parse(clipboardData);
    ChatLib.chat("loaded!");
}

function findVein(searchStart) {
    let veinWaypoints = [];
    let maxSearchSteps = 15;
    let searchRadius = 1.75;
    let blocksToSearch = searchStart;
    let searchedBlocks = new Map();

    // Use a sphere shape to find the vein's blocks
    let searchShape = genSphere(searchRadius);
    for(let currentStep = 1; currentStep <= maxSearchSteps; currentStep++) {
        let newBlocks = new Map();

        blocksToSearch.forEach(block => {
            let blockType = [
                {name: "minecraft:stained_glass", variants: [block.getMetadata()]},
                {name: "minecraft:stained_glass_pane", variants: [block.getMetadata()]},
            ];
            searchedBlocks.set(getcoords(block), block);
            filterShape(block, searchShape, blockType).forEach(newblock => {
                if (!(newBlocks.has(getcoords(newblock)) || searchedBlocks.has(getcoords(newblock)))) {
                    newBlocks.set(getcoords(newblock), newblock);
                }
            });
        });
        blocksToSearch = newBlocks;
    }
    
    // Put all the blocks in the data structure
    searchedBlocks.forEach(block => {
        veinWaypoints.push({
            x: block.getX(),
            y: block.getY(),
            z: block.getZ(),
            blockId: block.getType().getID() // TODO: use other system?
        })
    });

    return veinWaypoints;
}

function genSphere(radius) {
    let shape = []

    for(let x = -Math.ceil(radius); x <= Math.ceil(radius); x++)
    {
        for(let y = -Math.ceil(radius); y <= Math.ceil(radius); y++)
        {
            for(let z = -Math.ceil(radius); z <= Math.ceil(radius); z++)
            {
                if(x*x + y*y + z*z <= radius*radius) {
                    shape.push({"x": x, "y": y, "z": z});
                }
            }
        }
    }

    return shape;
}

function filterShape(block, shape, blockType) {
    let matchingBlocks = [];
    let toSearch = [];

    shape.forEach(coord => {
        toSearch.push(World.getBlockAt(block.pos.add(new Vec3i(coord.x, coord.y, coord.z))));
    });

    for(let i = 0; i < toSearch.length; i++) {
        if(filterBlock(toSearch[i], blockType)) {
            matchingBlocks.push(toSearch[i]);
        }
    }

    return matchingBlocks;
}

function filterBlock(lookingAt, blockType) {
    if(lookingAt == undefined || lookingAt?.getRegistryName() == "minecraft:air" || !lookingAt instanceof Block) {
        ChatLib.chat("Cannot insert waypoint. Looking at air.");
        return false;
    }
    if(blockType == null) {
        blockType = blockStatesToFind;
    }

    if(blockType.some(obj => obj.name === lookingAt.type.getRegistryName() && obj.variants.includes(lookingAt.getMetadata()))) {
        return true;
    } else {
        // ChatLib.chat("That block doesn't match the whitelist.");
        return false;
    }
}

function getcoords(block) {
    return `${block.getX()},${block.getY()},${block.getZ()}`;
}

function rgbToColorInt(red, green, blue) {
    return (255 << 24) | (red << 16) | (green << 8) | blue;
}

function calcPlayerDist(x, y, z) {
    return Math.sqrt((x-(Player.getRenderX()-0.5))**2 + (y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2 + (z-(Player.getRenderZ()-0.5))**2);
}