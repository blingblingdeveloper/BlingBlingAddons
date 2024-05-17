# To-Do

## Celeite:
- strucCheck block filter options
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


block order stuffs:
Raycast player --> next waypoint
All hit blocks in vein are valid 'exit' blocks
Block closest to next waypoint is 'path exit'
	if no blocks found try to find closest angle (cone search?)
Block the player is currently looking at is 'path start'

Raycast to all blocks
Find unobstructed blocks (somehow)
Smallest angle + largest visible area is next block

Alternatively, score all tiles
Unobstructed = bonus (large)
Smaller angle = bonus (minor)/smaller distance from current block, idk
Exit tile = punish (minor)
Distance from player = punish (moderate)

HSV hue (0 to 120)

Alternatively (again)
Walk every path, purge if not possible
do diagonals if not possible