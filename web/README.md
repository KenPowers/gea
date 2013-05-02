# GEA Web Server / Client

##Keyboard Shortcuts for Web

Toggle Play/Pause: Space

Next: Right arrow

Previous: Left arrow

Start/Enter Search music: Enter

##Prerequisites

In order to run the web server and client you should be running a machine with
the latest stable versions of [node.js](http://nodejs.org) and
[PostgreSQL](http://www.postgresql.org/) installed.

You will also need an `rdio.json` configuration file. This file is a simple
structure which contains an Rdio developer key and secret:

    {
      "key": "9d3ayynanambvwxq5wpnw82y",
      "secret": "CdNPjjcrPW"
    }

We did not commit our `rdio.json` file to this repository for security concerns.
You must create or otherwise obtain this file and place it in a new directory
called `config`.

##Installation Instructions

If you are running a clean installation of Ubuntu 12.10, we have an installation
script which will install all prerequisites and set everything up for you
automatically (including node.js, PostgreSQL, and all other dependencies). Run
`ubuntu-installer.sh` and skip ahead to the instructions on how to run the
server.

Otherwise, set up a database in PostgreSQL named `gea` with a user `gea` and
password `gea` (for development purposes, other settings may be set in
`db/database.json`, the user should have full permissions to the database)
please follow these directions in your terminal:

1. `npm install -g pg db-migrate`
2. `npm install`
3. `cd db`
4. `db-migrate`
5. `cd ..`

The database can be populated with sample data using the following command:

    node db/refreshDb.js

##Running the Server

To run the server, run `node app` from this directory. The web client will be
accessible from `http://localhost:3000/`. You must have the Adobe Flash plugin
installed in your browser for the web client to function correctly. If you are
running Ubuntu 12.10, you can install the plugin with `sudo apt-get -f install
flashplugin-installer`. The current release of the web server and client are
running [here](http://gea.kenpowers.net) (May 2nd, 2013).

##Tests

To run the web server and client tests using `testem`.
1. Install `testem` with `npm install -g testem`.
2. Execute the tests with `testem` while in the `web/` folder.
**Note: The server must be running before tests are executed.**

##1.0 Functionality:

* Server
    * REST Endpoint: `GET /rdio/getPlaybackToken`
        * Gets a playback token from Rdio which allows the client to play music.
    * REST Endpoint: `POST /rate?from=rdio&id=<id>&verdict=<like|dislike>`
        * Saves a rating to the database. Only supports Rdio right now. `<id>` is a track id from Rdio. `<like|dislike>` must be set to either `like` or `dislike`.
    * REST Endpoint: `GET /rate?[artist=<artist>[&album=<album>&title=<title>]][[&pastHours=<pastHours>]|[&timeStart=<timeStart>&timeEnd=<timeEnd>]][&limit=<limit>&offset=<offset>]`
        * Gets ratings from the database
        * `artist` is optional
        * If `artist` is specified, then `album || title` can be specified
        * `pastHours || (timeStart && timeEnd)` are optional. `pastHours` takes precedent -- default is 24 hours
        * `limit` will limit the number of results (defaults to 10, maximum 100)
        * `offset` will skip the first given number of results, useful for pagination
* Client
    * Allows user to search for songs, albums, and artists.
    * Search results are distinguished by song, album, and artist with small icons.
    * When search results are clicked a thirty-second clip is played.
    * Users can like or dislike the currently playing song.
    * The top 10 songs per state are visible on the map in a spiral formation, ordered by ranking.
    * If the pins are too close, they are grouped under a cluster that can be expanded.
    * Users can choose a time period to show the top 10 song ratings via a drop-down selection.
    * Users can view song details for the top songs on the map and begin listening by clicking on the album art from the map pin.
    * Users who have never visited are greeted with a brief tour to explain the features and functionality of the client.
    * Users can use the keyboard shortcuts (listed above) to control media playback.

##Release notes
See [`../release-notes-1.0-binary.txt`](../release-notes-1.0-binary.txt) and [`../release-notes-1.0-source.txt`](../release-notes-1.0-source.txt).
