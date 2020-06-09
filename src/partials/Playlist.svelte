<script context='module'>
  import moment from 'moment';
  import interact from 'interactjs';
</script>

<script>
  import {onMount} from "svelte";
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

  async function updateList() {}


  function updatePlaylists(list) {
    for (let i=0; i<$plexPlaylists.length; i++) {
      if ($plexPlaylists[i].ratingKey === list.ratingKey) {
        $plexPlaylists[i] = list;
      }
    }
    $plexPlaylists = [...$plexPlaylists];
    $currPlaylist = list;
  };

  onMount(() => {
    let node;
    let topY;
    console.log("module playlist mounted")
    interact('.handle').draggable({
      lockAxis: 'y',
      modifiers: [
        interact.modifiers.restrict({
          restriction: '.table'
        })
      ],
      listeners: {
        start (event) {
          let el = event.target.parentNode;
          topY = el.offsetTop;
          node = null;
        },
        move (event) {
          let el = event.target.parentNode; // the TR
          let x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.setAttribute('data-x',x);
          el.setAttribute('data-y',y);

          let currY = el.offsetTop + y;
          if ((currY > topY) && (currY < (topY + el.offsetHeight))) { return; }

          let entries = Array.from(el.parentNode.childNodes);
          node =entries[0];
          let curr = 0;
          topY = 0;
          for (let i=0; i<entries.length; i++) {
            // get entry top corner is in.
            if (currY > (entries[i].offsetTop + (entries[i].offsetHeight/2))) {              
              topY = entries[i].offsetTop
              curr = i;
            }
          }
          if (curr > 0) { node = entries[curr]}
        },
        end(event) {
          let el = event.target.parentNode;

          el.removeAttribute("data-y");
          el.removeAttribute("data-x");
          el.removeAttribute("style");
          el.classList.remove('active');

          moveAfterItem(el.dataset.id, node.dataset.id);
          node = null;
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

<table class='table table-striped table-sm table-dark droppable' id='playlist-table' data-id={playlist.ratingKey}>
{#each entries as movie, i}
  <tr class='playlist-entry' data-id={movie.playlistItemID} data-pos={i} data-title={movie.title}>
    <td class='handle text-muted'>
      <i class='fas fa-bars'></i>
    </td>
    <td class='position text-muted'>{ i + 1 }</td>
    <td class='movie-thumb'>
      <img src="{Plex.thumbUrl(movie.thumb, 30)}"/>
    </td>
    <td class='movie-details'>
      <h6>{movie.title}</h6>
      <span class='text-muted'>
        {parseInt(movie.duration/60/1000,10)}m  &middot; 
        <small class='text-warning'><i class='fas fa-star'></i></small> {movie.rating} &middot; {movie.librarySectionTitle} 
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
    </td> 
  </tr>
{/each}     
</table>

<style lang='scss'>

.composite {
  margin-bottom: 20px;
  margin-right: 10px;
  border: 1px solid #333;
  float: left;
}
#playlist-table {
  td {
    vertical-align: middle;
  }
  &.active-drop {
    border: 1px dashed red !important;
    background: rgba(0,0,0,0.9);
  }
  .handle { text-align:left; width: 16px; 
    touch-action: none;
    user-select: none;
    
  }
  .position { text-align:left;  width: 16px; }
  .movie-thumb {
    width: 30px; 
    img {
      width:  30px;
    }
  }
  .movie-details {
    h6 { margin: 0;  }
    width:  100%;
    .actions {
      position: relative; top:  0; right:  0; text-align: right;
      float: right;
    }
  }
}

</style>


