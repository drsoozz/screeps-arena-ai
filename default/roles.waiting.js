const rb = require('./roles.role_base');

const Tasks = {
    WAIT: "WAIT"
}

class Waiting extends rb.RoleBase {
    constructor (creep) {
        super(creep)
    }

    _find_task() {
        return;
    }

    _do_task() {
        this.memory.waiting--;
    }
}

module.exports = {Waiting};