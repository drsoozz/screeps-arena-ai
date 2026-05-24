const rb = require('./role_base');

const Tasks = {
    UPGRADE: "UPGRADE",
    GET_ENERGY: "GET_ENERGY"
}

class Upgrader extends rb.RoleBase {
    constructor (creep) {
        super(creep)
    }
    _find_task() {
        switch(this.memory.task) {
            default:
            case Tasks.UPGRADE:
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.GET_ENERGY
                }
                break;
            case Tasks.GET_ENERGY:
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === this.creep.store.getCapacity(RESOURCE_ENERGY)) {
                    this.memory.task = Tasks.UPGRADE
                } 
                break;
        }
    }

    _do_task() {
        switch(this.memory.task) {
            case Tasks.UPGRADE: {
                if(this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
                }
                break;
            }
            default:
            case Tasks.GET_ENERGY: {
                let targets = this.creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }})
                if(targets.length > 0) {
                    if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    if(this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                break;
            }
        }
    }
}

module.exports = {Upgrader};