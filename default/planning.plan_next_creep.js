const { RoleType } = require('./roles.role_base');
const { FindSafeSources } = require('./utilities.find_safe_sources')
const { getRoleDist, RoleBody } = require('./planning.control_levels_consts');
const { RolePriority } = require('./planning.priority');

/**
 * @param {StructureSpawn} spawn 
 * @param {number} control_level 
*/
function plan_next_creep(spawn, control_level) {

    const NumCreepsNeeded = new Object()
    const RequiredCreeps = getRoleDist(spawn.room, control_level)

    for(let role in RoleType) {
        NumCreepsNeeded[role] = RequiredCreeps[role]
    }

    for(let name in Game.creeps) {
        let role = Game.creeps[name].memory.role
        NumCreepsNeeded[role]--
    }

    let emergency = false
    if (NumCreepsNeeded[RoleType.HARVESTER] === RequiredCreeps[RoleType.HARVESTER]) {
        emergency = true
    }

    for(let role of RolePriority) {
        if(NumCreepsNeeded[role] > 0) {
            let name = "Uranium-" + role + "-" + Game.time;
            console.log('Spawning new creep of role "' + role + '".')
            let body = plan_creep_body(spawn, control_level, role)
            if (!body) {
                return undefined;
            }

            // mutated by different roles in different ways. sent as an arg into the final spawn command
            const _memory = {role: role, renewing_num: 0}
            _memory.sourceId = _get_source(role, spawn)
            const result = spawn.spawnCreep(body, name, {memory: _memory});
            console.log(result)
            return result
        }
    }

    return null;
}

/** 
 * @param {StructureSpawn} spawn 
 * @param {number} control_level 
 * @param {RoleType} role
 * @param {boolean} emergency
 */
function plan_creep_body(spawn, control_level, role, emergency) {
    let bdata = RoleBody[control_level][role]
    let body = [...bdata.set_body];
    let fill_body = bdata.fill_body
    if(!!fill_body) {
        body.push(fill_body)
    }
    if(emergency) {
        return body
    }
    let estores = spawn.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
    let etot = 0
    let ecurrent = 0
    for(let estore of estores) {
        etot += estore.store.getCapacity(RESOURCE_ENERGY)
        ecurrent += estore.store.getUsedCapacity(RESOURCE_ENERGY)
    }
    let ecost = _.sum(body, bp => BODYPART_COST[bp])
    if(ecost > etot) {
        console.log("Not enough energy storage to create this creep's basic body plan. BODY PLAN: " + body);
        return undefined;
    }
    if(!!fill_body) {
        let fill_cost = BODYPART_COST[bdata.fill_body]
        while ((etot - ecost) >= 0 && body.length < 50) {
            ecost += fill_cost
            if((etot - ecost) >= 0) {
                body.push(fill_body)
            }
        }
    }

    if (ecurrent < etot) {
        console.log("Not enough energy to create this creep's current body plan. BODY PLAN: " + body);
        return undefined;
    }

    return body
}

/**
 * @param {RoleType} role 
 * @param {StructureSpawn} spawn 
 * @returns 
 */
function _get_source(role, spawn) {

    const safeSources = FindSafeSources(spawn.room)
    let source;
    if (role === RoleType.HARVESTER) {

        const usedSources = new Set(
            Object.values(Game.creeps)
                .filter(c => c.memory.role === RoleType.HARVESTER)
                .map(c => c.memory.sourceId)
                .filter(Boolean)
        );

        source = safeSources.find(s => !usedSources.has(s.id));
    } else {
        source = safeSources[Math.floor(Math.random() * safeSources.length)];
    }
    return source ? source.id : null;
}

module.exports = {plan_next_creep}