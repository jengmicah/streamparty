const users = [];

const checkUser = ({ name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Check if username exists in this room already
    const duplicateUser = users.find((user) => user.room === room && user.name === name);
    if (duplicateUser) return { error: 'DUPLICATE_USER' };
    return {};
}

const addUser = ({ id, name, room, colors }) => {
    const user = { id, name, room, colors };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index != -1) {
        return users.splice(index, 1)[0];
    }
};

const getUserById = (id) => users.find((user) => user.id === id);

const getUserByName = (name) => users.find((user) => user.name === name);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getOtherUserInRoom = (room, newUser) => users.filter((user) => user.room === room && user.id !== newUser.id)[0];

module.exports = { 
    checkUser, 
    addUser, 
    removeUser, 
    getUserById, 
    getUsersInRoom, 
    getOtherUserInRoom, 
    getUserByName 
};
