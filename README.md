disCo
=====

This jQuery plugin provides functionality to display your record collection at 
http://www.discogs.com. It basically creates a simple table with a configurable 
number of releases from one of your folders (with the default value pointing to 
"All releases"). The generated table uses an "id" attribute set to "records", so 
you better don't use this value for any other element on your page. There's probably 
a better way to create the table; I just don't want to spend time on this topic.

Settings
========

Here are the settings with their default values:

user: ""
  The person's username at Discogs
folder: 0
  The ID of the folder you want to display records from. For now Discogs seems 
  to allow folder requests only for the default folder containing all releases,
  so this option doesn't really make sense.Default value is 0, so all releases are targeted
sort: "added"
  Sort column. Discogs only allows very few values here ("added", "artist", "label",...).
sortOrder: "desc"
  Sort order ("asc", "desc").
results: 10
  The number of results to be displayed. Beware: The larger the number, the more requests to 
  Discogs will be made!
tableClass: "records"
  class for the entire result table
headerId: "ID"
	The ID column name
headerArtists: "Artists"
	The artists column name
headerTitle: "Title"
  The title column name
headerLabels: "Labels"
  The labels column name
headerStyles: "Styles"
  The styles column name
headerYear: "Year"
  The year column name
noReleasesNote: "No releases could be found."
  Text to be displayed if no releases are found
