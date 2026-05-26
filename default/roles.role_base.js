const { FindSafeSources } = require('./utilities.find_safe_sources')
const { REPAIR_STOP_THRESHHOLD } = require('./consts')

const RoleType = Object.freeze({
    HARVESTER: "HARVESTER",
    CONSTRUCTOR: "CONSTRUCTOR",
    UPGRADER: "UPGRADER",
    REPAIRER: "REPAIRER"
});

class RoleBase {
    constructor(creep) {
        /** @param {Creep} creep */
        /** @type {Creep} */
        this.creep = creep;
        /** @type {Object} */
        this.memory = this.creep.memory;
    }
    run() {
        this._find_task();
        this._do_task();
    }
    _find_task() {
        throw new Error("_find_task() must be implemented by subclass");
    }
    _do_task() {
        throw new Error("_do_task() must be implemented by subclass");
    }
    _harvest_safe_source() {
        if (this.creep.memory.sourceId) {
            const source = Game.getObjectById(this.creep.memory.sourceId)
            if(this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            const safeSources = FindSafeSources(creep.room)
            if(this.creep.harvest(safeSources[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(safeSources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }        
        }
    }
    _get_energy() {
        let targets = this.creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
                        }});
        if(targets.length > 0) {
            if(this.creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            this._harvest_safe_source();
        }
    }
    /**
     * 
     * @param {number} threshhold 
     */
    _repair(threshhold = 0.75) {
        if (!this.memory.repair_target) {
            const structs = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.hits / structure.hitsMax) < threshhold);
                }
            });
            if (structs.length > 0) {
                structs.sort((a, b) => {
                    return (a.hits / a.hitsMax) - (b.hits / b.hitsMax);
                });
                this.creep.memory.repair_target = structs[0].id
            }
        } else {
            
            /** @param {AnyStructure} struct */
            const struct = Game.getObjectById(this.memory.repair_target)
            if (struct.hits / struct.hitsMax > REPAIR_STOP_THRESHHOLD) {
                this.memory.repair_target = null;
            } else {
                
                if (this.creep.repair(struct) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(struct, {visualizePathStyle: {stroke: '#00B300'}})
                }
            }
        }
    }
}

module.exports = {
    RoleType,
    RoleBase
};