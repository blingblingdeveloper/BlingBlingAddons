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
        const categories = ['Waypoints', 'Mining Skills', 'GUI', 'Struc Check', 'Block Highlight', 'Mining Stats', 'HELP'];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {
    // #region Waypoints
    @SwitchProperty({
        name: 'Waypoint Mode',
        description: 'enabled: waypoints, disabled: ordered',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    waypoint = true;
    @SwitchProperty({
        name: '§bi love cactus',
        description: 'skip ordered wps out of order. suggested by cactusloverr',
        category: 'Waypoints',
        subcategory: 'Waypoints',
    })
    cactusThing = false;
    
    @SwitchProperty({
        name: 'Waypoint Outline',
        description: 'toggles waypoint outline',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
    })
    waypointOutline = true;
    @ColorProperty({
        name: 'Waypoint Outline Color',
        description: 'change the outline color',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
    })
    waypointOutlineColor = Color.PINK;
    @SwitchProperty({
        name: 'Waypoint Fill',
        description: 'toggles waypoint fill',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
    })
    waypointFill = true;
    @ColorProperty({
        name: 'Waypoint Fill Color',
        description: 'change the fill color',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
    })
    waypointFillColor = Color.PINK;
    
    @ColorProperty({
        name: 'Text Color',
        description: 'change the waypoint label color',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
    })
    waypointTextColor = Color.WHITE;

    @SwitchProperty({
        name: 'Extra Line',
        description: 'toggles showing a line between veins',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
    })
    waypointExtraLine = false;
    @ColorProperty({
        name: 'Extra Line Color',
        description: 'color of the line',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
    })
    waypointLineColor = Color.WHITE;
    @SliderProperty({
        name: 'Extra Line Thickness',
        description: 'tickness of the line',
        category: 'Waypoints',
        subcategory: '§rWaypoint Visuals',
        min: 0,
        max: 30
    })
    waypointLineThickness = 3;
    
    @ColorProperty({
        name: 'Ordered Previous Color',
        description: 'color of the previous ordered waypoint',
        category: 'Waypoints',
        subcategory: '§r§rOrdered Waypoint Visuals',
    })
    orderedColorBefore = Color.BLACK;
    @ColorProperty({
        name: 'Ordered Next Color',
        description: 'color of the next ordered waypoint',
        category: 'Waypoints',
        subcategory: '§r§rOrdered Waypoint Visuals',
    })
    orderedColorAfter = Color.BLACK;
    @SwitchProperty({
        name: 'Ordered Line',
        description: 'toggles showing a tracer to the next vein',
        category: 'Waypoints',
        subcategory: '§r§rOrdered Waypoint Visuals',
    })
    orderedLine = true;
    @ColorProperty({
        name: 'Ordered Line Color',
        description: 'color of next block tracer',
        category: 'Waypoints',
        subcategory: '§r§rOrdered Waypoint Visuals',
    })
    orderedLineColor = Color.BLACK;
    @SliderProperty({
        name: 'Ordered Line Thickness',
        description: 'tickness of the line',
        category: 'Waypoints',
        subcategory: '§r§rOrdered Waypoint Visuals',
        min: 0,
        max: 30
    })
    orderedLineThickness = 3;

    // #endregion
    // #region Mining Skills
    @SwitchProperty({
        name: 'Ping Glide Sounds',
        description: 'plays a sound when you can start mining the next block',
        category: 'Mining Skills',
        subcategory: 'Ping Glide'
    })
    pingGlide = true;
    @TextProperty({
        name: 'Sound',
        description: 'specify what sound to use (1.8 sounds only)',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
        placeholder: 'dig.stone'
    })
    pingGlideSound = 'dig.stone';
    @SliderProperty({
        name: 'Volume',
        description: 'volume of ping glide sound',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
        min: 0,
        max: 100
    })
    pingGlideVolume = 32;
    @SliderProperty({
        name: 'Delay',
        description: 'delay (in ms) before the sound plays &c(will be changed in the future)',
        category: 'Mining Skills',
        subcategory: 'Ping Glide',
        min: 0,
        max: 2000
    })
    pingGlideDelay = 250;
    @SwitchProperty({
        name: 'Mining Speed Boost',
        description: 'toggles ping glide sounds during mining speed boost',
        category: 'Mining Skills',
        subcategory: 'Ping Glide'
    })
    pingGlideMsb = false;
    // #endregion
    // #region GUI
    @SwitchProperty({
        name: 'Toggle Coin Tracker',
        description: `show/hide tracker`,
        category: 'GUI',
        subcategory: 'Coin Tracker',
    })
    coinTracker = true;
    @SwitchProperty({
        name: 'Include Rough Estimate?',
        description: 'add rough gemstone profit estimate into $/hr and fl/hr',
        category: 'GUI',
        subcategory: 'Coin Tracker',
    })
    roughGems = false;
    @SwitchProperty({
        name: 'Efficiency Tracker',
        description: 'include block efficiency on coin tracker',
        category: 'GUI',
        subcategory: 'Coin Tracker',
    })
    showEfficiency = false;
    @SwitchProperty({
        name: 'Force NPC',
        description: 'use npc price for profits',
        subcategory: 'Coin Tracker',
        category: 'GUI'
    })
    forceNPC = false;
    @SwitchProperty({
        name: 'Use Sell Offer?',
        description: `use bazaar sell offer prices for profits`,
        category: 'GUI',
        subcategory: 'Coin Tracker',
    })
    sellOffer = true;
    @SelectorProperty({
        name: 'Gemstone Type',
        description: 'set the gemstone type to use for bazaar prices',
        subcategory: 'Coin Tracker',
        category: 'GUI',
        options: ['Rough', 'Flawed', 'Fine', 'Flawless', 'Perfect']
    })
    gemstoneType = 3;
    @SliderProperty({
        name: 'Reset Delay',
        description: 'how long to wait before resetting the tracker (seconds)',
        category: 'GUI',
        subcategory: 'Coin Tracker',
        min: 5,
        max: 30
    })
    resetDelay = 15;

    @ButtonProperty({
        name: 'Move Coin Tracker GUI',
        description: 'move the location of the coin tracker gui',
        subcategory: 'Edit',
        category: 'GUI',
        placeholder: 'Move'
    })
    myButtonAction() {
        Client.currentGui.close()
        setTimeout(() => {
            ChatLib.command('movecointracker', true)
        }, 1);
    }
    @ColorProperty({
        name: 'Coin Tracker Color',
        description: 'set the coin tracker text color',
        category: 'GUI',
        subcategory: 'Edit',
    })
    coinTrackerColor = Color.WHITE;
    @SwitchProperty({
        name: 'Auto Hide Coin Tracker',
        description: 'automatically hide the coin tracker when not mining',
        category: 'GUI',
        subcategory: 'Edit',
    })
    coinTrackerHide = false;
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
        placeholder: 'minecraft:stained_glass'
    })
    daBlock = 'minecraft:stained_glass';

    @ColorProperty({
        name: '§bbhl custom color',
        description: `sets the color of your block highlight (set your preset color to custom for this to work!)`,
        category: 'Block Highlight',
        subcategory: 'bhl',
    })
    blockHighlightColor = Color.WHITE;

    @SliderProperty({
        name: '§bthickness',
        description: 'sets a custom thickness of the block highlight',
        category: 'Block Highlight',
        subcategory: 'bhl',
        min: 0,
        max: 6
    })
    blockHighlightThickness = 1;
    
    // inner blockhighlight
    @SwitchProperty({
        name: '§ainner bhl',
        description: 'bhl but for the inside of the block',
        category: 'Block Highlight',
        subcategory: 'bhl',
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
        name: '§binner opacity',
        description: 'sets a custom opacity of the inner block highlight',
        category: 'Block Highlight',
        subcategory: 'bhl',
        min: 0,
        max: 100
    })
    innerBlockHighlightOpacity = 15;
    @SliderProperty({
        name: '§dbhl max distance',
        description: 'maximum distance an object can be to be highlighted',
        category: 'Block Highlight',
        subcategory: 'bhl',
        min: 0,
        max: 10
    })
    maxDist = 5;

    @SliderProperty({
        name: '§dbhl min distance',
        description: 'sets the minimum distance required to highlight an object(set it to 0 to exclude it)',
        category: 'Block Highlight',
        subcategory: 'bhl',
        min: 0,
        max: 10
    })
    minDist = 0;
    // #endregion
    // #region Mining Stats
    //TODO: get from player stats automatically somehow
    @TextProperty({
        name: 'Gemstone Mining Speed',
        description: 'enter your gemstone mining speed',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
        placeholder: '0'
    })
    gemMiningSpeed = '9576';
    @TextProperty({
        name: 'Gemstone Fortune',
        description: 'enter your gemstone fortune',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
        placeholder: '0'
    })
    gemFortune = '2497';
    @TextProperty({
        name: 'Pristine',
        description: 'enter your pristine',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
        placeholder: '0'
    })
    pristine = '18.63';
    @SwitchProperty({
        name: 'Precision Miner',
        description: 'always use precision miner in calculations',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
    })
    alwaysPrecisionMiner = false;
    @SwitchProperty({
        name: 'Blue Cheese',
        description: 'toggle on if you have a Blue Cheese Goblin Omelette',
        category: 'Mining Stats',
        subcategory: 'i\'m dumb, we\'ll import stats later <3',
    })
    blueCheese = false;
    // #endregion
    // #region HELP
    
    @ButtonProperty({
        name: 'I need help what do I do?',
        description: 'displays a list of all the commands in chat',
        subcategory: 'Help',
        category: 'HELP',
        placeholder: 'Get Help.'
    })
    myButtonAction2() {
        Client.currentGui.close()
        setTimeout(() => {
            ChatLib.command('bahelp', true)
        }, 1);
    }
    // #endregion
    constructor() {
        this.initialize(this);
        this.addDependency('Waypoint Outline Color', 'Waypoint Outline');
        this.addDependency('Waypoint Fill Color', 'Waypoint Fill');
        this.addDependency('Extra Line Color', 'Extra Line');
        this.addDependency('Extra Line Thickness', 'Extra Line');
        this.addDependency('Ordered Line Color', 'Ordered Line');
        this.addDependency('Ordered Line Thickness', 'Ordered Line');

        this.addDependency('Sound', 'Ping Glide Sounds');
        this.addDependency('Volume', 'Ping Glide Sounds');
        this.addDependency('Delay', 'Ping Glide Sounds');
        this.addDependency('Mining Speed Boost', 'Ping Glide Sounds');

        this.addDependency('Include Rough Estimate?', 'Toggle Coin Tracker');
        this.addDependency('Efficiency Tracker', 'Toggle Coin Tracker');
        this.addDependency('Force NPC', 'Toggle Coin Tracker');
        this.addDependency('Use Sell Offer?', 'Toggle Coin Tracker');
        this.addDependency('Gemstone Type', 'Toggle Coin Tracker');
        this.addDependency('Reset Delay', 'Toggle Coin Tracker');
        this.addDependency('Move Coin Tracker GUI', 'Toggle Coin Tracker');
        this.addDependency('Coin Tracker Color', 'Toggle Coin Tracker');
        this.addDependency('Auto Hide Coin Tracker', 'Toggle Coin Tracker');
    }
}

export default new Settings();

// return new PropertyAttributesExt(
//     propertyType,
//     configObj.name,
//     configObj.category,
//     configObj.subcategory ?? "",
//     configObj.description ?? "",
//     configObj.min ?? 0,
//     configObj.max ?? 0,
//     configObj.minF ?? 0,
//     configObj.maxF ?? 0,
//     configObj.decimalPlaces ?? 1,
//     configObj.increment ?? 1,
//     configObj.options ?? new java.util.ArrayList(),
//     configObj.allowAlpha ?? true,
//     configObj.placeholder ?? "",
//     configObj.protected ?? false,
//     configObj.triggerActionOnInitialization ?? true,
//     configObj.hidden ?? false,
// );