# To-Do

## Celeite:
- Better ability tracking
- Fix position reset on gui move
- Look through util
- commandManager
- guiManager
- Add higher-level checks for more features (should also help performance)
- Vigilance reactivity (or Amaterasu)
- Efficiency tracker --> start mining tracker
- Efficiency tracker --> better rough calc
- Update help commands
- Check if tick required between blocks for efficiency
- Just wrap block info, dummy it'll probably be better in the long run
- better color defaults (alpha)
- command input checks

- Look into getShape stuff for panetest
- strucCheck block filter options
- strucCheck /lv "add" option for multiple on one waypoint
- Dynamic mining stats
- Ping glide change
  - Fix console errors >:|
- License + attribution
- Probably refactor some stuff
- strucCheck cross-chunk/lobby swap check
- strucCheck from world file
- Nice block whitelist
- Suggested mining order (hard)
- Hash waypoints
- Bob-omb placement
- Mining ability switcher?
- Glacite mineshaft routing

- CT unload/load modules
- Texture pack reload lag fix
- gfmod settings.save that one toggle
- Vigilance onScroll fix


Block order stuffs:
Block closest to raycast from previous waypoint --> current waypoint is 'path start'
Block farthest from current waypoint within player reach, but closest to raycast from current waypoint --> next waypoint is 'path exit'

For remaining blocks:
Score with combination of smallest angle + largest visible area
Threshold value for "candidate" next blocks
    if no blocks found, lower threshold
Select block from candidate
Use angle to center as new look angle, remove 'used' blocks, recaulculate weights
Repeat

Walk several paths, total mouse distance moved for each, minimum distance = best path

Can be precalculated for the entire route
Each block then gets an "order" tag, lowest value present in the vein = suggested block