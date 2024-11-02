const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
}, { timeStamps: true })

export default mongoose.model('Todo', todoSchema);