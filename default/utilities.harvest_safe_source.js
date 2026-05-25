const { FindSafeSources } = require('./utilities.find_safe_sources')

/**
 * 
 * @param {Creep} creep 
 */
function harvestSafeSource (creep) {
    if (creep.memory.sourceId) {
        const source = Game.getObjectById(creep.memory.sourceId)
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        const safeSources = FindSafeSources(creep.room)
                        if(creep.harvest(safeSources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(safeSources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }        
    }
}

module.exports = {harvestSafeSource}