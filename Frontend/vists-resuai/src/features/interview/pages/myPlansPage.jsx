import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import Navbar from '../../../components/Navbar.jsx';
import '../styles/myPlansPage.scss';

const ITEMS_PER_PAGE = 4;

const MyPlansPage = () => {
    const { loading, reports } = useInterview();
    const navigate = useNavigate();

    // Search, Filter & Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all"); // 'all', 'high', 'mid', 'low'
    const [currentPage, setCurrentPage] = useState(1);

    // Filter & Search Logic
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesQuery = (report.title || 'Untitled Position')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            
            const score = report.matchScore || 0;
            let matchesScore = true;
            if (scoreFilter === 'high') matchesScore = score >= 80;
            else if (scoreFilter === 'mid') matchesScore = score >= 60 && score < 80;
            else if (scoreFilter === 'low') matchesScore = score < 60;

            return matchesQuery && matchesScore;
        });
    }, [reports, searchQuery, scoreFilter]);

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
    const paginatedReports = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredReports.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredReports, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="plans-page-wrapper">
                <Navbar />
                <main className="loading-screen">
                    <div className="spinner-glow"></div>
                    <h1>Loading Your Strategy Library...</h1>
                </main>
            </div>
        );
    }

    return (
        <div className="plans-page-wrapper">
            <Navbar />

            <div className="plans-container">
                {/* Header */}
                <header className="page-header">
                    <div className="hero-badge">📄 STRATEGY LIBRARY</div>
                    <h1>My Interview <span className="highlight">Strategy Plans</span></h1>
                    <p>Search, filter, and review all your generated interview preparation strategies.</p>
                </header>

                {/* Search & Filter Controls */}
                <div className="controls-bar glass-card">
                    <div className="search-input-wrap">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by job title or company..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-wrap">
                        <label className="filter-label">Filter by Fit Score:</label>
                        <select
                            value={scoreFilter}
                            onChange={(e) => { setScoreFilter(e.target.value); setCurrentPage(1); }}
                            className="filter-select"
                        >
                            <option value="all">All Match Scores</option>
                            <option value="high">High Match (80%+)</option>
                            <option value="mid">Mid Match (60-79%)</option>
                            <option value="low">Low Match (&lt;60%)</option>
                        </select>
                    </div>

                    <div className="count-badge">{filteredReports.length} Plans Found</div>
                </div>

                {/* Plans Grid */}
                {paginatedReports.length > 0 ? (
                    <>
                        <div className="reports-grid">
                            {paginatedReports.map(report => (
                                <div
                                    key={report._id}
                                    className="report-card glass-card"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className="card-top">
                                        <h3>{report.title || 'Untitled Position'}</h3>
                                        <span className={`score-badge ${report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'}`}>
                                            {report.matchScore}% Match
                                        </span>
                                    </div>
                                    <div className="card-bottom">
                                        <span className="date-text">
                                            📅 {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="view-link">View Strategy →</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination-bar">
                                <span className="pagination-info">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length} plans
                                </span>

                                <div className="pagination-buttons">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="page-btn nav-btn"
                                    >
                                        ← Prev
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`page-btn num-btn ${currentPage === page ? 'active' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="page-btn nav-btn"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state glass-card">
                        <span className="empty-icon">📂</span>
                        <h3>No Interview Plans Found</h3>
                        <p>{reports.length === 0 ? "You haven't created any interview plans yet!" : "No plans matched your search query."}</p>
                        <button className="create-first-btn" onClick={() => navigate('/create')}>
                            ⚡ Create Your First Strategy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPlansPage;
