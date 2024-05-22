import RenderLib from "RenderLib";

register("playerInteract", () => {
    if (Player.getHeldItem()?.getName()?.includes("Wooden Pickaxe") && Client.getMinecraft().field_71442_b.func_178889_l().func_77145_d()) { //2nd part detects if creative mode
        let castedBlock = rayTrace(57)

        // check if valid etherwarp point (not perfect)

        if (!castedBlock) return
        if (World.getBlockAt(castedBlock.x, castedBlock.y + 1, castedBlock.z).type.name == "tile.air.name" && World.getBlockAt(castedBlock.x, castedBlock.y + 2, castedBlock.z).type.name == "tile.air.name") {
            castedBlock.valid = true
            ChatLib.command(`gamerule sendCommandFeedback false`, false);
            ChatLib.command(`tp ${castedBlock.x} ${castedBlock.y + 1} ${castedBlock.z}`, false);
            World.playSound("mob.enderdragon.hit", 1, 1);
        }
    }
})
register('renderWorld', () => {
    if (!Player.getHeldItem()?.getName()?.includes("Wooden Pickaxe")) return castedBlock = null
    let castedBlock = rayTrace(57)
    if (!castedBlock) return
    if (World.getBlockAt(castedBlock.x, castedBlock.y + 1, castedBlock.z).type.name == "tile.air.name" && World.getBlockAt(castedBlock.x, castedBlock.y + 2, castedBlock.z).type.name == "tile.air.name") {
        RenderLib.drawEspBox(Math.floor(castedBlock.x) + .5, Math.floor(castedBlock.y), Math.floor(castedBlock.z) + .5, 1, 1, 156 / 255, 0 / 255, 0 / 255, 1, true)
    }
})

const rayTrace = (dist) => {
    let rayBlockPos = Player.getPlayer().func_174822_a(dist, Tessellator.getPartialTicks())?.func_178782_a();

    let rayx = rayBlockPos.func_177958_n();
    let rayy = rayBlockPos.func_177956_o();
    let rayz = rayBlockPos.func_177952_p();

    let blockAt = World.getBlockAt(rayx, rayy, rayz);

    return blockAt.getType().getRegistryName() === "minecraft:air" ? null : { x: rayx, y: rayy, z: rayz, valid: false };
}
