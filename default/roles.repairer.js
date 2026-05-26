const rb = require('./roles.role_base');
const { FindSafeConstructionSites } = require('./utilities.find_safe_construction_sites')

const Tasks = {
    CONSTRUCT: "CONSTRUCT",
    REPAIR: "REPAIR",
    GET_ENERGY: "GET_ENERGY"
}

class Repairer extends rb.RoleBase {
    constructor (creep) {
        super(creep)
    }

    _find_task() {
        switch(this.memory.task) {
            case Tasks.REPAIR: {
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.GET_ENERGY
                } else if (!(this.safeCSites.length === 0)) {
                    this.memory.task = Tasks.CONSTRUCT
                }
                break;
            }
            default:
            case Tasks.GET_ENERGY: {
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.REPAIR
                } else {
                    this.memory.task = Tasks.GET_ENERGY
                }
                break;
            }
        }
    }

    _do_task() {
        switch(this.memory.task) {
            case Tasks.REPAIR: {
                this._repair(0.80)
                break;
            }
            default:
            case Tasks.GET_ENERGY: {
                this._get_energy()
                break;
            }
        }
    }
}

module.exports = {Repairer};