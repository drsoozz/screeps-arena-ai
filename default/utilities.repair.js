/** @param {Creep} creep */
function Repair(creep, threshhold = 0.75) {
    const structs = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return ((structure.hits / structure.hitsMax) < threshhold);
        }
    });
    if (structs.length > 0) {
        structs.sort((a, b) => {
            return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
        });
        if (creep.repair(structs[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structs[0], {visualizePathStyle: {stroke: '#00B300'}})
        }
    }
}

module.exports = {Repair};