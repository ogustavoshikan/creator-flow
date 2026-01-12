import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task, Status } from '../types';
import { useAuth } from './useAuth';

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper to extract YYYY-MM-DD from ISO date string or pass through simple date
    const normalizeDateString = (dateStr: string | null | undefined): string | undefined => {
        if (!dateStr) return undefined;
        // If it's already YYYY-MM-DD format (10 chars, no T), return as is
        if (dateStr.length === 10 && !dateStr.includes('T')) return dateStr;
        // If it has 'T', extract just the date part (before T)
        if (dateStr.includes('T')) return dateStr.split('T')[0];
        // Fallback: return as is
        return dateStr;
    };

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
        dueDate: normalizeDateString(dbTask.due_date),
        comments: dbTask.comments,
        attachments: dbTask.attachments,
        tags: dbTask.tags,
        assigneeAvatar: dbTask.assignee_avatar,
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
                .order('created_at', { ascending: true });

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
                due_date: newTask.dueDate,
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
            setTasks(prev => [...prev, createdTask]);
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
                due_date: updatedTask.dueDate,
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

    const duplicateTask = async (taskId: string) => {
        const taskToDuplicate = tasks.find(t => t.id === taskId);
        if (!taskToDuplicate || !user) return;

        const newTask = {
            title: `${taskToDuplicate.title} (Cópia)`,
            platform: taskToDuplicate.platform,
            priority: taskToDuplicate.priority,
            status: taskToDuplicate.status,
            description: taskToDuplicate.description,
            checklist: taskToDuplicate.checklist,
            isStagnant: taskToDuplicate.isStagnant,
            image: taskToDuplicate.image,
            date: taskToDuplicate.date,
            comments: 0,
            attachments: 0,
            tags: taskToDuplicate.tags,
            assigneeAvatar: taskToDuplicate.assigneeAvatar
        };

        await createTask(newTask);
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
        duplicateTask,
        moveTask,
        refreshTasks: fetchTasks
    };
}
