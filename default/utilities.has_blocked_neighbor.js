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
                        s.structureType !== STRUCTURE_ROAD &&
                        s.structureType !== STRUCTURE_CONTAINER
                    );            
                });

            if (blocking) {
                return true;
            }

            const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
            
            if (sites.length > 0) {
                return true;
            }

        }
    }

    return false;
}

module.exports = {hasBlockedNeighbor};