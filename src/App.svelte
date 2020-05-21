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
    await Plex.Server.login(email, password);
    initPlex();
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
    if ($plexToken == null) return;
    let data = await Plex.Library.all();
    console.log('[App] loadLibaries() ',data)
    $plexLibraries = data;
    $currLibId = $plexLibraries[0].key;
    console.log(`[App] loadLibraries: ${$plexLibraries.length} currLibId ${$currLibId}`);
    console.log("[App] Curr Library", $plexLibraries[0])
  };

  onMount(() => {
    initPlex();

    interact('.mediaCell').draggable({
      hold: 0,  // need for ipad when having scrollable content
      inertia: {
        smoothEndDuration: 200,
        resistance: 10,
        minSpeed: 200,
        endSpeed: 100,
      },
      listeners: {
        start (event) {
          let el = event.target;
          el.classList.add('active');
        },
        move (event) {
          let el = event.target;
          let x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.setAttribute('data-x',x);
          el.setAttribute('data-y',y);
        },
        end(event) {
          let el = event.target;
          el.removeAttribute("data-y");
          el.removeAttribute("data-x");
          el.removeAttribute("style");

          el.classList.remove('active');
        }
      }
    });

    interact('.playlist-drop').dropzone({
      accept: '.mediaCell',
      overlap: 'pointer',
      listeners: {
        dropactivate (event) {
          event.target.classList.remove('active-drop');
          event.target.classList.remove('dropped');
        },
        dropdeactivate (event) {
        },
        dragenter(event) { 
          event.target.classList.add('active-drop');
        },
        dragleave(event) {
          event.target.classList.remove('active-drop');
        },
        drop(event) {
          event.target.classList.remove('active-drop');
          event.target.classList.add('dropped');
          setTimeout(() => event.target.classList.remove('dropped'), 600);
        }
      }
    });    
  });



  async function myfetch(url) {
      let resp = await fetch(url).then(async result => {
          console.log("result", result);
          if (result.ok) {
            let data = await resp.json().then( output => {
              return {status: result.status, message: result.message, data: output}
            }).catch(e => {
              return {message: ["error1", e.message], data:null}
            });
          } else {
            return {status: "Not OK", message: result.statusText, data: null }
          }
        }).catch(e => {
            console.log("Error on fetch", e.message);
            return {status: 'bad', message: ["error1", e.message], data: null}
        });
      console.log("output from awaits", resp)
      return resp;


      // }).catch(e => {
      //   console.log("Catch ",e);
      //   return e;
      // });
      // console.log("Resp is ", resp);
      // let data = await resp.json().then( result => {
      //   console.log("result 2", result);
      //   return result;
      // }).catch(e => {
      //   console.log("Catch 2", e);
      //   return e;
      // });
      // return data;
  }

  document.fetch = myfetch;


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
