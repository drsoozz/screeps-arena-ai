const { RoleType } = require('./roles/role_base')
const { RoleMap } = require('./roles/role_map')

const { Harvester } = require('./roles/harvester');
// var roleUpgrader = require('role.upgrader');
// var roleBuilder = require('role.builder');

module.exports.loop = function () {
    /**
     * Four parts:
     *  1. Waste collection
     *  2. Creep planning
     *  3. Structure planning
     *  4. Creep actions
     */

    // Part 1 - Waste collection
    

    // Part 4 - Creep actions
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        const RoleClass = RoleMap[creep.memory.role]

        if (!RoleClass) {
            console.log(`Unknown role: ${creep.memory.role}`);
            continue;
        }

        const role = new RoleClass(creep);

        role.run();
    }
}