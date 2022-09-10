const users = [];

const addUser = ({id, username, roomName}) => {
    //clean the data
    const name = username.trim().toLowerCase();
    const room = roomName.trim().toLowerCase();
    //validate the data
    if(!name || !room){

     console.log("not working");
     return {
        error: "username and room are required!"
     }   
    }


    const existinguser = users.find((user)=>{
        return user.room === room && user.name === username;
    });
    if(existinguser){
        return{
            error: "Username is already in use!"
        }
    }

    const user = {id, name, room};
    users.push(user);
    return {user};
}

const removeUser = (id)=>{

   const index = users.findIndex((user)=>{
        return user.id === id; 
    });
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id) => {
    return users.find((user)=> user.id === id );
}

const getUsersInRoom = (room)=>{
    return users.filter((user)=> user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}