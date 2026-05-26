const {RoleType} = require('./roles.role_base')
// individual classes
const {Harvester} = require('./roles.harvester')
const {Upgrader} = require('./roles.upgrader')
const {Constructor} = require('./roles.constructor')
const { Repairer } = require('./roles.repairer')

const RoleMap = {
    [RoleType.HARVESTER]: Harvester,
    [RoleType.UPGRADER]: Upgrader,
    [RoleType.CONSTRUCTOR]: Constructor,
    [RoleType.REPAIRER]: Repairer
}

module.exports = {RoleMap};