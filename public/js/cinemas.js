//public/js/cinema.js
document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');
    titleInput.addEventListener('input', () => fetchTitles(titleInput.value));
  
    async function fetchTitles(query) {
      if (query.length < 3) return;
      try {
        const response = await fetch(`/cinemas/titles?q=${query}`);
        const titles = await response.json();
        const datalist = document.getElementById('titles');
        datalist.innerHTML = '';
        titles.forEach(title => {
          const option = document.createElement('option');
          option.value = title;
          datalist.appendChild(option);
        });
      } catch (error) {
        console.error('Error fetching titles:', error);
      }
    }
  });