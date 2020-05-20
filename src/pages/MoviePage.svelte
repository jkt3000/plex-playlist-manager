<script>
  import { onMount } from 'svelte';
  import {plexToken, plexUser, plexLibraries, currentPage, currentLibrary} from './../stores.js';
  import Movie from './../Movie.svelte';
  const Plex = document.plex; // only for console access

  export let library_id = null;

  let movies = [];
  let totalSize = null;


  async function loadMovies() {
    let results = await Plex.Movie.all(library_id);
    console.log(results)
    totalSize = results.size;
    return results.Metadata;
  }

  onMount(async () => {
    movies = [... await loadMovies()];
  })
</script>


<div class='panel-right col-3 no-gutters'>
  <nav class="navbar navbar-expand sticky-top filterbar-right">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="#">Playlists</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Sort by</a>
      </li>
      <li class='nav-item '>
        <a class="nav-link" href="#"><i class='fas fa-plus-circle'></i></a>
      </li>
    </ul>
  </nav>
  <div class='workarea-right'>
    <div class='playlist-drop'>
      <h5>My fav movies</h5>
    </div>
  </div>
</div>

<div class='panel-left col-9 no-gutters'>
  <nav class="navbar navbar-expand sticky-top" id='filter-bar'>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="#">{totalSize}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Sort by</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Genre: Action</a>
      </li>
    </ul>
  </nav>

  <div class='workarea'>
    {#each movies as movie}
      <Movie movie={movie}/>
    {/each}
  </div>
</div>

