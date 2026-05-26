const {ROOM_SIZE} = require("./consts")

/**
 * @param {RoomPosition} pos
 * @param {Room} room
 */
function hasBlockedNeighbor(pos, room) {
    const terrain = room.getTerrain();
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {

            const x = pos.x + dx;
            const y = pos.y + dy;

            if (x < 0 || x > ROOM_SIZE-1 || y < 0 || y > ROOM_SIZE-1 ) {
                continue;
            }

            // terrain walls
            if (terrain.get(x,y) === TERRAIN_MASK_WALL) { 
                return true;
            }

            const structures = room.lookForAt(LOOK_STRUCTURES, x, y);

            const blocking = structures.some(s => {
                return (
                        s.structureType !== STRUCTURE_ROAD
                    );            
                });

            if (blocking) {
                return true;
            }

            const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y)
                .filter((s) => s.structureType !== STRUCTURE_ROAD);
            
            if (sites.length > 0) {
                return true;
            }

        }
    }

    // if something is still here then it is allowed to be destroyed.
    // i.e. it is a road or a road construction site
    const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y)
    for (i in structures) {
        structures[i].destroy()
    }

    const sites = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y)
    for (i in sites) {
        sites[i].destroy()
    }

    return false;
}

module.exports = {hasBlockedNeighbor};