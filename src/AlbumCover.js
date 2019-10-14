/*global swal*/

import React, { Component } from "react";
import Sound from "react-sound";

class AlbumCover extends Component {
  render() {
    const albumImages = this.props.track.album.images;
    const previewUrl = this.props.track.preview_url;
    return albumImages.length > 0 ? (
      <div>
        <img src={this.props.track.album.images[1].url} alt={this.props.track.name}></img>
        <Sound url={previewUrl} playStatus={Sound.status.PLAYING} />
      </div>
    ) : (
      <p>No image was found for this track!</p>
    );
  }
}

export default AlbumCover;
