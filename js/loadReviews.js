async function loadReviews(indexFile, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<p>Loading reviews...</p>';

  console.log(`Loading reviews from: ${indexFile}`);

  let files;
  try {
    const res = await fetch(indexFile);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    files = await res.json();
    console.log(`Found ${files.length} reviews:`, files);
  } catch (err) {
    console.error('Failed to load review index:', err);
    container.innerHTML = '<p>Error loading reviews.</p>';
    return;
  }

  // Parse all reviews
  const reviews = [];
  for (const file of files) {
    try {
      const text = await fetch(`resources/reviews/${file}`).then(r => r.text());
      const review = parseReviewText(text);

      // Defaults
      review.writer = review.writer || 'Unknown';
      review.rating = review.rating || null;
      review.publication = review.publication || 'Unknown Publication';
      review.album = review.album || 'Unknown Album';
      review.date = review.date || 'Unknown Date';
      review.type = review.type || '';
      review.file = file;

      reviews.push(review);
    } catch (err) {
      console.error(`Failed to load review ${file}:`, err);
    }
  }

  // Group reviews by album
  const albums = {};
  reviews.forEach(r => {
    if (!albums[r.album]) albums[r.album] = [];
    albums[r.album].push(r);
  });

  container.innerHTML = ''; // clear loading message

  // Render each album with its reviews
  for (const albumName in albums) {
    const albumReviews = albums[albumName];

    // Album artwork filename
    const artworkFile = albumName.toLowerCase().replace(/\s+/g, '_') + '-200px.jpg';
    const artworkHTML = `
      <div class="review-artwork">
        <img src="resources/album-art/${artworkFile}" alt="${albumName}" />
      </div>
    `;

    // Container for all reviews for this album
    const reviewsHTML = albumReviews.map(r => {
      const reviewLink = '/#press/review?file=' + r.file;
      return `
        <div class="review-item">
          <a href="${reviewLink}">${r.publication}</a> - 
          <strong>${r.album}</strong> ${r.type} - ${r.date}
        </div>
      `;
    }).join('');

    const albumGroupHTML = `
      <div class="album-group">
        ${artworkHTML}
        <div class="review-list">${reviewsHTML}</div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', albumGroupHTML);
  }

  console.log('All reviews rendered.');
}

