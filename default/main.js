// parts
const { waste_collection } = require('./utilities.waste_collection')
const { plan_next_creep } = require('./planning.plan_next_creep')
const {planNextStructure} = require('./planning.plan_next_structure')

const {Renewing} = require('./roles.renewing')

const {MIN_LIFE, MAX_LIFE, MAX_RENEW_CYCLES} = require('./consts')
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
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
        console.log(`Converting cpu bucket into a Pixel. CURRENT PIXEL COUNT: ${Game.resources.pixel}`)
    }

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
        
        if (creep.ticksToLive <= MIN_LIFE && 
            !creep.memory.renewing && 
            (
                !creep.memory.renewing_num || 
                creep.memory.renewing_num < MAX_RENEW_CYCLES[creep.room.controller.level]
            )
        ) {
            console.log(`"${creep.name}" has begun renewing.`);
            creep.memory.renewing = true
            if (!creep.memory.renewing_num) {
                creep.memory.renewing_num = 1
            } else {
                creep.memory.renewing_num += 1
            }
        } else if (creep.ticksToLive >= MAX_LIFE) {
            if (creep.memory.renewing) {
                console.log(`"${creep.name}" has finished renewing.`)
            }
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