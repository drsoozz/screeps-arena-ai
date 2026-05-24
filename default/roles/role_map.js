const {RoleType} = require('./role_base')
// individual classes
const {Harvester} = require('./harvester')

const RoleMap = {
    [RoleType.HARVESTER]: Harvester
}

module.exports = RoleMap;