const { RoleType } = require('../roles/role_base');

const CreepsPriority = {
    [RoleType.HARVESTER]: 0,
    [RoleType.UPGRADER]: 1,
    [RoleType.CONSTRUCTOR]: 2 
}