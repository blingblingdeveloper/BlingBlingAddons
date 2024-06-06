register('command', () => {
    ChatLib.chat(ChatLib.getCenteredText("&4--------------[ §d[BlingBling Addons] &4]--------------"))
    ChatLib.chat("Ignore [] brackets for the following examples. They are just meant to easily show things.")
    ChatLib.chat(ChatLib.getCenteredText("&6Waypoints")) //this is category
    ChatLib.chat("&d/load: &floads waypoints from clipboard, automatically converts from DilloPro if needed")
    ChatLib.chat("&d/unload: &fremoves all waypoints")
    ChatLib.chat("&d/swp [#]: &fcreates (or inserts) a waypoint at [#]")
    ChatLib.chat("&d/rwp [#]: &fremoves a waypoint at [#]")
    ChatLib.chat("&d/export: &fexports waypoints to clipboard")
    ChatLib.chat("&d/skip [#]: &fskip [#] waypoints ahead")
    ChatLib.chat("&d/unskip [#]: &fskip [#] waypoints back")
    ChatLib.chat("&d/sb [block]: &fset all waypoints to [block] (\"minecraft:___\")")
    ChatLib.chat("&d/y64: &fexports loaded waypoints and converts them to y64 format to clipboard. (very buggy, dislike.)")

    ChatLib.chat("&dPro Tip: &fYou can switch between ordered and wps in the settings menu!")

    ChatLib.chat(ChatLib.getCenteredText("§6Structure Check")) //this is category
    ChatLib.chat("&d/lrg: &floads a regular route from clipboard and automatically detects nearby veins for struc check format.")
    ChatLib.chat("&d/lr: &floads structure check format from clipboard, or a regular route for converting to struc check format manually.")
    ChatLib.chat("&d/ur: &funloads the structure check route.")
    ChatLib.chat("&d/sv [#]: &fsets vein the cursor is currently on as the vein associated with [#].")
    ChatLib.chat("&d/sv add [#]: &fadds vein the cursor is currently on to the vein(s) associated with [#].")
    ChatLib.chat("&d/rv [#]: &fclears waypoint [#]'s associated vein.")
    ChatLib.chat("&d/cs: &fchecks for structure grief. Will make a waypoint showing missing blocks. &cchunks have to be loaded to work.")
    ChatLib.chat("&d/es: &fexports structure check format to clipboard")

    ChatLib.chat(ChatLib.getCenteredText("§6Miscellaneous")) //this is category
    ChatLib.chat("&d/b: &fopen settings menu")
    ChatLib.chat("&d/miningtest: &fresets mining tracker")
    ChatLib.chat("&d/bahelp: &fyou're here!")
    ChatLib.chat(ChatLib.getCenteredText("&4----------------------------------------------"))
}).setName('bahelp');
