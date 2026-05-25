const rb = require('./roles.role_base');
const { getEnergy } = require('./utilities.get_energy');
const { FindSafeConstructionSites } = require('./utilities.find_safe_construction_sites')

const Tasks = {
    CONSTRUCT: "CONSTRUCT",
    REPAIR: "REPAIR",
    GET_ENERGY: "GET_ENERGY"
}

class Constructor extends rb.RoleBase {
    constructor (creep) {
        super(creep)
        this.safeCSites = FindSafeConstructionSites(this.creep.room)
    }

    _find_task() {
        switch(this.memory.task) {
            case Tasks.CONSTRUCT: {
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.GET_ENERGY
                } else if (this.safeCSites.length === 0) {
                    this.memory.task = Tasks.REPAIR
                }
                break;
            }
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
                    if (!(this.safeCSites.length === 0)) {
                        this.memory.task = Tasks.CONSTRUCT;
                    } else {
                        this.memory.task = Tasks.REPAIR
                    }
                }  else {
                    this.memory.task = Tasks.GET_ENERGY
                }
                break;
            }
        }
    }

    _do_task() {
        switch(this.memory.task) {
            case Tasks.CONSTRUCT: {
                if(this.safeCSites.length > 0) {
                    if(this.creep.build(this.safeCSites[0]) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(this.safeCSites[0], {visualizePathStyle: {stroke: '#FE5000'}})
                    }
                } 
                break;
            }
            case Tasks.REPAIR: {
                const structs = this.creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.hits / structure.hitsMax) < 0.75);
                    }
                });
                if (structs.length > 0) {
                    structs.sort((a, b) => {
                        return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
                    });
                    if (this.creep.repair(structs[0]) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(structs[0], {visualizePathStyle: {stroke: '#00B300'}})
                    }
                }
                break;
            }
            case Tasks.GET_ENERGY: {
                getEnergy(this.creep)
                break;
            }
        }
    }
}

module.exports = {Constructor};