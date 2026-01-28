/**
 * 90s Style Website Router
 * Loads content dynamically into the main content area
 */

// Content cache to avoid reloading
const contentCache = {};

// Current page tracking
let currentPage = '';

/**
 * Load a page into the content area
 * @param {string} pagePath - Path to the content file (e.g., 'main/news')
 */
async function loadPage(pagePath) {
  const contentArea = document.getElementById('content-area');

  // --- Handle single review only if it has ?file= ---
  if (pagePath.includes('press/review') && pagePath.includes('?file=')) {
    const params = new URLSearchParams(pagePath.split('?')[1]);
    const file = params.get('file');
    if (file) {
      loadSingleReview(file, 'content-area');
      currentPage = pagePath; // mark as loaded
      return; // stop normal page fetch
    }
  }

  // --- Normal page loading ---
  if (currentPage === pagePath) return;

  contentArea.innerHTML = '<div class="loading">Loading...</div>';

  try {
    let content;

    if (contentCache[pagePath]) {
      content = contentCache[pagePath];
    } else {
      const response = await fetch(`content/${pagePath}.html`);
      if (!response.ok) throw new Error('Page not found');
      content = await response.text();
      contentCache[pagePath] = content;
    }

    contentArea.innerHTML = content;
    currentPage = pagePath;
    contentArea.scrollTop = 0;
    executeScripts(contentArea);

    // Initialize reviews list if we're on the reviews page
    if (pagePath === 'press/reviews') {
      loadReviews('resources/reviews/index.json', 'reviews-list');
    }
  } catch (error) {
    console.error(error);
    contentArea.innerHTML = `
      <div class="under-construction">
        <h1>Page Not Found!</h1>
        <img src="resources/construction.gif" alt="Under Construction">
        <p>Sorry, this page is still under construction!</p>
        <p>Please check back later.</p>
        <p><a href="#" onclick="loadPage('main/news'); return false;">Return to Home</a></p>
      </div>
    `;
  }
}


/**
 * Execute scripts found in dynamically loaded content
 * @param {HTMLElement} container - The container with the new content
 */
function executeScripts(container) {
  const scripts = container.querySelectorAll('script');
  scripts.forEach(script => {
    const newScript = document.createElement('script');
    if (script.src) newScript.src = script.src;
    else newScript.textContent = script.textContent;
    document.head.appendChild(newScript);
    document.head.removeChild(newScript);
  });
}

/**
 * Handle browser back/forward buttons
 */
window.addEventListener('hashchange', function() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  loadPage(hash);
});

/**
 * Handle initial page load with hash
 */
window.addEventListener('load', function() {
  const hash = window.location.hash.slice(1);
  if (hash) loadPage(hash);
});

/**
 * Utility function to format dates in 90s style
 */
function formatDate(date) {
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Simple visitor counter (stored in localStorage)
 */
function updateVisitorCounter() {
  let count = localStorage.getItem('visitorCount') || 0;
  count = parseInt(count) + 1;
  localStorage.setItem('visitorCount', count);

  const counterElement = document.querySelector('.visitor-counter');
  if (counterElement) counterElement.textContent = String(count).padStart(6,'0');
}