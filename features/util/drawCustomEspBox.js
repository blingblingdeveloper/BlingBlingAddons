// i do not take credit for this code below in any way. I just needed to change a line for the purposes of this module.
// original author of this method is Debuggings/Debug
// here is a link to their module RenderLib: https://chattriggers.com/modules/v/Renderlib


export const drawCustomEspBox = (x, y, z, lWidth = 2.0, w, h, red, green, blue, alpha, phase) => {
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
  
    const locations = [
        //    x, y, z    x, y, z
        [
            [0, 0, 0],
            [w, 0, 0],
        ],
        [
            [0, 0, 0],
            [0, 0, w],
        ],
        [
            [w, 0, w],
            [w, 0, 0],
        ],
        [
            [w, 0, w],
            [0, 0, w],
        ],
  
        [
            [0, h, 0],
            [w, h, 0],
        ],
        [
            [0, h, 0],
            [0, h, w],
        ],
        [
            [w, h, w],
            [w, h, 0],
        ],
        [
            [w, h, w],
            [0, h, w],
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
            [0, 0, w],
            [0, h, w],
        ],
        [
            [w, 0, w],
            [w, h, w],
        ],
    ];
  
    locations.forEach((loc) => {
        Tessellator.begin(3).colorize(red, green, blue, alpha);
  
        Tessellator.pos(x + loc[0][0] - w / 2, y + loc[0][1], z + loc[0][2] - w / 2).tex(0, 0);
  
        Tessellator.pos(x + loc[1][0] - w / 2, y + loc[1][1], z + loc[1][2] - w / 2).tex(0, 0);
  
        Tessellator.draw();
    });
  
    GlStateManager.func_179089_o(); // enableCull
    GlStateManager.func_179084_k(); // disableBlend
    GlStateManager.func_179132_a(true); // depthMask
    GlStateManager.func_179098_w(); // enableTexture2D
  
    if (phase) {
        GlStateManager.func_179126_j(); // enableDepth
    }
    
    Tessellator.popMatrix();
};