

<div class='cellItem draggable'>
  <div class='poster-card'>
    <img src="{Plex.thumbUrl(movie.thumb, width, height)}" class='poster'/>
  </div>
  <div class='poster-text'>
    <h5>{title}</h5>
    <p>{year}</p>
<!--   Rating: {movie.rating}
  Duration: {parseInt(movie.duration/60/1000,10)}m
  Release: {moment(movie.originallyAvailableAt).format("MMM D, YYYY")}
 -->  

  </div>
</div>


<script context='module'>
  import moment from 'moment';
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

<style lang='scss'>
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


.cellItem {
  background: inherit;
  box-sizing: border-box;
  touch-action: none;
  user-select: none;
  margin:0.5em 0.5em 0 0;
  display:inline-block;
  width: 150px;
  height: 270px;
  overflow:hidden;
  text-align:left; 
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
    height: 100px;
    display:block;
    overflow: hidden;
    h5, p, span, a {
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
    width: 150px; 
  }  
}
</style>


