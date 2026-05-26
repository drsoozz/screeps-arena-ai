const rb = require('./roles.role_base');

const Tasks = {
    HARVEST: "HARVEST",
    TRANSFER: "TRANSFER"
}

class Harvester extends rb.RoleBase {
    constructor (creep) {
        super(creep)
    }
    _find_task() {
    switch(this.memory.task) {
        case Tasks.HARVEST: {
            if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                this.memory.task = Tasks.TRANSFER;
            }
            break;
        }
        default:
        case Tasks.TRANSFER: {
            if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                this.memory.task = Tasks.HARVEST;
            } else {
                this.memory.task = Tasks.TRANSFER;
            }
            break;
        }
    }
}
    _do_task() {
        switch(this.memory.task) {
            default:
            case Tasks.HARVEST: {
                const source = Game.getObjectById(this.memory.sourceId)
                if(this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                break;
            }
            case Tasks.TRANSFER: {
                let targets = this.creep.room.find(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(targets.length > 0) {
                    if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                // if all spawns and extensions are full, fill up containers
                } else {

                    let targets = this.creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }})
                    if(targets.length > 0) {
                        if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            }
        }
    }
}

module.exports = {Harvester};