<div class="modal" tabindex="-1" role="dialog" id='login-modal'>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" on:click>
          <span aria-hidden="true">&times;</span>
        </button>
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
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" on:click={requestLogin}>Login</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" on:click>Close</button>
      </div>
    </div>
  </div>
</div>

<script>
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let display = false;
  export let email = '';
  export let password = '';

  function requestLogin() {
    dispatch('login', {email: email, password: password});
  }

  function toggleDisplay() {
    display = !display;
  }
</script>