const { RoleType } = require('../roles/role_base');
const { RoleDist, RoleBody } = require('./control_levels_consts');
const { RolePriority } = require('./priority');

/**
 * @param {StructureSpawn} spawn 
 * @param {number} control_level 
*/
function plan_next_creep(spawn, control_level) {

    const NumCreepsNeeded = new Object()
    const RequiredCreeps = RoleDist[control_level]

    for(let role in RoleType) {
        NumCreepsNeeded[role] = RequiredCreeps[role]
    }

    // this is done in a weird way to not mutate RoleDist
    for(let name in Game.creeps) {
        let role = Game.creeps[name].memory.role
        NumCreepsNeeded[role]--
    }

    for(let role of RolePriority) {
        if(NumCreepsNeeded[role] > 0) {
            let name = "Uranium" + Game.time;
            console.log('Spawning new creep of role "' + role + '".')
            let body = plan_creep_body(spawn, control_level, role)
            return spawn.spawnCreep(body, name, {memory: {role: role}});
        }
    }

    return null;
}

/** 
 * @param {StructureSpawn} spawn 
 * @param {number} control_level 
 * @param {RoleType} role
 */
function plan_creep_body(spawn, control_level, role) {
    let bdata = RoleBody[control_level][role]
    let body = [...bdata.set_body];
    let fill_body = bdata.fill_body
    body.push(fill_body)
    let estores = spawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
    let etot = 0
    for(let estore of estores) {
        etot += estore.getUsedCapacity(RESOURCE_ENERGY)
    }
    etot -= _.sum(body, bp => BODYPART_COST[bp])
    if(etot < 0) {
        console.log("Not enough energy to create this creep. BODY PLAN: " + body);
        return undefined;
    }
    if(!!fill_body) {
        let fill_cost = BODYPART_COST[bdata.fill_body]
        while (etot > 0 && body.length < 50) {
            etot -= fill_cost
            if((etot) > 0) {
                body.push(bdata.fill_body)
            }
        }
    }

    return body
}

module.exports = {plan_next_creep}