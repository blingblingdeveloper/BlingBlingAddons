import {drawCustomEspBox} from "./util/drawCustomEspBox.js"
import RenderLib from "RenderLib";
import Settings from "../settings"

let data=[];
const processArray = (data) => {
    const resultArray = [];
  
    data.forEach(({ x, y, z, options: { name } }) => {
      resultArray[name - 1] = { x, y, z };
    });
  
    return resultArray;
  }

let res = processArray(data);
const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");
register('command', (message) => {
    if (message.includes(' ')) {
        return;
    }
    const index = Number(message);
    if (Number.isNaN(index)) {
        ChatLib.chat("§d[BlingBling Addons] §cInvalid index, must be a number.");
        return;
    }
    const adjustedIndex = index - 1; // decrement index by 1
    data.splice(adjustedIndex, 1);
    for (let i = adjustedIndex; i < data.length; i++) {
        data[i].options.name--;
    }
    res = processArray(data);
    ChatLib.chat(`§d[BlingBling Addons] §fWaypoint ${index} removed successfully!`);
}).setName('ba rwp').setAliases(['rwp','barwp']);


register('command', (message) => {
  const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
  let data = clipboard.getData(DataFlavor.stringFlavor);
  data = JSON.parse(data);
  const convertedData = data.map((obj, index) => {
    if (!obj.options) {
      obj.options = {};
    }
    obj.options.name = index + 1;
    return obj;
  })
  
ChatLib.command(`ct copy ${JSON.stringify(convertedData)}`, true)
ChatLib.chat(`§d[BlingBling Addons] §fconverted dillopro to cw waypoints and exported to clipboard!`);
}).setName('cactusiscool').setAliases(['cactus']);
register('command', (message) => {
  const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
  const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
  const inputData = JSON.parse(clipboardData);
  const data2 = inputData.map(obj => {
    const { x, z, options } = obj;
    return { x, y: 63, z, r: obj.r, g: obj.g, b: obj.b, options };
  });

  ChatLib.chat(`§d[BlingBling Addons] §f${inputData.length} y64 waypoints successfully exported to clipboard!`);
  ChatLib.command(`ct copy ${JSON.stringify(data2)}`, true)
}).setName('y64').setAliases(['y64']);








register('command', (message) => {
    const [indexStr, ...coords] = message.split(' ');
    if (message.includes(' ')) {
        return;
    }
    const index = Number.isNaN(Number(indexStr)) ? undefined : Math.max(0, Math.min(Number(indexStr) - 1, data.length)); // decrement index by 1 and clamp to data length
    if (index === undefined) {
        ChatLib.chat("§d[BlingBling Addons] §cInvalid index, must be a number.");
        return;
    }
    const x = Math.floor(Player.getX());
    const y = Math.floor(Player.getY())-1;
    const z = Math.floor(Player.getZ());
    if (index === data.length) { // if index is equal to data length, we are adding a new waypoint, otherwise we are inserting into an existing one
        const newWaypoint = {
            x,
            y,
            z,
            r: 0,
            g: 1,
            b: 0,
            options: { name: index + 1 }
        };
        data.push(newWaypoint); // push the new waypoint
        res = processArray(data); // update the result array
        ChatLib.chat(`§d[BlingBling Addons] §fWaypoint ${index+1} added successfully!`);
    } else { // if index is not equal to data length, we are inserting into an existing waypoint
        const newWaypoint = {
            x,
            y,
            z,
            r: 0,
            g: 1,
            b: 0,
            options: { name: index + 1 }
        };
        data.splice(index, 0, newWaypoint); // insert the new waypoint at the index
        for (let i = index + 1; i < data.length; i++) { // update the names of all following waypoints
            data[i].options.name++;
        }
        res = processArray(data); // update the result array
        if (y!=62)
        ChatLib.chat(`§d[BlingBling Addons] §4Waypoint ${index+1} added successfully!`);
    }

}).setName('ba swp').setAliases(['swp','ba swp','ba insert']);

register('command', (message) => {
  ChatLib.command(`ct copy ${JSON.stringify(data)}`, true)
}).setName('export').setAliases(['e']);

register('command', () => {
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
    data = JSON.parse(clipboardData)
    res = processArray(data);
}).setName('load').setAliases(['l']);
register('command', (message) => {
  wp = (wp +  parseInt(message, 10)) % res.length;
  ChatLib.chat(`§d[BlingBling Addons] §fwent forward ${message} waypoints`);
}).setName('skip').setAliases(['skip']);

register('command', (message) => {
  wp = (wp - parseInt(message, 10) + data.length) % data.length; // modulo with length ensures we stay within bounds
  ChatLib.chat(`§d[BlingBling Addons] §fwent back ${message} waypoints`);
}).setName('unskip').setAliases(['unskip']);

register('command', (message) => {
      data = [];
    res = processArray(data);
}).setName('unload').setAliases(['unload']);


register('command', (message) => {
  if(Client.getMinecraft().field_71442_b.func_178889_l().func_77145_d()){
  ChatLib.chat(`§d[BlingBling Addons] §fPlacing blocks!`);
  for (let i = 0; i < res.length; i++) {

  ChatLib.command(`setblock ${res[i].x} ${res[i].y} ${res[i].z} ${message}`, false);
}
  }
}).setName('setblocks').setAliases(['sb']);






    // // data = [{"x":211,"y":72,"z":257,"r":0,"g":1,"b":0,"options":{"name":1}},{"x":212,"y":72,"z":259,"r":0,"g":1,"b":0,"options":{"name":2}}]
    //#1460 63 220 //810 63 333
    // data = JSON.parse(clipboardData.toString())
    // res = processArray(data);


//res[waypoint#].x/y/z
// register("command", (message) => {
// drawBlock(res[0].x,res[0].y,res[0].z)
// }).setName('test').setAliases(['t']);p
register('renderWorld', () => {
  if (res.length > 0){
  if (Settings.waypoint) { //waypoints
    for (let i = 0; i < res.length; i++) {
        drawBlock(i, res[i].x, res[i].y, res[i].z,Settings.OuterColor.getRed(),Settings.OuterColor.getGreen(), Settings.OuterColor.getBlue());
        drawInnerBlock(i, res[i].x, res[i].y, res[i].z,Settings.InnerColor.getRed(),Settings.InnerColor.getGreen(), Settings.InnerColor.getBlue());
    }
    for (let i = 0; i < res.length-1; i++) {
        drawFunc(res[i].x, res[i].y, res[i].z,res[i+1].x, res[i+1].y, res[i+1].z)
    }
    if(res.length > 1) {
      drawFunc(res[res.length-1].x, res[res.length-1].y, res[res.length-1].z,res[0].x, res[0].y, res[0].z,)//this is last wp -> 1st
    }
  //   if(Settings.extraLine){
  // trace(res[wp].x+0.5, res[wp].y+0.5, res[wp].z+0.5, 255, 255, 255,Settings.orderedLineThickness, 0.5);
  //   }
  }
  else{ //ordered waypoints
    const wpBefore2 = (wp-2+res.length)%res.length;
    const wpBefore1 = (wp-1+res.length)%res.length;
    drawBlock(wp, res[wp].x, res[wp].y, res[wp].z,Settings.orderedColorAfter.getRed(),Settings.orderedColorAfter.getGreen(), Settings.orderedColorAfter.getBlue());//this is end
    drawBlock(wpBefore2, res[wpBefore2].x, res[wpBefore2].y, res[wpBefore2].z,Settings.orderedColorBefore.getRed(),Settings.orderedColorBefore.getGreen(), Settings.orderedColorBefore.getBlue());//this is beginning
    drawBlock(wpBefore1, res[wpBefore1].x, res[wpBefore1].y, res[wpBefore1].z,Settings.OuterColor.getRed(),Settings.OuterColor.getGreen(), Settings.OuterColor.getBlue());//this is middle
    
    
    // drawInnerBlock(wp, res[wp].x, res[wp].y, res[wp].z,Settings.OuterColor.getRed(),Settings.OuterColor.getGreen(), Settings.OuterColor.getBlue());
    // drawInnerBlock(wpBefore2, res[wpBefore2].x, res[wpBefore2].y, res[wpBefore2].z,Settings.orderedColorBefore.getRed(),Settings.orderedColorBefore.getGreen(), Settings.orderedColorBefore.getBlue());
    // drawInnerBlock(wpBefore1, res[wpBefore1].x, res[wpBefore1].y, res[wpBefore1].z,Settings.orderedColorAfter.getRed(),Settings.orderedColorAfter.getGreen(), Settings.orderedColorAfter.getBlue());
    drawInnerBlock(wp, res[wp].x, res[wp].y, res[wp].z,Settings.orderedColorAfter.getRed(),Settings.orderedColorAfter.getGreen(), Settings.orderedColorAfter.getBlue());
    drawInnerBlock(wpBefore2, res[wpBefore2].x, res[wpBefore2].y, res[wpBefore2].z,Settings.orderedColorBefore.getRed(),Settings.orderedColorBefore.getGreen(), Settings.orderedColorBefore.getBlue());
    drawInnerBlock(wpBefore1, res[wpBefore1].x, res[wpBefore1].y, res[wpBefore1].z,Settings.OuterColor.getRed(),Settings.OuterColor.getGreen(), Settings.OuterColor.getBlue());
    trace(res[wp].x+0.5, res[wp].y+0.5, res[wp].z+0.5,Settings.orderedColor.getRed()/255,Settings.orderedColor.getGreen()/255,Settings.orderedColor.getBlue()/255,Settings.orderedLineThickness, 1);
    if(Settings.extraLine){
    drawFunc(res[wpBefore2].x, res[wpBefore2].y, res[wpBefore2].z, res[wpBefore1].x, res[wpBefore1].y, res[wpBefore1].z,)
    drawFunc(res[wpBefore1].x, res[wpBefore1].y, res[wpBefore1].z, res[wp].x, res[wp].y, res[wp].z,)
    }
  }
}
})
let wp = 0;
let wpSize = Settings.textSize;
let nearbyWaypoints = [];
register('tick', () => {
  
  if (res.length > 0) {
    const playerX = Math.floor(Player.getX());
    const playerY = Math.floor(Player.getY());
    const playerZ = Math.floor(Player.getZ());

    let dx = playerX - res[wp].x;
    let dy = playerY - res[wp].y;
    let dz = playerZ - res[wp].z;

    let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    if (wp === 0) {
      nearbyWaypoints = [];
    }
    if (distance <= 3) {

      wp = (wp + 1) % res.length;
  }
  if (nearbyWaypoints.includes(wp) && Settings.cactusThing) {
    wp = (wp + 1) % res.length;
  }
  
if (res.length > 3 && Settings.cactusThing){
for (let wpIndex = 0; wpIndex < res.length; wpIndex++) {
  let wpX = playerX - res[wpIndex].x;
  let wpY = playerY - res[wpIndex].y;
  let wpZ = playerZ - res[wpIndex].z;
  let wpDistance = Math.sqrt(wpX * wpX + wpY * wpY + wpZ * wpZ);

    // Do something with the distance, such as checking if it's within a certain range
    // For example:
    if (wpDistance < 3 && !nearbyWaypoints.includes(wpIndex) && wpIndex != wp-1){
      let e = wpIndex+1; 
      nearbyWaypoints.push(wpIndex);
    }
  }
}
  }
  color = rgbToColorInt(Settings.textColor.getRed(),Settings.textColor.getGreen(),Settings.textColor.getBlue());
  wpSize=Settings.textSize
})

register('command', (message) => {
  ChatLib.chat("Colors: " + Settings.orderedColor.getRed() + " " + Settings.orderedColor.getGreen() + " " + Settings.orderedColor.getBlue())
}).setName('reset wp').setAliases(['ree']);






let color = rgbToColorInt(Settings.textColor.getRed(),Settings.textColor.getGreen(),Settings.textColor.getBlue());

function rgbToColorInt(red, green, blue) {
    return (255 << 24) | (red << 16) | (green << 8) | blue;
}

function drawBlock(wpNum,x,y,z,red,green,blue){
    // let distToPlayerSq = (x-Player.getRenderX())**2 + (y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2 + (z-Player.getRenderZ())**2
    // let distToPlayer=Math.sqrt(distToPlayerSq)
    // let distRender=Math.min(distToPlayer,50)
    // let includeVerticalDistance=false
    // let distanceText = includeVerticalDistance ? Math.hypot(x-Player.getRenderX(), y-(Player.getRenderY() +
    // Player.getPlayer()["func_70047_e"]()), z-Player.getRenderZ()) :
    // Math.hypot(x-Player.getRenderX(), z-Player.getRenderZ())
  if(Settings.wpOutline){
    RenderLib.drawEspBox(Math.floor(x)+.5, Math.floor(y), Math.floor(z)+.5,  1, 1, red/255,green/255, blue/255, 1, true)
  // RenderLib.drawEspBox(Math.floor(x)+.5, Math.floor(y), Math.floor(z)+.5,  1, 1, Settings.OuterColor.getRed(),Settings.OuterColor.getGreen(), Settings.OuterColor.getBlue(), 1, true)
  }

  Tessellator.drawString(wpNum+1,x+.5,y+1.5,z+.5,color,true,wpSize/100,false)
  }
  function drawInnerBlock(wpNum,x,y,z,red,green,blue){
    if(Settings.wpInner){
      RenderLib.drawInnerEspBox(Math.floor(x)+.49, Math.floor(y)-0.01, Math.floor(z)+0.49, 1, 1, red/255,green/255,blue/255, Settings.ocupacity/100, true) 
      RenderLib.drawInnerEspBox(Math.floor(x)+.51, Math.floor(y)+0.01, Math.floor(z)+0.51, 1, 1, red/255,green/255,blue/255, Settings.ocupacity/100, true)
}
  }
    function drawFunc(x,y,z,x2,y2,z2){
      drawLine(x+0.5,y+0.5,z+0.5,x2+0.5,y2+0.5,z2+0.5,Settings.orderedColor.getRed()/255,Settings.orderedColor.getGreen()/255,Settings.orderedColor.getBlue()/255,3,1) //2 is thickness
  }
  const drawLine = (x1, y1, z1, x2, y2, z2, red, green, blue, width, alpha) => {
    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(width);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDepthMask(false);
    GlStateManager.func_179094_E(); // pushMatrix()

    Tessellator.begin(3).colorize(red, green, blue, alpha);

    Tessellator.pos(x1, y1, z1);
    Tessellator.pos(x2, y2, z2);

    Tessellator.draw();

    GlStateManager.func_179121_F(); // popMatrix()
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
}
const trace =  (x, y, z, red, green, blue, alpha, lineWidth = 1) =>
{
    if(Player.isSneaking())
        drawLine(Player.getRenderX(), Player.getRenderY() + 1.54, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
    else
        drawLine(Player.getRenderX(), Player.getRenderY()+1.62, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
}

// register('command', (message) => {
//   ChatLib.chat(`&bSaved. Yay!`)
//   }).setName('waypointsave').setAliases(['s']);
  