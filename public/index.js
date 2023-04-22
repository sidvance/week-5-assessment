const form = document.querySelector('form')
const titleInput = document.querySelector('#title-input')
const genreSelect = document.querySelector('#genre-select')
const bookList = document.querySelector('#book-list')

function handleSubmit(e) {
    e.preventDefault()

    if (titleInput.value < 1) {
        alert ('You must enter a title')
        return
    }

    let userRating = document.querySelector('input[name="rating"]:checked').value
    let body = {
        name: titleInput.value, 
        rating: +userRating, 
        genreId: +genreSelect.value
    }

    axios.post('http://localhost:4004/books', body)
        .then(() => {
            genreSelect.value = 1
            titleInput.value = ''
            document.querySelector('#rating-one').checked = true
            getBooks()
        })
}

function deleteCard(id) {
    axios.delete(`http://localhost:4004/books/${id}`)
        .then(() => getBooks())
        .catch(err => console.log(err))
}

function getBooks() {
    bookList.innerHTML = ''

    axios.get('http://localhost:4004/books/')
        .then(res => {
            res.data.forEach(elem => {
                let countryCard = `<div class="book-card">
                    <h2>${elem.title}</h2>
                    <h3>Genre: ${elem.genre}</h3>
                    <h3>Rating: ${elem.rating}/5</h3>
                    <button onclick="deleteCard(${elem['book_id']})">Delete</button>
                    </div>
                `

                bookList.innerHTML += countryCard
            })
        })
}

function getGenres() {
    axios.get('http://localhost:4004/books')
        .then(res => {
            res.data.forEach(genre => {
                const option = document.createElement('option')
                option.setAttribute('value', genre['genre_id'])
                option.textContent = genre.name
                genreSelect.appendChild(option)
            })
        })
}

getGenres()
getBooks()
form.addEventListener('submit', handleSubmit)