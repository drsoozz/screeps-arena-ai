const {StructurePriority} = require('./planning.priority')
const {spiralOutward} = require('./utilities.spiral')
const {hasBlockedNeighbor} = require('./utilities.has_blocked_neighbor');
const { ROOM_SIZE } = require('./consts');

/**
* @param {Room} room
*/
function planNextStructure(room) {
    const numStructuresNeeded = new Object()

    for (let struct in CONTROLLER_STRUCTURES) {
        const current = room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === struct
        }).length;
        const planned = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: (s) => s.structureType === struct
            }).length;
        numStructuresNeeded[struct] = CONTROLLER_STRUCTURES[struct][room.controller.level] - current - planned
    }

    for (let struct of StructurePriority) {
        if (numStructuresNeeded[struct] > 0 || !!numStructuresNeeded[struct] /**if there's no limit */ ) {
            switch(struct) {
                case STRUCTURE_EXTENSION: {
                    _planExtension(room)
                    break;
                }
                case STRUCTURE_CONTAINER: {
                    _planContainer(room)
                    break;
                }
                case STRUCTURE_ROAD: {
                    _planRoads(room)
                    break;
                }
            }
        }
    }
}

/**
* @param {Room} room
* @param {Structure} structure
*/
function __planUtility(room, structure) {
    const _xy = spiralOutward()
    while (true) {
        const xy = _xy.next().value;
        if (!xy) {
            continue;
        }
        if (xy.x < 0 || xy.x >= ROOM_SIZE - 1 || xy.y < 0 || xy.y >= ROOM_SIZE - 1) {
            return undefined;
        }
        let position = new RoomPosition(xy.x, xy.y, room.name)
        if (!hasBlockedNeighbor(position, room)) {
            console.log('Attempting to create a(n) "' + structure + '" structure.')
            const result = position.createConstructionSite(structure)
            return result
        }
    }

}

function _planExtension(room) {
    __planUtility(room, STRUCTURE_EXTENSION)
}

function _planContainer(room) {
    __planUtility(room, STRUCTURE_CONTAINER)
}

function _planRoads(room) {
    return;
}

module.exports = {planNextStructure};