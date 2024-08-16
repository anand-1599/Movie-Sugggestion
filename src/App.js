import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled, { keyframes } from 'styled-components';
import ParticlesBackground from './ParticlesBackground';
import './App.css';

// background: linear-gradient(to right, #1e3c72, #2a5298);

const Container = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 20px;
    padding: 20px;
    height: 100vh;
    color: white;
    position: relative;
    overflow: hidden;
    
`;

const FormContainer = styled.div`
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
`;

const Gallery = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

const MovieItem = styled.div`
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        height: 400px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 20px;
    }
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    margin-top: 10px;
`;

const buttonHover = keyframes`
    0% {
        background-color: #ff4757;
    }
    50% {
        background-color: #ff6b81;
    }
    100% {
        background-color: #ff4757;
    }
`;

const LikeButton = styled.button`
    background-color: #1e90ff;
    color: white;
    border: none;
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        animation: ${buttonHover} 1s infinite;
    }
`;

const DislikeButton = styled.button`
    background-color: #ff4757;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        animation: ${buttonHover} 1s infinite;
    }
`;

function App() {
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState({
        name: '',
        imdbLink: '',
        youtubeLink: '',
        cast: '',
        summary: ''
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const response = await axios.get('https://movie-sugggestion.onrender.com/movies');
        setMovies(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('https://movie-sugggestion.onrender.com/add-movie', form);
        setForm({ name: '', imdbLink: '', youtubeLink: '', cast: '', summary: '' });
        fetchMovies();
    };

    const handleVote = async (id, vote) => {
        const sessionVotes = JSON.parse(sessionStorage.getItem('votes')) || {};
        if (!sessionVotes[id]) {
            await axios.post(`https://movie-sugggestion.onrender.com/vote/${id}`, { vote });
            sessionVotes[id] = vote;
            sessionStorage.setItem('votes', JSON.stringify(sessionVotes));
            fetchMovies();
        }
    };

    return (
        <Container>
            <ParticlesBackground />
            <div style = {{overflowY : 'auto'}}>
                <h2 style = {{textAlign: 'center'}}>Dorm Films</h2>
            <Gallery>
                {movies.map((movie) => (
                    <MovieItem key={movie._id}>
                        <h2 style = {{ fontSize:'1.4rem', marginBottom: '10px', textAlign: 'center',height: '30px', overflowY: 'auto'}}>{movie.name}</h2>
                        {movie.poster && <img style = {{height: '300px',objectFit: 'cover',borderRadius: '10px',marginBottom: '10px'}}src={movie.poster} alt={`${movie.name} Poster`} />}
                        <p style = {{fontSize: '1rem',marginBottom: '5px', textAlign: 'justify',height: '130px', overflowY: 'auto' }}>{movie.summary}</p>
                        <p style = {{textAlign: 'center', height: '50px', overflowY: 'auto'}}>
                            <b>Cast:</b> {movie.cast}
                        </p>
                        <p>
                            <a href={movie.imdbLink} target="_blank" rel="noopener noreferrer" className="custom-link">
                                IMDb
                            </a>{' '}
                            |{' '}
                            <a href={movie.youtubeLink} target="_blank" rel="noopener noreferrer" className="custom-link">
                                YouTube Trailer
                            </a>
                        </p>
                        <div>
                            <LikeButton
                                onClick={() => handleVote(movie._id, 'like')}
                                disabled={JSON.parse(sessionStorage.getItem('votes'))?.[movie._id]}
                            >
                                Like ({movie.likes})
                            </LikeButton>
                            <DislikeButton
                                onClick={() => handleVote(movie._id, 'dislike')}
                                disabled={JSON.parse(sessionStorage.getItem('votes'))?.[movie._id]}
                            >
                                Dislike ({movie.dislikes})
                            </DislikeButton>
                        </div>
                        <ProgressBarContainer>
                            <ProgressBar>
                                <ProgressBar
                                    variant="success"
                                    now={(movie.likes / (movie.likes + movie.dislikes)) * 100}
                                    label={`${((movie.likes / (movie.likes + movie.dislikes)) * 100).toFixed(1)}%`}
                                />
                                <ProgressBar
                                    variant="danger"
                                    now={(movie.dislikes / (movie.likes + movie.dislikes)) * 100}
                                    label={`${((movie.dislikes / (movie.likes + movie.dislikes)) * 100).toFixed(1)}%`}
                                />
                            </ProgressBar>
                        </ProgressBarContainer>
                    </MovieItem>
                ))}
            </Gallery>
            </div>
            <FormContainer>
                <h1 style = {{textAlign: 'center'}}>Suggest a Movie</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Movie Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        type="url"
                        placeholder="IMDb Link"
                        value={form.imdbLink}
                        onChange={(e) => setForm({ ...form, imdbLink: e.target.value })}
                        required
                    />
                    <input
                        type="url"
                        placeholder="YouTube Trailer Link"
                        value={form.youtubeLink}
                        onChange={(e) => setForm({ ...form, youtubeLink: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Cast"
                        value={form.cast}
                        onChange={(e) => setForm({ ...form, cast: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Summary"
                        value={form.summary}
                        onChange={(e) => setForm({ ...form, summary: e.target.value })}
                        required
                    ></textarea>
                    <button type="submit">Add Movie</button>
                </form>
            </FormContainer>
        </Container>
    );
}

export default App;
