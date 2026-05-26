const {StructurePriority} = require('./planning.priority')
const {spiralOutward} = require('./utilities.spiral')
const {hasBlockedNeighbor} = require('./utilities.has_blocked_neighbor');
const { ROOM_SIZE } = require('./consts');
const {roadPlannerCoords} = require('./utilities.road_planner')

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
    const spawn_pos = room.find(FIND_MY_SPAWNS)[0]
    const _xy = spiralOutward(spawn_pos.x, spawn_pos.y)
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

/**
* @param {Room} room
*/
function _planExtension(room) {
    __planUtility(room, STRUCTURE_EXTENSION);
}

/**
* @param {Room} room
*/
function _planContainer(room) {
    __planUtility(room, STRUCTURE_CONTAINER);
}

/**
* @param {Room} room
*/
function _planRoads(room) {

    // initialize
    if (!Memory.road_planner || !Memory.road_planner.coords || Memory.road_planner.index === undefined) {
        Memory.road_planner = {
            coords: roadPlannerCoords(room),
            index: 0
        }
        console.log("`Memory.road_planner` was generated.")
    } 

    // reset when finished
    if (Memory.road_planner.index >= Memory.road_planner.coords.length) {
        Memory.road_planner.coords = roadPlannerCoords(room);
        Memory.road_planner.index = 0;
        console.log("`Memory.road_planner` was regenerated.")
    }

    const raw = Memory.road_planner.coords[Memory.road_planner.index];
    const pos = new RoomPosition(raw.x, raw.y, raw.roomName);

    if (!hasRoadOrSite(pos)) {
        pos.createConstructionSite(STRUCTURE_ROAD);
    }

    Memory.road_planner.index++;
    
}

function hasRoadOrSite(pos) {
    const structures = pos.lookFor(LOOK_STRUCTURES);
    const sites = pos.lookFor(LOOK_CONSTRUCTION_SITES);

    return (
        structures.some(s => s.structureType === STRUCTURE_ROAD) ||
        sites.some(s => s.structureType === STRUCTURE_ROAD)
    )

}

module.exports = {planNextStructure};