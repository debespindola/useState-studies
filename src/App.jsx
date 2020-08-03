import React, { useState } from 'react';
import axios from 'axios';

import './App.css';

const App = () => {
  const [inputUserValue, setInputUserValue] = useState('');
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
    const data = await axios.get(`https://api.github.com/users/${inputUserValue}`);
    const { name, avatar_url: avatarUrl, bio } = data.data;

    setImage(avatarUrl);
    setBioText(bio);
    setUserName(name);
  };

  return (
    <div>
      <form onSubmit={(event) => {
        event.preventDefault();

        getInformation();
        getRepositories();
      }}
      >
        <input type="text" value={inputUserValue} onChange={(event) => setInputUserValue(event.target.value)} />
        <input type="submit" value="buscar" />
      </form>

      <section className="initial-informations-container">

        {userName && <h2 className="github-name">{userName}</h2>}

        {bioText && <p className="user-bio">{bioText}</p>}

        {image && <img src={image} alt="profile pic" className="user-picture" />}

      </section>

      <section className="repository-list-container">
        <form onSubmit={(event) => {
          event.preventDefault();

          setRepositories([
            ...repositories,
            {
              name: inputRepositoriesValue,
              id: Math.random() * 1000,
            },
          ]);

          setInputRepositoriesValue('');
        }}
        >
          <input type="text" value={inputRepositoriesValue} onChange={(event) => setInputRepositoriesValue(event.target.value)} />
          <input type="submit" value="criar" />
        </form>

        <ul>
          {repositories.map((each) => (
            <li key={each.id}>{each.name}</li>
          ))}
        </ul>

        <p className="obs">obs: isso não cria um repositório no github de verdade, é apenas simulação</p>
      </section>
    </div>
  );
};

export default App;
