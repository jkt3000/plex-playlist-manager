# Library APIs

## Sorting
```
param: sort=<value>

Values:

titleSort                   [default] title A-Z
titleSort:desc
year:desc                   [default] (2020 -> ...)
year
originallyAvailableAt:desc  [default] (latest release -> )
originallyAvailableAt
rating:desc                 [default] (10 -> 0)
rating
duration:desc               (longest -> shortest)
duration
addedAt:desc                Date added to Plex (latest -> oldest)
addedAt                     
lastViewedAt:desc           Latest watched 
lastViewedAt

Filter

all media         /all
uplayed           ?unwatched=1
duplicates        ?duplicate=1
in progress       ?inProgress=1
HDR               ?hdr=1

by year           ?year=xxxx
by decade         ?decade=2010
by genre          ?genre=genreId
by content rating ?contentRating=G,R....
by Actor
by Director
by Studio
by Country
by Producer