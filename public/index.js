const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = document.querySelector('#searchOn').value;

    try {

        if (!text) {

            let empty = document.getElementById('search-results')
            empty.innerHTML = '<br><h6>Enter some text</h6>'
            setTimeout(() => {
                empty.innerHTML = ''
            }, 2000);

            return;
        }


        const response = await fetch('http://localhost:3000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: text })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('Error:', error);
    }
});


//display on Modal

function displayResults(results) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';

    if (results.length === 0) {
        modalBody.innerHTML = '<tr><td colspan="4">No results found</td></tr>';
    } else {
        results.forEach(result => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${result.room_code.toUpperCase()}</td>
                <td>${capitalizeFirstLetter(result.room_name) || 'N/A'}</td>
                <td>${result.block.toUpperCase()}</td>
                <td>${result.floor}</td>
            `;
            modalBody.appendChild(tr);
        });
    }

    // Show the modal
    const searchResultsModal = new bootstrap.Modal(document.getElementById('searchResultsModal'));
    searchResultsModal.show();
}


function capitalizeFirstLetter(str) {
    if (!str)
        return;
    let [first, ...rest] = str;
    return first.toUpperCase() + rest.join('');
}


//Explore more section -- to load new page

document.getElementById('explore-button').addEventListener('click', (e) => {
    window.location.href = 'explore/index.html';
});




