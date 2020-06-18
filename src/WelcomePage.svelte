<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  let email;
  let password;
  
  function requestLogin() {
    dispatch('login', {email: email, password: password});
  }
</script>

<div class='container' style='margin-top:60px'>
<div class='row'>
  <div class='col-12 text-center p-3'>
    <h2>Welcome to Plex Tools</h2>

    <div class="modal-content col-6 m-auto mt-3 text-dark">
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
  </div>
</div>
</div>