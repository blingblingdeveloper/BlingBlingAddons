import { @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @ButtonProperty} from 'Vigilance';

@Vigilant('blingblingaddons', 'Config', {
    getCategoryComparator: () => (a, b) => {
        const categories = ["Waypoints", "Mining Skills", "GUI", "Struc Check", "Block Highlight", "Mining Stats", "HELP"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {
    // #region Waypoints
    @SwitchProperty({
        name: "§dshow all veins",
        description: "enable = waypoints disable = ordered",
        category: "Waypoints",
        subcategory: "Waypoints",
    })
    waypoint = true;
    @SwitchProperty({
        name: "§dshow line between veins",
        description: "activate",
        category: "Waypoints",
        subcategory: "Waypoints",
    })
    waypointExtraLine = false;
    @SwitchProperty({
        name: '§bi love cactus',
        description: 'skip ordered wps out of order. suggested by cactusloverr',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    cactusThing = false;
    @SwitchProperty({
        name: '§bwaypoint outline',
        description: 'toggles waypoint outline',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    waypointOutline = true;
    @ColorProperty({
        name: '§bwaypoints outline color',
        description: 'waypoint inner color',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    waypointOuterColor = Color.PINK;
    @SwitchProperty({
        name: '§bwaypoints inner',
        description: 'toggles waypoint inner outline',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    waypointInner = true;
    @PercentSliderProperty({
        name: '§bwaypoints inner opacity',
        description: 'waypoint inner opacity',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    waypointInnerAlpha = 0.2;
    @ColorProperty({
        name: '§btext color',
        description: 'text inner color',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    waypointTextColor = Color.WHITE;
    @SliderProperty({
        name: '§bline thickness',
        description: 'ordered line thickness',
        category: 'Waypoints',
        subcategory: 'Waypoints',
        min: 0,
        max: 30
    })
    orderedLineThickness = 3;
    @ColorProperty({
        name: '§bline color',
        description: 'color of line',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    waypointLineColor = Color.WHITE;
    @ColorProperty({
        name: '§bordered tracer color',
        description: 'color of next block tracer',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    orderedLineColor = Color.BLACK;
    @ColorProperty({
        name: '§bordered previous color',
        description: 'color of previous ordered wp',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    orderedColorBefore = Color.BLACK;
    @ColorProperty({
        name: '§bordered next color',
        description: 'color of next ordered wp',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    orderedColorAfter = Color.BLACK;

    // #endregion
    // #region Mining Skills
    @SwitchProperty({
        name: '§aPing Glide Sounds',
        description: 'toggles ping glide sounds',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
    })
    pingGlide = true;
    @TextProperty({
        name: 'sound',
        description: 'specify what sound to use(1.8 sounds only)',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
    })
    pingGlideSound = "dig.stone";
    @SliderProperty({
        name: 'volume',
        description: 'Volume of ping glide sound.',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
        min: 0,
        max: 100
    })
    vol = 32;
    @SliderProperty({
        name: 'delay',
        description: 'Delay (in ms)',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
        min: 0,
        max: 2000
    })
    pingDelay = 250;
    @SwitchProperty({
        name: 'speed',
        description: 'toggles ping glide sounds during speed boost',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
    })
    pingSpeedBoost = false;
    // #endregion
    // #region GUI
    @SelectorProperty({
        name: "Gemstone Type",
        description: "Sets the type of gemstones to use for coin tracker for bazaar prices.",
        subcategory: "Coin Tracker",
        category: "GUI",
        options: ["Perfect", "Flawless", "Fine", "Flawed", "Rough"]
    })
    gemstoneType = 2;
    @SwitchProperty({
        name: "Force NPC",
        description: "Forces NPC price for the coin tracker.",
        subcategory: "Coin Tracker",
        category: "GUI"
    })
    forceNPC = false;
    @SwitchProperty({
        name: 'Use Sell Offer?',
        description: `Uses sell offer for coin tracker.`,
        category: 'GUI',
        subcategory: 'Coin Tracker',
    })
    sellOffer = true;
    @SwitchProperty({
        name: 'Include Rough Estimate?',
        description: 'Add rough gemstone profit estimate into $/hr and fl/hr.',
        category: 'GUI',
        subcategory: 'Coin Tracker',
    })
    roughGems = false;
    @SliderProperty({
        name: 'Reset delay',
        description: 'How long to wait before resetting the timer (seconds).',
        category: 'GUI',
        subcategory: 'Coin Tracker',
        min: 5,
        max: 30
    })
    resetDelay = 10;
    @SwitchProperty({
        name: 'Efficiency Tracker',
        description: 'Add efficiency to the coin tracker?',
        category: 'GUI',
        subcategory: 'Coin Tracker',
    })
    showEfficiency = false;

    @ButtonProperty({
        name: "Move Coin Tracker GUI",
        description: "Move the location of the coin tracker gui.",
        subcategory: "Edit",
        category: "GUI",
        placeholder: "Open"
    })
    myButtonAction() {
        Client.currentGui.close()
        setTimeout(() => {
            ChatLib.command("movecointracker", true)
        }, 1);
    }
    @ColorProperty({
        name: 'Coin tracker color',
        description: `sets the color of coin ctracker)`,
        category: 'GUI',
        subcategory: 'Edit',
    })
    trackerColor = Color.WHITE;
    @SwitchProperty({
        name: 'Auto Hide coin tracker',
        description: `after a certain amount of time, hide coin tracker`,
        category: 'GUI',
        subcategory: 'Edit',
    })
    hide = false;
    @SwitchProperty({
        name: 'Toggle Coin Tracker',
        description: `show/hide tracker`,
        category: 'GUI',
        subcategory: 'Edit',
    })
    coinTracker = true;
    // #endregion
    // #region Struc Check

    // #endregion
    // #region Block Highlight
    // outer blockhighlight
    @SwitchProperty({
        name: '§abhl',
        description: 'toggles block highlight',
        category: 'Block Highlight',
        subcategory: 'bhl',
    })
    blockHighlightSwitch = false;
    @SwitchProperty({
        name: '§bouter bhl',
        description: 'toggles block highlight outline',
        category: 'Block Highlight',
        subcategory: 'bhl',
    })
    blockHighlightOutlineSwitch = false;
    @TextProperty({
        name: '§bbhl block to search for',
        description: `enter the name of the block you want to search for`,
        category: 'Block Highlight',
        subcategory: 'bhl',
    })
    daBlock = "glass";

    @ColorProperty({
        name: '§bbhl custom color',
        description: `sets the color of your block highlight (set your preset color to custom for this to work!)`,
        category: 'Block Highlight',
        subcategory: 'bhl',
    })
    blockHighlightColor = Color.WHITE;

    @SliderProperty({
        name: "§bthickness",
        description: "sets a custom thickness of the block highlight.",
        category: "Block Highlight",
        subcategory: "bhl",
        min: 0,
        max: 6
    })
    blockHighlightThickness = 1;
    
    // inner blockhighlight
    @SwitchProperty({
        name: "§ainner bhl",
        description: "bhl but for the inside of the block",
        category: "Block Highlight",
        subcategory: "bhl",
    })
    innerBlockHighlightSwitch = true;
    @ColorProperty({
        name: '§binner bhl custom color',
        description: `sets the color of your inner block highlight (set your preset color to custom for this to work!) (currently not working)`,
        category: 'Block Highlight',
        subcategory: 'bhl',
    })
    innerBlockHighlightColor = Color.WHITE;

    @SliderProperty({
        name: "§binner opacity",
        description: "sets a custom opacity of the inner block highlight.",
        category: "Block Highlight",
        subcategory: "bhl",
        min: 0,
        max: 100
    })
    innerBlockHighlightOpacity = 15;
    @SliderProperty({
        name: "§dbhl max distance",
        description: "maximum distance an object can be to be highlighted",
        category: "Block Highlight",
        subcategory: "bhl",
        min: 0,
        max: 10
    })
    maxDist = 5;

    @SliderProperty({
        name: "§dbhl min distance",
        description: "sets the minimum distance required to highlight an object(set it to 0 to exclude it)",
        category: "Block Highlight",
        subcategory: "bhl",
        min: 0,
        max: 10
    })
    minDist = 0;
    // #endregion
    // #region Mining Stats
    //TODO: get from player stats automatically somehow
    @TextProperty({
        name: 'Gemstone Mining Speed',
        description: 'Enter your gemstone mining speed',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
    })
    gemMiningSpeed = "9576";
    @TextProperty({
        name: 'Gemstone Fortune',
        description: 'Enter your gemstone fortune',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
    })
    gemFortune = "2497";
    @TextProperty({
        name: 'Pristine',
        description: 'Enter your pristine',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
    })
    pristine = "18.63";
    @SwitchProperty({
        name: 'Precision Miner',
        description: 'Always use precision miner in calculations',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
    })
    alwaysPrecisionMiner = false;
    @SwitchProperty({
        name: 'Blue Cheese',
        description: 'Toggle on if you have a Blue Cheese Goblin Omelette',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
    })
    blueCheese = false;
    // #endregion
    // #region HELP
    
    @ButtonProperty({
        name: "I need help what do I do?",
        description: "Displays a list of all the commands in chat.",
        subcategory: "Help",
        category: "HELP",
        placeholder: "Get Help."
    })
    myButtonAction2() {
        Client.currentGui.close()
        setTimeout(() => {
            ChatLib.command("bahelp", true)
        }, 1);
    }
    // #endregion
    constructor() {
        this.initialize(this);
    }
}

export default new Settings();