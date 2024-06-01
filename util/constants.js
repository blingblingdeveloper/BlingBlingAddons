import PogObject from "PogData"
import { updateRegisters } from "./helperFunctions"

let PogData = new PogObject("blingblingaddons", {
    "api_key": "",
    "professional": 0,
    "jungle_amulet": true,
    "first_time": true,
    "tracked": {},
    "itemStringed": "",
    "museum": [],
    "currentPet": "",
    "effMinerEnabled": false,
    "powdertrackerGui": {
        "chests": 0,
        "gemstonePowder": 0,
        "mithrilPowder": 0,
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    }
}, "config/data.json")

export default constants = {
    PREFIX: "§d[BBA] ",
    CALCULATEERRORMESSAGE: `${PREFIX}&cInvalid arguments. '/ba calculate help' for more information.`,
    INVALIDARGS: `${PREFIX}&cInvalid arguments. '/ba help' for more information.`,
    VERSION: (JSON.parse(FileLib.read("blingblingaddons", "metadata.json"))).version,
    data: PogData,
    beta: false,
    checkedGemstoneStats: false
}


register("chat", (lvl, pet, event) => {
    constants.data.currentPet = pet.toLowerCase()
    constants.data.save()
}).setCriteria(/&cAutopet &eequipped your &.\[Lvl ([0-9]+)] &.([a-zA-Z]+)&e! &a&lVIEW RULE&r/g)


register("chat", (message, pet, event) => {
    if(message == "summoned")
        constants.data.currentPet = pet.toLowerCase()
    else if (message == "despawned")
        constants.data.currentPet = "N/A"

    constants.data.save()
}).setCriteria(/&r&aYou ([a-zA-Z]+) your &r&.([a-zA-Z✦ ]+)&r&a!&r/g)


register("chat", (state, event) => {
    constants.data.effMinerEnabled = state == "Enabled"
    constants.data.save()
}).setCriteria(/&r&.([a-zA-Z]+) Efficient Miner&r/g)


// ct load
updateRegisters()

register("worldLoad", () => {
    updateRegisters()
})

// Event handler for GUI settings close.
register("guiClosed", (event) => {
    updateRegisters();
});

register("guiOpened", (event) => {
    updateRegisters();
});