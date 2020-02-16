import React, { Component } from 'react';
require('dotenv').config();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: false,
    }
  }

  componentDidMount() {

    fetch(`/IPlayerService/GetOwnedGames/v0001/?key=${process.env.REACT_APP_API_KEY}&steamid=${process.env.REACT_APP_STEAM_ID}&format=json`,
      {
        "headers":
        {
          "Accept": "application.json"
        }
      })
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          data: json.response
        })
      })
      .catch(err => {
        console.log(err)
      });
  }

  render() {
    var { isLoaded, data } = this.state;

    if (!isLoaded) {
      return <h2> Loading Data... </h2>
    }
    else if (data.length > 0) {
      return (
        <div className="App">
          <h1>Game List for ID: {process.env.REACT_APP_STEAM_ID}</h1>
          <h2>Game Count: {data.game_count}</h2>
          <ul>
          {data.games.map(game => (
            <li key= {game.appid}>
              Game ID: {game.appid} | Gametime Played: {Math.floor(game.playtime_forever / 60)} hours, {Math.round((game.playtime_forever / 60 - Math.floor(game.playtime_forever / 60)) * 60)}minutes.
            </li>
          ))};
                    
          </ul>
        </div>
      );
    }
    else{
      return <h2> Issue Connecting to Steam API Service... </h2>
    }
  }
}

export default App;