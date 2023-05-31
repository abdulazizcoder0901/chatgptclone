const chatInput = document.querySelector('.chat-input')
const sendBtn = document.querySelector('#send-btn')
const chatContainer = document.querySelector('.chat-container')
const themeBtn = document.querySelector('#theme-btn')
const deleteBtn = document.querySelector('#delete-btn')
const body = document.querySelector('body')

sendBtn.addEventListener('click', outGoingChat)
const initialHeight = chatInput.scrollHeight

function loadData (){
  chatContainer.scrollTo(0, chatContainer.scrollHeight)
  const defaultText = `<div class = 'default-text'>
                        <h1>ChatGPT Clone</h1>
                        <p>Start a conversation and explore the power of AI. <br>
                        Your chat history will be displayed here.</p>
                  </div>`
  chatContainer.innerHTML = localStorage.getItem('all-chats') || defaultText
}

loadData()

userText = null
function createElement (html, className){
    const chatDiv = document.createElement('div')
    chatDiv.classList.add('chat', className)
    chatDiv.innerHTML = html
    return chatDiv
}

const API_Key = "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"

async function getChatResponse(incomingGoingDiv) {
    const API = "https://api.openai.com/v1/completions";
    const pElement = document.createElement('p')
    const requestOptions = {
        method:'POST', 
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_Key}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }
    try{
        const response = await (await fetch(API, requestOptions)).json()
        pElement.textContent = response.choices[0].text.trim()
    }catch(err){
        pElement.classList.add('error')
        pElement.textContent = 'Oops! Something went wrong while retrieving the response. Please try again!'
    }
    incomingGoingDiv.querySelector('.typing-animation').remove()
    incomingGoingDiv.querySelector('.chat-details').appendChild(pElement)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    localStorage.setItem('all-chats', chatContainer.innerHTML)
}

function copyResponse(copyBtn){
  const responseEl = copyBtn.parentElement.querySelector('p')
  navigator.clipboard.writeText(responseEl.textContent)
  copyBtn.classList.add('fa-check')
  setTimeout(() => copyBtn.classList.remove("fa-check"),1500)
}

function showTypingAnimation(){
    const html = `<div class="chat-content">
      <div class="chat-details">
        <img src="./Image/chatbot.jpg" alt="chatgpt.image" />
        <div class="typing-animation">
          <div class="typing-dot" style="--delay: 0.2s"></div>
          <div class="typing-dot" style="--delay: 0.3s"></div>
          <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
      </div>
      <span onclick = "copyResponse(this)" class="fa-solid fa-clipboard"></span>
      </div>`
  const incomingGoingDiv = createElement(html, 'incoming')
  chatContainer.appendChild(incomingGoingDiv)
  chatContainer.scrollTo(0, chatContainer.scrollHeight)
  getChatResponse(incomingGoingDiv)
}

function outGoingChat() {
    userText = chatInput.value.trim()
    if(!userText) return 
    chatInput.style.height = `${initialHeight}px` 
    const html = `<div class="chat-content">
    <div class="chat-details">
      <img src="./Image/user.jpg" alt="user-image" />
      <p></p>
    </div>
  </div>`
  const outGoingDiv = createElement(html, 'outgoing')
  outGoingDiv.querySelector('p').textContent = userText
  chatContainer.appendChild(outGoingDiv)
  document.querySelector('.default-text')?.remove()
  chatContainer.scrollTo(0, chatContainer.scrollHeight)
  setTimeout(showTypingAnimation, 500)
    chatInput.value = ""
}

deleteBtn.addEventListener('click', () =>{
  if(confirm('Are you sure you want to delete all the chats?')){
    localStorage.removeItem('all-chats')
    loadData()
  }
})

function store(value){
  localStorage.setItem('lightMode', value)
}

function load(){
  const lightMode = localStorage.getItem('lightMode')
  if(lightMode == 'true'){
    body.classList.add('light-mode')
    themeBtn.classList.add('fa-moon')
  }else if(lightMode == 'false'){
    themeBtn.classList.remove('fa-moon')
  }
  chatContainer.scrollTo(0, chatContainer.scrollHeight)
}

load()

themeBtn.addEventListener('click', () =>{
    body.classList.toggle('light-mode')

    store(body.classList.contains('light-mode'))

    if(body.classList.contains('light-mode')){
      body.classList.add('light-mode')
      themeBtn.classList.add('fa-moon')
    } else{
      themeBtn.classList.add('fa-sun')
      themeBtn.classList.remove('fa-moon')
    }
})

chatInput.addEventListener('input', () =>{
  chatInput.style.height = `${initialHeight}px`
  chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener('keydown', (e) =>{
    if(e.key == 'Enter' && !e.shiftKey && window.innerWidth > 800){
      e.preventDefault()
      outGoingChat()
    }
})