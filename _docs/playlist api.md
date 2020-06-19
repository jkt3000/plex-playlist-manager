# Playlist API


Media providers

  GET /media/providers  - list of media providers
    - want machineIdentifier to build uri for adding items into play

    uri=server://<machineIdentifier>/com.plexapp.plugins.library/library/metadata/<id>

### GET all playlists

  GET /playlists

### SHOW a playlist

  GET /playlists/<id>

### SHOW playlist details/content

  GET /playlists/<id>/items

### MOVE item in playlist

  PUT /playlists/<id>/items/<item_id>/move
  params: { after: <playlistItemID> }

- playlistItemID from Metadata in playlist details response

### DELETE item in playlist

  DELETE /playlists/<id>/items<item_id>

### ADD item to playlist

  PUT https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/playlists/29271/items

  Params:
  uri: server://623cbfe8a679d4d8c68a6ffe3608aca44e8da703/com.plexapp.plugins.library/library/metadata/14277
  includeExternalMedia: 1
  
  Response: 200
  <MediaContainer size="1" leafCountAdded="1" leafCountRequested="1">
<Playlist ratingKey="29271" key="/playlists/29271/items" guid="com.plexapp.agents.none://08120dab-2e37-4bb7-af02-e03d8f114dbe" type="playlist" title="John Wick: Chapter 3 - Parabellum" summary="" smart="0" playlistType="video" composite="/playlists/29271/composite/1589599720" duration="15265000" leafCount="2" addedAt="1589599523" updatedAt="1589599720">
</Playlist>
</MediaContainer>

### Create a normal playlist

  POST https://192-168-2-5.fd260bceec114882b0b2db343469745c.plex.direct:32400/playlists?uri=server%3A%2F%2F623cbfe8a679d4d8c68a6ffe3608aca44e8da703%2Fcom.plexapp.plugins.library%2Flibrary%2Fmetadata%2F14265

  params:
    uri: server://623cbfe8a679d4d8c68a6ffe3608aca44e8da703/com.plexapp.plugins.library/library/metadata/14265
    includeExternalMedia: 1
    title: John Wick: Chapter 3 - Parabellum
    smart: 0
    type: video


  Response (in XML)
<MediaContainer size="1">
  <Playlist ratingKey="29271" key="/playlists/29271/items" guid="com.plexapp.agents.none://08120dab-2e37-4bb7-af02-e03d8f114dbe" type="playlist" title="John Wick: Chapter 3 - Parabellum" summary="" smart="0" playlistType="video" composite="/playlists/29271/composite/1589599523" ratingCount="0" duration="7845000" leafCount="1" addedAt="1589599523" updatedAt="1589599523">
  </Playlist>
</MediaContainer>



### Create a Smart List

creating a smart playlist:

includeExternalMedia: 1
title: 2020movies
smart: 1
uri: server://623cbfe8a679d4d8c68a6ffe3608aca44e8da703/com.plexapp.plugins.library/library/sections/1/all?type=1&decade=2020

server://623cbfe8a679d4d8c68a6ffe3608aca44e8da703/com.plexapp.plugins.library/library/sections/1/all?type=1&decade=2020
server%3A%2F%2F623cbfe8a679d4d8c68a6ffe3608aca44e8da703%2Fcom.plexapp.plugins.library%2Flibrary%2Fsections%2F1%2Fall%3Ftype%3D1%26decade%3D2020



### Edit smart playlist details

### Modify parameters of contents for a smart playlist

PUT /playlists/29265/items?uri=server%3A%2F%2F623cbfe8a679d4d8c68a6ffe3608aca44e8da703%2Fcom.plexapp.plugins.library%2Flibrary%2Fsections%2F1%2Fall%3Ftype%3D1%26actor%3D6042%26limit%3D5

params:
 uri = server%3A%2F%2F623cbfe8a679d4d8c68a6ffe3608aca44e8da703%2Fcom.plexapp.plugins.library%2Flibrary%2Fsections%2F1%2Fall%3Ftype%3D1%26decade%3D2010

 - pass a uri with server machineid with url /library/sections/<id>/all?type=1&decade=2010

