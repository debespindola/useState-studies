import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

const App = () => {
  const [inputUserValue, setInputUserValue] = useState('debespindola');
  const [image, setImage] = useState('');
  const [userName, setUserName] = useState('');
  const [bioText, setBioText] = useState('');
  const [inputRepositoriesValue, setInputRepositoriesValue] = useState('');
  const [repositories, setRepositories] = useState([]);

  const getRepositories = async () => {
    const data = await axios.get(`https://api.github.com/users/${inputUserValue}/repos`);
    const mapedInformation = data.data.map((repo) => ({ name: repo.name, id: repo.id }));

    setRepositories(mapedInformation);
  };

  const getInformation = async () => {
    try {
      const data = await axios.get(`https://api.github.com/users/${inputUserValue}`);
      const { name, avatar_url: avatarUrl, bio } = data.data;

      getRepositories();
      setImage(avatarUrl);
      setBioText(bio);
      setUserName(name);
    } catch (error) {
      setUserName('USER NOT FOUND');
      setImage('');
      setBioText('');
      setRepositories([]);
    }
  };

  const activeButton = {
    cursor: 'pointer',
    backgroundColor: 'pink',
  };

  const disabledButton = {
    cursor: 'default',
    backgroundColor: '#aaa',
  };

  useEffect(() => {
    getInformation();
  }, []);

  return (
    <div className="website">
      <header className="header-container">
        <h1 className="primary-title">CHECK UP ON A GITHUB ACCOUNT</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            getInformation();
          }}
          className="form-container"
        >
          <input
            className="search-input"
            type="text"
            value={inputUserValue}
            onChange={(event) => setInputUserValue(event.target.value)}
          />
          <input className="search-button" type="submit" value="SEARCH" style={activeButton} />
        </form>
      </header>

      <section className="initial-informations-container">
        {userName && <h2 className="github-name">{userName}</h2>}

        {image && <img src={image} alt="profile pic" className="user-picture" />}

        {bioText && <p className="user-bio">{bioText}</p>}
      </section>

      <section className="repository-list-container">
        {image && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputRepositoriesValue) {
              setRepositories([
                ...repositories,
                {
                  name: inputRepositoriesValue,
                  id: Math.random() * 1000,
                },
              ]);

              setInputRepositoriesValue('');
            }
          }}
          className="form-container"
        >
          <input
            className="search-input"
            type="text"
            value={inputRepositoriesValue}
            onChange={(event) => setInputRepositoriesValue(event.target.value)}
          />
          <input
            className="search-button"
            type="submit"
            value="ADD"
            style={inputRepositoriesValue ? activeButton : disabledButton}
          />
        </form>
        )}

        <ul>
          {repositories.map((each) => (
            <li key={each.id}>{each.name}</li>
          ))}
        </ul>
      </section>

      <footer className="footer-obs">
        {image && <p className="obs">obs: isso não cria um repositório no github de verdade, é apenas simulação</p>}
      </footer>
    </div>
  );
};

export default App;
