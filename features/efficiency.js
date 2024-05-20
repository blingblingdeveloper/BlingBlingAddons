import Settings from "../settings";

let hitBlocks = new Map();
let timeout = 2000;

//TODO: reset command
//TODO: gui

//=========== block efficiency garbage
const tph = 72000;
let miningSpeed = Settings.alwaysPrecisionMiner ? Settings.gemMiningSpeed + 920 : Settings.gemMiningSpeed;

let currentyMining = false;
let msbAvailable = false;
let msbActive = false;
let ticks = 0;
let msbTicks = 0;
let currentBreakTick = 0;
let regularBlock = '';
let msbBlock = '';

let efficiency = 0;

let blockStrength = {
    'Ruby': 2300,
    'Amethyst': 3000,
    'Jade': 3000,
    'Sapphire': 3000,
    'Amber': 3000,
    'Topaz': 3800,
    'Jasper': 4800
}

let blockTicks = {}
let maxMined = {}
let mined = {}

Object.keys(blockStrength).forEach((gem) => {
    blockTicks[gem] = {
        'regular': Math.round(30 * blockStrength[gem] / miningSpeed),
        'boost': Math.round(30 * blockStrength[gem] / (miningSpeed * 3)) < 4 ? 4 : Math.round(30 * blockStrength[gem] / (miningSpeed * 3))
    }
});

Object.keys(blockStrength).forEach((gem) => {
    maxMined[gem] = {
        'regular': 0,
        'boost': 0
    }
});

Object.keys(blockStrength).forEach((gem) => {
    mined[gem] = {
        'regular': 0,
        'boost': 0
    }
});
//=========== end block efficiency garbage

//=========== block mining registration
register("hitBlock", (block, event) => {
    if (filterBlock(block) && !hitBlocks.has(block)) {
        hitBlocks.set(`${block.getX()},${block.getY()},${block.getZ()}`, {
            'type': block.getMetadata(),
            'time': Date.now()
        });
    }
});

register("step", () => {
    let recentBlocks = new Map();
    hitBlocks.forEach((obj, coord) => {
        if (Date.now() - obj['time'] <= timeout) {
            recentBlocks.set(coord, {
                'type': obj['type'],
                'time': obj['time']
            })
        }
    });

    hitBlocks = recentBlocks;
}).setFps(10);

// Count blocks broken
register("packetReceived", (packet, event) => {
    const blockPos = new BlockPos(packet.func_179827_b());
    const blockState = packet.func_180728_a();

    let playerPos = new Vec3i(Player.getX(), Player.getY() + 1.5, Player.getZ());
    let distance = Math.round(blockPos.distance(playerPos) * 100) / 100;

    if (distance < 5.6 && blockState == "minecraft:air") {
        if (hitBlocks.has(`${blockPos.getX()},${blockPos.getY()},${blockPos.getZ()}`)) {
            let blockType = hitBlocks.get(`${blockPos.getX()},${blockPos.getY()},${blockPos.getZ()}`)['type'];
            currentyMining = true; //FIXME: remove this later
            if (getGemType(blockType)) {
                mined[getGemType(blockType)][msbActive?'boost':'regular']++;
                setActiveGems(mined);
                ChatLib.chat(`Broke ${getGemType(blockType)}`);
            }
            hitBlocks.delete(`${blockPos.getX()},${blockPos.getY()},${blockPos.getZ()}`);
        }
    }
}).setFilteredClass(net.minecraft.network.play.server.S23PacketBlockChange);
//=========== end block mining registration

//=========== efficiency calc
function getTotalMined(minedList) {
    let count = 0;
    Object.keys(minedList).forEach(gem => {
        count += minedList[gem]['regular'];
        count += minedList[gem]['boost'];
    });
    return count;
}

function setActiveGems(minedList) {
    regularBlock = Object.keys(minedList).reduce((a, b) => minedList[a]['regular'] > minedList[b]['regular'] ? a : b);
    msbBlock = Object.keys(minedList).reduce((a, b) => minedList[a]['boost'] > minedList[b]['boost'] ? a : b);
}

register("tick", () => {
    if (currentyMining) {
        ticks++;
        currentBreakTick++;
        if (msbTicks > 0) {
            msbTicks--;
        } else {
            msbAvailable = false;
        }
        // TODO: switch this to ratio-basis instead of counting for higher accuracy
        if (currentBreakTick >= (msbAvailable?blockTicks[msbBlock]['boost']:blockTicks[regularBlock]['regular'])) {
            currentBreakTick = 0;
            maxMined[msbAvailable?msbBlock:regularBlock][msbAvailable?'boost':'regular']++;
        }

        efficiency = getTotalMined(mined)/getTotalMined(maxMined);
    }
})

register("chat", (gem, amount, event) => {
    msbAvailable = true;
    msbTicks = Settings.blueCheese ? 500 : 400;
}).setChatCriteria(/&r&a&r&6Mining Speed Boost &r&ais now available!&r/g);

register("chat", (gem, amount, event) => {
    msbActive = true;
}).setChatCriteria(/&r&aYou used your &r&6Mining Speed Boost &r&aPickaxe Ability!&r/g);

register("chat", (gem, amount, event) => {
    msbActive = false;
}).setChatCriteria(/&r&cYour Mining Speed Boost has expired!&r/g);
//=========== end efficiency calc

//=========== gui
register("renderOverlay", recentlyHit);
register("renderOverlay", efficiencyOverlay);

function recentlyHit() {
    Renderer.drawString(`Recently Hit Blocks:`, 100, 10);
    let i = 2;
    hitBlocks.forEach((obj, coord) => {
        Renderer.drawString(`${coord}, ${obj['time'] + timeout - Date.now()}`, 100, i * 10);
        i++;
    });
}

function efficiencyOverlay() {
    Renderer.drawString(`Efficiency: ${Math.round(efficiency * 10000) / 100}%`, 300, 10);
    Renderer.drawString(`Regular: ${regularBlock} Boost: ${msbBlock}`, 300, 20);
    Renderer.drawString(`Broken: ${JSON.stringify(mined,null,2)}`, 300, 30);
    Renderer.drawString(`Possible: ${JSON.stringify(maxMined,null,2)}`, 400, 30);
}
//=========== end gui

//=========== helpers
let blockStatesToFind = [
    {name: "minecraft:stained_glass", variants: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]},
    {name: "minecraft:stained_glass_pane", variants: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]},
]

function filterBlock(block) {
    if(block == undefined || block?.getRegistryName() == "minecraft:air" || !block instanceof Block) {
        return false;
    }

    if(blockStatesToFind.some(obj => obj.name === block.type.getRegistryName() && obj.variants.includes(block.getMetadata()))) {
        return true;
    } else {
        return false;
    }
}

function getGemType(glassType) {
    switch (glassType) {
        case 1:
            return 'Amber';
        case 2:
            return 'Jasper';
        case 3:
            return 'Sapphire';
        case 4:
            return 'Topaz';
        case 5:
            return 'Jade';
        case 10:
            return 'Amethyst';
        case 14:
            return 'Ruby';
        default:
            return;
    }
}