const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/chat-udiv', {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(db => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.log(err));

const conversationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    userMessage: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
identification: { type: String, required: true },
conversations: [conversationSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};