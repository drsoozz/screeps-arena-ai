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
        /** @type {Array} */
        this.memory = this.creep.memory;
    }
    run() {
        this._find_task()
        this._do_task()
    }
    _find_task() {
        throw new Error("_find_task() must be implemented by subclass");
    }
    _do_task() {
        throw new Error("_do_task() must be implemented by subclass");
    }
    _harvest() {
        if (this.memory.sourceId) {

        } else {
            
        }
    }
}

module.exports = {
    RoleType,
    RoleBase
};