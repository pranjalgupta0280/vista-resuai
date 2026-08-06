import React from 'react';
import './aiTipsModal.scss';

const AiTipsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <span className="sparkle-icon">✨</span>
                        <h2>AI Resume &amp; Interview Master Guide</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <section className="tip-card">
                        <div className="tip-badge">1. ATS Optimization</div>
                        <h3>Keywords &amp; Action Verbs</h3>
                        <p>Tailor your resume text directly to the job description requirements. Use strong action verbs like <em>"Engineered"</em>, <em>"Architected"</em>, and <em>"Optimized"</em>.</p>
                    </section>

                    <section className="tip-card">
                        <div className="tip-badge">2. Quantifiable Impact</div>
                        <h3>Numbers &amp; Achievements</h3>
                        <p>Highlight measurable results (e.g. <em>"Increased system throughput by 40%"</em> or <em>"Reduced page load time from 3.2s to 800ms"</em>).</p>
                    </section>

                    <section className="tip-card">
                        <div className="tip-badge">3. STAR Method</div>
                        <h3>Behavioral Questions</h3>
                        <p>Structure answers using <strong>Situation</strong>, <strong>Task</strong>, <strong>Action</strong>, and <strong>Result</strong> to articulate your problem-solving process concisely.</p>
                    </section>

                    <section className="tip-card">
                        <div className="tip-badge">4. Technical Deep Dives</div>
                        <h3>System Architecture</h3>
                        <p>Be ready to explain trade-offs (e.g. SQL vs NoSQL, caching strategies, asynchronous message queues) for your target seniority level.</p>
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="primary-btn" onClick={onClose}>Got It, Let's Prepare!</button>
                </div>
            </div>
        </div>
    );
};

export default AiTipsModal;
