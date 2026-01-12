import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task, Status } from '../types';
import { useAuth } from './useAuth';

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mapDatabaseTaskToTask = (dbTask: any): Task => ({
        id: dbTask.id,
        title: dbTask.title,
        platform: dbTask.platform,
        priority: dbTask.priority || [],
        status: dbTask.status,
        description: dbTask.description || '',
        checklist: dbTask.checklist || [],
        isStagnant: dbTask.is_stagnant,
        image: dbTask.image,
        date: dbTask.date,
        comments: dbTask.comments,
        attachments: dbTask.attachments,
        tags: dbTask.tags,
        assigneeAvatar: dbTask.assignee_avatar,
        // Add other fields as necessary
    });

    const fetchTasks = useCallback(async () => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            setTasks(data ? data.map(mapDatabaseTaskToTask) : []);
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial fetch
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const createTask = async (newTask: Omit<Task, 'id'>) => {
        if (!user) return null;

        try {
            const taskToInsert = {
                user_id: user.id,
                title: newTask.title,
                platform: newTask.platform,
                priority: newTask.priority,
                status: newTask.status,
                description: newTask.description,
                checklist: newTask.checklist,
                is_stagnant: newTask.isStagnant || false,
                image: newTask.image,
                date: newTask.date,
                comments: newTask.comments || 0,
                attachments: newTask.attachments || 0,
                tags: newTask.tags || [],
                assignee_avatar: newTask.assigneeAvatar,
            };

            const { data, error: insertError } = await supabase
                .from('tasks')
                .insert([taskToInsert])
                .select()
                .single();

            if (insertError) throw insertError;

            const createdTask = mapDatabaseTaskToTask(data);
            setTasks(prev => [createdTask, ...prev]);
            return createdTask;
        } catch (err: any) {
            console.error('Error creating task:', err);
            setError(err.message);
            return null;
        }
    };

    const updateTask = async (updatedTask: Task) => {
        if (!user) return;

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

        try {
            const taskToUpdate = {
                title: updatedTask.title,
                platform: updatedTask.platform,
                priority: updatedTask.priority,
                status: updatedTask.status,
                description: updatedTask.description,
                checklist: updatedTask.checklist,
                is_stagnant: updatedTask.isStagnant,
                image: updatedTask.image,
                date: updatedTask.date,
                comments: updatedTask.comments,
                attachments: updatedTask.attachments,
                tags: updatedTask.tags,
                assignee_avatar: updatedTask.assigneeAvatar,
                updated_at: new Date().toISOString(),
            };

            const { error: updateError } = await supabase
                .from('tasks')
                .update(taskToUpdate)
                .eq('id', updatedTask.id);

            if (updateError) throw updateError;
        } catch (err: any) {
            console.error('Error updating task:', err);
            setError(err.message);
            // Revert optimistic update on error would be ideal here, 
            // but simplistic re-fetch is safer for now or we just alert
            fetchTasks();
        }
    };

    const deleteTask = async (taskId: string) => {
        if (!user) return;

        // Optimistic update
        setTasks(prev => prev.filter(t => t.id !== taskId));

        try {
            const { error: deleteError } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (deleteError) throw deleteError;
        } catch (err: any) {
            console.error('Error deleting task:', err);
            setError(err.message);
            fetchTasks();
        }
    };

    const moveTask = async (taskId: string, newStatus: Status) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            await updateTask({ ...task, status: newStatus });
        }
    };

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        refreshTasks: fetchTasks
    };
}
