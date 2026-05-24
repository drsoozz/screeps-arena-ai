const rb = require('./role_base');

const Tasks = {
    HARVEST: "harvest",
    TRANSFER: "transfer"
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
            if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === this.creep.store.getCapacity(RESOURCE_ENERGY)) {
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
                if(this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                break;
            }
            case Tasks.TRANSFER: {
                let targets = this.creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(targets.length > 0) {
                    if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
}

module.exports = Harvester;