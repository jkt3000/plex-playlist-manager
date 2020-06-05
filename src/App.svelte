<script>
  import interact from 'interactjs';
  import {onMount} from 'svelte';
  import {plexToken, plexUser, plexLibraries, currLibrary} from './lib/stores.js';

  import Navbar from './partials/Navbar.svelte';
  import WelcomePage from './WelcomePage.svelte';
  import LibraryPanel from './LibraryPanel.svelte';
  import PlaylistPanel from './PlaylistPanel.svelte';
  const Plex = document.plex; // only for console access

  $: playlists = [];
  $: sidepanel = false;

  $: {
    if ($plexToken != null) {
      if ($currLibrary == null) {
        loadLibraries();
        loadPlaylists();
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

  async function loadPlaylists() {
    if ($plexToken == null) return;
    let resp = await Plex.Playlist.all();
    playlists = resp.Metadata;
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
          let drops = document.getElementsByClassName('droppable');
          drops.forEach(drop => { drop.classList.add('available')})
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
          let drops = document.getElementsByClassName('droppable');
          drops.forEach(drop => { drop.classList.remove('available')})
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
    interact('.playlist-drop.droppable').dropzone({
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

  function toggleSidePanel() {
    sidepanel = !sidepanel;
  };

</script>

<Navbar on:logout={logout} />
<div class='workspace'>
  <div class='playlist-panel' class:active={sidepanel}>
    <PlaylistPanel playlists={playlists} />
  </div>
  {#if ($plexToken != null) }
    {#if ($currLibrary != null)}      
      <div class='library-panel' class:active={sidepanel}>
        <LibraryPanel library={$currLibrary} showSide={sidepanel} on:toggleSidePanel={toggleSidePanel} />
      </div>
    {/if}
  {:else}
    <WelcomePage on:login={login} />
  {/if}
</div>

<style lang='scss'>

$sideWidth: 33vw;

.workspace {
  display:flex;
  flow-flow:column nowrap;
  align-items:stretch;
  top:55px;
  bottom:0;
  left:0;
  right:0;
}

.library-panel {
  position: relative;
  z-index:100;
  order: 1;
  top: 105px;
  &.active {
    width: calc(100% - #{$sideWidth});
  }
}
.playlist-panel {
  position: fixed;
  z-index: 100;
  top:  55px;
  bottom: 0;
  right: 0;
  order: 2;
  border-left:  1px solid #000;
  width:  $sideWidth;
  right: -($sideWidth);
  &.active {
    right: 0;
  }
}
</style>
