require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'b8cc6273'; // Replace with your OMDB API key

app.use(cors());
app.use(bodyParser.json());

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://gptmspe:mspegpt-2023@movie.6kpjvlg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI/*'mongodb://localhost:27017/movieDB'*/, { useNewUrlParser: true, useUnifiedTopology: true });
    //.then(() => console.log('MongoDB connected'))
    //.catch(err => console.log(err));

const movieSchema = new mongoose.Schema({
    name: String,
    imdbLink: String,
    youtubeLink: String,
    cast: String,
    summary: String,
    poster: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
});

movieSchema.virtual('imdbIdVirtual').get(function (){
    const urlPattern = /tt\d+/;
    const match = this.imdbLink.match(urlPattern);
    return match ? match [0] : null;
});

const Movie = mongoose.model('Movie', movieSchema);

app.post('/add-movie', async (req, res) => {
    const { name, imdbLink, youtubeLink, cast, summary } = req.body;
    const tempMovie = new Movie({imdbLink});
    const imdbId = tempMovie.imdbIdVirtual;
    const omdbResponse = await axios.get(`http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
    const poster = omdbResponse.data.Poster || '';
    const movie = new Movie({ name, imdbLink, youtubeLink, cast, summary, poster });
    await movie.save();
    res.send(movie);
});

app.get('/movies', async (req, res) => {
    const movies = await Movie.find().sort({ likes: -1 });
    res.send(movies);
});

app.post('/vote/:id', async (req, res) => {
    const { id } = req.params;
    const { vote } = req.body;
    const movie = await Movie.findById(id);
    if (vote === 'like') movie.likes++;
    if (vote === 'dislike') movie.dislikes++;
    await movie.save();
    res.send(movie);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
