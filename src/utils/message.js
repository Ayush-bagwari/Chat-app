const generateMessage = (username,text)=>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username,coords)=>{
    return{
        username,
        text: 'https://google.com/maps?q='+coords.latitiude+','+coords.longitude,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}