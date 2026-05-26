const {ROOM_SIZE} = require('./consts')
const { FindSafeSources } = require('./utilities.find_safe_sources')

/**
 * 
 * @param {Room} room 
 */
function roadPlannerCoords(room) {
    // get array of all structures that need paths between them
    // every structure in this array will have a path to every other structure

    const coords = [];

    const _sources = FindSafeSources(room);
    const _controller = [room.controller];
    const _spawns = room.find(FIND_MY_SPAWNS);
    const importantStructures = [..._sources, ..._controller, ..._spawns];

    for (let i = 0; i < importantStructures.length; i++) {
        for (let j = i + 1; j < importantStructures.length; j++) {
            const path = PathFinder.search(importantStructures[i].pos, importantStructures[j].pos, {range: 1, plainCost: 1, swampCost: 1}).path;
            for (let pos of path) {
                coords.push(pos);
            }
        }
    }

    //  coords one at a time

    const containersAndExtensions = room.find(FIND_STRUCTURES, { filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION
    }});
    // THEN, get array of containers and extensions
    //  coords one at a time for each square around them
    for (let struct of containersAndExtensions) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const x = struct.pos.x + dx;
                const y = struct.pos.y + dy;
                if (dx === 0 && dy === 0) {
                    continue;
                } else if (
                    x < 0 ||
                    x > ROOM_SIZE - 1 ||
                    y < 0 ||
                    y > ROOM_SIZE - 1
                ) {
                    continue;
                }

                coords.push(new RoomPosition(x, y, room.name));
            }
        }
    }

    const seen = new Set();
    const unique = [];


    for (const pos of coords) {
        const key = `${pos.roomName}:${pos.x}:${pos.y}`;

        if (!seen.has(key)) {
            seen.add(key);
            unique.push(pos);
        }
    }
    return unique;
}

module.exports = {roadPlannerCoords};