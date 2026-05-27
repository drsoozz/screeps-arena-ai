const rb = require('./roles.role_base');
const { DEFAULT_OPACITY, DEFAULT_REUSE_PATH } = require('./consts')

const Tasks = {
    HARVEST: "HARVEST",
    TRANSFER: "TRANSFER",
    CONSTRUCT: "CONSTRUCT",
    REPAIR: "REPAIR",
    UPGRADE: "UPGRADE"
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
                } else if (this._get_all_transfer_targets().length < 1) {
                    this.memory.task = Tasks.CONSTRUCT;
                } else {
                    this.memory.task = Tasks.TRANSFER;
                }
                break;
            }
            case Tasks.CONSTRUCT: {
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.HARVEST
                } else if (!(this._get_all_transfer_targets().length === 0)) {
                    this.memory.task = Tasks.TRANSFER
                } else if (this._get_all_safe_construction_sites().length === 0) {
                    this.memory.task = Tasks.REPAIR
                }
                break;
            }
            case Tasks.REPAIR: {
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.HARVEST
                } else if (!(this._get_all_transfer_targets().length === 0)) {
                    this.memory.task = Tasks.TRANSFER
                } else if (!(this._get_all_safe_construction_sites().length === 0)) {
                    this.memory.task = Tasks.CONSTRUCT
                } else if ((this._get_all_repair_targets().length === 0)) {
                    this.memory.task = Tasks.UPGRADE
                    console.log(this.memory.task)
                }
                break;
            }
            case Tasks.UPGRADE: {
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.HARVEST
                } else if (!(this._get_all_transfer_targets().length === 0)) {
                    this.memory.task = Tasks.TRANSFER
                } else if (!(this._get_all_safe_construction_sites().length === 0)) {
                    this.memory.task = Tasks.CONSTRUCT
                } else if (!(this._get_all_repair_targets().length === 0)) {
                    this.memory.task = Tasks.REPAIR
                }
                break;
            }
        }
    }
    _do_task() {
        switch(this.memory.task) {
            default:
            case Tasks.HARVEST: {
                this._harvest_safe_source()
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
                        this.creep.moveTo(targets[0], {
                            reusePath: DEFAULT_REUSE_PATH,
                            visualizePathStyle: {stroke: '#ffaa00', opacity: DEFAULT_OPACITY}
                        });
                    }
                // if all spawns and extensions are full, fill up containers
                } else {

                    let targets = this.creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }})
                    if(targets.length > 0) {
                        if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(targets[0], {
                                reusePath: DEFAULT_REUSE_PATH,
                                visualizePathStyle: {stroke: '#ffaa00', opacity: DEFAULT_OPACITY}
                            });
                        }
                    }
                }
                break;
            }
            case Tasks.CONSTRUCT: {
                this._construct();
                break;
            }
            case Tasks.REPAIR: {
                this._repair();
                break;
            }
            case Tasks.UPGRADE: {
                this._upgrade();
                break;
            }
        }
    }
}

module.exports = {Harvester};