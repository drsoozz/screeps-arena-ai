const {RoleType} = require('./role_base')
// individual classes
const {Harvester} = require('./harvester')
const {Upgrader} = require('./upgrader')

const RoleMap = {
    [RoleType.HARVESTER]: Harvester,
    [RoleType.UPGRADER]: Upgrader
}

module.exports = {RoleMap};