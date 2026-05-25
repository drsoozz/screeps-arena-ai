// parts
const { waste_collection } = require('./utilities.waste_collection')
const { plan_next_creep } = require('./planning.plan_next_creep')
const {planNextStructure} = require('./planning.plan_next_structure')

const {Renewing} = require('./roles.renewing')

const {MIN_LIFE, MAX_LIFE} = require('./consts')
const { RoleMap } = require('./roles.role_map')

module.exports.loop = function () {
    /**
     * Four parts:
     *  1. Waste collection
     *  2. Creep planning
     *  3. Structure planning
     *  4. Creep actions
     */

    console.log("\n\n")

    // Part 1 - Waste collection
    waste_collection()

    const rooms = new Set();

    for (let name in Game.spawns) {
        let spawn = Game.spawns[name]
        rooms.add(spawn.room)
        // Part 2 - Creep planning
        plan_next_creep(spawn, spawn.room.controller.level)
    }
    for (let room of rooms) {
        // Part 3 - Structure planning
        if (room.controller.level < 2) {
            continue;
        } else {
            planNextStructure(room);
        }
    }

    // Part 4 - Creep actions
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        if (creep.ticksToLive <= MIN_LIFE) {
            if (!creep.memory.renewing) {
                console.log(`"${creep.name}" has begun renewing.`);
            }
    
            creep.memory.renewing = true
        } else if (creep.ticksToLive >= MAX_LIFE) {
            console.log(`"${creep.name}" has finished renewing.`)
            creep.memory.renewing = false
        }
        
        let RoleClass;
        if (creep.memory.renewing) {
            RoleClass = Renewing
        } else {
            RoleClass = RoleMap[creep.memory.role]
        }

        if (!RoleClass) {
            console.log(`Unknown role: ${creep.memory.role}`);
            continue;
        }

        const role = new RoleClass(creep);
        role.run();
    }
}