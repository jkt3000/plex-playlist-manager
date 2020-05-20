<script>
  import interact from 'interactjs';
  import {onMount} from 'svelte';
  import {plexToken, plexUser, plexLibraries, currentPage, currentLibrary, current} from './stores.js';

  import Library from './Library.svelte';
  import WelcomePage from './pages/WelcomePage.svelte';
  import MoviePage from './pages/MoviePage.svelte';
  import PlaylistPage from './pages/PlaylistPage.svelte';
  import CollectionPage from './pages/CollectionPage.svelte';

  const Plex = document.plex; // only for console access

  // copy plex params into store  
  function loadPlex() {
    $plexToken = Plex.token;
    $plexUser = Plex.params();
  }

  async function loadLibraries() {
    let libs = await Plex.Library.all();
    console.log("[App] Plex call for Libraries", libs);
    if (Array.isArray(libs)) {
      $plexLibraries = libs;
    }
  };

  function toggleLogin() {
    return;
  };

  function login() {

  }
  function logout() {
    Plex.logout();
    loadPlex();
  }
 
  setTimeout(() => {
    if ($plexLibraries.length == 0) {
      loadLibraries();
    }
  }, 0);

  onMount(() => {
    loadPlex();
  });
</script>


<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top" id='header'>
  <a class="navbar-brand" href="#" on:click={ () => $currentPage = 'welcome' }>
    Plex Tools 
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarsExampleDefault">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item" class:active={$currentPage == 'movies'}>
        <a class="nav-link" href="#" on:click={ () => $currentPage = 'movies' }>Medias</a>
      </li>
      <li class="nav-item" class:active={$currentPage == 'playlists'}>
        <a class="nav-link" href="#" on:click={ () => $currentPage = 'playlists' }>Playlists</a>
      </li>
      <li class="nav-item" class:active={$currentPage == 'collections'}>
        <a class="nav-link" href="#" on:click={ () => $currentPage = 'collections' }>Collections</a>
      </li>
      <li class="nav-item"><span class='nav-link'>|</span></li>
      {#each $plexLibraries as library}
        <li class="nav-item">
          <a class="nav-link" 
             href="#" 
             class:active={ $currentLibrary == library.key }
             on:click={ () => $currentLibrary = library.key }>
            {library.title}
          </a>
        </li>
      {/each}
      <li class="nav-item"><span class='nav-link'>
        <small>{$currentPage}|{$currentLibrary}</small>
      </span></li>

<!--       <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
        <div class="dropdown-menu" aria-labelledby="dropdown01">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
 -->    </ul>
    <ul class='navbar-nav'>
      <li class='nav-item'>
        {#if $plexToken}
          <a href="#" class='nav-link' on:click={toggleLogin}>{$plexUser.name} Logout</a>
        {:else}
          <a href="#" class='nav-link' on:click={toggleLogin}>Login</a>
        {/if}
      </li>
    </ul>
  </div>
</nav>

{#if ($plexToken == null) }
  <WelcomePage on:click={loadLibraries}/>
{:else if $currentPage == 'playlists'}
  <PlaylistPage library_id={$currentLibrary}/>
{:else if $currentPage == 'movies'}
  <MoviePage library_id={$currentLibrary}/>
{:else if $currentPage == 'collections'}
  <CollectionPage library_id={$currentLibrary}/>
{:else}
  <WelcomePage on:click={loadLibraries}/>
{/if}
