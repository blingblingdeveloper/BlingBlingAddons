import constants from "../util/constants";

register("renderOverlay", () => {
    if (!constants.onboarding.main) {
        ChatLib.chat("§d[BlingBling Addons] §fWelcome to BlingBling Addons!");
        ChatLib.chat("§d[BlingBling Addons] §fTo change settings, run §d/bling§f, or §d/b");
        ChatLib.chat("§d[BlingBling Addons] §fFor help, run §d/b§f and go to the §6Usage§f tab");
        constants.onboarding.main = true;
        constants.save();
    }
});