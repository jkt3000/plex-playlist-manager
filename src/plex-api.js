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

      let data = await Plex.requestx(url, {method: 'post', body: form, noToken: true});
      console.log("[Plex] Login response ", data);
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
      let data = await Plex.requestx(url, {method: 'get'});
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
      let resp = await Plex.requestx(url, {method: 'get'});
      let libraries = resp.MediaContainer.Directory;
      for (let i=0; i<libraries.length; i++){
        let url = `${Plex.hostUrl}/library/sections/${libraries[i].key}/all`;
        let size = await Plex.totalSize(url);
        libraries[i].totalSize = size;
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
    // by default, load 500 at once
    async all(library_id, options = {}) {
      let url = `${Plex.hostUrl}/library/sections/${library_id}/all`;
      let resp = await Plex.requestx(url, {method: 'get'});
      return resp.MediaContainer;
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
    async all(options = {}) {
      let url = `${Plex.hostUrl}/playlists`;
      let resp = await Plex.requestx(url, {method: 'get'});
      return resp.MediaContainer;
    },
    async get(id) {
      let url = `${Plex.hostUrl}/playlists/${id}`;
      let resp = await Plex.requestx(url, {method: 'get'});
      return resp.MediaContainer;
    },
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
  // response format:
  //
  //  {ok: true|false, message: "", status: 201, data: Object }
  async requestx(url, {method = 'get', headers = {}, 
                options, body, page, page_size, noToken = false} = {}) {
    page = page || 1;
    page_size = page_size || 200;
    headers = Plex._sanitizeHeaders(headers, options, page, page_size, noToken);
    let params = {method: method, headers: headers, body: body};
    console.log('Request =>', url);
    let resp = await fetch(url, params).catch(e => {
      throw new Error(`Invalid request [${e.message}]`);
    });
    console.log("Response <=", resp.status);
    let data = await resp.json().catch(e => {
      throw new Error("Bad request or invalid data");
    });
    return data;
  },

  async request(url, {method = 'get', headers = {}, 
                options, body, page, page_size, noToken = false} = {}) {
    page = page || 1;
    page_size = page_size || 500;
    headers = Plex._sanitizeHeaders(headers, options, page, page_size, noToken);
    let params = {method: method, headers: headers, body: body};

    let response = {ok: null, code: null, message: null, data: null}
    console.log("Request: ", url);
    let resp = await fetch(url, params).then(async reply => {
        console.log("Reply to fetch:", reply.status);
        response.code    = reply.status;
        response.ok      = reply.ok;
        response.message = reply.statusText;
        if (reply.ok) {
          let data = await reply.json().then(output => {
            return output;
          }).catch(error => {
            console.log("Error in Fetch", error.message);
            response.message = error.message;
            response.ok = false;
            return null;
          });
          response.data = data;
        } else {
          response.data = null;
        }
        console.log("to json response", response.data)
        return response;
      }).catch(error => {
        console.log("Error on Fetch:", error.message);
        response.message = error.message;
        response.ok = false;
        response.code = null;
        response.data = null;
        return response;
      });
    return resp;
  },


   // same as request, but just want totalSize
  async totalSize(url, { method = 'get', headers = null, options, body } = {}) {    
    let opts = { method: method, headers: headers, options: options, body: body,
                 page: 1, page_size: 0 };
    let data = await Plex.requestx(url, opts);
    return data.MediaContainer.totalSize;
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