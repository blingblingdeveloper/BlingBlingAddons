import settings from "../settings/settings";
import { endChecker } from "../util/helperFunctions";

register("chat", () => {
    if (endChecker.check() && settings().lobbySwapping)
        ChatLib.command("lobby", false);
}).setChatCriteria("Your Mining Speed Boost has expired!");
