import React, { useState } from 'react'
import '../styles/interview.scss'

// ── Hardcoded Data (No external API needed) ───────────────────────────────────
const mockReport = {
    "matchScore": 88,
    "technicalQuestions": [
        {
            "question": "Your self-description mentions strong skills in React and experience with MERN stack. Can you elaborate on a specific React project where you built reusable components and optimized for performance?",
            "intention": "To assess practical React experience, component design, and performance optimization in a frontend context.",
            "answer": "While my resume highlights AI/ML projects, my self-description confirms my strong React skills and MERN stack experience. In a full-stack MERN application I developed, I focused on creating modular, reusable React components for UI elements like navigation bars, forms, and data display tables. For performance, I implemented techniques such as lazy loading components, memoization with `React.memo` and `useMemo`, and optimized API calls to reduce unnecessary re-renders and improve load times. I also ensured the application was responsive across various devices."
        },
        {
            "question": "The job requires understanding REST APIs. Can you describe your experience consuming and integrating RESTful services in your web applications, particularly how you handle data fetching, error handling, and authentication?",
            "intention": "To verify practical experience with API integration, a core frontend task.",
            "answer": "My MERN stack projects heavily relied on consuming REST APIs. I've used `fetch` API and Axios for data fetching, handling asynchronous operations with `async/await`. For error handling, I implemented try-catch blocks to gracefully manage network errors or API response issues, displaying user-friendly messages. For authentication, I've worked with JWTs (JSON Web Tokens), storing them securely and including them in request headers for protected routes, ensuring secure communication with the backend."
        },
        {
            "question": "Your resume lists Git and GitHub under Developer Tools. Can you describe your typical Git workflow when collaborating on a project, including branching strategies and conflict resolution?",
            "intention": "To assess practical Git knowledge and collaboration skills.",
            "answer": "My projects, including the AI ones, extensively use Git and GitHub for version control. My typical workflow involves creating feature branches from `develop` or `main`, working on specific tasks, and then creating pull requests for code reviews. I follow a Gitflow-like branching strategy for larger projects. When conflicts arise, I use `git status`, `git diff`, and `git log` to understand the changes, then manually resolve conflicts in my editor, followed by `git add` and `git commit`."
        }
    ],
    "behavioralQuestions": [
        {
            "question": "The job emphasizes collaboration with backend developers and designers. Can you share an experience where you effectively collaborated with a cross-functional team to deliver a feature or project?",
            "intention": "To assess collaboration and communication skills.",
            "answer": "In my MERN stack projects, I frequently collaborated with peers playing backend roles and also took on design considerations. For instance, when developing a new user dashboard, I worked closely with the 'backend developer' to define API endpoints and data structures, ensuring smooth data flow. I also iterated with 'designers' (or my own design ideas) to ensure the UI/UX met requirements, providing feedback on feasibility and suggesting improvements for responsiveness and accessibility. Regular stand-ups and clear communication channels were key."
        },
        {
            "question": "Your resume shows a strong background in AI/ML and competitive programming, which are different from core frontend development. How do you approach learning new technologies or adapting your skills to a new domain, and how do you see your diverse background benefiting a frontend role?",
            "intention": "To understand adaptability, learning agility, and how they connect their unique background to the job.",
            "answer": "I'm a highly adaptable learner, as demonstrated by my dive into AI/ML and competitive programming. My approach involves starting with foundational concepts, building small projects to apply knowledge, and then exploring advanced topics and best practices. For frontend, I leveraged my strong problem-solving skills from competitive programming to tackle complex UI logic and optimize application performance. My AI/ML background, particularly in understanding data flow and system architecture, helps me think critically about how frontend interacts with backend services and how to build more intelligent and efficient user interfaces."
        }
    ],
    "skillGaps": [
        {
            "skill": "HTML/CSS (Advanced)",
            "severity": "medium"
        },
        {
            "skill": "Tailwind CSS or modern UI frameworks",
            "severity": "low"
        },
        {
            "skill": "Web Performance Optimization (Specific strategies)",
            "severity": "low"
        }
    ],
    "preparationPlan": [
        {
            "day": 1,
            "focus": "Core Frontend Fundamentals & Responsive Design",
            "tasks": [
                "Review advanced HTML5 semantics and accessibility best practices.",
                "Deep dive into modern CSS techniques (Flexbox, Grid, custom properties).",
                "Practice building responsive layouts without frameworks.",
                "Understand browser rendering processes and the critical rendering path."
            ],
            "_id": "69d74f7b05f78db784ed01f8"
        },
        {
            "day": 2,
            "focus": "Advanced React & State Management",
            "tasks": [
                "Explore advanced React hooks (useReducer, useContext, custom hooks).",
                "Understand different state management patterns (Redux, Zustand, Context API).",
                "Practice building complex, data-driven components.",
                "Review React performance optimization techniques (memoization, lazy loading)."
            ],
            "_id": "69d74f7b05f78db784ed01f9"
        },
        {
            "day": 3,
            "focus": "UI Frameworks & Styling",
            "tasks": [
                "Learn the basics of Tailwind CSS and build a small component using it.",
                "Explore other popular UI libraries (e.g., Material-UI, Chakra UI) to understand their philosophy.",
                "Practice integrating a UI framework into a React project.",
                "Understand CSS-in-JS solutions like Styled Components or Emotion."
            ],
            "_id": "69d74f7b05f78db784ed01fa"
        },
        {
            "day": 4,
            "focus": "Web Performance & Build Tools",
            "tasks": [
                "Study web performance metrics (LCP, FID, CLS) and how to measure them.",
                "Learn about code splitting, tree shaking, and image optimization.",
                "Understand browser caching strategies and service workers.",
                "Familiarize with Webpack/Vite configuration for optimization."
            ],
            "_id": "69d74f7b05f78db784ed01fb"
        },
        {
            "day": 5,
            "focus": "Interview Preparation & System Design Basics",
            "tasks": [
                "Practice common Frontend Developer interview questions (JavaScript closures, event loop, React lifecycle).",
                "Review basic system design concepts relevant to frontend (CDN, caching, load balancing).",
                "Prepare to articulate how competitive programming and AI/ML skills are transferable.",
                "Refine answers to behavioral questions, focusing on collaboration and problem-solving."
            ],
            "_id": "69d74f7b05f78db784ed01fc"
        }
    ]
};

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')

    // Data is strictly driven by the mock object, no hooks or loading states
    const scoreColor =
        mockReport.matchScore >= 80 ? 'score--high' :
            mockReport.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    {/* External PDF logic removed to keep it purely visual/hardcoded */}
                    <button className='button primary-button'>
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{mockReport.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {mockReport.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{mockReport.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {mockReport.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{mockReport.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {mockReport.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{mockReport.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {mockReport.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview