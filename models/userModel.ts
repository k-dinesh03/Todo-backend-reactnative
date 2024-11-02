const mongoose = require('mongoose');
const todoSchema = require('./todo');

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        age: {
            type: Number,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Todo',
            }
        ]
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', userSchema);
