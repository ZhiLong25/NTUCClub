css = '''
<style>
.chat-message {
    padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem; display: flex
}
.chat-message.user {
    background: linear-gradient(45deg, rgba(255, 99, 71, 0.2) 0%, rgba(255, 99, 71, 0.5) 100%);
}
.chat-message.bot {
    background: linear-gradient(45deg, rgba(255, 99, 71, 0.2) 0%, rgba(255, 99, 71, 0.5) 100%);
}
.chat-message .avatar {
  width: 20%;
}
.chat-message .avatar img {
  max-width: 78px;
  max-height: 78px;
  border-radius: 50%;
  object-fit: cover;
}
.chat-message .message {
  width: 80%;
  padding: 0 1.5rem;
  color: black;
}
.stApp {
        background-color: white !important;
    }
.css-18ni7ap {
    background-color: white !important;
}
.css-10trblm{
color: white
}
.css-16idsys{
color:white
}
'''

bot_template = '''
<div class="chat-message bot">
    <div class="avatar">
    </div>
    <div class="message">{{MSG}}</div>
</div>
'''

user_template = '''
<div class="chat-message user">
    <div class="avatar">
    </div>    
    <div class="message">{{MSG}}</div>
</div>
'''