import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import agentStatsService from '../services/agentStatsService';

const ReviewSystem = ({ agentId, agentName, isOwner }) => {
  const { user } = usePrivy();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ 
    rating: 5, 
    comment: '', 
    category: 'general',
    helpful: true 
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Load reviews from localStorage
  useEffect(() => {
    if (agentId) {
      const storedReviews = JSON.parse(localStorage.getItem(`reviews_${agentId}`) || '[]');
      setReviews(storedReviews);
    }
  }, [agentId]);

  // Review categories
  const reviewCategories = [
    { value: 'general', label: 'General' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'speed', label: 'Speed' },
    { value: 'helpfulness', label: 'Helpfulness' },
    { value: 'communication', label: 'Communication' }
  ];

  // Submit new review
  const handleSubmitReview = async () => {
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    if (isOwner) {
      alert('You cannot review your own agent');
      return;
    }

    // Check if user already reviewed this agent
    const existingReview = reviews.find(review => review.userId === user.id);
    if (existingReview) {
      alert('You have already reviewed this agent. You can edit your existing review.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      
      const review = {
        id: Date.now().toString(),
        user: user.email?.address || user.id || 'Anonymous',
        userId: user.id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        category: newReview.category,
        helpful: newReview.helpful,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        verified: true // Could be based on actual purchase verification
      };

      const updatedReviews = [...reviews, review];
      setReviews(updatedReviews);
      
      // Store in localStorage
      localStorage.setItem(`reviews_${agentId}`, JSON.stringify(updatedReviews));
      
      // Update agent stats
      agentStatsService.updateReviewStats(agentId, updatedReviews);
      
      // Reset form
      setNewReview({ rating: 5, comment: '', category: 'general', helpful: true });
      setShowReviewForm(false);
      
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (reviewFilter === 'all') return true;
      if (reviewFilter === 'positive') return review.rating >= 4;
      if (reviewFilter === 'negative') return review.rating <= 2;
      return review.category === reviewFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  // Calculate review statistics
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half-filled">☆</span>);
    }

    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(<span key={i} className="star empty">☆</span>);
    }

    return stars;
  };

  const renderInteractiveStars = (rating, onChange) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-button ${i <= rating ? 'active' : ''}`}
          onClick={() => onChange(i)}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="review-system">
      {/* Review Summary */}
      <div className="review-summary">
        <div className="review-stats">
          <div className="average-rating">
            <div className="rating-number">{averageRating.toFixed(1)}</div>
            <div className="rating-stars">{renderStars(averageRating)}</div>
            <div className="rating-count">({reviews.length} reviews)</div>
          </div>
          
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating}★</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${reviews.length > 0 ? ((ratingDistribution[rating] || 0) / reviews.length) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="rating-count">({ratingDistribution[rating] || 0})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Controls */}
      <div className="review-controls">
        <div className="review-filters">
          <select 
            value={reviewFilter} 
            onChange={(e) => setReviewFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Reviews</option>
            <option value="positive">Positive (4-5 stars)</option>
            <option value="negative">Negative (1-2 stars)</option>
            {reviewCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {user && !isOwner && (
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-primary btn-review"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form">
          <h3 className="form-title">Write a Review for {agentName}</h3>
          
          <div className="form-group">
            <label>Rating *</label>
            <div className="star-input">
              {renderInteractiveStars(newReview.rating, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              value={newReview.category} 
              onChange={(e) => setNewReview(prev => ({ ...prev, category: e.target.value }))}
              className="form-select"
            >
              {reviewCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Comment *</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience with this agent..."
              className="form-textarea"
              rows="4"
              maxLength="500"
            />
            <small className="char-count">{newReview.comment.length}/500 characters</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newReview.helpful}
                onChange={(e) => setNewReview(prev => ({ ...prev, helpful: e.target.checked }))}
              />
              <span>This agent was helpful to me</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !newReview.comment.trim()}
              className="btn-primary"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
            <button 
              onClick={() => setShowReviewForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this agent!</p>
          </div>
        ) : (
          filteredAndSortedReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-details">
                    <div className="reviewer-name">{review.user}</div>
                    <div className="review-date">{review.date}</div>
                    {review.verified && (
                      <div className="verified-badge">✓ Verified Purchase</div>
                    )}
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <div className="review-body">
                <div className="review-category">{reviewCategories.find(c => c.value === review.category)?.label}</div>
                <p className="review-comment">{review.comment}</p>
                {review.helpful && (
                  <div className="helpful-badge">👍 Found this helpful</div>
                )}
              </div>
              
              <div className="review-footer">
                <div className="review-actions">
                  <button 
                    className="action-button"
                    onClick={() => {
                      // Handle like functionality
                      console.log('Like review:', review.id);
                    }}
                  >
                    👍 Helpful ({review.likes})
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => {
                      // Handle dislike functionality
                      console.log('Dislike review:', review.id);
                    }}
                  >
                    👎 Not helpful ({review.dislikes})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem; 