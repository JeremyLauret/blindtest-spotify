/*global swal*/

import React, { Component } from "react";
import logo from "./logo.svg";
import loading from "./loading.svg";
import "./App.css";
import Button from "./Button";
import AlbumCover from "./AlbumCover";

const apiToken =
  "BQC0jZshX7RTxZ-IIseLkUAONI9K0HxCAj9Jx0X5iTlrtXl0mqAEdFEu2A9yW4yEIIc5wsBzoQO2wo6jdttFWpmm_TGtErIgQT9vIPDRoCLkrXC4s7QZWfckarDbyBA4-FU7VPfb2ShlTIEEKwWhWELLqbe7Sp_LoIRB_3o1r9AO";

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
    this.setState({
      currentTrack: this.state.tracks[getRandomNumber(this.state.tracks.length)].track,
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
    let track1 = {};
    let track2 = {};
    let track3 = {};

    if (this.state.songsLoaded) {
      track1 = this.state.currentTrack;
      while (!track2.id || this.state.tracks[track2.id].track.id === track1.id) {
        track2.id = getRandomNumber(this.state.tracks.length);
      }
      track2 = this.state.tracks[track2.id].track;
      while (
        !track3.id ||
        this.state.tracks[track3.id].track.id === track1.id ||
        this.state.tracks[track3.id].track.id === track2.id
      ) {
        track3.id = getRandomNumber(this.state.tracks.length);
      }
      track3 = this.state.tracks[track3.id].track;
    }
    let tracks = [track1, track2, track3];
    tracks = shuffleArray(tracks);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          {this.state.songsLoaded ? (
            <AlbumCover track={track1} />
          ) : (
            <img src={loading} className="App-logo" alt="loading" />
          )}
        </div>
        <div className="App-buttons">
          {tracks.map(track => (
            <Button onClick={() => this.checkAnswer(track.id)}>
              {track.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
