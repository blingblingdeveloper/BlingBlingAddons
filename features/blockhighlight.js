import Settings from "../settings"
import { drawCustomEspBox } from "./util/drawCustomEspBox.js"
import RenderLib from "RenderLib";
import { genSphere, filterShape } from "./util/world.js";

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
            drawBlock(coordinate.x, coordinate.y, coordinate.z)
        });
    }
})

function drawBlock(x, y, z) {
    if (Settings.blockHighlightOutline) {
        drawCustomEspBox(
            Math.floor(x) + .5,
            Math.floor(y),
            Math.floor(z) + .5,
            Settings.blockHighlightThickness,
            1, 1,
            Settings.blockHighlightOutlineColor.getRed() / 255,
            Settings.blockHighlightOutlineColor.getGreen() / 255,
            Settings.blockHighlightOutlineColor.getBlue() / 255,
            Settings.blockHighlightOutlineColor.getAlpha() / 255,
            false
        )
    }

    if (Settings.blockHighlightFill) {
        RenderLib.drawInnerEspBox(
            Math.floor(x) + .49,
            Math.floor(y) - 0.01,
            Math.floor(z) + 0.49,
            1, 1,
            Settings.blockHighlightFillColor.getRed() / 255,
            Settings.blockHighlightFillColor.getGreen() / 255,
            Settings.blockHighlightFillColor.getBlue() / 255,
            Settings.blockHighlightFillColor.getAlpha() / 255,
            false
        );

        RenderLib.drawInnerEspBox(
            Math.floor(x) + .51,
            Math.floor(y) + 0.01,
            Math.floor(z) + .51,
            1, 1,
            Settings.blockHighlightFillColor.getRed() / 255,
            Settings.blockHighlightFillColor.getGreen() / 255,
            Settings.blockHighlightFillColor.getBlue() / 255,
            Settings.blockHighlightFillColor.getAlpha() / 255,
            false
        );
    }
}
