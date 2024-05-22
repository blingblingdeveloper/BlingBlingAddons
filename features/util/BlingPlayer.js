import Settings from "../../settings";
import { filterBlock, getInternalBlockAt } from "./world";
import { getcoords } from "./world";
import { blockStrength, getGemType, updateGemCosts } from "./mininginfo";

class BlingPlayer { // FIXME: extend Player???
    constructor() {
        this.currentlyMining = false;
        this.msbActive = false;
        this.hitBlocks = new Map();
        this.miningSpeed = Settings.alwaysPrecisionMiner ? parseInt(Settings.gemMiningSpeed) + 920 : Settings.gemMiningSpeed;
        this.pristine = Settings.pristine;
        this.miningFortune = Settings.miningFortune;
        this.lastMinedBlock = '';
        this.mined = {};
        this.lastMinedTime;
        this.startedMiningTime;

        this.stopMining();

        register("chat", () => {
            this.msbActive = true;
        }).setChatCriteria(/&r&aYou used your &r&6Mining Speed Boost &r&aPickaxe Ability!&r/g);

        register("chat", () => {
            this.msbActive = false;
        }).setChatCriteria(/&r&cYour Mining Speed Boost has expired!&r/g);

        register("worldLoad", () => {
            this.msbActive = false;
            this.stopMining();
        });

        register("step", () => {
            if (this.currentlyMining && Date.now() - this.lastMinedTime > Settings.resetDelay * 1000) {
                this.stopMining();
            }
        }).setFps(1);

        register("hitBlock", (block, event) => {
            if (filterBlock(getInternalBlockAt(block.pos)) && !this.hitBlocks.has(block)) {
                this.hitBlocks.set(getcoords(block), {
                    'type': block.getMetadata(),
                    'time': Date.now()
                });
            }
        });

        register("step", () => {
            let recentBlocks = new Map();
            this.hitBlocks.forEach((obj, coord) => {
                if (Date.now() - obj['time'] <= 2000) {
                    recentBlocks.set(coord, {
                        'type': obj['type'],
                        'time': obj['time']
                    })
                }
            });

            this.hitBlocks = recentBlocks;
        }).setFps(10);

        // Count blocks broken
        register("packetReceived", (packet, event) => {
            const blockPos = new BlockPos(packet.func_179827_b());
            const blockState = packet.func_180728_a();

            if (this.calcEyeDist(blockPos.x, blockPos.y, blockPos.z) < 5.6 && blockState == "minecraft:air") {
                if (this.hitBlocks.has(getcoords(blockPos))) {
                    let blockType = this.hitBlocks.get(getcoords(blockPos))['type'];
                    if (getGemType(blockType)) {
                        if (!this.currentlyMining) {
                            this.currentlyMining = true;
                            if (updateGemCosts()) {
                                this.startedMiningTime = Date.now();
                            }
                        }
                        this.lastMinedBlock = getGemType(blockType);
                        this.lastMinedTime = Date.now();
                        this.mined[this.lastMinedBlock][this.isMsbActive() ? 'boost' : 'regular']++;
                    }
                    this.hitBlocks.delete(getcoords(blockPos));
                }
            }
        }).setFilteredClass(net.minecraft.network.play.server.S23PacketBlockChange);
    }

    isCurrentlyMining() {
        return this.currentlyMining;
    }

    isMsbActive() {
        return this.msbActive;
    }

    getLastMinedBlock() {
        return this.lastMinedBlock;
    }

    getLastMinedTime() {
        return this.lastMinedTime;
    }

    getBlocksMined() {
        return this.mined;
    }

    getMiningSpeed() {
        return this.miningSpeed;
    }

    getPristine() {
        return this.pristine;
    }

    getMiningFortune() {
        return this.miningFortune;
    }

    getMiningStartTime() {
        return this.startedMiningTime;
    }

    stopMining() {
        this.currentlyMining = false;
        this.hitBlocks = new Map();
        this.lastMinedBlock = '';
        this.lastMinedTime;

        Object.keys(blockStrength).forEach((gem) => {
            this.mined[gem] = {
                'regular': 0,
                'boost': 0
            }
        });
    }

    calcEyeDist(x, y, z) {
        return Math.sqrt((x - Player.getRenderX()) ** 2 + (y - (Player.getRenderY() + Player.getPlayer()["func_70047_e"]())) ** 2 + (z - Player.getRenderZ()) ** 2);
    }

    calcDist(x, y, z) {
        return Math.sqrt((x - Player.getRenderX()) ** 2 + (y - Player.getRenderY()) ** 2 + (z - Player.getRenderZ()) ** 2);
    }
}

export default new BlingPlayer();