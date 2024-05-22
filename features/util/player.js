let msbActive = false;

register("chat", () => {
    msbActive = true;
}).setChatCriteria(/&r&aYou used your &r&6Mining Speed Boost &r&aPickaxe Ability!&r/g);

register("chat", () => {
    msbActive = false;
}).setChatCriteria(/&r&cYour Mining Speed Boost has expired!&r/g);

register("worldLoad", () => {
    msbActive = false;
})

function getMsbActive() {
    return msbActive;
}

function calcPlayerEyeDist(x, y, z) {
    return Math.sqrt((x - (Player.getRenderX())) ** 2 + (y - (Player.getRenderY() + Player.getPlayer()["func_70047_e"]())) ** 2 + (z - (Player.getRenderZ())) ** 2);
}

export { getMsbActive, calcPlayerEyeDist }