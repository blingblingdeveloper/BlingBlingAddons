import Settings from "../settings"
import { genSphere, filterShape } from "./util/world.js";
import { drawBlock, drawBlockFill } from "./util/render.js";

let isSearching = false;
let coordinatesArray = [];

register("worldLoad", () => {
    isSearching = true;
});

register("worldUnload", () => {
    isSearching = false;
});

register("step", () => {
    if (isSearching && Settings.blockHighlight) {
        coordinatesArray = [];
        let playerX = Math.floor(Player.getX());
        let playerY = Math.floor(Player.getY() + 1);
        let playerZ = Math.floor(Player.getZ());
        
        let outerShape = genSphere(Settings.blockHighlightMaxDist);
        let innerShape = genSphere(Settings.blockHighlightMinDist);
    
        let searchShape = outerShape.filter(offset => !innerShape.some(innerOffset => innerOffset.equals(offset)));
        if (Settings.blockHighlightBlock.includes("minecraft:stained_glass")) {
            coordinatesArray = filterShape(new Vec3i(playerX, playerY, playerZ), searchShape);
        } else {
            coordinatesArray = filterShape(new Vec3i(playerX, playerY, playerZ), searchShape, [{name: Settings.blockHighlightBlock}]);
        }
    }
}).setFps(1)

register('renderWorld', () => {
    if (Settings.blockHighlight) {
        coordinatesArray.forEach(coordinate => {
            if (Settings.blockHighlightOutline) {
                drawBlock(coordinate, Settings.blockHighlightOutlineColor, false);
            }
            if (Settings.blockHighlightFill) {
                drawBlockFill(coordinate, Settings.blockHighlightFillColor, false);
            }
        });
    }
})

