const {ROOM_SIZE} = require('./consts')
const { FindSafeSources } = require('./utilities.find_safe_sources')
const {findExploitationCandidates} = require('./utilities.find_exploitation_candidates');

/**
 * 
 * @param {Room} room 
 */
function roadPlannerCoords(room) {
    // get array of all structures that need paths between them
    // every structure in this array will have a path to every other structure

    const coords = [];
    const terrain = room.getTerrain();

    const _controller = [room.controller];
    const _sources = FindSafeSources(room);
    const _spawns = room.find(FIND_MY_SPAWNS);
    const importantStructures = [..._controller, ..._sources, ..._spawns]
        .filter(Boolean);

    for (let i = 0; i < importantStructures.length; i++) {
        for (let j = i + 1; j < importantStructures.length; j++) {
            const path = PathFinder.search(importantStructures[i].pos, importantStructures[j].pos, {range: 1, plainCost: 1, swampCost: 1}).path;
            for (let pos of path) {
                coords.push(pos);
            }
        }
    }
    // 2 range AOE around all important structures
    pushNearbyPositions(importantStructures, 2, terrain, coords);

    //  coords one at a time

    const containersAndExtensions = room.find(FIND_STRUCTURES, { filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION
    }});
    // 1 range AOE around containers and extensions
    pushNearbyPositions(containersAndExtensions, 1, terrain, coords);

    if (_spawns.length > 1) {
        createRoadsToExploitedSources(_spawns[0], coords);
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

/**
 * Push all valid positions within a range around objects into `coords`.
 *
 * @param {RoomObject[]} objects
 * @param {number} range
 * @param {Room.Terrain} terrain
 * @param {RoomPosition[]} coords
 */
function pushNearbyPositions(objects, range, terrain, coords) {

    for (const obj of objects) {

        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {

                // skip center tile
                if (dx === 0 && dy === 0) {
                    continue;
                }

                const x = obj.pos.x + dx;
                const y = obj.pos.y + dy;

                // bounds check
                if (
                    x < 0 ||
                    x >= ROOM_SIZE ||
                    y < 0 ||
                    y >= ROOM_SIZE
                ) {
                    continue;
                }

                // skip walls
                if (terrain.get(x, y) === TERRAIN_MASK_WALL) {
                    continue;
                }

                coords.push(
                    new RoomPosition(
                        x,
                        y,
                        obj.pos.roomName
                    )
                );
            }
        }
    }
}

/**
 * 
 * @param {StructureSpawn} spawn
 * @param {RoomPosition[]} coords
 */
function createRoadsToExploitedSources(spawn, coords) {
    let _exploitationCandidates = findExploitationCandidates(spawn.room);
    if (_exploitationCandidates.length < 1) {
        return;
    }
    for (let i = 0; i < _exploitationCandidates.length; i++) {
        const path = PathFinder.search(spawn.pos, {pos: _exploitationCandidates[i], range: 1}, {plainCost: 1, swampCost: 1}).path;
        for (let pos of path) {
            coords.push(pos);
        }
    }
}

module.exports = {roadPlannerCoords};