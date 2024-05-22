import Settings from '../settings';

register('command', () => Settings.openGUI()).setName('bling').setAliases(['b']); // FIXME: move this somewhere better

register('command', (message) => {
  ChatLib.chat(ChatLib.getCenteredText("&4--------------[ §d[BlingBling Addons] &4]--------------"))
  // ChatLib.chat(ChatLib.addTextFormattingCodes("&4-----------------[&dTerm: " + ChatLib.addTextFormattingCodes("§f definition") + "&4]-----------------"))
  ChatLib.chat("Ignore [] brackets for the following examples. They are just meant to easily show things.")
  ChatLib.chat(ChatLib.getCenteredText("&6Waypoints")) //this is category
  ChatLib.chat("&d/wp [#]: &fsets wp at number")
  ChatLib.chat("&d/rp [#]: &fremoves wp number")
  ChatLib.chat("&d/unload: &fremoves all wps")
  ChatLib.chat("&d/load: &floads wps from clipboard")
  ChatLib.chat("&d/export: &fexports wps to clipboard")
  ChatLib.chat("&d/y64: &fexports loaded wps and converts them to y64 format to clipboard. (very buggy, dislike.)")
  ChatLib.chat("&dPro Tip: &fYou can switch between ordered and wps in the settings menu!")
  
  ChatLib.chat(ChatLib.getCenteredText("§6Structure Check")) //this is category
  ChatLib.chat("&d/sv [#]: &fsets vein to highlight (uses vein that cursor is currently on). Used for structure check.")
  ChatLib.chat("&d/rv [#]: &fremoves vein number.")
  ChatLib.chat("&d/cs: &fchecks for structure grief. Will return a message if no structure grief is found, otherwise will make a waypoint showing blocks missing.")
  ChatLib.chat("&d/lv: &floads structure check format from clipboard.")
  ChatLib.chat("&d/se: &fexports structure check to clipboard")

  ChatLib.chat(ChatLib.getCenteredText("§6Miscellaneous")) //this is category
  ChatLib.chat("&d/b: &fopen settings menu")
  ChatLib.chat("&d/miningtest: &fresets mining tracker")
  ChatLib.chat("&d/cactus: &fconverts clipboard from dillo pro to cw waypoints(for blingbling)")
  ChatLib.chat(ChatLib.getCenteredText("&4----------------------------------------------"))
}).setName('bahelp').setAliases(['bahelp']);