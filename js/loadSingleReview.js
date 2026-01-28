function loadSingleReview(file, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="loading">Loading review...</div>';

  fetch(`resources/reviews/${file}`)
    .then(res => res.text())
    .then(text => {
      const review = parseReviewText(text);

      const html = `
        <div class="single-review">
          <div class="review-content">
            <div class="review-header">${review.publication} - ${review.album || ''} ${review.type || ''}</div>
            <div class="review-meta">Originally published <a href="${review.link || '#'}" target="_blank">here</a> on ${review.date || ''}</div>
            ${review.writer ? `<div class="review-author">By ${review.writer}</div>` : ''}
            ${review.rating ? renderStars(review.rating) : ''}
            <div class="review-body">${review.body.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      `;

      container.innerHTML = html;
      container.scrollTop = 0;
    })
    .catch(err => {
      container.innerHTML = '<div class="under-construction">Could not load review.</div>';
      console.error(err);
    });
}
