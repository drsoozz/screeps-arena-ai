function waste_collection() {
    if (Memory.waste_collection === undefined) {
        Memory.waste_collection = 0;
    } else if (Memory.waste_collection < 1000) {
        Memory.waste_collection++;
    } else {
        console.log("The hourly waste collection has begun.")
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        Memory.waste_collection = 0;
    }
}

module.exports = {waste_collection};