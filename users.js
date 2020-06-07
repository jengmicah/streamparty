const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Check if username exists in this room already
    const duplicateUser = users.find((user) => user.room === room && user.name === name);
    if(duplicateUser) return { error: 'DUPLICATE_USER' };

    const user = { id, name, room }; 
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);    
    if(index != -1) {
        return users.splice(index, 1)[0];
    }
};
    
const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getOtherUserInRoom = (room, newUser) => users.filter((user) => user.room === room && user.id !== newUser.id)[0];

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getOtherUserInRoom };