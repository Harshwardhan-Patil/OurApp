const socket = io();

const userName = document.querySelectorAll('.o-user-name span');
const endUserName = document.querySelector('.other-user-name h3');
const otherUsernames = document.querySelectorAll('.user-brief');
const connectionId = document.querySelectorAll('.connectionId');
const otherUsersId = document.querySelectorAll('.otherUserId');
const mainUserId = document.querySelector('.mainUserId');
const chatDefaultPage = document.querySelector('.send-message-design');
const userMessage = document.querySelector('.message-sec');

const chatSection = document.querySelector('.chat-view');
const my_message = document.querySelector('.my-messages span');
const message = document.querySelector('.message-bar input');
const submitBtn = document.querySelector('.send-btn');


function messageBox(message,className){
    const div = document.createElement('div');
    const span = document.createElement('span');

    div.classList.add(`${className}`);
    span.textContent = message;
    div.appendChild(span);
    chatSection.appendChild(div);
}


submitBtn.addEventListener('click',()=>{
    messageBox(message.value,'my-messages');
    userName.forEach((name,i)=>{
      if(name.textContent === endUserName.textContent){
         socket.emit("message",{
           message:message.value,
           userId:otherUsersId[i].name,
           conversationId:connectionId[i].name
         })
      }
   })
   message.value = '';
})

socket.emit("connectUser",mainUserId.name);

socket.on("message",(message)=>{
  console.log(message);
   messageBox(message,'user-messages');
})