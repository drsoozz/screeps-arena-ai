const {RoleType} = require('./roles.role_base')
// individual classes
const {Harvester} = require('./roles.harvester')
const {Upgrader} = require('./roles.upgrader')
const {Constructor} = require('./roles.constructor')

const RoleMap = {
    [RoleType.HARVESTER]: Harvester,
    [RoleType.UPGRADER]: Upgrader,
    [RoleType.CONSTRUCTOR]: Constructor
}

module.exports = {RoleMap};