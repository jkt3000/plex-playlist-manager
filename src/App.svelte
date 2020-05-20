<script>
  import interact from 'interactjs';
  import {onMount} from 'svelte';
  import {plexToken, plexUser, plexLibraries, currentLibrary, currLibId} from './stores.js';

  import Library from './Library.svelte';
  import WelcomePage from './pages/WelcomePage.svelte';
  import MoviePage from './pages/MoviePage.svelte';
  import PlaylistPage from './pages/PlaylistPage.svelte';  
  const Plex = document.plex; // only for console access


  let promise;
  setTimeout(function() {
    promise = loadLibraries();
  }, 0);
  //
  // app functions
  //

  /*
    async login       
      - login from Plex.server and store creds in Plex.storage
      - getLibraries

    logout           
      - clear user creds in Plex.storage
      - clear user creds in stores
      - clear libraries, currLibId in stores
      - clear movies,playlists, etc.

    loadPLex
      - loads creds from Plex.storage => stores.js

    initPlex (onMount)
      - clears libraries, currLibId, movies, playlists, etc.
      - loads creds

    async getLibraries (overrides)
      - loads loads libraries from Plex => stores.js
      - sets currLibId -> first lib
  */

  // login - login and store credentials
  async function login(event) {
    console.log("[App] Log in ", event);
    let email = event.detail.email;
    let password = event.detail.password;
    let resp = await Plex.Server.login(email, password);
    await initPlex();
  };

  // logout - clear credentials, clear cache
  async function logout() {
    // clear all credentials in Plex
    Plex.Server.logout();
    // clear all stored credentials
    // clear all libraries and other cached lists
    // load blank credentials
    loadPlex();
  };

  async function initPlex() {
    console.log("[App] Reset and init stores.js from Plex.params")
    $plexLibraries = [];
    $currLibId     = null;
    // clear movies, playlists, etc.
    loadPlex();
  };

  // Load stores.js from Plex.params
  function loadPlex() {
    $plexToken = Plex.token;
    $plexUser  = Plex.params();
  }

  async function loadLibraries() {
    console.log("[App] loadLibraries()")
    if ($plexToken == null) return;
    $plexLibraries = await document.plex.Library.all();
    $currLibId = $plexLibraries[0].key;
    console.log(`[stores] libraries: ${$plexLibraries.length} currLibId ${$currLibId}`);
  };

  onMount(() => {
    initPlex();
  });
</script>


<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top" id='header'>
  <a class="navbar-brand" href="#">
    Plex Tools 
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarsExampleDefault">
    <ul class="navbar-nav mr-auto">
      {#if $plexToken == null}
        <li class="nav-item">
          <a class="nav-link" href='#'><strong>Please login in to start</strong></a>
        </li>
      {:else}
        {#each $plexLibraries as library}
          <li class="nav-item">
            <a class="nav-link" 
               href="#" 
               class:active={ $currLibId == library.key }
               on:click={ () => $currLibId = library.key }>
              {library.title}
            </a>
          </li>
        {/each}
      {/if}
      <li class="nav-item">
        <span class='nav-link'>| <small>Lib: {$currLibId}</small> </span>
      </li>
    </ul>

    <ul class='navbar-nav'>
      <li class='nav-item'>
        {#if $plexToken}
          <a href="#" class='nav-link' on:click={logout}>
            <img src="{$plexUser.avatar}" width=40 class='rounded-circle inline'/>
            {$plexUser.name} 
            Logout
          </a>
        {/if}
      </li>
    </ul>
  </div>
</nav>


{#if ($plexToken != null) }
  {#await promise then libs}
    <PlaylistPage library={$plexLibraries.find(l => l.key == $currLibId) }/>
  {:catch error}
    <p>Error!</p>
  {/await}
{:else}
  <WelcomePage on:login={login} />
{/if}
