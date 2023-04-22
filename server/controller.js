require('dotenv').config()
const Sequelize = require('sequelize')
const {CONNECTION_STRING} = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {

    seed: (req, res) => {
        sequelize.query(`
            drop table if exists books;
            drop table if exists genres;
    
            create table genres (
                genre_id serial primary key, 
                name varchar
            );
    
           CREATE TABLE books (
            book_id SERIAL PRIMARY KEY,
            title VARCHAR,
            rating INT
            genre_id INT REFERENCES genres(genre_id)
           )
    
            insert into genres (name)
            values ('Fantasy'),
            ('Horror'),
            ('Adventure'),
            ('Science Fiction'),
            ('Mystery'),
            ('Action'),
            ('Thriller'),
            ('Historical'),
            ('Romance');
        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },

    getBooks: (req, res) => {
        sequelize.query(`
            SELECT 
                b.book_id,
                b.title,
                b.rating,
                g.genre_id,
                g.name genre
            FROM books b
            JOIN genres a
            ON b.genre_id = a.genre_id;
        `).then((dbRes) => {
            console.log('getting a book!!!')
            res.status(200).send(dbRes[0])
         }).catch((theseHands) => {
            console.log('not getting books')
            console.log(res.status)
            res.status(400).send(theseHands)
         })
    }, 

    createBook: (req, res) => {
        const {title, rating, genreId} = req.body

        sequelize.query(`
            INSERT INTO books
            (title, rating, genreId)
            VALUES (${title}, ${rating}, ${genreId})
        `).then((dbRes) => {
            console.log('creating a book!!!')
            res.status(200).send(dbRes[0])
         }).catch((theseHands) => {
            console.log('not creating book')
            console.log(theseHands)
            res.status(400).send(theseHands)
         })
    },

    getGenres: (req, res) => {
        sequelize.query(`
            SELECT * FROM genres
        `).then((dbRes) => {
            console.log('getting genres')
            res.status(200).send(dbRes[0])
         }).catch((theseHands) => {
            console.log('not getting genres')
            res.staus(400).send(theseHands)
         })
    },

    deleteBook: (req, res) => {
        const {id} = req.params

        sequelize.query(`
            DELETE FROM books
            WHERE book_id = ${id};
        `).then((dbRes) => {
            console.log('deleting!!!')
            res.status(200).send(dbRes[0])
         }).catch((theseHands) => {
            console.log('not deleting book')
            console.log(res.status)
            res.status(400).send(theseHands)
         })
    }
}