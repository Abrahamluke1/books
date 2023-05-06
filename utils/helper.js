// In a separate JavaScript file (e.g., `helpers.js`)
function activeClass(currentPage) {
    const page = window.location.pathname.slice(1);
    if (page === currentPage) {
      return 'active';
    } else if (page === '' && currentPage === 'home') {
      return 'active';
    } else {
      return '';
    }
  }