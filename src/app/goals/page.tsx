"use client"
import { Button } from '@/components/ui/button';
import React, { useState, FormEvent } from 'react';

interface Goal {
    goal: string;
    deadline: string;
}

const GoalManager: React.FC = () => {
    const [goal, setGoal] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [goals, setGoals] = useState<Goal[]>([]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (goal && deadline) {
            setGoals([...goals, { goal, deadline }]);
            setGoal('');
            setDeadline('');
        }
    };

    const handleDelete = (index: number) => {
        setGoals(goals.filter((_, i) => i !== index));
    };

    return (
        <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Goal Management</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Add New Goal</h2>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Enter your goal"
                        className="w-4/5 p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-4/5 p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <Button
                        type="submit"
                        className="w-4/5  "
                    >
                        Add Goal
                    </Button>
                </form>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Your Goals</h2>
                <ul className="list-none p-0">
                    {goals.map((item, index) => (
                        <li
                            key={index}
                            className="bg-white shadow-md p-4 mb-2 rounded-lg flex justify-between items-center transition-transform transform hover:-translate-y-1"
                        >
                            <span className="flex-grow">{item.goal} (Deadline: {item.deadline})</span>
                            <button
                                onClick={() => handleDelete(index)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GoalManager;
