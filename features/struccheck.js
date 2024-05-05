const searchDistance = 25;
const searchRadius = 1;
let veinWaypoints = [];
let wp = veinWaypoints.length > 0 ? Math.max(...veinWaypoints.map(point => point.veinNum)) : 0;
import {drawCustomEspBox} from "./util/drawCustomEspBox.js"
import Settings from "../settings"

register("command", (message) => {
    if (Player.lookingAt()?.getRegistryName() !== "minecraft:air") {
        wp = veinWaypoints.length > 0 ? Math.max(...veinWaypoints.map(point => point.veinNum)) : 0;
        if (isNaN(parseInt(message))) {
            ChatLib.chat("Invalid input. Please provide a valid number for vein number.");
            return;
        }
        
        if (parseInt(message) <= wp + 1) {
            veinWaypoints.forEach(waypoint => {
                if (waypoint.veinNum >= parseInt(message)) {
                    waypoint.veinNum += 1;
                }
            });
            let lookingAt = Player.lookingAt();
            if (lookingAt instanceof Block) {
                let blocksToSearch = new Map();
                blocksToSearch.set(getcoords(lookingAt), lookingAt);
                let searchedBlocks = new Map();
                for (let distance = 1; distance <= searchDistance; distance++) {
                    let newblocks = new Map();
                    blocksToSearch.forEach(block => {
                        searchedBlocks.set(getcoords(block), block);
                        searchAdjacent(block).forEach(newblock => {
                            if (!(newblocks.has(getcoords(newblock)) || searchedBlocks.has(getcoords(newblock)))) {
                                newblocks.set(getcoords(newblock), newblock);
                            }
                        });
                    });
                    blocksToSearch = newblocks;
                }
                searchedBlocks.forEach(block => {
                    veinWaypoints.push({
                        x: block.getX(),
                        y: block.getY(),
                        z: block.getZ(),
                        blockId: block.getType().getID(),
                        veinNum: parseInt(message)
                    });
                });
            }
        } else {
            ChatLib.chat("Cannot insert waypoint with vein number " + message + ". Next allowed vein number is " + (wp + 1));
        }
    } else {
        ChatLib.chat("Cannot insert waypoint. Looking at air.");
    }
    ChatLib.chat("Vein size: " + veinWaypoints.length);
}).setCommandName("sv");
register("command", (message) => {
    let veinNum = parseInt(message);
    veinWaypoints = veinWaypoints.filter(waypoint => waypoint.veinNum !== veinNum);
    
    // Subtract 1 from vein numbers greater than veinNum
    veinWaypoints.forEach(waypoint => {
        if (waypoint.veinNum > veinNum) {
            waypoint.veinNum -= 1;
        }
    });
}).setName('removevein').setAliases(['rv']);

register('command', () => {
    const Toolkit = Java.type("java.awt.Toolkit");
    const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
    veinWaypoints = JSON.parse(clipboardData)
    ChatLib.chat("loaded!")
}).setName('loadvein').setAliases(['lv']);

function searchAdjacent(block) {
    matchingBlocks = [];

    toSearch = [
        World.getBlockAt(block.pos.north()),
        World.getBlockAt(block.pos.east()),
        World.getBlockAt(block.pos.south()),
        World.getBlockAt(block.pos.west()),
        World.getBlockAt(block.pos.up()),
        World.getBlockAt(block.pos.down())
    ];

    for(let i = 0; i < toSearch.length; i++) {
        if(block.type.getRegistryName().includes(toSearch[i].type.getRegistryName())||toSearch[i].type.getRegistryName().includes(block.type.getRegistryName())) {
            matchingBlocks.push(toSearch[i]);
        }
    }

    return matchingBlocks;
}
let color = rgbToColorInt(Settings.textColor.getRed(),Settings.textColor.getGreen(),Settings.textColor.getBlue());
let color2 = rgbToColorInt(255,0,0);
function rgbToColorInt(red, green, blue) {
    return (255 << 24) | (red << 16) | (green << 8) | blue;
}
register("renderWorld", () => {
    
    for(let i = 0; i < veinWaypoints.length; i++) {
                    let veinNum = veinWaypoints[i].veinNum;
        let distToPlayerSq = (veinWaypoints[i].x-Player.getRenderX())**2 + (veinWaypoints[i].y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2 + (veinWaypoints[i].z-Player.getRenderZ())**2
        let distToPlayer=Math.sqrt(distToPlayerSq)
        let distRender=Math.min(distToPlayer,50)
        let includeVerticalDistance=false
        let distanceText = includeVerticalDistance ? Math.hypot(veinWaypoints[i].x-Player.getRenderX(), veinWaypoints[i].y-(Player.getRenderY() +
        Player.getPlayer()["func_70047_e"]()), veinWaypoints[i].z-Player.getRenderZ()) :
        Math.hypot(veinWaypoints[i].x-Player.getRenderX(), veinWaypoints[i].z-Player.getRenderZ())
        if(distToPlayer<30){
            drawCustomEspBox(Math.floor(veinWaypoints[i].x)+.5, Math.floor(veinWaypoints[i].y), Math.floor(veinWaypoints[i].z)+.5, Settings.blockHighlightThickness, 1, 1, Settings.blockHighlightColor.getRed()/255,Settings.blockHighlightColor.getGreen()/255,Settings.blockHighlightColor.getBlue()/255, 1, false)
            if(i === 0 || veinNum != veinWaypoints[i-1].veinNum){
                Tessellator.drawString(veinNum,veinWaypoints[i].x+.5,veinWaypoints[i].y+1.5,veinWaypoints[i].z+.5,color,true,distRender/200,false);
            
            }
        }
    }
     

    for(let i = 0; i < strucWaypoints.length; i++) {
        let missingBlocks = [];
        drawCustomEspBox(Math.floor(strucWaypoints[i].x)+.5, Math.floor(strucWaypoints[i].y), Math.floor(strucWaypoints[i].z)+.5, Settings.blockHighlightThickness, 1, 1, Settings.blockHighlightColor.getRed()/255,Settings.blockHighlightColor.getGreen()/255,Settings.blockHighlightColor.getBlue()/255, 1, false)

        if(i > 0){
            if(strucWaypoints[i].veinNum != strucWaypoints[i-1].veinNum){
                missingBlocks = strucWaypoints.filter(block => block.veinNum === strucWaypoints[i].veinNum)
            }
        } else {
            missingBlocks = strucWaypoints.filter(block => block.veinNum === strucWaypoints[0].veinNum)
        }
        if(i === 0 || strucWaypoints[i].veinNum !== strucWaypoints[i-1].veinNum){
            Tessellator.drawString(`Missing blocks: ${missingBlocks.length}, Vein: ${strucWaypoints[i].veinNum}`,strucWaypoints[i].x+.5,strucWaypoints[i].y+1.5,strucWaypoints[i].z+.5,color2,true,Math.min(Math.hypot(strucWaypoints[i].x-Player.getRenderX(), strucWaypoints[i].z-Player.getRenderZ()),50)/200,false);
        }
    }
})

function getcoords(block) {
    return `${block.getX()},${block.getY()},${block.getZ()}`;
}
let strucWaypoints = [];
    register('command', (message) => {
        ChatLib.command(`ct copy ${JSON.stringify(veinWaypoints)}`, true)
      }).setName('exportstruc').setAliases(['se']);
register('command', () => {
    strucWaypoints = [];
    ChatLib.chat("checking rn bro")
        for (let i = 0; i < veinWaypoints.length; i++) {
            let block = World.getBlockAt(veinWaypoints[i].x, veinWaypoints[i].y, veinWaypoints[i].z)
            if (block.getType().getID() != veinWaypoints[i].blockId){
            strucWaypoints.push(veinWaypoints[i])
            }
            // else{
            //     ChatLib.chat("all good")
            // }
        }
    veinWaypoints = []
        if (strucWaypoints.length ==0){
            ChatLib.chat("No structure grief!")
        }
}).setName('checkstruc').setAliases(['cs']);