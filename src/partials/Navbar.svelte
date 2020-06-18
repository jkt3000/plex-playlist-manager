<script>
  import {plexToken, plexUser, plexLibraries, currLibrary, showSpinner} from '/lib/stores.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function logout() {
    dispatch('logout');
  };

</script>


<nav class="navbar navbar-expand-md navbar-dark fixed-top" id='header'>
  <a class="navbar-brand" href="/">
    Plex Tools &nbsp; 
    {#if $showSpinner}<i class='fas fa-spinner fa-sm text-warning fa-spin'></i>{/if}
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarsExampleDefault">
    <ul class="navbar-nav mr-auto">
    </ul>

    <ul class='navbar-nav'>
      <li class='nav-item'>
        {#if $plexToken}
          <a href="#" class='nav-link' on:click={logout}>
            <img src="{$plexUser.avatar}" width=40 class='rounded-circle inline'/>&nbsp;
            logout
          </a>
        {/if}
      </li>
    </ul>
  </div>
</nav>

<style lang='scss'>
#header {
  position: fixed;
  background: darken(#343a40, 10%);
  height: 55px;
  max-height:55px;
  top: 0;
  left: 0; 
  right: 0;
}
</style>