import React, { Component } from 'react';
require('dotenv').config();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalHours: 0,
      gamesResponse: [],
      playerResponse: [],
      isLoaded: false,
      steamId: process.env.REACT_APP_STEAM_ID,
      currentId: process.env.REACT_APP_STEAM_ID,
      invalidId: false
    }
  }

  componentDidMount() {
    this.handleGamesRequest();
  }

  handleGamesRequest() {
    fetch(`IPlayerService/GetOwnedGames/v0001/?key=${process.env.REACT_APP_API_KEY}&steamid=${this.state.steamId}&format=json&include_played_free_games&include_appinfo=true`,
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
          gamesResponse: json.response,
          invalidId: false
        })
      })
      .then(this.handlePlayerRequest())
      .catch(err => {
        console.log("Error, Invalid Steam ID");
        this.setState({
          steamId: this.state.currentId,
          invalidId: true
        })
        this.componentDidMount();
      });
  }

  handlePlayerRequest() {
    fetch(`ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.REACT_APP_API_KEY}&steamids=${this.state.steamId}`,
      {
        "headers":
        {
          "Accept": "application.json"
        }
      })
      .then(res => res.json())
      .then(json => {
        this.setState({
          playerResponse: json.response,
        })
      })
      .catch()
  }

  handleTextInput(e) {
    var reg = /^\d+$/
    if (reg.test(e[e.length - 1])) {
      this.setState({ steamId: e });
    }
  }

  handleButtonClick() {
    this.componentDidMount();
  }

  calculateTimePlayed(gamesArray) {
    let totalPlayTime = 0;
    gamesArray.forEach(game => {
      totalPlayTime = game.playtime_forever + totalPlayTime;
    });
    if (totalPlayTime === 0) {
      return "Games list of specified user is private, please modify in the steam client settings before proceeding."
    }
    return `Total Time Played: ${Math.floor(totalPlayTime / 60)} hours, ${Math.round((totalPlayTime / 60 - Math.floor(totalPlayTime / 60)) * 60)}minutes.`
  }

  displayGames(gamesResponse) {
    return (
      <ul>
        {gamesResponse.games.map(game => (
          <li key={game.appid}>
            <strong>{game.name}:</strong> {Math.floor(game.playtime_forever / 60)} hours, {Math.round((game.playtime_forever / 60 - Math.floor(game.playtime_forever / 60)) * 60)}minutes.
        </li>
        ))};
      </ul>)
  }

  render() {
    var { isLoaded, gamesResponse, playerResponse, steamId, currentId } = this.state;

    if (!isLoaded) {
      return <h2> Loading Data, Please Wait... </h2>
    }
    else if (gamesResponse.game_count && playerResponse.players.length > 0) {
      return (
        <div className="App">
          <h1>Game List for ID: {currentId}, {playerResponse.players[0].personaname}</h1>
          <input
            type="text"
            value={steamId}
            onChange={e => this.handleTextInput(e.target.value)}
          />
          <input
            className="btn"
            type="button"
            value="Submit"
            onClick={e => this.handleButtonClick(e.target.value)}
          />
          <h2>{this.calculateTimePlayed(gamesResponse.games)}</h2>
          <h2>Game Count: {gamesResponse.game_count}</h2>
          {this.displayGames(gamesResponse)}
        </div>
      );
    }
    else {
      return <h2> Issue Processing Request, Please Try Again. </h2>
    }
  }
}

export default App;