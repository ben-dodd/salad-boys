// js/reviewParser.js
function parseReviewText(text) {
  const lines = text.split('\n').map(l => l.trim());
  const review = {};

  // Helper to get the body after 'Body:'
  const bodyIndex = lines.findIndex(l => l.toLowerCase().startsWith('body:'));
  if (bodyIndex >= 0) {
    review.body = lines.slice(bodyIndex).join('\n').replace(/^body:/i, '').trim();
  } else {
    review.body = '';
  }

  lines.slice(0, bodyIndex >= 0 ? bodyIndex : lines.length).forEach(line => {
    const [key, ...rest] = line.split(':');
    if (!key || rest.length === 0) return;
    const value = rest.join(':').trim();
    switch(key.toLowerCase()) {
      case 'publication': review.publication = value; break;
      case 'album': review.album = value; break;
      case 'type': review.type = value; break;
      case 'date': review.date = value; break;
      case 'writer': review.writer = value; break;
      case 'rating': review.rating = value; break;
      case 'link': review.link = value; break;
    }
  });

  return review;
}

// Convert "4/5" to stars ★★★★☆
function renderStars(rating) {
  if (!rating) return '';
  const [num, outOf] = rating.split('/').map(Number);
  const fullStars = '★'.repeat(num);
  const emptyStars = '☆'.repeat(outOf - num);
  return `<div class="review-rating stars">${fullStars}${emptyStars}</div>`;
}
