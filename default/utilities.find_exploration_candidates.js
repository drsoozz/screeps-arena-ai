const {DEFAULT_EXPLORATION_RANGE} = require("./consts");

/**
 * 
 * @param {Room} room 
 */
function findExplorationCandidates(room, range = DEFAULT_EXPLORATION_RANGE) {
    // get exits
    let candidates = new Set();
    let stack = [room.name];
    let searched = new Set();
    let wantedRoomStatus = Game.map.getRoomStatus(room.name).status;
    for (let i = 0; i < range; i++) {
        let loop_candidates = new Set();
        while (stack.length > 0) {
            let targetRoom = stack.pop();
            if (searched.has(targetRoom)) {
                continue;
            } else {
                searched.add(targetRoom);
            }
            // find all rooms conneted to this current room that are not in `searched` and are not owned by anyone
            let exits = Object.values(Game.map.describeExits(targetRoom))
                .filter(r => {
                    return !searched.has(r) && (Game.map.getRoomStatus(r).status === wantedRoomStatus);
                })
                .filter(r => {
                    return PathFinder.search(new RoomPosition(25, 25, room.name), new RoomPosition(25, 25, r), {
                        range: 24,
                        swampCost: 1,
                        plainCost: 1
                    }).path.length < 700;
                })
                .filter(r => {
                    if (!Memory.rooms) {
                        return true;
                    } else if (!Memory.rooms[r]) {
                        return true;
                    } else if (Memory.rooms[r].controllerLevel === undefined) {
                        return true;
                    } else if (Memory.rooms[r].controllerLevel === 0) {
                        return true;
                    } else {
                        searched.add(r);
                        return false;
                    } 
                })
            exits.forEach(r => {
                loop_candidates.add(r);
                candidates.add(r);
            });
        }
        stack.push(...loop_candidates);
    }

    return [...candidates];
}

module.exports = {findExplorationCandidates};