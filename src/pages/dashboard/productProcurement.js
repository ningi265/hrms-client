import React, { useEffect } from 'react';

const ProductReviewsAnalysis = () => {
  // Mock data included directly in the component
  const productMetrics = {
    avg_rating: 4.2,
    ratings_distribution: {
      5: 45,
      4: 30,
      3: 15,
      2: 7,
      1: 3
    },
    feedback_topics: [
      { name: "Product Quality", sentiment: "positive", percentage: 85 },
      { name: "User Experience", sentiment: "positive", percentage: 78 },
      { name: "Value for Money", sentiment: "neutral", percentage: 62 },
      { name: "Customer Service", sentiment: "positive", percentage: 73 },
      { name: "Shipping Speed", sentiment: "negative", percentage: 45 }
    ]
  };

  // Define colors directly since CSS variables might not be accessible
  const colors = {
    positive: '#10b981', // Green
    neutral: '#3B82F6',  // Blue
    negative: '#dc2626', // Red
    amber: '#f59e0b',    // Amber for ratings
    border: '#e5e7eb'    // Border/background color
  };

  // Add animation for feedback topics
  useEffect(() => {
    const insightItems = document.querySelectorAll('.topic-item');
    if (insightItems.length) {
      insightItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 100);
      });
    }
  }, []);

  return (
    <div className="report-card">
      <div className="card-header">
        <h3>Product Reviews Analysis</h3>
        <div className="card-actions">
          <button className="btn-text">View Detailed Report</button>
        </div>
      </div>
      <div className="card-content">
        <div className="reviews-analysis">
          <div className="ratings-overview">
            <div className="rating-score">
              <div className="score-circle">
                <svg viewBox="0 0 36 36">
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="none" 
                  />
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    stroke={colors.amber}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${productMetrics.avg_rating * 100 / 5}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="score-value">{productMetrics.avg_rating}</div>
              </div>
              <div className="score-label">Overall Rating</div>
            </div>
            <div className="ratings-breakdown">
              {Object.entries(productMetrics.ratings_distribution)
                .sort((a, b) => b[0] - a[0]) // Sort by rating in descending order
                .map(([rating, percentage]) => (
                <div className="rating-item" key={rating}>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`star ${i < rating ? 'filled' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill={i < parseInt(rating) ? colors.amber : "none"} 
                        stroke={i < parseInt(rating) ? colors.amber : colors.border}
                        strokeWidth={i < parseInt(rating) ? "0" : "2"}
                        width="14"
                        height="14"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <div className="rating-bar" style={{ backgroundColor: 'rgba(229, 231, 235, 0.3)' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: colors.amber,
                        height: '100%',
                        borderRadius: '4px'
                      }}
                    ></div>
                  </div>
                  <div className="rating-percentage">{percentage}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="feedback-topics">
            <h4>Common Feedback Topics</h4>
            <div className="topics-list">
              {productMetrics.feedback_topics.map((topic, index) => (
                <div className="topic-item" key={index}>
                  <div className="topic-name">{topic.name}</div>
                  <div className="topic-bar" style={{ backgroundColor: 'rgba(229, 231, 235, 0.3)' }}>
                    <div 
                      className={`progress-bar ${topic.sentiment}`}
                      style={{ 
                        width: `${topic.percentage}%`,
                        backgroundColor: colors[topic.sentiment],
                        height: '100%', 
                        borderRadius: '4px'
                      }}
                    ></div>
                  </div>
                  <div className="topic-percentage" style={{ 
                    color: colors[topic.sentiment],
                    fontWeight: 600
                  }}>
                    {topic.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewsAnalysis;