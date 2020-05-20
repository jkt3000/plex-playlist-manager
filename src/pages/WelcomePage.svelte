<div class='row'>
  <div class='col-12 text-center p-3'>
    <h2>Welcome to Plex Tools</h2>

    {#if $plexToken == null }
    <div class="modal-content col-3 m-auto" style='margin-top:4em;'>
      <div class="modal-header">
        <h5 class="modal-title">Login</h5>
      </div>
      <div class="modal-body">
        <p>Enter your Plex credentials</p>

        <form>
          <div class='form-group'>
            <input type='text' class='form-control' bind:value={email} placeholder="email account for Plex" />
          </div>
          <div class='form-group'>
            <input type='password' class='form-control' bind:value={password} placeholder="password" />
          </div>

          <div class='form-group'>
            <button type="button" class="btn btn-primary" on:click={requestLogin}>Login</button>
          </div>
        </form>
      </div>
    </div>

    {:else}
      <p><img src={$plexUser.avatar} width='50' class='round-circle'/>
        {$plexUser.name} server: { $plexUser.server }
        {$plexToken} 
      </p>

      {#if $plexLibraries.length > 0}
        {#each $plexLibraries as library}
          <Library library={library}/>
        {/each}
      {:else}
        <button class='btn btn-primary' on:click>Load Libraries</button>
      {/if}

    {/if}
  </div>
</div>

<script>
  import { createEventDispatcher } from 'svelte';
  import Library from './../Library.svelte';
  import {plexToken, plexUser, plexLibraries, currentPage} from './../stores.js';

  const dispatch = createEventDispatcher();
  
  let email;
  let password;
  const Plex = document.plex; // only for console access
  function requestLogin() {
    console.log("dispatch loginRequest", email, password);
    dispatch('login', {email: email, password: password});
  }
</script>