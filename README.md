

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