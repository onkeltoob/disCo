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
* Don't blame me for anything, I simply don't know any better. Or don't want to do so.
*/
(function($) {
	$.extend($.fn, {
		disCo: function(options) {
			var settings = $.extend({
				// The name of the data-attribute containing the username
				'userAttributeName': 'user',
				// The name of the data-attribute containing the collection type ("collection" or "wantlist")
				'collectionAttributeName': 'collection',
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
				// class for the entire result table or paragraph (if no results are found)
				"resultElementClass": "records",
				// ID for the entire result table or paragraph (if no results are found)
				"resultElementId": "",
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

			// Create data attributes, if settings do not start with "data-"
			settings.userAttributeName = (!/^data\-(.)+$/.test(settings.userAttributeName)) ? 'data-' + settings.userAttributeName : settings.userAttributeName;
			settings.collectionAttributeName = (!/^data\-(.)+$/.test(settings.collectionAttributeName)) ? 'data-' + settings.collectionAttributeName : settings.collectionAttributeName;

			this.each(function() {
				var container = $(this);
				var url = 'http://api.discogs.com/users/'
							+ container.attr(settings.userAttributeName) + '/{folder}'
							+ '?per_page=' + settings.results 
							+ '&sort=' + settings.sort 
							+ '&sort_order=' + settings.sortOrder 
							+ '&callback=?';
				// Check type of result set to be retrieved (collection or wantlist)
				var isCollection = !(container.attr(settings.collectionAttributeName) == 'wantlist')
				if(isCollection){
					url = url.replace('{folder}', 'collection/folders/' + settings.folder + '/releases');
				} else {
					url = url.replace('{folder}', 'wants');
				}
				
				$.getJSON(url, function(results) {
					var resultSet = (isCollection) ? results.data.releases : results.data.wants
					if(resultSet.length > 0){
						// Create table element
						var resultTable = $(document.createElement('table'));
						if(settings.resultElementClass){resultTable.addClass(settings.resultElementClass);}
						if(settings.resultElementId){resultTable.attr('id', settings.resultElementId);}
						// Append table header
						resultTable.append('<tr><th>'
							+ settings.headerId + '</th><th>'
							+ settings.headerArtists + '</th><th>'
							+ settings.headerTitle + '</th><th>'
							+ settings.headerLabels + '</th><th>'
							+ settings.headerStyles + '</th><th>'
							+ settings.headerYear + '</th></tr>'
						);

						$.each(resultSet, function() {
							// Write current release to variable. This seems to be neccessary in 
							// order to use the release data inside of the following AJAX call.
							// There's a probably a better way; at least it somehow looks pretty ugly. Anyway.
							var release = this;

							// Get details
							$.ajax({
								type: "GET",
								url: release.basic_information.resource_url + '?callback=?',
								processData: true,
								data: {},
								dataType: "json",
								success: (function (releaseData) {
									resultTable.append('<tr><td>'  
										+ '<a href="' + releaseData.data.uri + '" title="' + release.basic_information.title + ' @ Discogs">' + release.id + '</a></td><td>' 
										+ $.map(release.basic_information.artists, function(artist){return artist.name;}).join(', ') + '</td><td>' 
										+ release.basic_information.title + '</td><td>' 
										+ $.map(release.basic_information.labels, function(label){return label.name;}).join(', ') + '</td><td>' 
										+ releaseData.data.styles.join(', ') + '</td><td>'
										+ ((release.basic_information.year != 0) ? release.basic_information.year : '-') + '</td></tr>'
									);
								}),
							});
						});
						container.append(resultTable);
					} else {
						container.append('<p>' + settings.noReleasesNote + '</p>');
					}
				})
			});

			return this;
		}
	});
})(jQuery);
