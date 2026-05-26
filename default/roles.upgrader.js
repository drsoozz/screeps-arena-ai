const rb = require('./roles.role_base');

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
            case Tasks.UPGRADE: { 
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.GET_ENERGY
                }
                break;
            }
            default:
            case Tasks.GET_ENERGY: {
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.UPGRADE
                }  else {
                    this.memory.task = Tasks.GET_ENERGY
                }
                break;
            }
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
                this._get_energy()
            }
        }
    }
}

module.exports = {Upgrader};