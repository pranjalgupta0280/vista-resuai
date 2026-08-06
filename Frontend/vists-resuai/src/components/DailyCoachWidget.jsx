import React, { useState, useEffect, useMemo } from 'react';
import { getDailyCoach, toggleDailyCoachTask } from '../features/interview/services/interview.api';
import { useAuth } from '../features/auth/hooks/useAuth';
import './dailyCoachWidget.scss';

const DEFAULT_COACH_DATA = {
    streakCount: 3,
    yesterdayRecap: ['✓ Resume version updated', '✓ 1 Interview plan generated'],
    todayTasks: [
        { id: 't1', text: 'Learn Redis & System Caching Strategy', estMinutes: 30, completed: false },
        { id: 't2', text: 'Solve 2 Graph & System Design Questions', estMinutes: 40, completed: false },
        { id: 't3', text: 'Interactive Mock Interview Review', estMinutes: 20, completed: false }
    ],
    totalEstMinutes: 90
};

const DailyCoachWidget = () => {
    const { user } = useAuth();
    const [coachData, setCoachData] = useState(DEFAULT_COACH_DATA);
    const [loading, setLoading] = useState(false);

    // Compute dynamic greeting based on hour
    const timeGreeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good morning';
        if (hour >= 12 && hour < 17) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const fetchCoach = async () => {
        setLoading(true);
        try {
            const data = await getDailyCoach();
            if (data?.coach) {
                setCoachData(data.coach);
            }
        } catch (error) {
            console.error("Failed to fetch daily coach, using local state:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoach();
    }, []);

    const handleToggleTask = async (taskId) => {
        if (!coachData) return;
        // Optimistic UI update
        setCoachData(prev => {
            if (!prev) return prev;
            const updatedTasks = prev.todayTasks.map(t =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            );
            return { ...prev, todayTasks: updatedTasks };
        });

        try {
            await toggleDailyCoachTask(taskId);
        } catch (error) {
            console.warn("Backend sync notice for daily task toggle:", error);
        }
    };

    const completedCount = coachData.todayTasks.filter(t => t.completed).length;
    const totalCount = coachData.todayTasks.length;
    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const userName = user?.username || user?.email?.split('@')[0] || 'Friend';

    return (
        <section className="daily-coach-card glass-card">
            {/* Header with Greeting & Streak */}
            <div className="coach-header">
                <div className="greeting-wrap">
                    <div className="coach-badge">✨ PERSONALIZED DAILY COACH</div>
                    <h2>{timeGreeting}, <span className="highlight-cyan">{userName}</span></h2>
                    <p className="subtitle">Here is your daily interview prep sprint to keep your momentum high.</p>
                </div>

                <div className="streak-badge">
                    <span className="flame-icon">🔥</span>
                    <div className="streak-text">
                        <span className="streak-count">{coachData.streakCount} Day Streak</span>
                        <span className="streak-sub">Keep coming back daily!</span>
                    </div>
                </div>
            </div>

            <div className="coach-body">
                {/* Left Column: Yesterday's Recap */}
                <div className="recap-column">
                    <div className="col-header">
                        <span className="col-icon">⏪</span>
                        <h3>Yesterday's Recap</h3>
                    </div>
                    <ul className="recap-list">
                        {coachData.yesterdayRecap.map((item, idx) => (
                            <li key={idx} className="recap-item">
                                <span className="check-icon">✓</span>
                                <span>{item.replace(/^✓\s*/, '')}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-divider"></div>

                {/* Right Column: Today's Action Tasks */}
                <div className="tasks-column">
                    <div className="col-header">
                        <div className="header-title-wrap">
                            <span className="col-icon">🎯</span>
                            <h3>Today's Prep Sprint</h3>
                        </div>
                        <div className="time-est-pill">
                            <span>⏱️ Est. {coachData.totalEstMinutes} min</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-wrap">
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                        </div>
                        <span className="progress-text">{completedCount} of {totalCount} completed ({progressPct}%)</span>
                    </div>

                    {/* Tasks Checkbox List */}
                    <div className="tasks-list">
                        {coachData.todayTasks.map(task => (
                            <div
                                key={task.id}
                                className={`task-item ${task.completed ? 'completed' : ''}`}
                                onClick={() => handleToggleTask(task.id)}
                            >
                                <div className="checkbox-wrap">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => {}} // Handled by div onClick
                                    />
                                    <span className="custom-checkmark"></span>
                                </div>

                                <div className="task-content">
                                    <span className="task-title">{task.text}</span>
                                    <span className="task-est">~{task.estMinutes} min</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DailyCoachWidget;
