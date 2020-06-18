<script context='module'>
  import moment from 'moment';
  import interact from 'interactjs';
</script>

<script>
  import {onMount} from "svelte";
  import {plexPlaylists, currPlaylist, showSpinner} from './lib/stores.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let Plex       = document.plex;

  export let playlist;

  $: showEdit = false;

  $: entries = [];  
  $: {
    if (playlist != null) {
      loadItems();
    }
  }

  async function loadItems() {
    $showSpinner = true;
    let data = await Plex.Playlist.getItems(playlist.ratingKey);
    entries = data.Metadata || [];
    $showSpinner = false;
  };

  async function removeItem(id) {
    $showSpinner = true;
    let data = await Plex.Playlist.removeItem(playlist.ratingKey, id);
    updatePlaylists(data.Metadata[0]);
    $showSpinner = false;
  };

  async function moveBeforeItem(itemId, targetId) {
    $showSpinner = true;
    let id = playlist.ratingKey;
    let data = await Plex.Playlist.moveItem(id, itemId, targetId, 'before');
    updatePlaylists(data.Metadata[0]);
    $showSpinner = false;
    
  };

  async function moveAfterItem(itemId, targetId) {
    $showSpinner = true;
    let id = playlist.ratingKey;
    let data = await Plex.Playlist.moveItem(id, itemId, targetId, 'after');
    updatePlaylists(data.Metadata[0]);
    $showSpinner = false;
  };

  async function moveToTop(itemId) {
    await moveBeforeItem(itemId, entries[0].playlistItemID);
  };

  async function moveToBottom(itemId) {
    await moveAfterItem(itemId, entries[entries.length-1].playlistItemID);
  };

  function updatePlaylists(list) {
    for (let i=0; i<$plexPlaylists.length; i++) {
      if ($plexPlaylists[i].ratingKey === list.ratingKey) {
        $plexPlaylists[i] = list;
      }
    }
    $plexPlaylists = [...$plexPlaylists];
    $currPlaylist = list;
    playlist = list;
  };

  async function deletePlaylist() {
    await Plex.Playlist.destroy(playlist.ratingKey);
    $currPlaylist = null;
    dispatch('loadPlaylists');
  };

  async function updatePlaylist() {
    let title   = document.getElementById('playlist[title]').value;
    let summary = document.getElementById('playlist[summary]').value;
    await Plex.Playlist.update(playlist.ratingKey, {title: title, summary: summary});
    dispatch('loadPlaylists');
    showEdit = false;
  };

  onMount(() => {
    let destIndex = null;
    interact('.list-item').draggable({
      hold: 0,
      lockAxis: 'y',
      modifiers: [
        interact.modifiers.restrict({
          restriction: 'ul'
        })
      ],
      listeners: {
        start (event) {
          let el = event.target;
          el.classList.add('dragged');
          el.style.zIndex = 1000;
        },
        move (event) {
          let el = event.target; // the TR
          let x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.setAttribute('data-x',x);
          el.setAttribute('data-y',y);

          let currY = parseInt(el.offsetTop + y);
          let entries = Array.from(el.parentNode.childNodes);
          destIndex = entries.findIndex(e => {
            let top = parseInt(e.offsetTop);
            let bot = parseInt(e.offsetTop + e.offsetHeight);
            if ((currY >= top) && (currY <= bot)) { return true }
          });

          // highlight active node, clear rest
          entries.forEach(e => e.classList.remove('active'));
          el.parentNode.classList.remove('movetotop');
          if (destIndex >= 0) {
            entries[destIndex].classList.add('active');
          } else {
            el.parentNode.classList.add('movetotop');
          }
        },
        end(event) {
          let el = event.target;
          let ul = el.parentNode;
          if (destIndex != null) {          
            if (destIndex == -1) {
              moveToTop(el.dataset.id);
            } else {
              moveAfterItem(el.dataset.id, entries[destIndex].playlistItemID);
            }
          }

          // reset el
          el.parentNode.childNodes.forEach(e => e.classList.remove('active'));
          el.parentNode.classList.remove('movetotop');

          el.removeAttribute("data-y");
          el.removeAttribute("data-x");
          el.removeAttribute("style");
          el.classList.remove('dragged');
          el.style.zIndex = null;
        }
      }
    });
  });

  function duration(dur) {
    let x = moment.duration(dur);
    let reply = x.days() == 0 ? "" : `${x.days()}d `;
    reply += `${x.hours()}h ${x.minutes()}m`;
    return reply;
  }

</script>


<a class='close-btn' href='#' on:click={() => $currPlaylist = null }>
  <i class='fas fa-times text-primary fa-lg'></i>
</a>

<div class='clearfix pt-2'>
  <img src={Plex.thumbUrl(playlist.composite, 100, 100)} class='composite'/>
  {#if showEdit }
      <div class='form-group'>
        <input id="playlist[title]"type='text' name='title' value="{playlist.title}">
        <textarea id="playlist[summary]">{playlist.summary}</textarea>
      </div>
      <div class='form-group'>
        <button class='btn btn-sm btn-primary' on:click={updatePlaylist}>Save</button>
        <button class='btn btn-sm btn-secondary' on:click={() => showEdit = false}>Cancel</button>
      </div>
  {:else}
    <h3 class='text-light'>
      {playlist.title}       
    </h3>
    <p class='text-muted'>{playlist.summary}</p>
    <a class='text-muted' href='#' on:click={() => showEdit = true }>
      <i class='fas fa-pencil'></i>
    </a>
  {/if}
  {#if playlist.smart}
    <small><i class='fas fa-cog text-success fa-lg'></i></small>
  {/if}
</div>

<div class='clearfix mt-3'>
  <h6 class='text-light'>
    {playlist.leafCount} Videos
    <span class='float-right text-muted'>{duration(playlist.duration)}</span>
  </h6>
</div>

<ul class='list-group mt-2 mb-2' class:droppable={!playlist.smart} id='playlist-entries' data-id={playlist.ratingKey}>
{#if entries.length == 0}
  <p class='text-center text-muted p-2'>Drag and drop media here to add to Playlist</p>
{:else}
{#each entries as movie, index}
  <li class='list-group-item text-muted bg-dark' class:list-item={!playlist.smart} data-id={movie.playlistItemID} data-title={movie.title}>
    {#if (!playlist.smart)}
      <div class='handle'>
        <i class='fas fa-bars'></i>
      </div>
    {/if}
    <div class='position'>{ index + 1 }</div>
    <div class='movie-thumb'>
      <img src="{Plex.thumbUrl(movie.thumb, 30)}"/>
    </div>
    <div class='movie-details'>
      <h6>{movie.title}</h6>
      <span class='text-muted'>
        {movie.year} &middot;
        {parseInt(movie.duration/60/1000,10)}m  &middot; 
        <small class='text-warning'><i class='fas fa-star'></i></small> {movie.rating}
      </span>
    {#if (!playlist.smart)}
      <div class='actions'>
        <a href='#' class='text-muted' on:click={() => moveToTop(movie.playlistItemID)}>
          <i class="fas fa-arrow-to-top"></i>
        </a> 
        &nbsp;
        <a href='#' class='text-muted' on:click={() => moveToBottom(movie.playlistItemID)}>
          <i class="fas fa-arrow-to-bottom "></i>
        </a>
        &nbsp;
        <a href='#' class='text-danger' on:click={() => removeItem(movie.playlistItemID)}>
          <i class='far fa-trash-alt'></i>
        </a>
      </div>
    {/if}
    </div>
  </li>
{/each}     
{/if}
</ul>

<div class="text-center mt-2 pt-2">
  <a class='btn btn-danger btn-sm' on:click={deletePlaylist}><i class='fas fa-trash'></i> Delete Playlist</a>
</div>

<style lang='scss'>
.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}
.composite {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  margin-right: 10px;
  border: 1px solid #222;
  background:  #222;
  float: left;
}

:global(.movetotop) {
  border-top: 4px solid #007bff !important;
}

#playlist-entries {
  min-height:  60px;
  background: darken(#343a40, 10%);
  li {
    touch-action: none;
    user-select: none;
    display: block;    
    position: relative;
    margin: 0; padding: 5px;
    z-index: 1;
  }
}

:global(.dragged) {
    border:  1px solid red !important;
    opacity:  0.7;
    z-index:  1000;
}

.handle { 
  width:  24px;
  float: left;
  text-align: center;
  touch-action: none;
  user-select: none;
}
.position { 
  float: left;
  width:  24px;
}
.movie-thumb {
  float: left; 
  text-align: center;
  width:  45px;
}
.movie-details { 
  
  overflow: hidden;
  h6 { color:  #ccc; }
}

.actions {
  text-align: right;
  float: right; 
  display: block;
  position: absolute;
  bottom: 5px; right: 5px;
}


</style>


