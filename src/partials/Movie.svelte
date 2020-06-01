<script context='module'>
  //import moment from 'moment';
//  import {plexToken, plexUser, plexLibraries, currentPage, currentLibrary} from './stores.js';
</script>

<script>
  export let movie;
  let width=200;
  let height=300;
  let key = movie.ratingKey;
  let title = movie.title;
  let year = movie.year;  

  let Plex = document.plex;
</script>


<div class='mediaCell bg-dark'>
  <div class='poster-card'>
    <img src="{Plex.thumbUrl(movie.thumb, width, height)}" class='poster'/>
  </div>
  <div class='poster-text'>
    <h5>{title}</h5>
    <p class='text-muted'>
      {year} &middot; 
      {parseInt(movie.duration/60/1000,10)}m &middot; 
      <small class='text-warning'><i class='fas fa-star'></i></small> {movie.rating} 
      
    </p>
<!--   Rating: {movie.rating}
  Duration: {parseInt(movie.duration/60/1000,10)}m
  Release: {moment(movie.originallyAvailableAt).format("MMM D, YYYY")}
 -->  

  </div>
</div>

<style lang='scss'>

  $cellW:  140px;
  $cellH:  $cellW * 1.81;

:global(.mediaCell) {
  touch-action: none;
  user-select: none;
  margin:0 1.5em 1.5em 0;
  display:inline-block;
  /* h = 1.81w */
  width: $cellW;
  height: $cellH;
  overflow:hidden;
  text-align:left; 
  border:  1px solid transparent;
  &.active {
    border: 1px solid #aaa;
    box-shadow: 5px 5px 10px 5px rgba(0,0,0,0.5);
  }
  &.tapped {
    border: 1px solid red;
  }
  &.doubletapped {
    box-shadow: 0px 0px 10px 5px rgba(255,255,0,0.75);
  }
  .poster-card {
    width: 100%;
  }
  .poster-text {
    padding:  2px;
    height: 33%;
    display:block;
    overflow: hidden;
    color:  #ccc;
    h5, p, a {
      z-index: 1;
      font-size: .9em;
      line-height:1.5em;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      margin:0; padding:0;
      display:block;
      overflow:hidden;
    }
    h5 { font-weight:bold; font-size: 1em; line-height: 1.5em;}
  }

  img.poster {
    width: 100%;
  }  
}
</style>


