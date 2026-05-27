const {MIN_LIFE, MAX_LIFE, MAX_RENEW_CYCLES} = require('./consts')

/**
 * 
 * @param {Creep} creep 
 * @returns null
 */
function handleRenewing(creep) {
    const renewLimit =
        MAX_RENEW_CYCLES[Game.rooms[creep.memory.home].controller.level]
        MAX_RENEW_CYCLES[creep.room.controller.level];

    const renewCount =
        creep.memory.renewing_num ?? 0;
    const canRenew =
        renewCount < renewLimit;

    const lowLife =
        creep.ticksToLive <= MIN_LIFE;

    const forcedRenew =
        !!creep.memory.should_renew;

    const shouldStartRenewing =
        !creep.memory.renewing &&
        canRenew &&
        (lowLife || forcedRenew);

    if (shouldStartRenewing) {

        creep.memory.renewing = true;
        creep.memory.should_renew = false;
        creep.memory.renewing_num = renewCount + 1;

        return;
    }

    const finishedRenewing =
        creep.memory.renewing &&
        creep.ticksToLive >= MAX_LIFE;

    if (finishedRenewing) {
        console.log(`"${creep.name}" has finished renewing.`);

        creep.memory.renewing = false;
    }
}

module.exports = {handleRenewing};