# To-Do

## Celeite:
- strucCheck block filter options
- strucCheck /lv "add" option for multiple on one waypoint
- Efficiency tracker
  - Mining stats
  - Gemstone ticks
- Ping glide change
  - Fix console errors >:|
- Licence + attribution (stolen ColeWeight code lmao)
- Probably refactor some stuff
- Gui stuff? Bling hates Vigilance.
- strucCheck cross-chunk/lobby swap check
- strucCheck from world file
- Nice block whitelist
- Suggested mining order (hard)
- Hash waypoints


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