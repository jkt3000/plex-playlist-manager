<script context='module'>
  import moment from 'moment';
  import interact from 'interactjs';
</script>

<script>
  import {onMount} from "svelte";
  import PlaylistItem from './PlaylistItem.svelte';
  import {plexPlaylists, currPlaylist} from './../lib/stores.js';
  let Plex   = document.plex;

  export let playlist;

  $: entries = [];  
  $: {
    if (playlist != null) {
      loadItems();
    }
  }

  async function loadItems() {
    let data = await Plex.Playlist.getItems(playlist.ratingKey);
    entries = data.Metadata;
  };

  async function removeItem(id) {
    let data = await Plex.Playlist.removeItem(playlist.ratingKey, id);
    updatePlaylists(data.Metadata[0]);
  };

  async function moveBeforeItem(itemId, targetId) {
    let id = playlist.ratingKey;
    let data = await Plex.Playlist.moveItem(id, itemId, targetId, 'before');
    updatePlaylists(data.Metadata[0]);
  };

  async function moveAfterItem(itemId, targetId) {
    let id = playlist.ratingKey;
    let data = await Plex.Playlist.moveItem(id, itemId, targetId, 'after');
    updatePlaylists(data.Metadata[0]);
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

  onMount(() => {
    let destIndex = null;
    interact('.handle').draggable({
      hold: 0,
      lockAxis: 'y',
      modifiers: [
        interact.modifiers.restrict({
          restriction: 'ul'
        })
      ],
      listeners: {
        start (event) {
          let el = event.target.parentNode;
          el.classList.add('dragged');
          el.style.zIndex = 1000;
        },
        move (event) {
          let el = event.target.parentNode; // the TR
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
          let el = event.target.parentNode;
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

<div class='clearfix'>
  <img src={Plex.thumbUrl(playlist.composite, 100, 100)} class='composite'/>
  <h3 class='text-light'>
  {playlist.title} 
  </h3>
  {#if playlist.smart}
    <small><i class='fas fa-cog text-success fa-lg'></i></small>
  {/if}
</div>

<div class='clearfix'>

  <h6 class='text-light'>
    {playlist.leafCount} Videos
    <span class='float-right text-muted'>{duration(playlist.duration)}</span>
  </h6>
</div>

<ul class='list-group droppable' id='playlist-entries' data-id={playlist.ratingKey}>
{#each entries as movie, i}
  <li class='list-group-item text-muted bg-dark' data-id={movie.playlistItemID} data-title={movie.title}>
    <div class='handle'>
      <i class='fas fa-bars'></i>
    </div>
    <div class='position'>{ i + 1 }</div>
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
      <div class='actions'>
        <a href='#' class='text-muted' on:click={() => moveToTop(movie.playlistItemID)}>
          <i class="fas fa-arrow-to-top"></i>
        </a>
        <a href='#' class='text-muted' on:click={() => moveToBottom(movie.playlistItemID)}>
          <i class="fas fa-arrow-to-bottom"></i>
        </a>
        <a href='#' class='text-danger' on:click={() => removeItem(movie.playlistItemID)}>
          <i class='far fa-trash-alt'></i>
        </a>
      </div>
    </div>
  </li>
{/each}     
</ul>

<style lang='scss'>

.composite {
  margin-bottom: 20px;
  margin-right: 10px;
  border: 1px solid #333;
  float: left;
}

:global(.movetotop) {
  border-top: 4px solid #007bff !important;
}

#playlist-entries {
  li {
    display: flex;    
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
  width:  20px;  align-self: center; flex: 1;
  touch-action: none;
  user-select: none;
}
.position { 
  width:  20px;  align-self: center; flex: 1;
  touch-action: none;
  user-select: none;
}
.movie-thumb { width:  40px;  flex:  2;
  align-self:center;
  touch-action: none;
  user-select: none;
}
.movie-details { 
  flex:  10;
  width:  100%;
  display: block;
  overflow: hidden;
  h6 { color:  #ccc; }
}

.actions {
  float: right; 
  display: block;
  position: relative;
  top: 0; right: 0;
}


</style>


