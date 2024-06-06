import Settings from 'Amaterasu/core/Settings'
import DefaultConfig from 'Amaterasu/core/DefaultConfig'
import { broadcast } from '../util/broadcast'

const config = new DefaultConfig("blingblingaddons", "settings.json")
const GUIDE = FileLib.read("blingblingaddons", "settings/guide.md")
const CREDITS = FileLib.read("blingblingaddons", "settings/credits.md")

config
    .addSwitch({
        category: "Waypoints",
        configName: "waypoint",
        title: "Waypoint Mode",
        description: "enabled: waypoints, disabled: ordered",
        value: true,
        subcategory: "Waypoints"
    })
    .addSwitch({
        category: "Waypoints",
        configName: "cactusThing",
        title: "i love cactus",
        description: "skip ordered wps out of order. suggested by cactusloverr",
        value: false,
        subcategory: "Waypoints"
    })
    .addKeybind({
        category: "Waypoints",
        subcategory: "Waypoints",
        configName: "wpKeybind",
        title: "Draw marker to first waypoint.",
        description: "For use with waypoint mode. Hold key to go to first waypoint.",
        value: 41
    })
    .addSwitch({
        category: "Waypoints",
        configName: "waypointOutline",
        title: "Waypoint Outline",
        description: "toggle waypoint outline",
        value: true,
        subcategory: "Waypoint Visuals"
    })
    .addColorPicker({
        category: "Waypoints",
        configName: "waypointOutlineColor",
        title: "Waypoint Outline Color",
        description: "change the outline color",
        value: [255, 192, 203, 255],
        subcategory: "Waypoint Visuals",
        shouldShow(data) {
            return true;
            return data.waypointOutline;
        }
    })
    .addSwitch({
        category: "Waypoints",
        configName: "waypointFill",
        title: "Waypoint Fill",
        description: "toggle waypoint fill",
        value: true,
        subcategory: "Waypoint Visuals"
    })
    .addColorPicker({
        category: "Waypoints",
        configName: "waypointFillColor",
        title: "Waypoint Fill Color",
        description: "change the fill color",
        value: [255, 192, 203, 50],
        subcategory: "Waypoint Visuals",
        shouldShow(data) {
            return true;
            return data.waypointFill;
        }
    })
    .addColorPicker({
        category: "Waypoints",
        configName: "waypointTextColor",
        title: "Text Color",
        description: "change the waypoint label color",
        value: [255, 255, 255, 255],
        subcategory: "Waypoint Visuals"
    })
    .addSwitch({
        category: "Waypoints",
        configName: "waypointExtraLine",
        title: "Extra Line",
        description: "toggle showing a line between veins",
        value: true,
        subcategory: "Waypoint Visuals"
    })
    .addColorPicker({
        category: "Waypoints",
        configName: "waypointLineColor",
        title: "Extra Line Color",
        description: "color of the line",
        value: [255, 255, 255, 255],
        subcategory: "Waypoint Visuals",
        shouldShow(data) {
            return true;
            return data.waypointExtraLine;
        }
    })
    .addSwitch({
        category: "Waypoints",
        configName: "dynamicTextSize",
        title: "Dynamic Text Size",
        description: "limits text size close to the player",
        value: true,
        subcategory: "Waypoint Visuals"
    })
    .addSlider({
        category: "Waypoints",
        configName: "waypointTextSize",
        title: "Waypoint Text Size",
        description: "size of the text used by waypoints",
        options: [1.001, 5],
        value: 2,
        subcategory: "Waypoint Visuals"
    })
    .addColorPicker({
        category: "Waypoints",
        configName: "orderedColorBefore",
        title: "Ordered Previous Color",
        description: "color of the previous ordered waypoint",
        value: [0, 0, 0, 255],
        subcategory: "Ordered Waypoint Visuals"
    })
    .addColorPicker({
        category: "Waypoints",
        configName: "orderedColorAfter",
        title: "Ordered Next Color",
        description: "color of the next ordered waypoint",
        value: [0, 0, 0, 255],
        subcategory: "Ordered Waypoint Visuals"
    })
    .addSwitch({
        category: "Waypoints",
        configName: "orderedLine",
        title: "Ordered Line",
        description: "toggle showing a trace line to the next vein",
        value: true,
        subcategory: "Ordered Waypoint Visuals"
    })
    .addColorPicker({
        category: "Waypoints",
        configName: "orderedLineColor",
        title: "Ordered Line Color",
        description: "color of next block trace line",
        value: [0, 0, 0, 255],
        subcategory: "Ordered Waypoint Visuals",
        shouldShow(data) {
            return true;
            return data.orderedLine;
        }
    })
    .addSwitch({
        category: "Mining Skills",
        configName: "pingGlide",
        title: "Ping Glide Sounds",
        description: "plays a sound when you can start mining the next block",
        value: false,
        subcategory: "Ping Glide"
    })
    .addSwitch({
        category: "Mining Skills",
        configName: "disableVanillaSound",
        title: "Disable Vanilla Sounds",
        description: "stop the regular glass break sounds from playing",
        value: true,
        subcategory: "Ping Glide",
        shouldShow(data) {
            return true;
            return data.pingGlide;
        }
    })
    .addTextInput({
        category: "Mining Skills",
        configName: "pingGlideSound",
        title: "Sound",
        description: "specify what sound to use (1.8 sounds only)",
        value: "dig.glass",
        placeHolder: "dig.glass",
        subcategory: "Ping Glide",
        shouldShow(data) {
            return true;
            return data.pingGlide;
        }
    })
    .addSlider({
        category: "Mining Skills",
        configName: "pingGlideVolume",
        title: "Volume",
        description: "volume of ping glide sound",
        options: [0, 100],
        value: 100,
        subcategory: "Ping Glide",
        shouldShow(data) {
            return true;
            return data.pingGlide;
        }
    })
    .addSlider({
        category: "Mining Skills",
        configName: "pingGlideDelay",
        title: "Delay",
        description: "your ping, higher = earlier sound",
        options: [0, 500],
        value: 150,
        subcategory: "Ping Glide",
        shouldShow(data) {
            return true;
            return data.pingGlide;
        }
    })
    .addSwitch({
        category: "Mining Skills",
        configName: "pingGlideMsb",
        title: "Mining Speed Boost",
        description: "toggle ping glide sounds during mining speed boost",
        value: false,
        subcategory: "Ping Glide",
        shouldShow(data) {
            return true;
            return data.pingGlide;
        }
    })
    .addSwitch({
        category: "Mining Skills",
        configName: "lobbySwapping",
        title: "Lobby Swap",
        value: false,
        description: "/lobby after mining speed boost is over while in end dimension",
        subcategory: "Obsidian"
    })
    .addSwitch({
        category: "GUI",
        configName: "coinTracker",
        title: "Toggle Coin Tracker",
        description: "show/hide tracker",
        value: true,
        subcategory: "Coin Tracker"
    })
    .addSwitch({
        category: "GUI",
        configName: "roughGems",
        title: "Include Rough Estimate?",
        description: "add rough gemstone profit estimate into $/hr and fl/hr. Trackers use pristine procs in order to track accurate profits. Enabling this will factor in rough gemstones to give a more accurate estimate.",
        value: false,
        subcategory: "Coin Tracker",
        shouldShow(data) {
            return true;
            return data.coinTracker;
        }
    })
    .addSwitch({
        category: "GUI",
        configName: "showEfficiency",
        title: "Efficiency Tracker",
        description: "include block efficiency on coin tracker",
        value: true,
        subcategory: "Coin Tracker",
        shouldShow(data) {
            return true;
            return data.coinTracker;
        }
    })
    .addSwitch({
        category: "GUI",
        configName: "forceNPC",
        title: "Force NPC",
        description: "use npc price for profits",
        value: false,
        subcategory: "Coin Tracker",
        shouldShow(data) {
            return true;
            return data.coinTracker;
        }
    })
    .addSwitch({
        category: "GUI",
        configName: "sellOffer",
        title: "Use Sell Offer?",
        description: "use bazaar sell offer prices for profits",
        value: true,
        subcategory: "Coin Tracker",
        shouldShow(data) {
            return true;
            return data.coinTracker && !data.forceNPC;
        }
    })
    .addDropDown({
        category: "GUI",
        configName: "gemstoneType",
        title: "Gemstone Type",
        description: "set the gemstone type to use for bazaar prices",
        options: ["Rough", "Flawed", "Fine", "Flawless", "Perfect"],
        value: 3,
        subcategory: "Coin Tracker",
        shouldShow(data) {
            return true;
            return data.coinTracker && !data.forceNPC;
        }
    })
    .addSlider({
        category: "GUI",
        configName: "resetDelay",
        title: "Reset Delay",
        description: "how long to wait before resetting the tracker (seconds)",
        options: [5, 60],
        value: 15,
        subcategory: "Coin Tracker",
        shouldShow(data) {
            return true;
            return data.coinTracker;
        }
    })
    .addColorPicker({
        category: "GUI",
        configName: "coinTrackerColor",
        title: "Coin Tracker Color",
        description: "set the coin tracker text color",
        value: [255, 255, 255, 255],
        subcategory: "Edit",
        shouldShow(data) {
            return true;
            return data.coinTracker;
        }
    })
    .addSwitch({
        category: "GUI",
        configName: "coinTrackerHide",
        title: "Auto Hide Coin Tracker",
        description: "automatically hide the coin tracker when not mining",
        value: true,
        subcategory: "Edit",
        shouldShow(data) {
            return true;
            return data.coinTracker;
        }
    })
    .addSwitch({
        category: "Struc Check",
        configName: "strucCheckAuto",
        title: "Automatic Structure Checking",
        description: "check the route automatically\n§6§o(turn of when creating struc check route)",
        value: false,
        subcategory: "Struc Check"
    })
    .addDropDown({
        category: "Struc Check",
        configName: "strucCheckGem",
        title: "Gemstone Type",
        description: "set the gemstone types struc check searches\nfor when setting up routes\n§c(CURRENTLY DOES NOTHING)",
        options: ["Ruby", "Amber", "Amethyst", "Jade", "Sapphire", "Topaz"],
        value: 1,
        subcategory: "Struc Check"
    })
    .addSlider({
        category: "Struc Check",
        configName: "strucCheckInitialRadius",
        title: "Initial Search Radius",
        description: "distance from waypoints to look for gemstone blocks\n§6§oprobably don't touch this",
        options: [1.001, 5],
        value: 3,
        subcategory: "Struc Check"
    })
    .addSwitch({
        category: "Struc Check",
        configName: "strucCheckSetup",
        title: "Setup Blocks",
        description: "highlight all blocks when creating struc check routes",
        value: true,
        subcategory: "Edit"
    })
    .addColorPicker({
        category: "Struc Check",
        configName: "strucCheckSetupColor",
        title: "Setup Blocks Color",
        description: "the color used when creating struc check routes",
        value: [255, 255, 255, 255],
        subcategory: "Edit",
        shouldShow(data) {
            return true;
            return data.strucCheckSetup;
        }
    })
    .addSwitch({
        category: "Struc Check",
        configName: "strucCheckMissing",
        title: "Missing Blocks",
        description: "highlight all missing blocks",
        value: true,
        subcategory: "Edit"
    })
    .addColorPicker({
        category: "Struc Check",
        configName: "strucCheckMissingColor",
        title: "Missing Blocks Color",
        description: "the color used when a vein is incomplete",
        value: [255, 0, 0, 255],
        subcategory: "Edit",
        shouldShow(data) {
            return true;
            return data.strucCheckMissing;
        }
    })
    .addSwitch({
        category: "Struc Check",
        configName: "strucCheckTrace",
        title: "Unloaded Trace",
        description: "draw a trace line to each unloaded vein",
        value: false,
        subcategory: "Edit"
    })
    .addColorPicker({
        category: "Struc Check",
        configName: "strucCheckTraceColor",
        title: "Unloaded Trace Color",
        description: "the color for trace line to unloaded veins",
        value: [255, 255, 255, 255],
        subcategory: "Edit",
        shouldShow(data) {
            return true;
            return data.strucCheckTrace;
        }
    })
    .addSwitch({
        category: "Block Highlight",
        configName: "blockHighlight",
        title: "Block Highlight",
        description: "toggle block highlight",
        value: false,
        subcategory: "Block Highlight"
    })
    .addTextInput({
        category: "Block Highlight",
        configName: "blockHighlightBlock",
        title: "Block",
        description: "enter the name of the block you want to search for",
        value: "minecraft:stained_glass",
        placeHolder: "minecraft:stained_glass",
        subcategory: "Block Highlight",
        shouldShow(data) {
            return true;
            return data.blockHighlight;
        }
    })
    .addSlider({
        category: "Block Highlight",
        configName: "blockHighlightMaxDist",
        title: "Maximum Distance",
        description: "maximum distance an object can be to be highlighted",
        options: [0.001, 10],
        value: 5,
        subcategory: "Block Highlight",
        shouldShow(data) {
            return true;
            return data.blockHighlight;
        }
    })
    .addSlider({
        category: "Block Highlight",
        configName: "blockHighlightMinDist",
        title: "Minimum Distance",
        description: "sets the minimum distance required to highlight an object(set it to 0 to exclude it)",
        options: [0.001, 10],
        value: 0,
        subcategory: "Block Highlight",
        shouldShow(data) {
            return true;
            return data.blockHighlight;
        }
    })
    .addSwitch({
        category: "Block Highlight",
        configName: "blockHighlightOutline",
        title: "Outline",
        description: "toggle block highlight outline",
        value: false,
        subcategory: "Edit"
    })
    .addColorPicker({
        category: "Block Highlight",
        configName: "blockHighlightOutlineColor",
        title: "Outline Color",
        description: "set block highlight outline color",
        value: [255, 255, 255, 255],
        subcategory: "Edit",
        shouldShow(data) {
            return true;
            return data.blockHighlightOutline;
        }
    })
    .addSwitch({
        category: "Block Highlight",
        configName: "blockHighlightFill",
        title: "Fill",
        description: "toggle block highlight fill",
        value: true,
        subcategory: "Edit"
    })
    .addColorPicker({
        category: "Block Highlight",
        configName: "blockHighlightFillColor",
        title: "Fill Color",
        description: "set block highlight fill color",
        value: [255, 255, 255, 50],
        subcategory: "Edit",
        shouldShow(data) {
            return true;
            return data.blockHighlightFill;
        }
    })
    .addTextInput({
        category: "Mining Stats",
        configName: "gemMiningSpeed",
        title: "Gemstone Mining Speed",
        description: "enter your gemstone mining speed",
        value: "9576",
        placeHolder: "0",
        subcategory: "i'm dumb, we'll import stats later §d<3"
    })
    .addTextInput({
        category: "Mining Stats",
        configName: "gemFortune",
        title: "Gemstone Fortune",
        description: "enter your gemstone fortune",
        value: "2497",
        placeHolder: "0",
        subcategory: "i'm dumb, we'll import stats later §d<3"
    })
    .addTextInput({
        category: "Mining Stats",
        configName: "pristine",
        title: "Pristine",
        description: "enter your pristine",
        value: "18.63",
        placeHolder: "0",
        subcategory: "i'm dumb, we'll import stats later §d<3"
    })
    .addSwitch({
        category: "Mining Stats",
        configName: "blueCheese",
        title: "Blue Cheese",
        description: "toggle on if you have a Blue Cheese Goblin Omelette",
        value: false,
        subcategory: "i'm dumb, we'll import stats later §d<3"
    })
    .addSwitch({
        category: "Render",
        configName: "renderLimitEnabled",
        title: "Global Render Limit",
        description: "enabling this may improve performance",
        value: false,
        subcategory: "Render"
    })
    .addSlider({
        category: "Render",
        configName: "renderLimit",
        title: "Render Distance",
        description: "how far away boxes will be drawn (in chunks)",
        options: [0, 10],
        value: 4,
        subcategory: "Render",
        shouldShow(data) {
            return true;
            return data.renderLimitEnabled;
        }
    })
    .addSlider({
        category: "Render",
        configName: "blockOutlineThickness",
        title: "Block Outline Thickness",
        description: "thickness for block outlines",
        options: [1, 10],
        value: 3,
        subcategory: "Render"
    })
    .addSlider({
        category: "Render",
        configName: "lineThickness",
        title: "Line Thickness",
        description: "thickness for rendered lines",
        options: [1, 10],
        value: 3,
        subcategory: "Render"
    })
    .addSlider({
        category: "Render",
        configName: "traceThickness",
        title: "Trace Thickness",
        description: "thickness for trace lines",
        options: [1, 10],
        value: 3,
        subcategory: "Render"
    })
    .addButton({
        category: "GUI",
        configName: "myButtonAction",
        title: "Move Coin Tracker GUI",
        description: "move the location of the coin tracker gui",
        subcategory: "Edit",
        onClick() {
            Client.currentGui.close();
            broadcast('movecointracker');
        }
    })


const setting = new Settings("blingblingaddons", config, "settings/ColorScheme.json", "BlingBling Addons")
    .setCommand("blingblingaddons", ["b","bling"])
    .addMarkdown("§2Usage", GUIDE)
    .addMarkdown("§7Credits", CREDITS);

setting
    .setPos(15, 15)
    .setSize(70, 70)
    .apply()

export default () => setting.settings;