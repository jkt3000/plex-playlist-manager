<div class='library border m-1 p-1'>
  <h3> 
    {library.title} <span style='font-size:0.5em'>[id: {library.key}]</span> <small>({library.leafCount})</small>
    <small>
      {#if (library.type === 'movie')}
        <i class="fas fa-film"></i>  
      {:else}
        <i class="fas fa-tv"></i>
      {/if}
    </small>    
  </h3>
  <p>{library.key}</p>
  <p><em>Last updated: {moment(library.updatedAt * 1000).format("MMMM Do YYYY, hh:mm")}</em></p>
  
  
</div>

<script context='module'>
  import moment from 'moment';
</script>

<script>
  export let library;

  let Plex = document.plex;
  let user = Plex.name;
</script>