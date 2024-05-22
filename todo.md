# To-Do

## Celeite:
- Better ability tracking
- Split/refactor block check use custom format
- Split block/refactor block broken detaction
- Fix position reset on gui move
- Look through util
- commandManager
- guiManager
- Add higher-level checks for more features (should also help performance)
- Vigilance reactivity
- Efficiency tracker --> start mining tracker
- Efficiency tracker --> better rough calc
- Move some block hit stuff from efficiency
- Update help commands
- Check if tick required between blocks for efficiency
- Just wrap block info dummy it'll probably be better in the long run
- /lrg lag resolution?

- Look into getShape stuff for panetest
- strucCheck block filter options
- strucCheck /lv "add" option for multiple on one waypoint
- Efficiency tracker
  - Mining stats
- Ping glide change
  - Fix console errors >:|
- Licence + attribution
- Probably refactor some stuff
- Gui stuff? Bling hates Vigilance.
- strucCheck cross-chunk/lobby swap check
- strucCheck from world file
- Nice block whitelist
- Suggested mining order (hard)
- Hash waypoints

- CT unload/load modules
- Texture pack reload lag fix


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