// import {  @Vigilant, @ButtonProperty,
//     @CheckboxProperty,
//     Color,
//     @ColorProperty,
//     @PercentSliderProperty,
//     @SelectorProperty,
//     @SwitchProperty,
//     @TextProperty,
//     @Vigilant,
//     @SliderProperty
//  } from 'Vigilance';
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
@Vigilant("blingblingaddons")
@Vigilant('blingblingaddons', 'config',{
    getCategoryComparator: () => (a, b) => {
        // By default, categories, subcategories, and properties are sorted alphabetically.
        // You can override this behavior by returning a negative number if a should be sorted before b,
        // or a positive number if b should be sorted before a.

        // In this case, we can put Not general! to be above general.
        const categories = ["Waypoints", "Mining Skills","bhl","Struc Check","Gui","HELP"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
})
class Settings {
    @SwitchProperty({
        name: '§aPing Glide Sounds',
        description: 'toggles ping glide sounds',
        category: 'Mining Skills',
        subcategory: 'm',
        placeholder: 'Activate',
    })
    pingGlide = true;
    @TextProperty({
        name: 'sound',
        description: 'specify what sound to use(1.8 sounds only)',
        category: 'Mining Skills',
        subcategory: 'm',
        placeholder: 'Activate',
    })
    pingGlideSound = "dig.stone";
    @SliderProperty({
        name: "volume",
        description: "Volume of ping glide sound.",
        category: "Mining Skills",
        subcategory: "m",
        min: 0,
        max: 100
    })
    vol = 32;
    @SliderProperty({
        name: "delay",
        description: "Delay (in ms)",
        category: "Mining Skills",
        subcategory: "m",
        min: 0,
        max: 2000
    })
    del = 250;
    @SwitchProperty({
        name: "speed",
        description: 'toggles ping glide sounds during speed boost',
        category: 'Mining Skills',
        subcategory: 'm',
        placeholder: 'Activate',
    })
    sp = true;
   // outer blockhighlight

   @SwitchProperty({
    name: '§abhl',
    description: 'toggles block highlight',
    category: 'bhl',
    subcategory: 'bhl',
    placeholder: 'Activate',
})
blockHighlightSwitch = false;
@SwitchProperty({
    name: '§bouter bhl',
    description: 'toggles block highlight outline',
    category: 'bhl',
    subcategory: 'bhl',
    placeholder: 'Activate',
})
blockHighlightOutlineSwitch = false;
@TextProperty({
    name: '§bbhl block to search for',
    description: `enter the name of the block you want to search for`,
    category: 'bhl',
    subcategory: 'bhl',
})
daBlock = "glass";

@ColorProperty({
    name: '§bbhl custom color',
    description: `sets the color of your block highlight (set your preset color to custom for this to work!)`,
    category: 'bhl',
    subcategory: 'bhl',
})
blockHighlightColor = Color.WHITE;

@SliderProperty({
    name: "§bthickness",
    description: "sets a custom thickness of the block highlight.",
    category: "bhl",
    subcategory: "bhl",
    min: 0,
    max: 6
})
blockHighlightThickness = 1;



// inner blockhighlight

@SwitchProperty({
    name: "§ainner bhl",
    description: "bhl but for the inside of the block",
    category: "bhl",
    subcategory: "bhl",
})
innerBlockHighlightSwitch = true;
@ColorProperty({
    name: '§binner bhl custom color',
    description: `sets the color of your inner block highlight (set your preset color to custom for this to work!) (currently not working)`,
    category: 'bhl',
    subcategory: 'bhl',
})
innerBlockHighlightColor = Color.WHITE;

@SliderProperty({
    name: "§binner opacity",
    description: "sets a custom opacity of the inner block highlight.",
    category: "bhl",
    subcategory: "bhl",
    min: 0,
    max: 100
})
innerBlockHighlightOpacity = 15;
@SliderProperty({
    name: "§dbhl max distance",
    description: "maximum distance an object can be to be highlighted",
    category: "bhl",
    subcategory: "bhl",
    min: 0,
    max: 10
})
maxDist = 5;

@SliderProperty({
    name: "§dbhl min distance",
    description: "sets the minimum distance required to highlight an object(set it to 0 to exclude it)",
    category: "bhl",
    subcategory: "bhl",
    min: 0,
    max: 10
})
minDist = 0;

@SwitchProperty({
    name: "§dshow all veins",
    description: "enable = waypoints disable = ordered",
    category: "Waypoints",
    subcategory: "Waypoints",
})
waypoint=true
@SwitchProperty({
    name: "§dshow line between veins",
    description: "activate",
    category: "Waypoints",
    subcategory: "Waypoints",
})
extraLine=false
@SwitchProperty({
    name: '§bwaypoint outline',
    description: 'toggles waypoint outline',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
wpOutline = true;
@SwitchProperty({
    name: '§bi love cactus',
    description: 'skip ordered wps out of order. suggested by cactusloverr',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    // placeholder: 'Activate',
})
cactusThing = false;
@ColorProperty({
    name: '§bwaypoints outline color',
    description: 'waypoint inner color',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
OuterColor = Color.PINK;
@SwitchProperty({
    name: '§bwaypoints inner',
    description: 'toggles waypoint inner outline',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
wpInner = true;
@ColorProperty({
    name: '§bwaypoints inner color',
    description: 'waypoint inner color',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
InnerColor = Color.WHITE;
@ColorProperty({
    name: '§btext color',
    description: 'text inner color',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
textColor = Color.WHITE;
@SliderProperty({
    name: '§binner ocupacity',
    description: 'ocupacity of inner waypoint',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
    min: 0,
    max: 100
})
ocupacity=3;

@SliderProperty({
    name: '§bthickness',
    description: 'ordered line thickness',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
    min: 0,
    max: 30
})
orderedLineThickness=3;
@ColorProperty({
    name: '§bordered color',
    description: 'color of ordered line',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
orderedColor = Color.BLACK;
@ColorProperty({
    name: '§bordered previous color',
    description: 'color of previous ordered wp',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
orderedColorBefore = Color.BLACK;
@ColorProperty({
    name: '§bordered next color',
    description: 'color of next ordered wp',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
})
orderedColorAfter = Color.BLACK;
@SliderProperty({
    name: '§btext size',
    description: 'size of text',
    category: 'Waypoints',
    subcategory: 'Waypoints',
    placeholder: 'Activate',
    min: 0,
    max: 30
})
textSize=3;

@SelectorProperty({
    name: "Gemstone Type",
    description: "Sets the type of gemstones to use for coin tracker for bazaar prices.",
    subcategory: "Coin Tracker",
    category: "Gui",
    options: ["Perfect", "Flawless", "Fine", "Flawed", "Rough"]
})
gemstoneType = 2;
@SwitchProperty({
    name: "Force NPC",
    description: "Forces NPC price for the coin tracker.",
    subcategory: "Coin Tracker",
    category: "Gui"
})
forceNPC = false;
@SwitchProperty({
    name: 'Use Sell Offer?',
    description: `uses sell offer for coin tracker`,
    category: 'Gui',
    subcategory: 'Coin Tracker',
})
sellOffer = true;
@ButtonProperty({
    name: "Coin Tracker Gui",
    description: "Move the location of the coin tracker gui.",
    subcategory: "edit",
    category: "Gui",
    placeholder: "Open"
})
myButtonAction() {
    Client.currentGui.close()
    setTimeout(() => {
        ChatLib.command("movecointracker",true)
    }, 1);
}
@ColorProperty({
    name: 'Coin tracker color',
    description: `sets the color of coin ctracker)`,
    category: 'Gui',
    subcategory: 'edit',
})
trackerColor = Color.WHITE;
@SwitchProperty({
    name: 'Auto Hide coin tracker',
    description: `after a certain amount of time, hide coin tracker`,
    category: 'Gui',
    subcategory: 'edit',
})
hide = false;
@SwitchProperty({
    name: 'Toggle Coin Tracker',
    description: `show/hide tracker`,
    category: 'Gui',
    subcategory: 'edit',
})
coinTracker = true;
@ButtonProperty({
    name: "I need help what do i do?",
    description: "Displays a list of all the commands in chat.",
    subcategory: "Help",
    category: "HELP",
    placeholder: "Get Help."
})
myButtonAction2() {
    Client.currentGui.close()
    setTimeout(() => {
        ChatLib.command("bahelp",true)
    }, 1);
}


    constructor() {
        this.initialize(this);
    }
}

export default new Settings();