import Settings from "../settings"
import {drawCustomEspBox} from "./util/drawCustomEspBox.js"
import RenderLib from "RenderLib";

const isAdventure = () => { return Client.getMinecraft().field_71442_b.func_178889_l().func_82752_c(); } // https://discord.com/channels/119493402902528000/688773480954855537/1119311910773477397 @Matt ct disc credits
let isSearching = true;
let coordinatesArray = [];
let draw = true;

register('renderWorld', () => {
  coordinatesArray.forEach(coordinates => {
    let x = coordinates.x;
    let y = coordinates.y;
    let z = coordinates.z;
    drawBlock(x,y,z)
  });
})
 
register("step", () => {
  search(Settings.daBlock,1) 
}).setFps(1)

 let clear = true;
 let x = Player.getX();
 let y = Player.getY();
 let z = Player.getZ();
 //idk why but apparently it's not 4.5  
function drawBlock(x,y,z){
if(Settings.blockHighlightSwitch){
if(Settings.blockHighlightOutlineSwitch){
  drawCustomEspBox(Math.floor(x)+.5, Math.floor(y), Math.floor(z)+.5, Settings.blockHighlightThickness, 1, 1, Settings.blockHighlightColor.getRed()/255,Settings.blockHighlightColor.getGreen()/255,Settings.blockHighlightColor.getBlue()/255, 1, false)
}
  if (Settings.innerBlockHighlightSwitch) {
    RenderLib.drawInnerEspBox(Math.floor(x)+.49, Math.floor(y)-0.01, Math.floor(z)+0.49, 1., 1., Settings.innerBlockHighlightColor.getRed(), Settings.innerBlockHighlightColor.getGreen(), Settings.innerBlockHighlightColor.getBlue(), Settings.innerBlockHighlightOpacity/100, false)
    RenderLib.drawInnerEspBox(Math.floor(x)+.51, Math.floor(y)+0.01, Math.floor(z)+0.51, 1., 1.,  Settings.innerBlockHighlightColor.getRed(), Settings.innerBlockHighlightColor.getGreen(), Settings.innerBlockHighlightColor.getBlue(), Settings.innerBlockHighlightOpacity/100, false)
}
}
}
function search(blockToFind, type) {
  let newCoords = [];
  let scanSize = parseFloat(Settings.maxDist);//not the distance check
  let playerX = Math.floor(Player.getX());
  let playerY = Math.floor(Player.getY());
  let playerZ = Math.floor(Player.getZ());
  for (let x = playerX - scanSize; x <= playerX + scanSize; x++) {
    for (let y = playerY - scanSize; y <= playerY + scanSize; y++) {
      for (let z = playerZ - scanSize; z <= playerZ + scanSize; z++) {
        let block = World.getBlockAt(x, y, z);
        if (block) {
          if (block.toString().includes(blockToFind)) {
            let x1 = x;
            let y1 = y;
            let z1 = z;
            var dx = playerX - x1;
            var dy = playerY+1 - y1;
            var dz = playerZ - z1;
        
            let distance = Math.sqrt( dx * dx + dy * dy + dz * dz );
            if ( distance >parseFloat(Settings.minDist) && distance <= parseFloat(Settings.maxDist)){
              coordinatesArray.push({ x: x1, y: y1, z: z1});
              newCoords.push({ x: x1, y: y1, z: z1 });
            }
          }
        }
      }
    }
  }
  if(newCoords != coordinatesArray){
    coordinatesArray=newCoords;
  }
}