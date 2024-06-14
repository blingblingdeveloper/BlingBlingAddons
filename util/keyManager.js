import settings, { setting } from "../settings/settings";

new KeyBind("Draw line to current Waypoint", settings().wpKeybind, "BlingBling Addons");

register("guiClosed", (gui) => {
    if(gui.getClass() == net.minecraft.client.gui.GuiControls) {
        let wpKeybind = 
        setting.config.find(category => category.category === "Waypoints")
            .settings.find(setting => setting.name === "wpKeybind");
            
        wpKeybind.value = Client.getKeyBindFromDescription("Draw line to current Waypoint").getKeyCode();
        setting.apply();
    }
});