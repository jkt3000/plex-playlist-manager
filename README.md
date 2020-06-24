# Plex Playlist Manager

An Svelte app that allows you to use touch/drag/drop to manage your Plex playlists easier on an iPad. The app is fully self-contained and does not use or require backend server or API requests. Works on desktop as well, but you lose the touch drag/drop functionality. Does not work well on iPhone because the layout won't work on it.

You can:
- filter library view by most common filters (by year, decade, actor, director, genre, studio, country and rating)
- sort library view by title, year, release date, duration, rating, date added, date last viewed
- create/edit/delete playlists (only create regular playlist, not smart lists yet)
- drag and drop movies into regular playlists
- drag to reorder playlist content

<img src="/screenshots/screenshot.jpg" width="600"/>

## Try it

https://redronin.github.io/plex-playlist-manager

***Note: You will need to allow mixed-content if your Plex Server on your localnetwork doesn't support https***. 

If you access your local plex server like this: ***http://<your local ip>:32400*** instead of https://, then make sure you allow mixed-content for the above URL, otherwise you will not see any playlists or movies loading on your screen.

## Code

The actual production code is in the ***/docs*** directory because Github Pages will only allow pages from the docs/ path or the master branch, so this was the easiest way to host the app.


## install and build


```

# install parcel-bundler

  > yarn add parcel-bundler --dev

# run it 

  > yarn dev      

```

## Installing required libs

1. Sass

```
* For installing sass, was supposed to run:

> yarn add -D sass   # as per docs - but didnt' work

Needed to run:

> yarn add node-sass

```

2. Babel and required class-properties polyfill

```
 yarn add --dev @babel/core @babel/preset-env @babel/plugin-proposal-class-properties

 install svelte

 yarn add --dev svelte
 yarn add --dev parcel-plugin-svelte
 yarn add --dev parcel-bundler

 add core-js 

 yarn add core-js (not as --dev) !!

 yarn add svelte-preprocess

follow this:
  https://stackoverflow.com/questions/59629199/parcel-svelte-style-tags-with-sass 
```

More on parcel: https://parceljs.org/getting_started.html

https://stackoverflow.com/questions/59629199/parcel-svelte-style-tags-with-sass

