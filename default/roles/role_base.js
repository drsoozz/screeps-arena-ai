const RoleType = {
    HARVESTER: "harvester",
    CONSTRUCTOR: "constructor",
    UPGRADER: "upgrader"
};

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
}

module.exports = {
    RoleType,
    RoleBase
};