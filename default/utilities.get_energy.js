const { harvestSafeSource } = require('./utilities.harvest_safe_source')
/**
 * 
 * @param {Creep} creep 
 */
function getEnergy(creep) {
    let targets = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }})
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                        harvestSafeSource(creep)
                    }
}

module.exports = {getEnergy};