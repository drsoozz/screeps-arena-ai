/** 
 * @param {Room} room 
*/
function FindSafeSources(room) {
    const sources = room.find(FIND_SOURCES)
    const safeSources = sources.filter(source => {
        const hostilesNearby = source.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
        const hostileStructures = source.pos.findInRange(FIND_HOSTILE_STRUCTURES, 6);
        const alliesNearby = source.pos.findInRange(FIND_MY_CREEPS, 5);
        return ((hostilesNearby.length + hostileStructures) === 0 || hostilesNearby.length <= alliesNearby.length);
    })
    return safeSources;
}

module.exports = {FindSafeSources};