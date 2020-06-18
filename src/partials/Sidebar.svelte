<script>
  import {plexLibraries, plexPlaylists, currLibrary, currPlaylist} from './../lib/stores.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

</script>

<nav class='sidebar text-muted' id='sidebar'>
  <div class='sidebar-sticky'>

    <h6>Libraries</h6>
    {#if ($plexLibraries != null)}
    <ul class='nav flex-column'>
      {#each $plexLibraries as library}
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
      <a href='#' class='float-right text-primary' on:click={() => dispatch('newPlaylist')}><i class='fas fa-plus-circle fa-lg'></i></a>
    </h6>
    {#if ($plexPlaylists != null)}
    <ul class='nav flex-column'>
      {#each $plexPlaylists as playlist, i}
      <li class='nav-item' class:droppable={!playlist.smart} data-id={playlist.ratingKey}>
        <a href="#" class='nav-link' on:click={() => { $currPlaylist = playlist} }>
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