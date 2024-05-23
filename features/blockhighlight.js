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
    if (isSearching && Settings.blockHighlightSwitch) {
        coordinatesArray = [];
        let playerX = Math.floor(Player.getX());
        let playerY = Math.floor(Player.getY() + 1);
        let playerZ = Math.floor(Player.getZ());
        
        let outerShape = genSphere(Settings.maxDist);
        let innerShape = genSphere(Settings.minDist);
    
        let searchShape = outerShape.filter(offset => !innerShape.some(innerOffset => innerOffset.equals(offset)));
        
        coordinatesArray = filterShape(new Vec3i(playerX, playerY, playerZ), searchShape);
    }
}).setFps(1)

register('renderWorld', () => {
    if (Settings.blockHighlightSwitch) {
        coordinatesArray.forEach(coordinate => {
            drawBlock(coordinate.x, coordinate.y, coordinate.z)
        });
    }
})

function drawBlock(x, y, z) {
    if (Settings.blockHighlightOutlineSwitch) {
        drawCustomEspBox(
            Math.floor(x) + .5,
            Math.floor(y),
            Math.floor(z) + .5,
            Settings.blockHighlightThickness,
            1, 1,
            Settings.blockHighlightColor.getRed() / 255,
            Settings.blockHighlightColor.getGreen() / 255,
            Settings.blockHighlightColor.getBlue() / 255,
            1, false
        )
    }

    if (Settings.innerBlockHighlightSwitch) {
        RenderLib.drawInnerEspBox(
            Math.floor(x) + .49,
            Math.floor(y) - 0.01,
            Math.floor(z) + 0.49,
            1, 1,
            Settings.innerBlockHighlightColor.getRed(),
            Settings.innerBlockHighlightColor.getGreen(),
            Settings.innerBlockHighlightColor.getBlue(),
            Settings.innerBlockHighlightColor.getAlpha() / 255,
            false
        );

        RenderLib.drawInnerEspBox(
            Math.floor(x) + .51,
            Math.floor(y) + 0.01,
            Math.floor(z) + .51,
            1, 1,
            Settings.innerBlockHighlightColor.getRed(),
            Settings.innerBlockHighlightColor.getGreen(),
            Settings.innerBlockHighlightColor.getBlue(),
            Settings.innerBlockHighlightColor.getAlpha() / 255,
            false
        );
    }
}
