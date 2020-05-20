<div class='bg-light border-1 mb-2 movie'>
  <img src="{Plex.thumbUrl(movie.thumb, width, height)}" />
  <p>{title} <small>({year})</small></p>
  Rating: {movie.rating}
  Duration: {parseInt(movie.duration/60/1000,10)}m
  Release: {moment(movie.originallyAvailableAt).format("MMM D, YYYY")}
  
</div>

<script context='module'>
  import moment from 'moment';
//  import {plexToken, plexUser, plexLibraries, currentPage, currentLibrary} from './stores.js';
</script>

<script>
  export let movie;
  let width=75;
  let height=150;
  let key = movie.ratingKey;
  let title = movie.title;
  let year = movie.year;  

  let Plex = document.plex;
</script>

<style>
.movie {
  width:  150px;
  height:  300px;
  max-height:  300px;
  overflow: hidden;
  border:  1px solid #333;
  padding:  10px;
  margin:  3px 3px 0 3px;
  flex-shrink:  1;

}
</style>