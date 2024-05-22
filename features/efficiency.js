import Settings from "../settings";
import { filterBlock } from "./util/world";
import { getMsbActive } from "./util/player";

let hitBlocks = new Map();
let timeout = 2000;

//=========== block efficiency garbage
let miningSpeed = Settings.alwaysPrecisionMiner ? parseInt(Settings.gemMiningSpeed) + 920 : Settings.gemMiningSpeed;

let currentlyMining = false;
let lastMined = -1;

let msbAvailable = false;
let ticks = 0;
let msbTicks = 0;
let currentBreakTick = 0;
let targetGem = '';

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

resetVars();

register("step", () => {
    if (currentlyMining && Date.now() - lastMined > Settings.resetDelay * 1000) {
        resetVars();
    }
}).setFps(1);

register("command", () => {
    resetVars()
    ChatLib.chat("§d[BlingBling Addons] §fReset Tracker!");
}).setName("efficiencytest");

function resetVars() {
    miningSpeed = Settings.alwaysPrecisionMiner ? parseInt(Settings.gemMiningSpeed) + 920 : Settings.gemMiningSpeed;

    currentlyMining = false;
    lastMined = -1;

    ticks = 0;
    msbTicks = 0;
    currentBreakTick = 0;
    targetGem = '';

    efficiency = 0;

    blockTicks = {};
    mined = {};
    maxMined = {};

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
}
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
            if (getGemType(blockType)) {
                if (!currentlyMining) {
                    currentlyMining = true;
                    maxMined[getGemType(blockType)][getMsbActive() ? 'boost' : 'regular']++;
                }
                lastMined = Date.now();
                mined[getGemType(blockType)][getMsbActive() ? 'boost' : 'regular']++;
                targetGem = getGemType(blockType);
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

register("tick", () => {
    if (currentlyMining) {
        ticks++;
        currentBreakTick++;
        if (msbTicks > 0) {
            msbTicks--;
        } else {
            msbAvailable = false;
        }
        if (currentBreakTick >= (blockTicks[targetGem][msbAvailable ? 'boost' : 'regular'])) {
            currentBreakTick = currentBreakTick - (blockTicks[targetGem][msbAvailable ? 'boost' : 'regular']);
            maxMined[targetGem][msbAvailable ? 'boost' : 'regular']++;
        }

        efficiency = getTotalMined(mined) / getTotalMined(maxMined);
    }
})

register("chat", () => {
    msbAvailable = true;
    msbTicks = Settings.blueCheese ? 500 : 400;
}).setChatCriteria(/&r&a&r&6Mining Speed Boost &r&ais now available!&r/g);

register("worldLoad", () => {
    msbAvailable = false;
    resetVars();
});
//=========== end efficiency calc

//=========== helpers

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

function getEfficiency() {
    return efficiency;
}

export { getEfficiency };