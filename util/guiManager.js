let guis = [],
 guiNames = []


export function registerGui(gui)
{
    guis.push(gui)
    guiNames.push(gui.aliases[0])
}

export default guis