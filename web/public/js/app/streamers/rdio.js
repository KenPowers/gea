/*global define*/
define([
	'app/vent',
	'jqueryrdio',
	'util/jqr!'
], function (vent) {
  /* This is a wrapper for the Rdio web-playback API calls.
     The wrapper provides modularity so that in the event that
     Rdio is no longer a viable music streaming service, a minimum
     amount of code needs to be changed.
     To use an alternate streaming service in place of Rdio, an
     additional streamer object should be created, using this as a
     template.
  */
  return {
    //The 'name' attribute should reflect the unique name of the streaming service.
  	name: 'rdio',

    //The setup function requires an API object (normally an SWF object)
    //as well as a playback token to use for authentication with the service
  	setup: function (api, playBackToken) {
  		// Cache the Rdio API object
  		this.$api = api;
      //Initialize the API object with the playback token
  		this.$api.rdio(playBackToken);
  	},
    //The bind function is a helper function to allow other objects to create
    //bindings for various API calls. It requires an apiEvent (the trigger event)
    //and a function to call on that event.
  	bind: function (apiEvent, apiFunction) {
  		this.$api.bind(apiEvent + '.rdio', apiFunction);
  	},
    //The play method should either play the provided music
    //key (track, artist, album, etc) or, if the key is not provided, initiate playback.
  	play: function (key) {
  		if (key) this.$api.rdio().play(key);
  		else this.$api.rdio().play()
  	},
    //The pause method should pause playback
  	pause: function () {
  		this.$api.rdio().pause();
  	},
    //The next method should proceed to the next track in the playback source list
  	next: function () {
  		this.$api.rdio().next();
  	},
    //The previous method should skip to the previous track in the playback source list
  	previous: function () {
  		this.$api.rdio().previous();
  	},
    //The seek method should move the playback position to the provided 'position' (in seconds)
  	seek: function (position) {
  		this.$api.rdio().seek(position);
  	},
    //The queue method should add a music key to the source list to prepare for playback
  	queue: function(key) {
  		this.$api.rdio().queue(key);
  	}
  };
});
