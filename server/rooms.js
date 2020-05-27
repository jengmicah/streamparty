function getActiveRooms(io) {
    let activeRooms = [];
    Object.keys(io.sockets.adapter.rooms).forEach(room => {
        let isRoom = true;
        Object.keys(io.sockets.adapter.sids).forEach(id => {
            isRoom = (id === room) ? false : isRoom;
        });
        if (isRoom) activeRooms.push(room);
    });
    return activeRooms;
}

module.exports = { getActiveRooms };