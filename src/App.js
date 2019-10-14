/*global swal*/

import React, { Component } from "react";
import logo from "./logo.svg";
import loading from "./loading.svg";
import "./App.css";
import Button from "./Button";
import AlbumCover from "./AlbumCover";

const apiToken =
  "BQCsWTH12uxNMAQigfYoGJACptwX9296y0-rEgI4euY1olOV-8mm00mvMx2EIOnOaKmIxsTT694xhspwU5WtCmT0ZS60-STovANNu6wK-jd7fYdbZZjVI4ngag-9BkZLU3jqWeTnQsy-ao1QvPFf_qI5jTK9YyRBXnaOKiHXnBa_";

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      tracks: [],
      currentTrack: {},
      songsLoaded: false,
      timeout: null
    };
  }

  loadAnotherTrack() {
    clearTimeout(this.state.timeout);
    let newTrack = this.state.tracks[getRandomNumber(this.state.tracks.length)]
      .track;
    while (newTrack.id === this.state.currentTrack.id) {
      newTrack = this.state.tracks[getRandomNumber(this.state.tracks.length)]
        .track;
    }
    this.setState({
      currentTrack: newTrack,
      timeout: setTimeout(this.loadAnotherTrack.bind(this), 10000)
    });
  }

  checkAnswer(trackId) {
    trackId === this.state.currentTrack.id
      ? swal("Bravo !", "Tu es svelte et élancé", "success").then(
          this.loadAnotherTrack.bind(this)
        )
      : swal("Non", "Tu as le cancer et tu es adopté", "error");
  }

  componentDidMount() {
    fetch("https://api.spotify.com/v1/me/tracks", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + apiToken
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          tracks: data.items,
          currentTrack: data.items[getRandomNumber(data.items.length)].track,
          songsLoaded: true,
          timeout: setTimeout(this.loadAnotherTrack.bind(this), 10000)
        });
      });
  }

  render() {
    if (!this.state.songsLoaded) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Bienvenue sur le Blindtest</h1>
          </header>
          <div className="App-images">
            <img src={loading} className="App-logo" alt="loading" />
          </div>
        </div>
      );
    }

    const track1 = this.state.currentTrack;

    let track2 = this.state.tracks[getRandomNumber(this.state.tracks.length)]
      .track;
    while (track2.id === track1.id) {
      track2 = this.state.tracks[getRandomNumber(this.state.tracks.length)]
        .track;
    }

    let track3 = this.state.tracks[getRandomNumber(this.state.tracks.length)]
      .track;
    while (track3.id === track1.id || track3.id === track2.id) {
      track3 = this.state.tracks[getRandomNumber(this.state.tracks.length)]
        .track;
    }

    const tracks = [track1, track2, track3];
    const shuffledTracks = shuffleArray(tracks);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <AlbumCover track={track1} />
        </div>
        <div className="App-buttons">
          {shuffledTracks.map(track => (
            <Button key={track.name} onClick={() => this.checkAnswer(track.id)}>
              {track.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
