<script>
  import { onMount } from 'svelte';
  import {plexToken, plexUser, plexLibraries, currLibId} from './../stores.js';
  import Movie from './../Movie.svelte';
  const Plex = document.plex; // only for console access

  export let library = null;
  $: promise = loadMovies(library);
  
  async function loadMovies(lib) {
    let id = lib.key;
    if (id != null) {
      let results = await Plex.Movie.all(id);

    console.log("[loadMovies] for", id, results.size);
      return results.Metadata;      
    } else {
      return [];
    }
  }
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
  {#if library}
  <nav class="navbar navbar-expand sticky-top" id='filter-bar'>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="#"><span class='badge badge-pill badge-primary'>{library.totalSize}</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Filters</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Sort Order</a>
      </li>
    </ul>
  </nav>
  {/if}

  <div class='workarea'>
    {#await promise}
      <div class='p-2 m-2 text-center'>
        <h2>Loading... <i class="fas fa-spinner fa-spin"></i></h2>
      </div>
    {:then movies}
      {#if movies != null}
        {#each movies as movie}
          <Movie movie={movie}/>
        {/each}
      {/if}
      <p>Error loading...</p>
    {:catch error}
      <p>ERROR!</p>
    {/await}
  </div>
</div>



