<script>
  import interact from 'interactjs';
  import {onMount} from 'svelte';
  import {plexToken, plexUser, plexLibraries, currLibId} from './lib/stores.js';

  import WelcomePage from './WelcomePage.svelte';
  import LibraryPage from './LibraryPage.svelte';
  const Plex = document.plex; // only for console access


  let promise;
  setTimeout(function() {
    promise = loadLibraries();
  }, 0);

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
    Plex.Server.logout();
    initPlex();
  };

  async function initPlex() {
    console.log("[App] Reset and init stores.js from Plex.params")
    $plexLibraries  = [];
    $currLibId      = null;
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
          el.classList.remove('tapped');
          el.classList.remove('doubletapped');
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
    interact('.mediaCell').on('tap', (e) => {
      e.currentTarget.classList.toggle('tapped');      
      e.currentTarget.classList.remove('doubletapped');
    });
    interact('.mediaCell').on('doubletap', (e) => {
      e.currentTarget.classList.toggle('doubletapped');
      e.currentTarget.classList.remove('tapped');
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

</script>

<nav class="navbar navbar-expand-md navbar-dark fixed-top" id='header'>
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

<div class='panel'>
  {#if ($plexToken != null) }
    {#await promise then libs}
      <LibraryPage library={$plexLibraries.find(l => l.key == $currLibId)} />
    {:catch error}
      <p>Error!</p>
    {/await}
  {:else}
    <WelcomePage on:login={login} />
  {/if}
</div>

<style lang='scss'>

#header {
  background: darken(#343a40, 10%);
  height: 55px;
  max-height:55px;
}

.panel {
  xborder:  1px solid red;
  display: block;
  padding: 0;
  width:  100vw;
  height: 100%;
  margin-top: 55px;
  overflow-y: scroll;
  overflow-x: hidden;
}

</style>
