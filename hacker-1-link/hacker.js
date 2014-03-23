var fs = require('fs');
var utils = require('utils');
var casper = require("casper").create({
    pageSettings: {
		//We don't need these..
        loadImages: false,
        loadPlugins: false
    }
});

//Export directory
var FILE_DIR = "data.csv";

//Base URL
var BASE_URI = "http://www.mobileacademy.com/";
	//BASE_URI = "https://www.wikipedia.org/";

//Holds links
var links = [];

//Current Link Index in links[]
var currentLink = 0;

//Link, if Not broken, the value will be False;
var Link = function(uri) {
	this.uri = uri;
	this.broken = true;
}

// Formats an URL, not the best way, 
// but I've tried to do it without external libraries.
// This should work with most links
function formatURI(URI) {
	//make sure we're dealing with a string, trim it and assure it's lower-case
	URI = String(URI).trim();
	var lowerURI = URI.toLowerCase(); 
	
	//if it contains javascript we'll visit the base Uri
	if(lowerURI.indexOf("javascript:") >= 0) {
		URI = BASE_URI;
	}
	
	//starts without http or https, just // so it can be both, we'll force unsecured protocol
	else if(lowerURI.indexOf("//") == 0) { 
		URI = "http:"+URI; 
	}
	
	//starts with http:// or https://
	else if(lowerURI.indexOf("http://") == 0 || lowerURI.indexOf("https://") == 0) { 
		//it's okay
	}
	
	//it's none of the previous, we'll attach http:// at beginning
	//it might be: www.domain.com, domain.com, #home or something else...
	else { 
		//prepends Base URI
		URI = BASE_URI+URI; 
	}
	
	return URI;
}

// Opens the page, perform tests and fetch next links
function crawl(link) {
    this.start().then(function() {
        this.echo("Checking: " + link.uri, 'INFO');
        this.open(link.uri);
    });
	
    this.then(function() {
		//broken if less than 200 or greater than 299
		if((this.currentHTTPStatus >= 200 && 300 > this.currentHTTPStatus)) {
			link.broken = false;
            this.echo(link.uri + utils.format(' is OK (HTTP %s)\n', this.currentHTTPStatus));
        }else {
            this.echo(link.uri + utils.format(' is Broken (HTTP %s)\n', this.currentHTTPStatus));
        }
    });
}

// Loops through links[] then prints out results and creates file
function checkNext() {
    if (currentLink < links.length) {
		crawl.call(this, links[currentLink]);
        currentLink++;
        this.run(checkNext);
    } else {
        var brokenLinks = links.filter(function(link) {
            return link.broken;
        });
		
		this.echo("\n-----------------");
		this.echo("Total Links: "+links.length);
		this.echo("Broken Links: "+brokenLinks.length);
		
		var CSV = links.map(function(link){
			return link.uri + ", " + link.broken;
		}).join("\n");
		
		//save CSV to file directory
		fs.write(FILE_DIR, CSV, 'w');
		
		this.echo("Data exported to: " + FILE_DIR);
        this.die("-----------------");
		//Done!
    }
}

// Get all <a href> from the page
function searchLinks() {
    return this.evaluate(function() {
        return [].map.call(__utils__.findAll('a[href]'), function(node) {
            return node.getAttribute('href');
        });
    });
}

//start casperjs with our Base URL
casper.start(BASE_URI, function() {
	links = searchLinks.call(this).map(function(url) {
		return new Link(formatURI(url));
	});
	this.echo(links.length + " links found on " + BASE_URI);
});

//Starts to check links[] after obtaining and mapping its
casper.run(function() {
	casper.start().then(function(){
		this.echo("Checking links...\n");
	}).run(checkNext);
});