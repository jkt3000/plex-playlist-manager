<script>
  import interact from 'interactjs';
  import {onMount} from 'svelte';
  import {plexToken, plexUser, plexLibraries, currLibrary} from './lib/stores.js';

  import Navbar from './partials/Navbar.svelte';
  import WelcomePage from './WelcomePage.svelte';
  import LibraryPage from './LibraryPage.svelte';
  const Plex = document.plex; // only for console access

  $: {
    if ($plexToken != null) {
      if ($currLibrary == null) {
        loadLibraries();
      } 
    }
  }

  // login - login and store credentials
  async function login(event) {
    console.log("[App] Log in ", event);
    let email = event.detail.email;
    let password = event.detail.password;
    await Plex.Server.login(email, password);
    initPlex();
    loadLibraries();
  };

  // logout - clear credentials, clear cache
  async function logout() {
    Plex.Server.logout();
    initPlex();
  };

  async function initPlex() {
    console.log("[App] Reset and init stores.js from Plex.params")
    $plexLibraries = [];
    $currLibrary   = null;
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
    $currLibrary = $plexLibraries[0];
    console.log("[App] Curr Library", $currLibrary)
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

<Navbar on:logout={logout} />

<div class='panel'>
  {#if ($plexToken != null) }
    <LibraryPage library={$currLibrary} />
    }
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
  display: block;
  padding: 0;
  width:  100%;
  height: 100%;
  padding-top:  50px;
  overflow-y: scroll;
  overflow-x: hidden;
}

</style>
