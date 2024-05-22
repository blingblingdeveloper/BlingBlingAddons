import { Color } from 'Vigilance';
import { makeObjectDraggable } from "../../Draggable";

import Settings from "../settings";
import { rgbToColorInt, addCommas, secondsToMessage } from "./util/helperFunctions";
import { getEfficiency } from "./efficiency";
import { getGemCost } from './util/mininginfo';
import BlingPlayer from './util/BlingPlayer';

let money;
let moneyPerHour;
let roughmoneyPerHour;
let flawless;

register("chat", (gem, amount, event) => {
    money += getGemCost(gem, 1) * amount;
    moneyPerHour = Math.floor(money / ((Date.now() - BlingPlayer.getMiningStartTime()) / (1000 * 60 * 60)));
    roughmoneyPerHour = Math.floor((1 - (BlingPlayer.getPristine() / 100)) / (BlingPlayer.getPristine() / 100) * (moneyPerHour / 80));
    flawless = getGemCost(gem, 3);
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r&a. Flawed (.+) Gemstone &r&8x(\d+)&r&f!&r/g);

register("step", () => {
    if (!BlingPlayer.isCurrentlyMining()) {
        resetVars();
    }
}).setFps(1);

register("command", () => {
    resetVars()
    ChatLib.chat("§d[BlingBling Addons] §fReset Tracker!");
}).setName("miningtest");

function resetVars() {
    money = null;
    moneyPerHour = null;
    roughmoneyPerHour = null;
}

const text = new Text("", 5, 5);
const gui = new Gui();
makeObjectDraggable("Mining Tracker", text, () => gui.isOpen());

register("command", () => {
    gui.open();
}).setName("movecointracker"); //ignore this for manual use, this is just there so settings works.

register("renderOverlay", () => {
    if (Settings.coinTracker) {
        if (BlingPlayer.isCurrentlyMining() <= 0 && Settings.hide)
            return;
        let lines = [];
        lines[0] = `Uptime: ${(BlingPlayer.isCurrentlyMining()) ? "n/a" : secondsToMessage((Date.now() - BlingPlayer.getMiningStartTime()) / 1000)}`;
        lines[1] = `$/hr: ${money == null ? "n/a" : "$" + addCommas(Settings.roughGems ? moneyPerHour + roughmoneyPerHour : moneyPerHour)} ${Settings.roughGems ? "(+ rough)" : ""}`;
        lines[2] = `fl/hr: ${money == null ? "n/a" : Math.round((Settings.roughGems ? moneyPerHour + roughmoneyPerHour : moneyPerHour) / flawless * 10) / 10} ${Settings.roughGems ? "(+ rough)" : ""}`;
        if (Settings.showEfficiency) {
            lines[3] = `Efficiency:`;
            let efficiencyText = new Text(`${Math.round(getEfficiency() * 10000) / 100}%`, text.getX() + 56, text.getY() + 30);
            efficiencyText.setColor(efficiencyColor(Math.round(getEfficiency() * 10000) / 100).getRGB());
            efficiencyText.draw();
        }
        text.setString(lines.join("\n"));
        text.setColor(rgbToColorInt(Settings.trackerColor.getRed(), Settings.trackerColor.getGreen(), Settings.trackerColor.getBlue()));
        text.draw();
    }
});

function efficiencyColor(value) {
    let h = Math.round(120 / 100 * value) / 360;
    let s = 1.0;
    let b = Math.round(50 - ((value - 50) ** 2) / 125) / 50;
    return Color.getHSBColor(h, s, b);
}