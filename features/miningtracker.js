import { makeObjectDraggable } from "Draggable";

import settings from "../settings/settings";
import { rgbToColorInt, addCommas, secondsToMessage } from "../util/helperFunctions";
import { getEfficiency } from "./efficiency";
import { getGemCost } from '../util/mininginfo';
import BlingPlayer from '../util/BlingPlayer';

const Color = Java.type("java.awt.Color");

let money;
let moneyPerHour;
let roughmoneyPerHour;
let flawless;

let time;
let oldTime;

let mouseDown = false;

register("chat", (gem, amount, event) => {
    money += getGemCost(gem, settings.gemstoneType)/(Math.pow(80, settings.gemstoneType-1)) * amount;
    moneyPerHour = Math.floor(money / ((Date.now() - BlingPlayer.getMiningStartTime()) / (1000 * 60 * 60)));
    roughmoneyPerHour = Math.floor((1 - (BlingPlayer.getPristine() / 100)) / (BlingPlayer.getPristine() / 100) * (moneyPerHour / 80));
    flawless = getGemCost(gem, 3);
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r&a. Flawed (.+) Gemstone &r&8x(\d+)&r&f!&r/g);

register("step", () => {
    if (!BlingPlayer.isCurrentlyMining()) {
        resetVars();
    }
}).setFps(1);

function resetVars() {
    money = null;
    moneyPerHour = null;
    roughmoneyPerHour = null;
}

const text = new Text("", 5, 5);
const efficiencyText = new Text("", text.getX() + 56, text.getY() + 30);
const gui = new Gui();

makeObjectDraggable("Mining Tracker", text, () => gui.isOpen() && mouseDown);

// TODO: this is kinda gross, move to gui manager stuff later
register("guiMouseClick", (mx, my, b, activeGui) => {
    if (activeGui.equals(gui)) {
        mouseDown = true;
    }
});
register("guiMouseRelease", (mx, my, b, activeGui) => {
    mouseDown = false;
});

register("command", () => {
    gui.open();
}).setName("movecointracker"); //ignore this for manual use, this is just there so settings works.

register("renderOverlay", () => {
    if (settings.coinTracker) {
        if (!BlingPlayer.isCurrentlyMining() && settings.coinTrackerHide)
            return;

        time = secondsToMessage((Date.now() - BlingPlayer.getMiningStartTime()) / 1000);
        if (oldTime != time) {
            updateGui();
            oldTime = time;
        }
        if (settings.showEfficiency) {
            efficiencyText.setX(text.getX() + 56);
            efficiencyText.setY(text.getY() + 30);
            efficiencyText.draw();
        }
        text.draw();

    }
});

function updateGui() {
    let lines = [];
    lines[0] = `Uptime: ${!BlingPlayer.isCurrentlyMining() ? "n/a" : time}`;
    lines[1] = `$/hr: ${money == null ? "n/a" : "$" + addCommas(settings.roughGems ? moneyPerHour + roughmoneyPerHour : moneyPerHour)} ${settings.roughGems ? "(+ rough)" : ""}`;
    lines[2] = `fl/hr: ${money == null ? "n/a" : Math.round((settings.roughGems ? moneyPerHour + roughmoneyPerHour : moneyPerHour) / flawless * 10) / 10} ${settings.roughGems ? "(+ rough)" : ""}`;
    if (settings.showEfficiency) {
        lines[3] = `Efficiency:`;
        efficiencyText.setColor(efficiencyColor(Math.round(getEfficiency() * 10000) / 100).getRGB());
        efficiencyText.setString(`${Math.round(getEfficiency() * 10000) / 100}%`);
    }

    text.setColor(rgbToColorInt(settings.coinTrackerColor[0], settings.coinTrackerColor[1], settings.coinTrackerColor[2]));
    text.setString(lines.join("\n"));
}

function efficiencyColor(value) {
    let h = Math.round(120 / 100 * value) / 360;
    let s = 1.0;
    let b = Math.round(50 - ((value - 50) ** 2) / 125) / 50;
    return Color.getHSBColor(h, s, b);
}