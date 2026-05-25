/** 
 * @param {Room} room 
*/
function FindSafeConstructionSites(room) {
    const csites = room.find(FIND_MY_CONSTRUCTION_SITES)
    const safeCSites = csites.filter(csite => {
        const hostilesNearby = csite.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
        return hostilesNearby.length === 0;
    })
    return safeCSites
}

module.exports = {FindSafeConstructionSites};