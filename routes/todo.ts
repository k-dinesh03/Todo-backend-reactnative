import todoSchema from '../models/todo';
import userModel from '../models/userModel';
const express = require('express');

const router = express.Router();

router.post('/create/:id', async (req: any, res: any) => {
    try {
        const { todo } = req.body;
        const { id } = req.params;

        const user = await userModel.findOne({ _id: id });

        if (!user) return res.status(404).json({ message: 'User not found!' });

        const newTodo = await todoSchema.create({
            title: todo
        });
        user.todos.push(newTodo._id);
        await user.save();

        res.status(200).json({ message: "Created a TODO!", todos: newTodo });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/alltodos/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id).populate('todos').sort({ createdAt: -1 });
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const todos = user.todos;
        res.status(200).json(todos);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/complete/:userId/:todoId', async (req: any, res: any) => {
    try {
        const { userId, todoId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const todoIndex = user.todos.findIndex((t: any) => t._id.toString() === todoId);
        if (todoIndex === -1) return res.status(404).json({ message: 'Todo not found!' });

        const updatedTodo = await todoSchema.findByIdAndUpdate(todoId, { completed: true }, { new: true });
        if (!updatedTodo) return res.status(404).json({ message: 'Failed to delete Todo!' });

        res.status(200).json({ message: 'Todo completed successfully!', updatedTodo });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:userId/:todoId', async (req: any, res: any) => {
    try {
        const { userId, todoId } = req.params;
        const { todo } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const todoIndex = user.todos.findIndex((t: any) => t._id.toString() === todoId);
        if (todoIndex === -1) return res.status(404).json({ message: 'Todo not found!' });

        const updatedTodo = await todoSchema.findByIdAndUpdate(todoId, { title: todo }, { new: true });
        if (!updatedTodo) return res.status(404).json({ message: 'Failed to update Todo!' });

        res.status(200).json({ message: 'Todo updated successfully!', updatedTodo });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:userId/:todoId', async (req: any, res: any) => {
    try {
        const { userId, todoId } = req.params;
        const { todo } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const todoIndex = user.todos.findIndex((t: any) => t._id.toString() === todoId);
        if (todoIndex === -1) return res.status(404).json({ message: 'Todo not found!' });

        const deleteTodo = await todoSchema.findByIdAndDelete(todoId, { title: todo }, { new: true });
        if (!deleteTodo) return res.status(404).json({ message: 'Failed to delete Todo!' });

        user.todos.splice(todoIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Todo deleted successfully!' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;