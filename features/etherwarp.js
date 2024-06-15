import { drawBlock } from "../util/render";

let castedBlock;

register('playerInteract', () => {
    if (Player.getHeldItem()?.getName()?.includes("Wooden Pickaxe") && Client.getMinecraft().field_71442_b.func_178889_l().func_77145_d()) { //2nd part detects if creative mode
        if (!castedBlock) return;
        if (castedBlock.valid) {
            ChatLib.command(`gamerule sendCommandFeedback false`, false);
            ChatLib.command(`tp ${castedBlock.pos.x} ${castedBlock.pos.y + 1} ${castedBlock.pos.z}`, false);
            World.playSound("mob.enderdragon.hit", 1, 1);
        }
    }
})

register('renderWorld', () => {
    if (Player.getHeldItem()?.getName()?.includes("Wooden Pickaxe") && Client.getMinecraft().field_71442_b.func_178889_l().func_77145_d()) {
        castedBlock = rayTrace(57);
        if (!castedBlock) return;
        if (World.getBlockAt(castedBlock.pos.up(1)).type.getRegistryName() == "minecraft:air" && World.getBlockAt(castedBlock.pos.up(2)).type.getRegistryName() == "minecraft:air") {
            castedBlock.valid = true;
            drawBlock(castedBlock.pos, [156, 0, 0, 255], true);
        }
    } else {
        castedBlock = null;
    }
})

const rayTrace = (dist) => {
    let rayBlockPos = Player.getPlayer().func_174822_a(dist, Tessellator.getPartialTicks())?.func_178782_a();
    let blockAt = World.getBlockAt(rayBlockPos.func_177958_n(), rayBlockPos.func_177956_o(), rayBlockPos.func_177952_p());

    return blockAt.type.getRegistryName() === "minecraft:air" ? null : { pos: blockAt.pos, valid: false };
}
