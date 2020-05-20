# Plex Tools - a playlist manager & more

A Plex tools app that helps manage your playlists easily. Designed for use on ipads (for full touch, drag operations).

Written as a SPA in svelte, interactjs

## HLD

- login in
  - log into Plex w/ user/pass and store user info
  - gets server info and stores

### flow

- login
  -> get user and server info and stores it
  -> get libraries and stores it
  -> default to first library / media view

- top menu bar allows setting of libraries
  -> keep track of currentLibrary, cache libraries

- default view is playlists view
  -> media on left side, playlists manager on right
  -> for now, cache both medias and playlists
