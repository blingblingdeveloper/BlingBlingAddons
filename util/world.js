let blockStatesToFind = [
    {
        name: "minecraft:stained_glass",
        color: ['white', 'orange', 'magenta', 'lightBlue', 'yellow', 'lime', 'pink', 'gray', 'silver', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
    },
    {
        name: "minecraft:stained_glass_pane",
        color: ['white', 'orange', 'magenta', 'lightBlue', 'yellow', 'lime', 'pink', 'gray', 'silver', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
    },
]

function getcoords(block) {
    return `${block.x},${block.y},${block.z}`;
}

//TODO: probably move to helperFunctions
function genSphere(radius) {
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

function getInternalBlockAt(pos) {
    let block = {
        name: World.getBlockStateAt(pos).blockLocation.toString(),
        x: pos.x,
        y: pos.y,
        z: pos.z
    }
    World.getBlockStateAt(pos).func_177228_b().entrySet().forEach(property => {
        if (property.getKey().func_177701_a() == 'color') {
            block.color = property.getValue().toString();
        }
    });

    return block;
}

// TODO: have this support more things than just color
function filterBlock(block, filter = blockStatesToFind) {
    return filter.some(state => { return (state.name == block.name && (state.color?state.color.includes(block.color):true))})
}

function filterShape(pos, shape, blockType = blockStatesToFind) {
    let blockPos = new BlockPos(pos);
    let matchingBlocks = [];
    shape.forEach(offset => {
        let block = getInternalBlockAt(blockPos.add(offset));
        if (filterBlock(block, blockType)) {
            matchingBlocks.push(block);
        }
    });

    return matchingBlocks;
}

function findVein(blocksToSearch, maxSearchSteps = 15, searchRadius = 1.75) {
    let veinBlocks = [];
    let foundBlocks = new Map();

    // Use a sphere shape to find the vein's blocks
    let searchShape = genSphere(searchRadius);
    for (let currentStep = 1; currentStep <= maxSearchSteps; currentStep++) {
        let newBlocks = new Map();

        blocksToSearch.forEach(block => {
            let blockType = [
                { name: "minecraft:stained_glass", color: block.color },
                { name: "minecraft:stained_glass_pane", color: block.color },
            ];

            foundBlocks.set(getcoords(block), block);
            filterShape(new Vec3i(block.x, block.y, block.z), searchShape, blockType).forEach(newblock => {
                if (!(newBlocks.has(getcoords(newblock)) || foundBlocks.has(getcoords(newblock)))) {
                    newBlocks.set(getcoords(newblock), newblock);
                }
            });
        });
        blocksToSearch = newBlocks;
    }

    // Put all the blocks in the data structure
    foundBlocks.forEach((block) => {
        veinBlocks.push(block);
    });

    return veinBlocks;
}

export { filterBlock, getInternalBlockAt, genSphere, filterShape, findVein, getcoords }
