// FIXME: color names
let blockStatesToFind = [
    { 
        name: "minecraft:stained_glass",
        variants: {
            color: ['white', 'orange', 'magenta', 'lightBlue', 'yellow', 'lime', 'pink', 'gray', 'silver', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
        }
    },
    { 
        name: "minecraft:stained_glass_pane",
        variants: {
            color: ['white', 'orange', 'magenta', 'lightBlue', 'yellow', 'lime', 'pink', 'gray', 'silver', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
        }
    },
]

function findVein(blocksToSearch) {
    let veinWaypoints = [];
    let maxSearchSteps = 15;
    let searchRadius = 1.75;
    let searchedBlocks = new Map();

    // Use a sphere shape to find the vein's blocks
    let searchShape = genSphere(searchRadius);
    for (let currentStep = 1; currentStep <= maxSearchSteps; currentStep++) {
        let newBlocks = new Map();

        blocksToSearch.forEach(block => {
            let blockType = [
                { name: "minecraft:stained_glass", variants: [block.getMetadata()] },
                { name: "minecraft:stained_glass_pane", variants: [block.getMetadata()] },
            ];

            searchedBlocks.set(getcoords(block), block);
            filterShape(block, searchShape, blockType).forEach(newblock => {
                if (!(newBlocks.has(getcoords(newblock)) || searchedBlocks.has(getcoords(newblock)))) {
                    newBlocks.set(getcoords(newblock), newblock);
                }
            });
        });
        blocksToSearch = newBlocks;
    }

    // Put all the blocks in the data structure
    searchedBlocks.forEach(block => {
        veinWaypoints.push({
            x: block.getX(),
            y: block.getY(),
            z: block.getZ(),
            blockId: block.getType().getID() // TODO: use other system?
        })
    });

    return veinWaypoints;
}

function filterBlock(block, filter) {
    if (filter == null) {
        filter = blockStatesToFind;
    }

    let matchingName = filter.some(blockFilter => blockFilter.name === block.name);
    let matchingVariant = filter.some(blockFilter => Object.keys(blockFilter.variants).every(variantFilter => {
        return blockFilter.variants[variantFilter].includes(block[variantFilter])
    }));

    if (matchingName && matchingVariant) {
        return true;
    }
    return false;
}

function getBlockAt(pos) {
    let blockPos = new BlockPos(pos)
    let block = {
        name: World.getBlockStateAt().blockLocation.toString(),
        x: blockPos.x,
        y: blockPos.y,
        z: blockPos.z
    }

    World.getBlockStateAt(blockPos).func_177228_b().entrySet().forEach(property => {
        block[property.getKey().func_177701_a()] = typeof property.getValue() !== 'object' ? property.getValue() : property.getValue().func_176610_l();
    })

    return block;
}

function genSphere(radius) { //TODO: probably move to helperFunctions
    let shape = [];

    for (let x = -Math.ceil(radius); x <= Math.ceil(radius); x++) {
        for (let y = -Math.ceil(radius); y <= Math.ceil(radius); y++) {
            for (let z = -Math.ceil(radius); z <= Math.ceil(radius); z++) {
                if (x ** 2 + y ** 2 + z ** 2 <= radius ** 2) {
                    shape.push(new Vec3i(x, y, z));
                }
            }
        }
    }

    return shape;
}

function filterShape(position, shape, blockType = blockStatesToFind) {
    let matchingBlocks = [];
    let toSearch = [];

    shape.forEach(offset => {
        toSearch.push(getBlockAt(position.add(offset)));
    });

    for (let i = 0; i < toSearch.length; i++) {
        if (filterBlock(toSearch[i], blockType)) {
            matchingBlocks.push(toSearch[i]);
        }
    }

    return matchingBlocks;
}

function getcoords(block) {
    return `${block.getX()},${block.getY()},${block.getZ()}`;
}

export { filterBlock, getBlockAt, genSphere, filterShape, findVein, getcoords }
