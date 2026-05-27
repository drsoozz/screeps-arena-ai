// parts
const { waste_collection } = require('./utilities.waste_collection');
const { plan_next_creep } = require('./planning.plan_next_creep');
const {planNextStructure} = require('./planning.plan_next_structure');
const {handleRenewing} = require('./utilities.handle_renewing');
const {Renewing} = require('./roles.renewing');
const {Waiting} = require('./roles.waiting');

const {findExploitationCandidates} = require('./utilities.find_exploitation_candidates');

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
    // console.log("\n\n")

    // Part 1 - Waste collection
    waste_collection()
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
        console.log(`Converting cpu bucket into a Pixel. CURRENT PIXEL COUNT: ${Game.resources.pixel + 1}`);
    }

    const rooms = new Set();

    for (let name in Game.spawns) {
        // const start = Game.cpu.getUsed()
        let spawn = Game.spawns[name]
        
        // Part 2 - Creep planning
        plan_next_creep(spawn, spawn.room.controller.level)
        // console.log(`${name} time: ${Game.cpu.getUsed() - start}`)
    }

    // Part 4 - Creep actions
    for(let name in Game.creeps) {
        // const start = Game.cpu.getUsed()
        let creep = Game.creeps[name];
        rooms.add(creep.room)
        handleRenewing(creep);
        
        let RoleClass;
        if (creep.memory.renewing) {
            RoleClass = Renewing;
        } else if (!!creep.memory.waiting) {
            RoleClass = Waiting;
        } else {
            RoleClass = RoleMap[creep.memory.role];
        }

        if (!RoleClass) {
            console.log(`Unknown role: ${creep.memory.role}`);
            continue;
        }

        const role = new RoleClass(creep);
        role.run();

        // console.log(`${name} time: ${Game.cpu.getUsed() - start}`)
    }
    
    for (let room of rooms) {
        // const start = Game.cpu.getUsed()
        // Part 3 - Structure planning
        if (room.controller.level < 2) {
            continue;
        } else {
            planNextStructure(room);
        }
        // console.log(`${room.name} time: ${Game.cpu.getUsed() - start}`)
    }
}