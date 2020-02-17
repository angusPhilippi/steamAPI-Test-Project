import React, { Component } from 'react';
require('dotenv').config();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: false,
      steamId: process.env.REACT_APP_STEAM_ID,
      currentId: process.env.REACT_APP_STEAM_ID,
      invalidId: false
    }
  }

  componentDidMount() {
    fetch(`IPlayerService/GetOwnedGames/v0001/?key=${process.env.REACT_APP_API_KEY}&steamid=${this.state.steamId}&format=json&include_appinfo=true`,
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
          data: json.response,
          currentId: this.state.steamId,
          invalidId: false
        })
      })
      .catch(err => {
        console.log("Error, Invalid Steam ID");
        this.setState({
          steamId: this.state.currentId,
          invalidId: true
        })
        this.componentDidMount();
      });
  }

  handleChange(e) {
    this.setState({ steamId: e });
  }

  handleClick() {
    this.componentDidMount();
  }

  handleInvalidId() {
    if (this.state.invalidId) {
      return "Invalid Steam ID, Please try again."
    }
    else {
      return
    }
  }

  render() {
    var { isLoaded, data, steamId, currentId } = this.state;

    if (!isLoaded) {
      return <h2> Loading Data, Please Wait... </h2>
    }
    else if (data.game_count) {
      return (
        <div className="App">
          <h1>Game List for ID: {currentId}</h1>
          <input
            type="text"
            value={steamId}
            onChange={e => this.handleChange(e.target.value)}
          />
          <input
            className="btn"
            type="button"
            value="Submit"
            onClick={e => this.handleClick(e.target.value)}
          />
          <br></br>
          {this.handleInvalidId()}
          <h2>Game Count: {data.game_count}</h2>
          <ul>
            {data.games.map(game => (
              <li key={game.appid}>
                <strong>{game.name}:</strong> {Math.floor(game.playtime_forever / 60)} hours, {Math.round((game.playtime_forever / 60 - Math.floor(game.playtime_forever / 60)) * 60)}minutes.
            </li>
            ))};
          </ul>
        </div>
      );
    }
    else {
      return <h2> Issue Connecting to Steam API Service... (Steam Response Empty) </h2>
    }
  }
}

export default App;