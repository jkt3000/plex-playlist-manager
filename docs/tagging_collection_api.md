
### Create a New Collection Tag on movie 'The Bone Collector'

PUT 
https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/1/all?type=1&id=16350&includeExternalMedia=1&collection.locked=1&collection%5B0%5D.tag.tag=test&X-Plex-Product=Plex%20Web&X-Plex-Version=4.12.3&X-Plex-Client-Identifier=3444sr7uakddqa0cpiofgu4q&X-Plex-Platform=Chrome&X-Plex-Platform-Version=81.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=bundled&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1280x1306%2C2560x1440&X-Plex-Token=szqKsvgZp_hC1Xx98qx6&X-Plex-Language=en

Params:
type: 1
id: 16350           # movie id for The Bone Collector
includeExternalMedia: 1
collection.locked: 1
collection[0].tag.tag: test
X-Plex-Product: Plex Web
X-Plex-Version: 4.12.3
X-Plex-Client-Identifier: 3444sr7uakddqa0cpiofgu4q
X-Plex-Platform: Chrome
X-Plex-Platform-Version: 81.0
X-Plex-Sync-Version: 2
X-Plex-Features: external-media,indirect-media
X-Plex-Model: bundled
X-Plex-Device: OSX
X-Plex-Device-Name: Chrome
X-Plex-Device-Screen-Resolution: 1280x1306,2560x1440
X-Plex-Token: szqKsvgZp_hC1Xx98qx6
X-Plex-Language: en


### Adding existing tag to a Movie that already has one tag:

PUT https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/1/all
Params:
type: 1
id: 16350
includeExternalMedia: 1
collection[0].tag.tag: Test
collection[1].tag.tag: 12 Rounds

### Removing an existing Tag on a Movie

PUT https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/1/all
type: 1
id: 16350
includeExternalMedia: 1
collection[0].tag.tag: 12 Rounds
collection[].tag.tag-: Test


### List ALL Collections

GET https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/sections/3/collections

Params:
includeCollections: 1
includeExternalMedia: 1
includeAdvanced: 1
includeMeta: 1
X-Plex-Container-Start: 0
X-Plex-Container-Size: 50


{
  "MediaContainer": {
    "size": 56,
    "allowSync": true,
    "art": "/:/resources/movie-fanart.jpg",
    "identifier": "com.plexapp.plugins.library",
    "librarySectionID": 3,
    "librarySectionTitle": "4K Movies",
    "librarySectionUUID": "17d230c7-2e77-4246-a5c7-a5e399e69ad6",
    "mediaTagPrefix": "/system/bundle/media/flags/",
    "mediaTagVersion": 1579823211,
    "thumb": "/:/resources/movie.png",
    "title1": "4K Movies",
    "title2": "All 4K Movies",
    "viewGroup": "movie",
    "viewMode": 65592,
    "Metadata": [
      {
        "ratingKey": "14909",
        "key": "/library/metadata/14909/children",
        "guid": "collection://b611b3f3-5e3f-40ef-8262-b01092b130b4",
        "type": "collection",
        "title": "Aladdin",
        "subtype": "movie",
        "summary": "",
        "index": 62348,
        "thumb": "/library/metadata/14909/composite/1575833011?width=400&height=600",
        "addedAt": 1575833011,
        "updatedAt": 1575833011,
        "childCount": "1",
        "maxYear": "1992",
        "minYear": "1992"
      },
      {
        "ratingKey": "15124",
        "key": "/library/metadata/15124/children",
        "guid": "collection://179c1f88-6245-4119-aa71-70fb6b4ff451",
        "type": "collection",
        "title": "Alien",
        "subtype": "movie",
        "summary": "",
        "index": 62355,
        "thumb": "/library/metadata/15124/composite/1575833107?width=400&height=600",
        "addedAt": 1575833107,
        "updatedAt": 1575833107,
        "childCount": "1",
        "maxYear": "1979",
        "minYear": "1979"
      },
      ...
      ...
    ]
  }
}

### SHOW a collection
```
GET https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/metadata/14587

Params:
includeExternalMedia: 1
Accept-Language: en
includeConcerts: 1
includeExtras: 1
includeOnDeck: 1
includePopularLeaves: 1
includePreferences: 1
includeChapters: 1
includeStations: 1
includeExternalMedia: 1
asyncAugmentMetadata: 1
asyncCheckFiles: 1
asyncRefreshAnalysis: 1
asyncRefreshLocalMediaAgent: 1

Response:
{
  "MediaContainer": {
    "size": 1,
    "allowSync": true,
    "identifier": "com.plexapp.plugins.library",
    "librarySectionID": 3,
    "librarySectionTitle": "4K Movies",
    "librarySectionUUID": "17d230c7-2e77-4246-a5c7-a5e399e69ad6",
    "mediaTagPrefix": "/system/bundle/media/flags/",
    "mediaTagVersion": 1579823211,
    "Metadata": [
      {
        "ratingKey": "14587",
        "key": "/library/metadata/14587/children",
        "guid": "collection://13648a57-76f5-40c9-8e00-5d84bce49b62",
        "type": "collection",
        "title": "The Amazing Spider-Man",
        "titleSort": "Amazing Spider-Man",
        "librarySectionTitle": "4K Movies",
        "librarySectionID": 3,
        "librarySectionKey": "/library/sections/3",
        "subtype": "movie",
        "summary": "",
        "index": 62343,
        "thumb": "/library/metadata/14587/composite/1575832886?width=400&height=600",
        "addedAt": 1575832878,
        "updatedAt": 1575832886,
        "childCount": "2",
        "maxYear": "2014",
        "minYear": "2012"
      }
    ]
  }
}
```

### List contents of collection
```
GET  https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/library/metadata/14587/children

Params:
excludeAllLeaves: 1
includeExternalMedia: 1
X-Plex-Container-Start: 0
X-Plex-Container-Size: 20

Response:
{
  "MediaContainer": {
    "size": 2,
    "allowSync": true,
    "art": "/:/resources/movie-fanart.jpg",
    "identifier": "com.plexapp.plugins.library",
    "key": "14587",
    "librarySectionID": 3,
    "librarySectionTitle": "4K Movies",
    "librarySectionUUID": "17d230c7-2e77-4246-a5c7-a5e399e69ad6",
    "mediaTagPrefix": "/system/bundle/media/flags/",
    "mediaTagVersion": 1579823211,
    "nocache": true,
    "parentIndex": 62343,
    "parentTitle": "The Amazing Spider-Man",
    "title1": "4K Movies",
    "title2": "The Amazing Spider-Man",
    "viewGroup": "movie",
    "viewMode": 65592,
    "Metadata": [
      {
        "ratingKey": "14236",
        "key": "/library/metadata/14236",
        "guid": "com.plexapp.agents.imdb://tt0948470?lang=en",
        "studio": "Columbia Pictures",
        "type": "movie",
        "title": "The Amazing Spider-Man",
        "titleSort": "Amazing Spider-Man",
        "contentRating": "PG-13",
        "summary": "Peter Parker is an outcast high schooler abandoned by his parents as a boy, leaving him to be raised by his Uncle Ben and Aunt May. Like most teenagers, Peter is trying to figure out who he is and how he got to be the person he is today. As Peter discovers a mysterious briefcase that belonged to his father, he begins a quest to understand his parents' disappearance – leading him directly to Oscorp and the lab of Dr. Curt Connors, his father's former partner. As Spider-Man is set on a collision course with Connors' alter ego, The Lizard, Peter will make life-altering choices to use his powers and shape his destiny to become a hero.",
        "rating": 7.3,
        "audienceRating": 7.7,
        "year": 2012,
        "tagline": "The untold story begins.",
        "thumb": "/library/metadata/14236/thumb/1587262688",
        "art": "/library/metadata/14236/art/1587262688",
        "duration": 8177184,
        "originallyAvailableAt": "2012-06-23",
        "addedAt": 1575832626,
        "updatedAt": 1587262688,
        "audienceRatingImage": "rottentomatoes://image.rating.upright",
        "chapterSource": "media",
        "primaryExtraKey": "/library/metadata/14605",
        "ratingImage": "rottentomatoes://image.rating.ripe",
        "Media": [
          {
            "id": 33055,
            "duration": 8177184,
            "bitrate": 17149,
            "width": 3840,
            "height": 1606,
            "aspectRatio": 2.35,
            "audioChannels": 8,
            "audioCodec": "truehd",
            "videoCodec": "hevc",
            "videoResolution": "4k",
            "container": "mkv",
            "videoFrameRate": "24p",
            "videoProfile": "main 10",
            "Part": [
              {
                "id": 33056,
                "key": "/library/parts/33056/1537803761/file.mkv",
                "duration": 8177184,
                "file": "/volume1/Media/Movies_HQ/The Amazing Spider-Man (2012) [4K]/The Amazing Spider-Man (2012) [4K] [HEVC] [OTH 8ch].mkv",
                "size": 17244891925,
                "container": "mkv",
                "videoProfile": "main 10"
              }
            ]
          }
        ],
        "Genre": [
          {
            "tag": "Action"
          },
          {
            "tag": "Sci-Fi"
          }
        ],
        "Director": [
          {
            "tag": "Marc Webb"
          }
        ],
        "Writer": [
          {
            "tag": "Alvin Sargent"
          },
          {
            "tag": "Steve Kloves"
          }
        ],
        "Country": [
          {
            "tag": "USA"
          }
        ],
        "Collection": [
          {
            "tag": "The Amazing Spider-Man"
          }
        ],
        "Role": [
          {
            "tag": "Andrew Garfield"
          },
          {
            "tag": "Emma Stone"
          },
          {
            "tag": "Rhys Ifans"
          }
        ]
      },
      {
        "ratingKey": "14235",
        "key": "/library/metadata/14235",
        "guid": "com.plexapp.agents.imdb://tt1872181?lang=en",
        "studio": "Columbia Pictures",
        "type": "movie",
        "title": "The Amazing Spider-Man 2",
        "titleSort": "Amazing Spider-Man 2",
        "contentRating": "PG-13",
        "summary": "For Peter Parker, life is busy. Between taking out the bad guys as Spider-Man and spending time with the person he loves, Gwen Stacy, high school graduation cannot come quickly enough. Peter has not forgotten about the promise he made to Gwen’s father to protect her by staying away, but that is a promise he cannot keep. Things will change for Peter when a new villain, Electro, emerges, an old friend, Harry Osborn, returns, and Peter uncovers new clues about his past.",
        "rating": 5.2,
        "audienceRating": 6.4,
        "year": 2014,
        "tagline": "No more secrets.",
        "thumb": "/library/metadata/14235/thumb/1587262740",
        "art": "/library/metadata/14235/art/1587262740",
        "duration": 8494815,
        "originallyAvailableAt": "2014-04-16",
        "addedAt": 1575832626,
        "updatedAt": 1587262740,
        "audienceRatingImage": "rottentomatoes://image.rating.upright",
        "chapterSource": "media",
        "primaryExtraKey": "/library/metadata/14588",
        "ratingImage": "rottentomatoes://image.rating.rotten",
        "Media": [
          {
            "id": 33054,
            "duration": 8494815,
            "bitrate": 34968,
            "width": 3840,
            "height": 1604,
            "aspectRatio": 2.35,
            "audioChannels": 8,
            "audioCodec": "truehd",
            "videoCodec": "hevc",
            "videoResolution": "4k",
            "container": "mkv",
            "videoFrameRate": "24p",
            "videoProfile": "main 10",
            "Part": [
              {
                "id": 33055,
                "key": "/library/parts/33055/1537779471/file.mkv",
                "duration": 8494815,
                "file": "/volume1/Media/Movies_HQ/The Amazing Spider-Man 2 (2014) [4K]/The Amazing Spider-Man 2 (2014) [4K] [HEVC] [OTH 8ch].mkv",
                "size": 37070281468,
                "container": "mkv",
                "videoProfile": "main 10"
              }
            ]
          }
        ],
        "Genre": [
          {
            "tag": "Action"
          },
          {
            "tag": "Adventure"
          }
        ],
        "Director": [
          {
            "tag": "Marc Webb"
          }
        ],
        "Writer": [
          {
            "tag": "Alex Kurtzman"
          },
          {
            "tag": "Roberto Orci"
          }
        ],
        "Country": [
          {
            "tag": "USA"
          }
        ],
        "Collection": [
          {
            "tag": "The Amazing Spider-Man"
          }
        ],
        "Role": [
          {
            "tag": "Andrew Garfield"
          },
          {
            "tag": "Emma Stone"
          },
          {
            "tag": "Jamie Foxx"
          }
        ]
      }
    ]
  }
}

```