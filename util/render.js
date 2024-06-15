import settings from "../settings/settings";
import BlingPlayer from "./BlingPlayer";
import { rgbToColorInt } from "./helperFunctions";

function drawWireBox(x, y, z, w, h, l, lWidth = 2.0, red, green, blue, alpha, phase) {
    if (settings().renderLimitEnabled && BlingPlayer.calcEyeDist(x, y, z) > settings().renderLimit * 16) {
        return;
    }
    setupDraw(lWidth, phase);
    const locations = [
        [
            [0, 0, 0],
            [w, 0, 0],
        ],
        [
            [0, 0, 0],
            [0, 0, l],
        ],
        [
            [w, 0, l],
            [w, 0, 0],
        ],
        [
            [w, 0, l],
            [0, 0, l],
        ],

        [
            [0, h, 0],
            [w, h, 0],
        ],
        [
            [0, h, 0],
            [0, h, l],
        ],
        [
            [w, h, l],
            [w, h, 0],
        ],
        [
            [w, h, l],
            [0, h, l],
        ],

        [
            [0, 0, 0],
            [0, h, 0],
        ],
        [
            [w, 0, 0],
            [w, h, 0],
        ],
        [
            [0, 0, l],
            [0, h, l],
        ],
        [
            [w, 0, l],
            [w, h, l],
        ],
    ];

    locations.forEach((loc) => {
        Tessellator.begin(3).colorize(red, green, blue, alpha);

        Tessellator.pos(x + loc[0][0] - w / 2, y + loc[0][1], z + loc[0][2] - l / 2).tex(0, 0);
        Tessellator.pos(x + loc[1][0] - w / 2, y + loc[1][1], z + loc[1][2] - l / 2).tex(0, 0);

        Tessellator.draw();
    });
    endDraw(phase);
}


function drawFillBox(x, y, z, w, h, l, red, green, blue, alpha, phase) {
    if (settings().renderLimitEnabled && BlingPlayer.calcEyeDist(x, y, z) > settings().renderLimit * 16) {
        return;
    }
    setupDraw(2.0, phase);
    w /= 2;
    l /= 2;

    Tessellator.begin(GL11.GL_QUADS, false);
    Tessellator.colorize(red, green, blue, alpha);

    Tessellator.translate(x, y, z)
        .pos(w, 0, l)
        .pos(w, 0, -l)
        .pos(-w, 0, -l)
        .pos(-w, 0, l)

        .pos(w, h, l)
        .pos(w, h, -l)
        .pos(-w, h, -l)
        .pos(-w, h, l)

        .pos(-w, h, l)
        .pos(-w, h, -l)
        .pos(-w, 0, -l)
        .pos(-w, 0, l)

        .pos(w, h, l)
        .pos(w, h, -l)
        .pos(w, 0, -l)
        .pos(w, 0, l)

        .pos(w, h, -l)
        .pos(-w, h, -l)
        .pos(-w, 0, -l)
        .pos(w, 0, -l)

        .pos(-w, h, l)
        .pos(w, h, l)
        .pos(w, 0, l)
        .pos(-w, 0, l)
        .draw();
    endDraw(phase);
};

function setupDraw(lWidth, phase) {
    Tessellator.pushMatrix();
    GL11.glLineWidth(lWidth);
    GlStateManager.func_179129_p(); // disableCullFace
    GlStateManager.func_179147_l(); // enableBlend
    GlStateManager.func_179112_b(770, 771); // blendFunc
    GlStateManager.func_179132_a(false); // depthMask
    GlStateManager.func_179090_x(); // disableTexture2D

    if (phase) {
        GlStateManager.func_179097_i() // disableDepth
    }
}

function endDraw(phase) {
    GlStateManager.func_179089_o(); // enableCull
    GlStateManager.func_179084_k(); // disableBlend
    GlStateManager.func_179132_a(true); // depthMask
    GlStateManager.func_179098_w(); // enableTexture2D

    if (phase) {
        GlStateManager.func_179126_j(); // enableDepth
    }

    Tessellator.popMatrix();
}

function drawLine(x1, y1, z1, x2, y2, z2, red, green, blue, alpha, width, phase) {
    if (phase) {
        GlStateManager.func_179097_i() // disableDepth
    }
    GL11.glLineWidth(width);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glBlendFunc(770, 771);
    GL11.glDepthMask(false);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GlStateManager.func_179094_E(); // pushMatrix()

    Tessellator.begin(3).colorize(red, green, blue, alpha);

    Tessellator.pos(x1, y1, z1);
    Tessellator.pos(x2, y2, z2);

    Tessellator.draw();

    GlStateManager.func_179121_F(); // popMatrix()
    GL11.glDisable(GL11.GL_BLEND);
    GL11.glDepthMask(true);
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    if (phase) {
        GlStateManager.func_179126_j(); // enableDepth
    }
}

function drawBlockConnection(pos1, pos2, color) {
    drawLine(
        pos1.x + 0.5,
        pos1.y + 0.5,
        pos1.z + 0.5,
        pos2.x + 0.5,
        pos2.y + 0.5,
        pos2.z + 0.5,
        color[0],
        color[1],
        color[2],
        color[3],
        settings().lineThickness,
        false
    )
}

function drawText(text, pos, color) {
    let labelColor = rgbToColorInt(color[0], color[1], color[2]);
    let labelScale;
    if (settings().dynamicTextSize) {
        labelScale = Math.min(BlingPlayer.calcEyeDist(pos.x + .5, pos.y + 2, pos.z + .5) / 10, settings().waypointTextSize) / 20;
    }
    else {
        labelScale = settings().waypointTextSize / 20
    }
    Tessellator.drawString(
        text,
        pos.x + .5,
        pos.y + 2, //original celeite code is 1.5, but 2 is for kool kids - bling
        pos.z + .5,
        labelColor,
        true,
        labelScale,
        false
    );
}

function drawDistText(text, pos, color) {
    let labelColor = rgbToColorInt(color[0], color[1], color[2]);
    let labelScale;
    if (settings().dynamicTextSize) {
        labelScale = Math.min(BlingPlayer.calcEyeDist(pos.x + .5, pos.y + 2.5, pos.z + .5) / 10, settings().waypointTextSize) / 20;
    }
    else {
        labelScale = settings().waypointTextSize / 20
    }
    
    Tessellator.drawString(
        text,
        pos.x + .5,
        pos.y + 2.5,
        pos.z + .5,
        labelColor,
        true,
        labelScale,
        false
    );
}

function drawBlock(block, color, phase = true) {
    drawWireBox(
        Math.floor(block.x) + .5,
        Math.floor(block.y) - .005,
        Math.floor(block.z) + .5,
        1.01, 1.01, 1.01,
        settings().blockOutlineThickness,
        color[0] / 255,
        color[1] / 255,
        color[2] / 255,
        color[3] / 255,
        phase
    );
}

function drawBlockFill(block, color, phase = true) {
    drawFillBox(
        Math.floor(block.x) + .5,
        Math.floor(block.y) - .005,
        Math.floor(block.z) + .5,
        1.01, 1.01, 1.01,
        color[0] / 255,
        color[1] / 255,
        color[2] / 255,
        color[3] / 255,
        phase
    );
}

function drawTrace(block, color) {
    drawLine(
        Player.getRenderX(),
        Player.getRenderY() + Player.getPlayer()["func_70047_e"](),
        Player.getRenderZ(),
        block.x + 0.5,
        block.y + 0.5,
        block.z + 0.5,
        color[0] / 255,
        color[1] / 255,
        color[2] / 255,
        color[3] / 255,
        settings().traceThickness,
        true
    );
}

export { drawWireBox, drawFillBox, drawBlock, drawTrace, drawText, drawDistText, drawBlockFill, drawLine, drawBlockConnection }