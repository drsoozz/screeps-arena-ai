const {ROOM_SIZE} = require('./consts')

function* spiralOutward() {

    let x = Math.floor(ROOM_SIZE / 2);
    let y = Math.floor(ROOM_SIZE / 2);

    let dx = 1;
    let dy = 0;

    let stepSize = 1;
    yield {x: x, y: y};
    
    while (true) {

        // Two segments per step size
        for (let repeat = 0; repeat < 2; repeat++) {

            for (let i = 0; i < stepSize; i++) {

                x += dx;
                y += dy;

                // optional bounds check
                if (
                    x >= 0 && x < ROOM_SIZE &&
                    y >= 0 && y < ROOM_SIZE
                ) {
                    yield {x: x, y: y};
                }
            }

            // rotate direction
            [dx, dy] = [-dy, dx];
        }

        stepSize++;
    }
}

module.exports = {spiralOutward};