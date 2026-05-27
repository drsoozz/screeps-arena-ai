const rb = require('./roles.role_base');
const { DEFAULT_OPACITY, DEFAULT_REUSE_PATH } = require('./consts')

const Tasks = {
    GET_ENERGY: "GET_ENERGY",
    TRANSFER: "TRANSFER",
    RENEW: "RENEW"
}

class Renewing extends rb.RoleBase {
    constructor (creep) {
        super(creep)
    }

    _find_task() {
        switch(this.memory.task) {
            default:
            case Tasks.GET_ENERGY: {
                if (this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.TRANSFER;
                } else if (!this.creep.store.getCapacity()) {
                    this.memory.task = Tasks.RENEW
                }
                break;
            }
            case Tasks.TRANSFER: {
                if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    this.memory.task = Tasks.RENEW;
                } else if(this._estores_full()) {
                    this.memory.task = Tasks.RENEW;
                } else {
                    this.memory.task = Tasks.TRANSFER;
                }
                break;
            }
            case Tasks.RENEW: {
                const estores = this.creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                let ecurrent = 0
                for (let estore of estores) {
                    ecurrent += estore.store.getUsedCapacity(RESOURCE_ENERGY)
                }
                if (ecurrent < this._find_renew_cost() && this.creep.store.getCapacity() != 0) {
                    this.memory.task = Tasks.GET_ENERGY
                }
            }
        }
    }

    _do_task() {
        switch(this.memory.task) {
            default:
            case Tasks.GET_ENERGY: {
                this._get_energy();
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
                    let targets = this.creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }})
                    if(targets.length > 0) {
                        if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(targets[0], {
                                reusePath: DEFAULT_REUSE_PATH,
                                visualizePathStyle: {stroke: '#ffffff', opacity: DEFAULT_OPACITY}
                            });
                        }
                    }
                }
            }
            case Tasks.RENEW: {
                if (!this.creep.memory.home) {
                    this.creep.memory.home = this.creep.room.name;
                }
                const spawn = Game.rooms[this.creep.memory.home].find(FIND_MY_SPAWNS)
                if (spawn[0].renewCreep(this.creep) == ERR_NOT_IN_RANGE) {
                    if (this.creep.room.name != this.creep.memory.home) {
                        this.creep.moveTo(spawn[0], {
                            reusePath: 100, 
                            visualizePathStyle: {stroke: "#ff3b9d", opacity: DEFAULT_OPACITY}
                        });
                    } else {
                        this.creep.moveTo(spawn[0], {
                            reusePath: DEFAULT_REUSE_PATH,
                            visualizePathStyle: {stroke: "#ff3b9d", opacity: DEFAULT_OPACITY}
                        });
                    }
                
                }
            }
        }
    }

    _estores_full() {
        const estores = this.creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
        let etot = 0;
        let ecurrent = 0;
    for(let estore of estores) {
        etot += estore.store.getCapacity(RESOURCE_ENERGY);
        ecurrent += estore.store.getUsedCapacity(RESOURCE_ENERGY);
    }
    return etot === ecurrent;
    }

    _find_renew_cost() {
        this.creep.body[0].type
        const cost = _.sum(this.creep.body, (part) => {
            return BODYPART_COST[part.type]
        });
        
        return Math.ceil(cost / 2.5 / this.creep.body.length);
    }
}

module.exports = {Renewing};