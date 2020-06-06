//
// plex-api.js
//

const Plex = {

  token: null,
  name: null,
  avatar: null,
  hostUrl: null,
  machineId: null,
  PARAMS: ['token', 'name', 'avatar', 'hostUrl', 'machineId'],
  DEFAULT_HEADERS: {
    'X-Plex-Client-Identifier': 'plex-api',
    'Accept': 'application/json'
  },
  API_PATHS: {
    loginUrl: "https://plex.tv/api/v2/users/signin.json",
    userUrl: "https://plex.tv/api/v2/user",
    serverUrl: "https://plex.tv/api/v2/resources",
  },
  PAGE_SIZE: 200,

  //
  // call this to initialize the library
  //
  init() {
    Plex.PARAMS.forEach(key => {
      Plex[key] = Plex.getParam(key);
    });
    console.log("[Plex] Load params from localStorage", Plex.params());
  },
  params() {
    let params = {}
    Plex.PARAMS.forEach(key => params[key] = Plex[key] );
    return params;
  },
  //    https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/photo/:/transcode?width=200&height=301&minSize=1&upscale=1&url=%2Flibrary%2Fmetadata%2F14267%2Fthumb%2F1587262894%3FX-Plex-Token%3D_3ZFfNvrYhZ9awqszJ_m&X-Plex-Token=_3ZFfNvrYhZ9awqszJ_m
  thumbUrl(thumb, width=200, height=301) {
    let params = new URLSearchParams();
    params.append('width', width);
    params.append('height', height);
    params.append('url', thumb);
    params.append('X-Plex-Token', Plex.token);
    let url = `${Plex.hostUrl}/photo/:/transcode?${params.toString()}`;
    return url;
  },

  //
  // Server methods
  //
  Server: {
    async login(email, password) {
      console.log(`[Plex] Login ${email}:${password}`);
      let url = Plex.API_PATHS.loginUrl;
      let form = new FormData();
      form.append('login', email);
      form.append('password', password);

      let data = await Plex.request(url, {method: 'post', body: form, noToken: true});
      console.log("[Plex] Login response ", data);
      Plex.setParam('token', data.authToken);
      Plex.setParam('avatar', data.thumb);
      Plex.setParam('name', data.username);
      await Plex.Server.getServerInfo();
    },    
    logout() {
      Plex.reset();
    },
    async getServerInfo() {
      let url = Plex.API_PATHS.serverUrl;
      let data = await Plex.request(url, {method: 'get'});
      let server = data.find(entry => entry.product === "Plex Media Server");
      console.log("server found", server, server.connections[0]);
      if (server != null) {
        Plex.setParam('machineId', server.clientIdentifier);        
        Plex.setParam('hostUrl', server.connections[0].uri);
      }
    },
  },

  //
  // Library
  //
  Library: {
    async all() {
      let url = `${Plex.hostUrl}/library/sections`;
      let resp = await Plex.request(url, {method: 'get'});
      let libraries = resp.MediaContainer.Directory;
      for (let i=0; i<libraries.length; i++){
        let url = `${Plex.hostUrl}/library/sections/${libraries[i].key}/all`;
        let size = await Plex.totalSize(url);
        libraries[i].totalSize = size;
      }
      return libraries;
    },
    async get(id) {
      let url = `${Plex.hostUrl}/library/sections/${id}`;
      let data = await Plex.request(url, {method: 'get'});
      return data.MediaContainer;
    }   
  },

  //
  // Movie
  //
  Movie: {
    async all(library_id, options = {}) {
      options = this.sanitizeOptions(options);
      let url = `${Plex.hostUrl}/library/sections/${library_id}/all`;
      let data = await Plex.request(url, {method: 'get', options: options});
      return data.MediaContainer;
    },
    get(id) {},
    update(id, data) {},
    addTag() {},
    removeTag() {},
    updateTag() {},
    // build sort and filter params
    sanitizeOptions(options) {
      let params = {};
      if (options.sort != null) {
        params.sort = options.sort;
      }
      return params;
    }
  },

  //
  // Show
  //
  Show: {},


  //
  // Collection
  //
  Collection: {},

  //
  // Playlist
  //
  Playlist: {
    async all(options = {}) {
      let url = `${Plex.hostUrl}/playlists`;
      let data = await Plex.request(url, {method: 'get'});
      return data.MediaContainer;
    },
    async get(id) {
      let url = `${Plex.hostUrl}/playlists/${id}`;
      let data = await Plex.request(url, {method: 'get'});
      return data.MediaContainer;
    },
    async getItems(id) {
      let url = `${Plex.hostUrl}/playlists/${id}/items`;
      let data = await Plex.request(url, {method: 'get'});
      return data.MediaContainer;      
    },

    async addItem(id, mediaId) {
      let url = `${Plex.hostUrl}/playlists/${id}/items`;
      let options = {
        'uri': `server://${Plex.machineId}/com.plexapp.plugins.library/library/metadata/${mediaId}`,
        'includeExternalMedia': 1
      };
      let data = await Plex.request(url, {method:'put', options:options});
      return data.MediaContainer;
    },
    removeItem() {},
    moveItem() {},
    update(id) {},
    updateContent() {}, // for smart playlist
    getItems() {},        
    create() {},
  },

  //
  // utility functions
  //

  reset() {
    Plex.PARAMS.forEach(key => Plex.clearParam(key) );
  },

  getParam(key) {
    if (Plex.PARAMS.indexOf(key) < 0) { return; }
    if (window) {
      return window.localStorage.getItem("plex-"+key);
    } else {
      console.error('no window')
    }
  },

  setParam(key, value) {
    if (Plex.PARAMS.indexOf(key) < 0) { return; }
    Plex[key] = value;
    if (window) {
      window.localStorage.setItem("plex-"+key, value);
    } else {
      console.error('no window')
    }
  },

  clearParam(key) {
    if (Plex.PARAMS.indexOf(key) < 0) { return; }
    Plex[key] = null;
    window.localStorage.removeItem("plex-"+key);
  },


  async request(url, {method = 'get', options = {}, headers = {}, body = null} = {}) {
    headers = Plex._buildHeaders(headers);
    let params = Plex._sanitizeOptions(options);
    console.log(`[PLEX] Request: ${url}`, {params: params} );
    if (params.length > 0) {
      url = `${url}?${params}`
    } 
    let resp = await fetch(url, {method: method, headers: headers, body: body}).catch(e => {
      throw new Error(`Invalid request [${e.message}]`);
    });
    let data = await resp.json().catch(e => {
      throw new Error("Bad request or invalid data");
    });
    console.log("[PLEX] Response <=", resp.status, data);
    return data;
  },

  async totalSize(url) {    
    let data = await Plex.request(url, { method: 'get', options: {page: 1, page_size: 0} });
    return data.MediaContainer.totalSize;
  },

  _sanitizeOptions(options = {}) {
    let default_options = {'X-Plex-Client-Identifier': 'plex-api'}
    if (Plex.token != null) {
      default_options['X-Plex-Token'] = Plex.token;
    };

    if (options.page != null) {
      let page_size = (options.page_size == null) ? Plex.PAGE_SIZE : parseInt(options.page_size, 10);
      default_options["X-Plex-Container-Size"]  = page_size;
      default_options["X-Plex-Container-Start"] = (parseInt(options.page, 10) - 1) * page_size;
      delete options['page'];
      delete options['page_size'];
    }
    return new URLSearchParams({...default_options, ...options}).toString();
  },

  _buildHeaders(headers = {}) {
    let params = {'Accept': 'application/json'};
    params = {...params, ...headers};
    return params;
  }
}

export {Plex};