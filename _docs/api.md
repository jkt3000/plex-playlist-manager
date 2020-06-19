# Plex API methods

### Overview

#### Headers

```

Most calls require these Headers/Params:
X-Plex-Token                  # obtain from after login
X-Client-Identifier           # some random string
Accept: application/json      # to get json format back

X-Plex-Container-Start        # relative page start
X-Plex-Container-Size         # size of page


Misc headers:

X-Plex-Version
X-Plex-Platform
X-Plex-Platform-Version
X-Plex-Sync-Version
X-Plex-Features
X-Plex-Model
X-Plex-Device
X-Plex-Device-Name
X-Plex-Device-Screen-Resolution
X-Plex-Language

eg: sample headers from chrome:

X-Plex-Product: Plex Web
X-Plex-Version: 4.33.1
X-Plex-Client-Identifier: iludcirfnapypbiknxn4lzzr
X-Plex-Platform: Chrome
X-Plex-Platform-Version: 81.0
X-Plex-Sync-Version: 2
X-Plex-Features: external-media,indirect-media
X-Plex-Model: hosted
X-Plex-Device: OSX
X-Plex-Device-Name: Chrome
X-Plex-Device-Screen-Resolution: 1280x1306,2560x1440
X-Plex-Token: 8zZJvyoQp56Gfgd_GwxC
X-Plex-Language: en

```


### Login / Authentication
Ability to login and obtain a Plex Token for all future calls

```
URL: https://plex.tv/api/v2/users/signin.json

Headers:

Params:
- login=<johnsmith@gmail.com>
- password=<password>


Response:

{
  ...
  authToken: "hg8EVr3BRHtGzHyYbpdh"
  id: 297636
  thumb: "https://plex.tv/users/315a1c6f5b0c7a4d/avatar?c=1555467028"
  title: "redronin7"
  ...  
}

Fields we care about:
authToken   # token
thumb       # img src url?
title       # user name

Workflow:

1. make call to https://plex.tv/api/v2/users/signin
2. Get the authToken parameter from response (plus any other fields we care about)
```

### Playing video in webpage

```
eg 
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/parts/37348/1370942526/file.mp4?X-Plex-Session-Identifier=c0o1oebfk34kst29ldhmzadz&X-Plex-Product=Plex%20Web&X-Plex-Version=4.12.3&X-Plex-Client-Identifier=mx1522ibstgkfzp9sabrqi7k&X-Plex-Platform=Chrome&X-Plex-Platform-Version=81.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=bundled&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1597x1216%2C2560x1440&X-Plex-Token=_3ZFfNvrYhZ9awqszJ_m&X-Plex-Language=en&Accept-Language=en

url:

https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/parts/37348/1370942526/file.mp4

params:
X-Plex-Session-Identifier: c0o1oebfk34kst29ldhmzadz
X-Plex-Product: Plex Web
X-Plex-Version: 4.12.3
X-Plex-Client-Identifier: mx1522ibstgkfzp9sabrqi7k
X-Plex-Platform: Chrome
X-Plex-Platform-Version: 81.0
X-Plex-Sync-Version: 2
X-Plex-Features: external-media,indirect-media
X-Plex-Model: bundled
X-Plex-Device: OSX
X-Plex-Device-Name: Chrome
X-Plex-Device-Screen-Resolution: 1597x1216,2560x1440
X-Plex-Token: _3ZFfNvrYhZ9awqszJ_m
X-Plex-Language: en
Accept-Language: en

```

### Plex Resources (finding the Plex server)
Find out the IP address of our local Plex Media Server

```
URL: https://plex.tv/api/v2/resources.json

Headers:
- X-Plex-Token:
- X-Plex-Client-Identifier:

Params:
- includeHttps: 1     # ?
- includeRelay: 1     # ?

Sample:

https://plex.tv/api/v2/resources?includeHttps=1&includeRelay=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.33.1&X-Plex-Client-Identifier=iludcirfnapypbiknxn4lzzr&X-Plex-Platform=Chrome&X-Plex-Platform-Version=81.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1280x1306%2C2560x1440&X-Plex-Token=8zZJvyoQp56Gfgd_GwxC&X-Plex-Language=en

    params:
    {
      "includeHttps" => "1",
      "includeRelay" => "1",
      "X-Plex-Product" => "Plex Web",
      "X-Plex-Version" => "4.33.1",
      "X-Plex-Client-Identifier" => "iludcirfnapypbiknxn4lzzr",
      "X-Plex-Platform" => "Chrome",
      "X-Plex-Platform-Version" => "81.0",
      "X-Plex-Sync-Version" => "2",
      "X-Plex-Features" => "external-media,indirect-media",
      "X-Plex-Model" => "hosted",
      "X-Plex-Device" => "OSX",
      "X-Plex-Device-Name" => "Chrome",
      "X-Plex-Device-Screen-Resolution" => "1280x1306,2560x1440",
      "X-Plex-Token" => "8zZJvyoQp56Gfgd_GwxC",
      "X-Plex-Language" => "en",
      "Accept" => "application/json"
    }


Sample Response (output in json format):

[
 {"name"=>"hoth",
  "product"=>"Plex Media Server",
  "productVersion"=>"1.18.5.2309-f5213a238",
  "platform"=>"Linux",
  "platformVersion"=>"DSM 6.2.2.24922-6",
  "device"=>"DS1819+",
  "clientIdentifier"=>"623cbfe8a679d4d8c68a6ffe3608aca44e8da703",
  "createdAt"=>"2019-11-30T23:19:20Z",
  "lastSeenAt"=>"2020-05-15T22:18:42Z",
  "provides"=>"server",
  "ownerId"=>nil,
  "sourceTitle"=>nil,
  "publicAddress"=>"45.72.253.150",
  "accessToken"=>"8zZJvyoQp56Gfgd_GwxC",
  "owned"=>true,
  "home"=>false,
  "synced"=>false,
  "relay"=>false,
  "presence"=>true,
  "httpsRequired"=>false,
  "publicAddressMatches"=>true,
  "dnsRebindingProtection"=>true,
  "connections"=>
   [{"protocol"=>"http",
     "address"=>"192.168.2.5",
     "port"=>32400,
     "uri"=>"http://192.168.2.5:32400",
     "local"=>true,
     "relay"=>false,
     "IPv6"=>false}]},
 {"name"=>"IpadPro12",
  "product"=>"Plex for iOS",
  "productVersion"=>"6.11.1",
  "platform"=>"iOS",
  "platformVersion"=>"13.4.1",
  "device"=>"iPad",
  "clientIdentifier"=>"3A815746-ACA2-41C9-8CDC-A81B415D0D26",
  "createdAt"=>"2015-08-12T00:56:50Z",
  "lastSeenAt"=>"2020-05-15T12:42:58Z",
  "provides"=>
   "client,controller,sync-target,player,pubsub-player,provider-playback",
  "ownerId"=>nil,
  "sourceTitle"=>nil,
  "publicAddress"=>"45.72.253.150",
  "accessToken"=>nil,
  "owned"=>true,
  "home"=>false,
  "synced"=>false,
  "relay"=>false,
  "presence"=>false,
  "httpsRequired"=>false,
  "publicAddressMatches"=>true,
  "connections"=>
   [{"protocol"=>"http",
     "address"=>"192.168.2.118",
     "port"=>32500,
     "uri"=>"http://192.168.2.118:32500",
     "local"=>true,
     "relay"=>false,
     "IPv6"=>false}]},
 {"name"=>"Chrome",
  "product"=>"Plex Web",
  "productVersion"=>"4.12.3",
  "platform"=>"Chrome",
  "platformVersion"=>"81.0",
  "device"=>"OSX",
  "clientIdentifier"=>"mx1522ibstgkfzp9sabrqi7k",
  "createdAt"=>"2019-12-07T15:42:14Z",
  "lastSeenAt"=>"2020-05-15T17:37:37Z",
  "provides"=>"client,player,pubsub-player",
  "ownerId"=>nil,
  "sourceTitle"=>nil,
  "publicAddress"=>"45.72.253.150",
  "accessToken"=>"8zZJvyoQp56Gfgd_GwxC",
  "owned"=>true,
  "home"=>false,
  "synced"=>false,
  "relay"=>false,
  "presence"=>true,
  "httpsRequired"=>false,
  "publicAddressMatches"=>true,
  "connections"=>
   [{"protocol"=>"http",
     "address"=>"192.168.2.5",
     "port"=>32400,
     "uri"=>"http://192.168.2.5:32400",
     "local"=>true,
     "relay"=>false,
     "IPv6"=>false}]},
 {"name"=>"roninPro2015.local",
  "product"=>"Plex for Mac",
  "productVersion"=>"1.10.0.1208-daa6b641",
  "platform"=>"osx",
  "platformVersion"=>"10.15",
  "device"=>nil,
  "clientIdentifier"=>"jfpqdfpz15s7i2x5zl71qb2d",
  "createdAt"=>"2020-04-04T23:13:29Z",
  "lastSeenAt"=>"2020-05-14T12:52:16Z",
  "provides"=>"client,player,pubsub-player",
  "ownerId"=>nil,
  "sourceTitle"=>nil,
  "publicAddress"=>"45.72.253.150",
  "accessToken"=>"8zZJvyoQp56Gfgd_GwxC",
  "owned"=>true,
  "home"=>false,
  "synced"=>false,
  "relay"=>false,
  "presence"=>false,
  "httpsRequired"=>false,
  "publicAddressMatches"=>true,
  "connections"=>
   [{"protocol"=>"http",
     "address"=>"192.168.2.5",
     "port"=>32400,
     "uri"=>"http://192.168.2.5:32400",
     "local"=>true,
     "relay"=>false,
     "IPv6"=>false}]},
 {"name"=>"Chrome",
  "product"=>"Plex Web",
  "productVersion"=>"4.33.1",
  "platform"=>"Chrome",
  "platformVersion"=>"81.0",
  "device"=>"OSX",
  "clientIdentifier"=>"iludcirfnapypbiknxn4lzzr",
  "createdAt"=>"2020-05-15T22:35:26Z",
  "lastSeenAt"=>"2020-05-15T22:35:28Z",
  "provides"=>"client,player,pubsub-player",
  "ownerId"=>nil,
  "sourceTitle"=>nil,
  "publicAddress"=>"45.72.253.150",
  "accessToken"=>"8zZJvyoQp56Gfgd_GwxC",
  "owned"=>true,
  "home"=>false,
  "synced"=>false,
  "relay"=>false,
  "presence"=>true,
  "httpsRequired"=>false,
  "publicAddressMatches"=>true,
  "connections"=>
   [{"protocol"=>"http",
     "address"=>"192.168.2.5",
     "port"=>32400,
     "uri"=>"http://192.168.2.5:32400",
     "local"=>true,
     "relay"=>false,
     "IPv6"=>false}]}]


Workflow:

1. query /resources and get list of all resources
  
2. find record where product = "Plex Media Server"

3. get the connection with "local" => true
  
  "connections"=>
   [{"protocol"=>"http",
     "address"=>"192.168.2.5",
     "port"=>32400,
     "uri"=>"http://192.168.2.5:32400",
     "local"=>true,
     "relay"=>false,
     "IPv6"=>false}]},

4. get URI 

  "uri"=>"http://192.168.2.5:32400",

```

### Getting machineID 
Need this for building URI when building smart playlists, etc. 

```
URL: http://<plex server IP:port>/identity

Headers:
- X-Plex-Token:
- X-Plex-Client-Identifier:
- Accept: application/json

Sample Call (simplfied):
http://192.168.2.5:32400/identity?X-Plex-Product=Plex%20Web&X-Plex-Version=4.12.3&X-Plex-Client-Identifier=3444sr7uakddqa0cpiofgu4q

Response:
 {
    "MediaContainer": {
        "size": 0,
        "claimed": true,
        "machineIdentifier": "623cbfe8a679d4d8c68a6ffe3608aca44e8da703",
        "version": "1.18.5.2309-f5213a238"
    }
  }

XML response:
<?xml version="1.0" encoding="UTF-8"?>
<MediaContainer size="0" claimed="1" machineIdentifier="623cbfe8a679d4d8c68a6ffe3608aca44e8da703" version="1.18.5.2309-f5213a238">
</MediaContainer>

Workflow:
1. Make call to /identity
2. extract the "machineIdentifier" field

```


### Images from Composite attribute
Some resources have a 'composite' attribute, which is to generate thumbanils of collections, playlists, etc.

```
URL: http://192.168.2.5:32400/photo/:/transcode

Params:
  url: /playlists/26699/composite/1589464238
  width: 200
  height: 200
  minSize: 1
  upscale: 1

Headers:

- X-Plex-Token:
- X-Plex-Client-Identifier:
- Accept: application/json

composite = /playlists/26699/composite/1589464238

Sample Call:
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/photo/:/transcode?width=280&height=280&minSize=1&upscale=1&url=%2Fplaylists%2F26765%2Fcomposite%2F1576080883%3FX-Plex-Token%3DszqKsvgZp_hC1Xx98qx6&X-Plex-Token=szqKsvgZp_hC1Xx98qx6

Sample params:
  width: 280
  height: 280
  minSize: 1
  upscale: 1

Sample Response:
  image
```

### Media Cover/Thumbs
To generate posters/covers of movies and shows

```
URL: http://192.168.2.5:32400/photo/:/transcode

Headers:
  X-Plex-Token:

Params:
  width: 200
  height: 301
  minSize: 1
  upscale: 1
  url: /library/metadata/26838/thumb/1587264257


Sample Call:

https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/photo/:/transcode?width=200&height=301&minSize=1&upscale=1&url=%2Flibrary%2Fmetadata%2F26838%2Fthumb%2F1587264257%3FX-Plex-Token%3D_3ZFfNvrYhZ9awqszJ_m&X-Plex-Token=_3ZFfNvrYhZ9awqszJ_m

```


### Other Endpoints to investigate

```
/media/providers


# libraries

# Details about the Plex library?

URL: /library
Params:

{"MediaContainer"=>
  {"size"=>3,
   "allowSync"=>false,
   "art"=>"/:/resources/library-art.png",
   "content"=>"",
   "identifier"=>"com.plexapp.plugins.library",
   "mediaTagPrefix"=>"/system/bundle/media/flags/",
   "mediaTagVersion"=>1579823211,
   "title1"=>"Plex Library",
   "title2"=>"",
   "Directory"=>
    [{"key"=>"sections", "title"=>"Library Sections"},
     {"key"=>"recentlyAdded", "title"=>"Recently Added Content"},
     {"key"=>"onDeck", "title"=>"On Deck Content"}
    ]
  }
}

# list all libraries in Plex server
URL: /library/sections

{
  "MediaContainer": {
    "Directory": [
      {
        "Location": [
          {
            "id": 10,
            "path": "/volume1/Media/Movies_HQ"
          },
          {
            "id": 11,
            "path": "/volume1/Media/downloads_hq"
          }
        ],
        "agent": "com.plexapp.agents.imdb",
        "allowSync": true,
        "art": "/:/resources/movie-fanart.jpg",
        "composite": "/library/sections/3/composite/1589583154",
        "content": true,
        "contentChangedAt": 561875,
        "createdAt": 1575729789,
        "directory": true,
        "filters": true,
        "key": "3",
        "language": "en",
        "refreshing": false,
        "scannedAt": 1589583154,
        "scanner": "Plex Movie Scanner",
        "thumb": "/:/resources/movie.png",
        "title": "4K Movies",
        "type": "movie",
        "updatedAt": 1589583209,
        "uuid": "17d230c7-2e77-4246-a5c7-a5e399e69ad6"
      },
      {
        "Location": [
          {
            "id": 15,
            "path": "/volume1/Media/Movies_HEVC"
          },
          {
            "id": 13,
            "path": "/volume1/Media/downloads"
          },
          {
            "id": 14,
            "path": "/volume1/Media/Movies"
          }
        ],
        "agent": "com.plexapp.agents.imdb",
        "allowSync": true,
        "art": "/:/resources/movie-fanart.jpg",
        "composite": "/library/sections/1/composite/1589590997",
        "content": true,
        "contentChangedAt": 571292,
        "createdAt": 1575393330,
        "directory": true,
        "filters": true,
        "key": "1",
        "language": "en",
        "refreshing": false,
        "scannedAt": 1589590997,
        "scanner": "Plex Movie Scanner",
        "thumb": "/:/resources/movie.png",
        "title": "Movies",
        "type": "movie",
        "updatedAt": 1589591052,
        "uuid": "0f2755ad-7ed8-42fb-909a-eb2678369768"
      },
      {
        "Location": [
          {
            "id": 4,
            "path": "/volume1/Media/downloads_tv"
          },
          {
            "id": 2,
            "path": "/volume1/Media/tv_downloads"
          },
          {
            "id": 3,
            "path": "/volume1/Media/TV"
          }
        ],
        "agent": "com.plexapp.agents.thetvdb",
        "allowSync": true,
        "art": "/:/resources/show-fanart.jpg",
        "composite": "/library/sections/2/composite/1589581060",
        "content": true,
        "contentChangedAt": 540265,
        "createdAt": 1575643578,
        "directory": true,
        "filters": true,
        "key": "2",
        "language": "en",
        "refreshing": false,
        "scannedAt": 1589581060,
        "scanner": "Plex Series Scanner",
        "thumb": "/:/resources/show.png",
        "title": "TV Shows",
        "type": "show",
        "updatedAt": 1589581121,
        "uuid": "70ba12bf-8ab7-40df-93c4-383b080589d5"
      }
    ],
    "allowSync": false,
    "identifier": "com.plexapp.plugins.library",
    "mediaTagPrefix": "/system/bundle/media/flags/",
    "mediaTagVersion": 1579823211,
    "size": 3,
    "title1": "Plex Library"
  }
}

# Show details of library <id>
URL: /library/sections/<id>

{
  "MediaContainer": {
    "Directory": [
      {
        "key": "all",
        "title": "All Movies"
      },
      {
        "key": "unwatched",
        "title": "Unplayed"
      },
      {
        "key": "newest",
        "title": "Recently Released"
      },
      {
        "key": "recentlyAdded",
        "title": "Recently Added"
      },
      {
        "key": "recentlyViewed",
        "title": "Recently Viewed"
      },
      {
        "key": "onDeck",
        "title": "On Deck"
      },
      {
        "key": "collection",
        "secondary": true,
        "title": "By Collection"
      },
      {
        "key": "genre",
        "secondary": true,
        "title": "By Genre"
      },
      {
        "key": "year",
        "secondary": true,
        "title": "By Year"
      },
      {
        "key": "decade",
        "secondary": true,
        "title": "By Decade"
      },
      {
        "key": "director",
        "secondary": true,
        "title": "By Director"
      },
      {
        "key": "actor",
        "secondary": true,
        "title": "By Starring Actor"
      },
      {
        "key": "country",
        "secondary": true,
        "title": "By Country"
      },
      {
        "key": "contentRating",
        "secondary": true,
        "title": "By Content Rating"
      },
      {
        "key": "rating",
        "secondary": true,
        "title": "By Rating"
      },
      {
        "key": "resolution",
        "secondary": true,
        "title": "By Resolution"
      },
      {
        "key": "firstCharacter",
        "secondary": true,
        "title": "By First Letter"
      },
      {
        "key": "folder",
        "title": "By Folder"
      },
      {
        "key": "search?type=1",
        "prompt": "Search Movies",
        "search": true,
        "title": "Search..."
      }
    ],
    "allowSync": false,
    "art": "/:/resources/movie-fanart.jpg",
    "content": "secondary",
    "identifier": "com.plexapp.plugins.library",
    "librarySectionID": 1,
    "mediaTagPrefix": "/system/bundle/media/flags/",
    "mediaTagVersion": 1579823211,
    "size": 19,
    "thumb": "/:/resources/movie.png",
    "title1": "Movies",
    "viewGroup": "secondary",
    "viewMode": 65592
  }
}

# List all movies/shows Library <id>
/library/sections/<id>/all



# Show details of a particular movie/show
/library/metadata/31448

```


### writers,directors, etc.

```
list of writers

https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/writer
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/director
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/actor
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/genre
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/collection
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/country
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/resolution

Not actor => actor! = 123
is actor  => actor  = 120



includeExternalMedia: 1


Directors

