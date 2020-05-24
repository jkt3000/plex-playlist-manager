<script>
  import { onMount } from 'svelte';
  import InfiniteScroll from "/partials/InfiniteScroll.svelte";

  import {plexToken, plexUser, plexLibraries, currLibId} from '/lib/stores.js';
  import Movie from '/partials/Movie.svelte';
  import PlaylistPage from '/PlaylistPage.svelte';
  const Plex = document.plex; // only for console access

  export let library = null;
  let newBatch     = [];
  let movies       = [];
  let page         = 1;
  let page_size    = 200;
  let showSpinner  = false;
  let promise;
  $: showPlaylists = false;

  async function loadMovies() {
    showSpinner = true;
    if (library != null) {
      let key = library.key;
      let resp = await Plex.Movie.all(key, {page: page, page_size: page_size});
      newBatch    = resp.Metadata;
      showSpinner = false;
      movies      = [ ...movies, ...newBatch];
      console.log("Movies count is ", movies.length);
    }
  };


  $: {
    let el;
    if (library != null) {
      movies = [];
      page = 1;
      el = document.getElementById('workpanel');
      if (el) {
        el.scrollTop = 0;
      }
      promise = loadMovies();
    }
  }

  function togglePlaylists() {
    showPlaylists = !showPlaylists
  }

</script>


{#if library}
<nav class="navbar navbar-expand fixed-top panel-header">
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
  <ul class="navbar-nav">
    <li class='nav-item'>
      <a class='nav-link' href='#'  on:click={togglePlaylists}>
        <i class="fas fa-chevron-double-{showPlaylists ? 'right' : 'left'}"></i> Playlists
      </a>
    </li>
    {#if showSpinner}
      <li>
        <i class='fas fa-spinner fa-spin'></i>
      </li>
    {/if}
  </ul>
</nav>
{/if}

<div class='panel-body'>
  <div class='playlist-panel' class:active={showPlaylists}>
    <PlaylistPage />
  </div>

  <div class='media-panel' class:active={showPlaylists}>
    {#await promise}
    {:then _ }
      {#each movies as movie}
        <Movie movie={movie} />
      {/each}
    {:catch error}
      <p class='alert alert-danger'>{error.message}</p>
    {/await}
  </div>
</div>
<InfiniteScroll hasMore={newBatch.length == page_size}
    threshold={1000} scrollpos={library ? 0 : 1}
    on:loadMore={() => {page++; loadMovies()}} />


<style lang='scss'>
.panel-header {
  position: fixed;
  top:  55px;
  background: black;
  height: 50px;
  max-height:50px;
  width: inherit;
}

.panel-body {
  xborder:  1px solid pink;
}

$sideWidth: 33vw;

@media (min-width: 1200px) {
  .playlist-panel {
    width:  25rem !important;
  }
  .media-panel {
    &.active {
      width:  calc(100% - 25rem) !important;
      margin-right:  25rem !important;
    }
  }
}

.media-panel {
  xborder: 1px solid green;
  width: 100%;
  padding: 1.5em 2em;
  transition: all 0.4s;
  margin-right: 0;
  &.active {
    width: calc(100% - #{$sideWidth});
    margin-right: $sideWidth;
  }
}
.playlist-panel {
  xborder:  1px solid red;
  position: fixed;
  top:  105px;
  right: 0;
  bottom:  0;
  background: lighten(#343a40, 5%);
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.9);
  padding:  1em;
  width:  $sideWidth;
  transition: all 0.4s;
  overflow-y: scroll;
  margin-right: -($sideWidth);
  &.active {
    margin-right: 0;
  }
}


</style>