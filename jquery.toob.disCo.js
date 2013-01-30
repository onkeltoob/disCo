/*
* jQuery Toob disCo
* http://tobias-reinhardt.de
*
* Copyright 2013, Tobias Reinhardt
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 
* January 2013
*
* This plugin provides functionality to display your record collection
* at http://www.discogs.com. It basically creates a simple table with 
* a configurable number of releases from one of your folders (with the 
* default value pointing to "All releases").
* The generated table uses an "id" attribute set to "records", so you better
* don't use this value for any other element on your page. There's probably 
* a better way to create the table; I just don't want to spend time on this topic.
* Don't blame me for anything, I simply don't know any better. Or don't want to do so.
*/
(function ($) {
  $.fn.disCo = function (options) {
		var settings = $.extend({
			// The person's username at Discogs
			"user": "",
			// The ID of the folder you want to display records from.
			// For now Discogs seems to allow folder requests only for the default folder containing all releases,
			// so this option doesn't really make sense.Default value is 0, so all releases are targeted
			"folder": 0,
			// Sort column. Discogs only allows very few values here ("added", "artist", "label",...).
			"sort": "added",
			// Sort order ("asc", "desc").
			"sortOrder": "desc",
			// The number of results to be displayed. Beware: 
			// The larger the number, the more requests to Discogs will be made!
			"results": "10",
			// class for the entire result table
			"tableClass": "records",
			// The ID column name
			"headerId" : "ID",
			// The artists column name
			"headerArtists" : "Artists",
			// The title column name
			"headerTitle" : "Title",
			// The labels column name
			"headerLabels" : "Labels",
			// The styles column name
			"headerStyles" : "Styles",
			// The year column name
			"headerYear" : "Year",
			// Text to be displayed if no releases are found
			"noReleasesNote" : "No releases could be found."
		}, options);
		
		var container = this;
		$.getJSON('http://api.discogs.com/users/' 
			+ settings.user + '/collection/folders/' 
			+ settings.folder + '/releases?'
			+ 'per_page=' + settings.results 
			+ '&sort=' + settings.sort 
			+ '&sort_order=' + settings.sortOrder 
			+ '&callback=?', function(results) {
				if(results.data.releases.length > 0){
					// Create table structure
					container.append('<table id="records" class="' + settings.tableClass + '"><tr><th>'
						+ settings.headerId + '</th><th>'
						+ settings.headerArtists + '</th><th>'
						+ settings.headerTitle + '</th><th>'
						+ settings.headerLabels + '</th><th>'
						+ settings.headerStyles + '</th><th>'
						+ settings.headerYear + '</th></tr>'
						+ '</table>'
					);
					$.each(results.data.releases, function() {
						// Write current release to variable. This seems to be neccessary in 
						// order to use the release data inside of the following AJAX call.
						// There's a probably a better way; at least it somehow looks pretty ugly. Anyway.
						var release = this;
						
						// Join artist names
						var artists = $.map(release.basic_information.artists, function(artist){
							return artist.name;
						}).join(', ');
						
						// Join label names
						var labels = $.map(release.basic_information.labels, function(label){
							return label.name;
						}).join(', ');
						
						// Get details
						$.ajax({
							type: "GET",
							url: release.basic_information.resource_url + '?callback=?',
							processData: true,
							data: {},
							dataType: "json",
							success: (function (releaseData) {
								// Join styles
								var styles = releaseData.data.styles.join(', ');
								$('#records').append('<tr><td>'  
									+ '<a href="' + releaseData.data.uri + '" title="' + release.basic_information.title + ' @ Discogs">' + release.id + '</a></td><td>' 
									+ artists + '</td><td>' 
									+ release.basic_information.title + '</td><td>' 
									+ labels + '</td><td>' 
									+ styles + '</td><td>'
									+ release.basic_information.year + '</td></tr>'
								);
							}),
						});
					})
				} else {
					container.append('<p>' + settings.noReleasesNote + '</p>');
				}
		});
		
		return container;
	};
})(jQuery);
