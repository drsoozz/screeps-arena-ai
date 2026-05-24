const { RoleType } = require('../roles/role_base');

const RolePriority = [
    RoleType.HARVESTER,
    RoleType.UPGRADER,
    RoleType.CONSTRUCTOR
];

module.exports = {RolePriority};