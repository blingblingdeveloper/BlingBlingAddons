import settings from "../settings/settings"
import { genSphere, filterShape } from "../util/world.js";
import { drawBlock, drawBlockFill } from "../util/render.js";

let isSearching = false;
let coordinatesArray = [];

register("worldLoad", () => {
    isSearching = true;
});

register("worldUnload", () => {
    isSearching = false;
});

register("step", () => {
    if (isSearching && settings().blockHighlight) {
        new Thread(() => {
            let playerX = Math.floor(Player.getX());
            let playerY = Math.floor(Player.getY() + 1);
            let playerZ = Math.floor(Player.getZ());
            
            let outerShape = genSphere(settings().blockHighlightMaxDist);
            let innerShape = genSphere(settings().blockHighlightMinDist);
        
            let searchShape = outerShape.filter(offset => !innerShape.some(innerOffset => innerOffset.equals(offset)));
            if (settings().blockHighlightBlock.includes("minecraft:stained_glass")) {
                coordinatesArray = filterShape(new Vec3i(playerX, playerY, playerZ), searchShape);
            } else {
                coordinatesArray = filterShape(new Vec3i(playerX, playerY, playerZ), searchShape, [{name: settings().blockHighlightBlock}]);
            }
        }).start();
    }
}).setFps(1)

register('renderWorld', () => {
    if (settings().blockHighlight) {
        coordinatesArray.forEach(coordinate => {
            if (settings().blockHighlightOutline) {
                drawBlock(coordinate, settings().blockHighlightOutlineColor, false);
            }
            if (settings().blockHighlightFill) {
                drawBlockFill(coordinate, settings().blockHighlightFillColor, false);
            }
        });
    }
})

