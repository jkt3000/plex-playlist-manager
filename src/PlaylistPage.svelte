
<script>  
  import { onMount } from 'svelte';

  import {plexToken, plexUser, plexLibraries, currLibId} from '/lib/stores.js';
  import Playlist from '/partials/Playlist.svelte';
  const Plex = document.plex; // only for console access

  export let library = null;

  let promise;
  let playlists = [];
  let newBatch  = [];
  $: listType = 'smart';

  $: {
    console.log("checking to see if we load playlists yet...", library)
    if (library != null) {
      promise = loadPlaylists();
    }
  };

  async function loadPlaylists() {
    console.log("[PlaylistPage] loadPlaylists for active Plextoken", $plexToken);
    let resp = await Plex.Playlist.all();
    newBatch = resp.Metadata;
    playlists = newBatch;
  };
</script>
<nav class='navbar navbar-expand m-0 p-0'>
  <span class='navbar-brand'>
    <i class="far fa-list-alt"></i> Playlists
  </span>
  <ul class='navbar-nav'>
    <li class='nav-item'>
      <a href='#' class='nav-link'>All</a>
    </li>
    <li class='nav-item'>
      <a href='#' class='nav-link'>Smart</a>
    </li>
    <li class='nav-item'>
      <a href='#' class='nav-link'>Regular</a>    
    </li>
  </ul>  
  <ul class='navbar-nav'>
    <li class='nav-link'>
      <a href='#' class='nav-link'>
        <i class='fas fa-plus-circle fa-lg text-white'></i>
      </a>
    </li>
  </ul>

</nav>
<h5><i class="far fa-list-alt"></i> Playlists
  <span class='btn btn-sm'
        class:btn-outline-primary={listType !== 'all'}
        class:btn-primary={listType === 'all'}
        on:click={() => listType = 'all'}>All</span>
  <span class='btn btn-sm' 
        class:btn-outline-success={listType !== 'smart'}
        class:btn-success={listType === 'smart'}
        on:click={() => listType = 'smart'}>Smart</span>
  <span class='btn btn-sm'
        class:btn-outline-warning={listType !== 'regular'}
        class:btn-warning={listType === 'regular'}
        on:click={() => listType = 'regular'}>Regular</span>
</h5>
{#await promise}
{:then results }
  {#each playlists as playlist}
    <Playlist playlist={playlist} listType={listType}/>
  {/each}
{:catch error}
  <p class='alert alert-danger'>{error.message}</p>
{/await}
