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
      console.log(`[Plex] Logging in ${email}:${password}`);
      let url = Plex.API_PATHS.loginUrl;
      let form = new FormData();
      form.append('login', email);
      form.append('password', password);

      let resp = await Plex.request(url, {method: 'post', body: form, noToken: true});
      let data = await resp.json();
      console.log("[Plex] Login response ", data);
      console.log(data.authToken, data.thumb, data.username)
      // assume everything went well - need to handle error conditions
      Plex.setParam('token', data.authToken);
      Plex.setParam('avatar', data.thumb);
      Plex.setParam('name', data.username);
      Plex.Server.getServerInfo();
    },    
    logout() {
      Plex.reset();
    },
    async getServerInfo() {
      let url = Plex.API_PATHS.serverUrl;
      let resp = await Plex.request(url, {method: 'get'});
      let data = await resp.json();
      let server = data.find(entry => entry.product === "Plex Media Server");
      console.log("server found", server, server.connections[0]);
      if (server != null) {
        Plex.setParam('machineId', server.clientIdentifier);        
        Plex.setParam('hostUrl', server.connections[0].uri);
        console.log(Plex.machineId, Plex.hostUrl)
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
      let json = await resp.json();
      let libraries = json.MediaContainer.Directory;
      for (let i=0; i <libraries.length; i++){
        let url = `${Plex.hostUrl}/library/sections/${libraries[i].key}/all`;
        let size = await Plex.totalSize(url);
        libraries[i].leafCount = size;
      }
      return libraries;
    },
    get(id) {},
    update() {},
    create() { return; },    
  },

  //
  // Movie
  //
  Movie: {
    async all(library_id, options = {}) {
      let url = `${Plex.hostUrl}/library/sections/${library_id}/all`;
      let resp = await Plex.request(url, {method: 'get'});
      let json = await resp.json();
      return json.MediaContainer;
    },
    get(id) {},
    update(id, data) {},
    addTag() {},
    removeTag() {},
    updateTag() {}
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
    all(library_id, options = {}) {},
    get(id) {},
    addItem() {},
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

  //
  // async fetch promise 
  // - need to handle failure conditions
  // - what to send in case of failure?
  async request(url, {method = 'get', headers = {}, 
                options, body, page, page_size, noToken = false} = {}) {
    headers = Plex._sanitizeHeaders(headers, options, page, page_size, noToken);
    let resp = await fetch(url, {method: method, headers: headers, body: body});
    return resp;
  },

   // same as request, but just want totalSize
  async totalSize(url, { method = 'get', headers = null, options, body } = {}) {    
    let opts = { method: method, headers: headers, options: options, body: body,
                 page: 1, page_size: 0 };
    let resp = await Plex.request(url, opts);
    let json = await resp.json();
    return json.MediaContainer.totalSize;
  },

  _sanitizeHeaders(headers, options, page, page_size, noToken) {
    headers = {...Plex.defaultHeaders, ...headers};
    if (page != null) {
      let per_page = (page_size == null) ? Plex.PAGE_SIZE : parseInt(page_size, 10);
      headers["X-Plex-Container-Size"]  = per_page;
      headers["X-Plex-Container-Start"] = (parseInt(page,10) - 1) * per_page;
    }
    if (noToken === true) {
      delete headers["X-Plex-Token"];
    }
    return headers;
  },

  get defaultHeaders() {
    let headers = {
      'X-Plex-Client-Identifier': 'plex-api',
      'Accept': 'application/json',
      "X-Plex-Token" : Plex.token 
    };
    return headers;
  }

}

export {Plex};