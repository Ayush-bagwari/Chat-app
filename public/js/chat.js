var data = document.getElementById('send');
var location_button = document.getElementById('send-location');
var messageTemplate = document.querySelector('#message-template').innerHTML;
var locationTemplate = document.querySelector('#location-template').innerHTML;
var siderbarTemplate = document.querySelector('#siderbar-template').innerHTML;

const socket = io();

// const {username, room} = qs.parse(location.search,{ignoreQueryPrefix : true});
const username = location.search.substring(1).split('&')[0].split('=')[1];
const roomName = location.search.substring(1).split('&')[1].split('=')[1];

const autoscroll = (messages)=>{
    const newMessage = messages.lastElementChild;
    // get height of new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
    // visible height
    const visibleheight = messages.offsetHeight;
    // height of message container
    const containerHeight = messages.scrollHeight;
    // how far i have scrolled
    const scrollOffset = messages.scrollTop + visibleheight;
    if(containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight; 
    }
}
socket.on('chat',(value)=>{
    var messages = document.getElementById('messages');
  
    const html = Mustache.render(messageTemplate,{
        name:value.username,
        message: value.text,
        createdAt: moment(value.createdAt).format('h:mm a'),
    });
    messages.insertAdjacentHTML("beforeend",html);
    autoscroll(messages);
});

socket.on('roomData',({room, users})=>{
    console.log(room);
    console.log(users);
    const html = Mustache.render(siderbarTemplate,{
        room: room,
        users: users
    });
    document.querySelector('#sidebar').innerHTML = html;

})

socket.on('myLocation',(value)=>{
    var messages = document.getElementById('messages');
  
    // console.log(value);
    const html = Mustache.render(locationTemplate,{
        link: value,
        createdAt: moment(value.createdAt).format('h:mm a'),
        name: value.username
    });
    messages.insertAdjacentHTML("beforeend",html);
    autoscroll(messages);
});

// var el = document.getElementById('increment');
// console.log(el);
// el.addEventListener('click',()=>{
//    socket.emit('increment');
// });


data.addEventListener('click',()=>{
var inputMessage = document.getElementById('message').value;
   
data.setAttribute('disabled','disabled');
socket.emit('message',inputMessage,(error)=>{
    data.removeAttribute('disabled');
    data.value='';
    data.focus();
   if(error){
    return console.log(error);
   }
    console.log("Message delivered");
});
});
 
location_button.addEventListener('click',()=>{
    if(!navigator.geolocation){
        alert('Geolocation not supportd by your browser');
    }
    location_button.setAttribute('disabled','disabled');
    const location = navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('userLocation',{
            latitiude: position.coords.latitude,
            longitude: position.coords.longitude
        },(value)=>{
            location_button.removeAttribute('disabled');
        });
    });
});

socket.emit('join',{username,roomName},(error)=>{
if(error){
    alert(error);
    location.href="/";
}
});