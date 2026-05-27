const rb = require('./roles.role_base');
const { DEFAULT_OPACITY, LONG_JOURNEY_REUSE_PATH } = require('./consts')
const { FindSafeSources } = require('./utilities.find_safe_sources')
const {findExplorationCandidates} = require('./utilities.find_exploration_candidates');

const Tasks = {
    CHART: "CHART",
}

class Charter extends rb.RoleBase {
    constructor(creep) {
        super(creep)
    }
    _find_task() {
        switch(this.memory.task) {
            default:
            case Tasks.CHART: {
                this.memory.task = Tasks.CHART;
                break;
            }
        }
    }
    _do_task() {
        switch(this.memory.task) {
            default:
            case Tasks.CHART: {
                if (!this.memory.exploration_candidates || !this.memory.exploration_candidates.rooms || this.memory.exploration_candidates.index === undefined) {
                    this.memory.exploration_candidates = {
                        rooms: findExplorationCandidates(Game.rooms[this.memory.home]),
                        index: 0
                    }
                    console.log(`"exploration_candidates" was generated for ${this.creep.name}`);
                }
                if (this.memory.exploration_candidates.index >= this.memory.exploration_candidates.rooms.length) {
                    this.memory.exploration_candidates.rooms = findExplorationCandidates(Game.rooms[this.memory.home]);
                    this.memory.exploration_candidates.index = 0;
                    console.log(`"exploration_candidates" was regenerated for ${this.creep.name}`);
                    this.memory.waiting = 5000;
                }
                const target_room = this.memory.exploration_candidates.rooms[this.memory.exploration_candidates.index];
                if (!target_room) {
                    return;
                }
                if (!Memory.rooms) {
                    Memory.rooms = {};
                }
                if (!Memory.rooms[target_room]) {
                    Memory.rooms[target_room] = {};
                }
                if (!Memory.rooms[this.creep.room.name]) {
                    Memory.rooms[this.creep.room.name] = {};
                }
                let roomMemory = Memory.rooms[target_room];
                let currentRoomMemory = Memory.rooms[this.creep.room.name];
                if (!roomMemory.lastChartDate) {
                    roomMemory.lastChartDate = 1;
                }
                if (!currentRoomMemory.lastChartDate) {
                    currentRoomMemory.lastChartDate = 1;
                }
                const timeSinceLastChartDate = Game.time - (roomMemory.lastChartDate);
                const currentRoomTimeSinceLastChartDate = Game.time - (currentRoomMemory.lastChartDate);
                if (currentRoomTimeSinceLastChartDate > 1000) {
                    roomMemory.safeSources = FindSafeSources(this.creep.room).map((s) => {
                        return s.id
                    });
                    roomMemory.controllerLevel = this.creep.room.controller.level ?? 0;
                    roomMemory.lastChartDate = Game.time;
                }

                if (timeSinceLastChartDate < 10000) {
                    this.memory.exploration_candidates.index++;
                } else if (this.creep.room.name != target_room) {
                    if (this.creep.moveTo(new RoomPosition(25, 25, target_room), {
                        range: 24,
                        swampCost: 1,
                        plainCost: 1,
                        reusePath: LONG_JOURNEY_REUSE_PATH,
                        visualizePathStyle: {stroke: '#048243', opacity: DEFAULT_OPACITY}
                    }) === ERR_NO_PATH) {
                        this.memory.exploration_candidates.index++;
                    }
                } else {
                    roomMemory.safeSources = FindSafeSources(this.creep.room).map((s) => {
                        return s.id
                    });
                    roomMemory.controllerLevel = this.creep.room.controller.level ?? 0;
                    roomMemory.lastChartDate = Game.time;
                    this.memory.exploration_candidates.index++;
                    this.creep.memory.should_renew = true; // always renew between charting targets to prevent creep death.
                }
                break;
            }
        }
    }
}

module.exports = {Charter};