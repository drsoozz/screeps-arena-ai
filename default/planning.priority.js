const { RoleType } = require('./roles.role_base');

const RolePriority = [
    RoleType.HARVESTER,
    RoleType.UPGRADER,
    RoleType.CONSTRUCTOR,
    RoleType.REPAIRER
];

const StructurePriority = [
    STRUCTURE_EXTENSION,
    STRUCTURE_CONTAINER,
    STRUCTURE_ROAD,
    STRUCTURE_WALL,
    STRUCTURE_RAMPART
]

module.exports = {RolePriority, StructurePriority};