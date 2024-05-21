import request from "../../requestV2";
import { makeObjectDraggable } from "../../Draggable";

import Settings from "../settings";
import { addCommas, secondsToMessage } from "./util/helperFunctions";
import { getEfficiency } from "./efficiency";

let pristine = 18.63; // IDK if/how to get from stats, maybe settings input box, should be toggleable

const gemstoneCosts = {};
let lastForceNPC = Settings.forceNPC;
let lastGemstoneType = Settings.gemstoneType;
let lastGemstone = "n/a";

let startTime = -1;
let lastMined = -1;

let money;
let moneyPerHour;
let roughmoneyPerHour;
let flawless;

register("chat", (gem, amount, event) => {
    if (lastForceNPC != Settings.forceNPC || lastGemstoneType != Settings.gemstoneType)
        resetVars();
    lastForceNPC = Settings.forceNPC;
    lastGemstoneType = Settings.gemstoneType;
    let type;
    switch (Settings.gemstoneType) {
        case 0:
            type = "PERFECT";
            break;
        case 1:
            type = "FLAWLESS";
            break;
        case 2:
            type = "FINE";
            break;
        case 3:
            type = "FLAWED";
            break;
        case 4:
            type = "ROUGH";
            break;
    }

    let id = type + "_" + gem.toUpperCase() + "_GEM";
    lastMined = Date.now();

    if (startTime === 0) return;
    if (startTime === -1) {
        startTime = 0;
        request({
            url: "https://api.hypixel.net/skyblock/bazaar",
            json: true
        }).then(res => {
            startTime = Date.now();
            lastMined = Date.now();
            Object.keys(res.products).filter(i => {
                if (i.startsWith("FLAWED") || i.startsWith("FINE") || i.startsWith("FLAWLESS") | i.startsWith("PERFECT") || i.startsWith("ROUGH")) return true
            }).forEach(i => {
                let npc = 3 * Math.pow(80, (4 - Settings.gemstoneType));
                if (Settings.sellOffer) {
                    gemstoneCosts[i] = Settings.forceNPC ? npc : Math.max(npc, res.products[i].quick_status.buyPrice);
                }
                else {
                    gemstoneCosts[i] = Settings.forceNPC ? npc : Math.max(npc, res.products[i].quick_status.sellPrice);
                }
            });
        }).catch(err => {
            if (Settings.debug)
                console.log("Coin tracker: " + err);
        });
        return;
    }

    lastGemstone = gem;
    money += (gemstoneCosts[id] / Math.pow(80, (3 - Settings.gemstoneType))) * amount;
    moneyPerHour = Math.floor(money / ((Date.now() - startTime) / (1000 * 60 * 60)));
    roughmoneyPerHour = Math.floor((1 - (pristine / 100)) / (pristine / 100) * (moneyPerHour / 80));
    flawless = gemstoneCosts["FLAWLESS" + "_" + gem.toUpperCase() + "_GEM"]
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r&a. Flawed (.+) Gemstone &r&8x(\d+)&r&f!&r/g);

register("step", () => {
    if (startTime && Date.now() - lastMined > Settings.resetDelay * 1000) {
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
    roughMoneyPerHour = null;
    startTime = -1;
    lastMined = -1;
    if (Settings.hide) //setting that hides display after not mining for a while
        display.clearLines()
}

const text = new Text("", 5, 5);
const gui = new Gui();
makeObjectDraggable("Mining Tracker", text, () => gui.isOpen());

register("command", () => {
    gui.open();
}).setName("movecointracker"); //ignore this for manual use, this is just there so settings works.

function rgbToColorInt(red, green, blue) {
    return (255 << 24) | (red << 16) | (green << 8) | blue;
}

register("renderOverlay", () => {
    if (Settings.coinTracker)
        if (startTime <= 0 && Settings.hide)
            return;
    let lines = [];
    lines[0] = `Uptime: ${(startTime <= 0) ? "n/a" : secondsToMessage((Date.now() - startTime) / 1000)}`;
    lines[1] = `$/hr: ${money == null ? "n/a" : "$" + addCommas(Settings.roughGems ? (moneyPerHour + roughmoneyPerHour) : moneyPerHour)}`;
    lines[2] = `fl/hr: ${money == null ? "n/a" : Math.round((Settings.roughGems ? (moneyPerHour + roughmoneyPerHour) / flawless : moneyPerHour / flawless) * 10) / 10}`;
    if (Settings.showEfficiency) {
        lines[3] = `Efficiency:`;
        let efficiencyText = new Text(`${Math.round(getEfficiency() * 10000) / 100}%`, text.getX()+56, text.getY()+30);
        efficiencyText.setColor(efficiencyColor(Math.round(getEfficiency() * 10000) / 100).getRGB());
        efficiencyText.draw();
    }
    text.setString(lines.join("\n"));
    text.setColor(rgbToColorInt(Settings.trackerColor.getRed(), Settings.trackerColor.getGreen(), Settings.trackerColor.getBlue()));
    text.draw();
});


function efficiencyColor(value) {
    const Color = Java.type("java.awt.Color");

    let h = Math.round(120/100 * value)/360;
    let s = 1.0;
    let b = Math.round(50-((value-50)**2)/125)/50;
    return Color.getHSBColor(h, s, b);
}