<script>
  import {currLibrary, currPlaylist} from './../lib/stores.js';
  const Plex = document.plex; // only for console access

  export let libraries;
  export let playlists;


  async function loadPlaylist(key) {
    let data = await Plex.Playlist.get(key);
    $currPlaylist = data.Metadata[0];
  };
</script>

<nav class='sidebar text-muted' id='sidebar'>
  <div class='sidebar-sticky'>

    <h6>Libraries</h6>

    {#if (libraries != null)}
    <ul class='nav flex-column'>
      {#each libraries as library}
        <li class="nav-item">
          <a class="nav-link" 
             href="#" 
             class:active={ $currLibrary == library }
             on:click={ () => $currLibrary = library }>
            {library.title} <small class='text-muted'>({library.totalSize})</small>
          </a>
        </li>
      {/each}
    </ul>
    {/if}

    <h6>
      Playlists  
      <a href='#' class='float-right text-success'><i class='fas fa-plus-circle'></i></a>
    </h6>

    {#if (playlists != null)}
    <ul class='nav flex-column'>
      {#each playlists as playlist}
      <li class='nav-item' class:droppable={!playlist.smart} data-id={playlist.ratingKey}>
        <a href="#" class='nav-link' on:click={() => {loadPlaylist(playlist.ratingKey)} }>
          {#if playlist.smart}<i class='fas fa-cog text-muted'></i>{/if}
          {playlist.title}
          <small class='text-muted'>({playlist.leafCount})</small>
        </a>
      </li>
      {/each}
    </ul>
    {/if}
  </div>        
</nav>



<style lang='scss'>

  .nav-link { 
    color: #aaa; 
    margin-left: -8px;
    &.active {
      color:  #fff;
      font-weight: bold;
    }
  }
  .nav-item {
    &.active-drop {
      background: #999 !important;
      border: 1px dashed red !important;
    }
  }
  .sidebar-sticky {
    padding: 1em .5em;
    h6 { 
      text-transform: uppercase; 
      font-size: .9em; 
    }
    ul { 
      margin-bottom: 1em; 
    }
  }
</style>