var numid = 0;
var ytplayer;
var timer;
var lastsearch = "";
var playerStatess = 1;
var currentvid = "";
var showthumb = "1";
var justswitch = "0";
var dontplayvideo  = "0";
var pdivsequence;
var pdivsequencedetail;
var justcleared = "0";
var tempclass = "a";
var desdiv = "b";
var desdivnum = 0;
var lastsearchurl = "";
var shuffle = "0";
var shufflearray = [];
var addedone = false;
var apiKey = "AIzaSyCbjl_OA8J-fO0hETl64DocvC6hJOJP4EU";
var clientLoaded = false;
var handleClientLoad = function() {
	gapi.client.setApiKey(apiKey);
	gapi.client.load('youtube', 'v3', function() {
		clientLoaded = true;
    		//handleAPILoaded();
  	});
};
window.onload = function() {
	//$('#playlistdetail').hide();
	//$('#updateplaylistdiv').hide();
	//$('#saveplaylistdiv').hide();
	//$('#savebigdiv').hide();
	//$('#savebody').hide();
	//$('#loadbody').hide();
	//$('#loadplaylistdiv').hide();
	jQuery('body').keyup(function(e){
  		if (e.which == 27) {
			closesave();
			closeload();
		}
	});
	jQuery('#playlistloadname').keyup(function(e){
		if (e.which == 13) {
			loadplaylist();
		}
	});
};

function checkShuffle(){
	if($('#shuffle').is(':checked')){
		try {
                	_gaq.push(['_trackEvent', 'Event', 'ShuffleOn']);
        	} catch(e) {
	
        	}
		shuffle = "1";
	}else{
		shuffle = "0";
	}
}

function onYouTubeIframeAPIReady(playerId) {
	//ytplayer = document.getElementById("myytplayer");
	//ytplayer.addEventListener("onError", "onPlayerError");
	//ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer = new YT.Player('myytplayer', {
      		height: '314',
		enablejsapi: true,
      		width: '479',
      		videoId: 'Oi1BcouEmio',
		autoplay: 0,
		events: {
			"onError": onPlayerError,
			'onReady': onPlayerReady,
			"onStateChange": onPlayerStateChange,
		}
    	});
}

function onPlayerReady() {
	debugger;
}
function onPlayerError() {
	debugger;
}

var _video_count = 0;
function loadVideo(vidid, first) {
	_video_count++;
	if(dontplayvideo == "0")
	{
		try {
                	_gaq.push(['_trackEvent', 'Event', 'LoadVideo', vidid.split('_')[0]+'']);
        	} catch(e) {
	
        	}
		if(showthumb == "1"){
			document.getElementById("headervideotitle").innerHTML = document.getElementById(vidid).title;
			document.title = document.getElementById(vidid).title;
                        setTimeout('looptitle',1000);
			document.getElementById("playlistdetail").style.display = "none";
			if(currentvid != ""){
				if(document.getElementById(currentvid))				{
					document.getElementById(currentvid).style.border='3px solid black';
					try {
					document.getElementById(currentvid.substring(0, currentvid.length-1)).style.backgroundColor = 'transparent ';
					} catch (e) {}
				}
			}
			currentvid = vidid;

			document.getElementById(vidid).style.border='3px solid red';
			document.getElementById(vidid.substring(0, vidid.length-1)).style.backgroundColor = '#f1b1b4';

			vidid = vidid.substring(0,vidid.lastIndexOf("_"));
			
			if(ytplayer) {
				ytplayer.loadVideoById(vidid);
			}
		}else{
			document.getElementById("headervideotitle").innerHTML = document.getElementById(vidid+"1").title;
			document.title = document.getElementById(vidid+"1").title;
			setTimeout('looptitle',1000);
			document.getElementById("playlistthumb").style.display = "none";
	
			if(currentvid != ""){
				if(document.getElementById(currentvid))				{
					document.getElementById(currentvid).style.backgroundColor = 'transparent';
					document.getElementById(currentvid+"1").style.border='3px solid black';
				}
			}
			currentvid = vidid;
		
			document.getElementById(vidid).style.backgroundColor = '#f1b1b4';
			document.getElementById(vidid+"1").style.border='3px solid red';
	
			vidid = vidid.substring(0,vidid.lastIndexOf("_"));
		
			if(ytplayer) {
				ytplayer.loadVideoById(vidid);
			}
		}
	}
	dontplayvideo = "0";

	if (_video_count > Math.floor(Math.random()*5)+5) {
		_video_count = 0;
		$('#bottom-ad').html("");
		$('#bottom-ad').html('\
                                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\
<ins class="adsbygoogle"\
     style="display:inline-block;width:728px;height:90px"\
     data-ad-client="ca-pub-2573654110684813"\
     data-ad-slot="7784187267"></ins>\
<script>\
(adsbygoogle = window.adsbygoogle || []).push({});\
</script>');
	}
}

var looper;
var fulltitle;
function looptitle(){
	fulltitle = document.title;
	clearInterval(looper);
	looper = setInterval('looprunner()',250);	
}

function looprunner(){
	if(document.title == ''){
		document.title = fulltitle;
		clearInterval(looper);
	}else{
		document.title = document.title.substring(1,document.title.length);
	}
}



function onPlayerStateChange(newState) {
	playerStatess = newState;
	newState = newState.data;
	pause(50);
	if(newState == 0){	
		if(document.getElementById(currentvid).nextSibling){
			if(shuffle == "0"){
				loadVideo(document.getElementById(currentvid).nextSibling.id, '0');
			}else{
				loadNextShuffle();
			}	
		}else{
			if(shuffle == "1"){
				loadNextShuffle();
			} else {
				loadVideo(document.getElementById('playlistthumb').children[0].id);
			}
		}
	}
}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

function loadNextShuffle(){
	var kids = [];
	var kid = document.getElementById("playlistdetail").firstChild;
	
	while(kid.nextSibling){
		kids.push(kid.id);
		kid = kid.nextSibling;
	}
	kids.push(kid.id);
	
	var count = Math.floor(Math.random()*kids.length);
	kid = document.getElementById(kids[count]);

	if(kids.length == shufflearray.length){
		resetshuffle();
		loadNextShuffle();
	}else{
		while(shufflearray.contains(kid.id.substring(0,kid.id.lastIndexOf("_")))){
			count = Math.floor(Math.random()*kids.length);
			kid = document.getElementById(kids[count]);
		}
		
		shufflearray.push(kid.id.substring(0,kid.id.lastIndexOf("_")));
		if(showthumb == "1"){
			loadVideo(kid.id+"1", '0');
		}else{
			loadVideo(kid.id, '0');
		}
	}
}

function getVideoId(url){
	var match_start = url.indexOf('=');
	var match_end = url.indexOf('&');
	
	if (match_start) {
		id = url.substring(match_start+1,match_end);
		return id;
	}
}
	
function hitPlayButton(id){
	loadVideo(id, '0');
}

function hitPlayButtonFirst(id){
	addToPlaylist(id, 1);
	if(showthumb == "1"){
		loadVideo(id+"1", '1');
	}else{
		loadVideo(id, '1');
	}
}

function cleartextbox(){
	if(document.getElementById("searchbox").value == "  Search for videos..."){
		document.getElementById("searchbox").value = "";
	}
}

function hitNextButtonFirst(id){
	if (playerStatess == -1) {
		hitPlayButtonFirst(id);
		return;
	}
	addToPlaylist(id, 1);
	if((playerStatess == 5) || (playerStatess == 0) || playerStatess == -1 || (justcleared == "1") || (currentvid == "")){
		if(showthumb == "1"){
			loadVideo(id, '0');
			justcleared = "0";
		}else{
			loadVideo(id, '2');
			justcleared = "0";
		}
	}
}

function deleteFromPlaylist(id){
	dontplayvideo = 0;
	var parent,child;
	if(showthumb == 0){
		if(currentvid == id){
				if(document.getElementById(id).nextSibling){
					loadVideo(document.getElementById(id).nextSibling.id, '0');
				}else{
					ytplayer.stopVideo();
					ytplayer.clearVideo();
				}
		}
	
		parent = document.getElementById("playlistdetail");
		child = document.getElementById(id);
		parent.removeChild(child);
	
		parent = document.getElementById("playlistthumb");
		child = document.getElementById(id+"1");
		parent.removeChild(child);
	}else{
		if(currentvid == id){
				if(document.getElementById(id).nextSibling){
					loadVideo(document.getElementById(id).nextSibling.id, '0');
				}else{
					ytplayer.stopVideo();
					ytplayer.clearVideo();
				}
		}
	
		parent = document.getElementById("playlistthumb");
		child = document.getElementById(id);
		child.parentNode.removeChild(child);
		//parent.removeChild(child);
	
		parent = document.getElementById("playlistdetail");
		child = document.getElementById(id.substring(0, id.length-1));
		child.parentNode.removeChild(child);
		//parent.removeChild(child);
	}
}


function autoSuggest(data) {
	if (inserted) {
		setTimeout(function() {
			inserted = false;
		},600);
		return;
	}
	var b = $('#suggests').length ? $('#suggests') : $('<div></div>');
	if (b.id == undefined) {
		b.blur(function() {
			b[0].style.display = 'none';
		});
		$('body').click(function() {
			b.trigger('blur');
		});
		$('body').append(b);
	}

	b[0].style.display = 'block';
	b[0].id = 'suggests';
	b[0].style.top = '45px';
	b[0].style.position = 'absolute';
	b[0].style.zIndex = 99999;
	b[0].style.left = $('#searchbox').offset().left;
	var results = data[1];
	b[0].innerHTML = '';
	if (!results[0] || !results[0][0]) return;
	b[0].innerHTML = '<ul id="asu">';
	for (var i = 0; i < results.length; i++) {
		b[0].innerHTML += '<li>'+results[i][0]+'</li>';
	}
	b[0].innerHTML += '</ul>';
	b.find('li').click(function() {
		try {
                	_gaq.push(['_trackEvent', 'Event', 'SuggestClick', this.innerHTML]);
        	} catch(e) {
		}
		$('#searchbox').val(this.innerHTML);	
		insertVideos('relevance', 'descending', '1', 'false', 'false');
	});

}

function loadplaylistnameurl(name) {
	if (ytplayer && clientLoaded) {
		loadplaylistname(name);
	} else {
		setTimeout(function() {
			loadplaylistnameurl(name);
		}, 50);
	}
}

$(document).ready(function() {
	try {
		var url = location.search.replace('?', '');
		var params = url.split('&');
		for (var i = 0; i < params.length; i++) {
			param = params[i].split('=');
			if(param.length == 2 && param[0] == 'p') {
				loadplaylistnameurl(decodeURIComponent(param[1]));
				break;
			}
		}
	} catch (e) {}

	document.getElementById("playlistdetail").style.display = "none";
	document.getElementById("playlistthumb").style.display = ""; 


	var search_id = 0;
	$('#searchbox').keyup(function(e) {
		var bad = [67, 18, 17, 13, 38, 39, 40, 35, 36, 27, 20];
		for(var i = 0; i < bad.length; i++) {
			if(bad[i] == e.keyCode) {
				return;
			}
		}
		search_id++;
		(function(sid, term){
		setTimeout(function(){
		if (sid !== search_id) return;
		if (term == '') {
			$('#suggests')[0].style.display = 'none';	
			return;
		}
		var script = document.createElement('script');
		script.setAttribute('id', 'jsonScript');
		script.setAttribute('type', 'text/javascript');
		var search_term = term
		script.setAttribute('src', 'http://suggestqueries.google.com/complete/search?hl=en&client=youtube&hjson=t&ds=yt&jsonp=autoSuggest&q='+search_term+'&cp=3');
		document.documentElement.firstChild.appendChild(script);
		}, 50);
		})(search_id, $('#searchbox').val());
	});
});

function clear(){
	var playlistelements = document.getElementById("playlistthumb");
	while(playlistelements.firstChild){
		playlistelements.removeChild(playlistelements.firstChild);
	}

	playlistelements = document.getElementById("playlistdetail");
	while(playlistelements.firstChild){
		playlistelements.removeChild(playlistelements.firstChild);
	}
		
	justcleared = "1";
	currentvid = "";
addedone = false;	
	try {
		ytplayer.stopVideo();
		ytplayer.clearVideo();
	} catch(e) {}
}

//if 0 then add to end of playlist, if 1 then start now and add after current playing
function addToPlaylist(id, first){
	var vidMove = document.getElementById(id);
	vidMove.parentNode.removeChild(vidMove.nextSibling);

	//edit the add button to change to delete button
	var addbt = vidMove.firstChild.firstChild.firstChild.nextSibling.nextSibling;
	addbt.src = '/images/delete-icon.png';
	addbt.title = "Delete From Playlist";
	addbt.onclick = new Function('deleteFromPlaylist(\''+id+'\');');

	//edit playbutton
	var plbt = vidMove.firstChild.firstChild.firstChild;
	plbt.onclick = new Function('hitPlayButton(\''+id+'\');');

	//edit image size
	var vimg = vidMove.firstChild.firstChild.nextSibling;
	vimg.style.width = "75px";
	vimg.className = 'searchlistimgplaylist';

	var tempdiv = document.createElement("div");
	tempdiv.innerHTML = vidMove.innerHTML;
	
	var grpdiv = vidMove.firstChild;
	grpdiv.className = 'searchlistgraphicsplaylist';
	var txtdiv = grpdiv.nextSibling;
	txtdiv.className = 'searchlisttextplaylist';

	//hide more description if it was showing when the user added it to the playlist
	if(txtdiv.firstChild.nextSibling != null){
		removeDescription(txtdiv.firstChild.nextSibling.id);
	}

	//remove playnext button
	var playnextbtn = vidMove.firstChild.firstChild.firstChild.nextSibling;

	vidMove.firstChild.firstChild.removeChild(playnextbtn);
	vidMove.style.width = "100%";
	vidMove.className = "newwidget";

		//trying to make it so when you click more on the details it pushes down like the search results do
		//var divblock = document.createElement('div');
		//	divblock.className = "divblock";
		//	vidMove.appendChild(divblock);

	if(first == 0){
		document.getElementById("playlistdetail").appendChild(vidMove);
	}else{
		if(showthumb == "0"){
			if(currentvid != ""){
				document.getElementById("playlistdetail").insertBefore(vidMove, document.getElementById(currentvid).nextSibling);
			}else{
				document.getElementById("playlistdetail").appendChild(vidMove);
			}
		}else{
			if(currentvid != ""){
				document.getElementById("playlistdetail").insertBefore(vidMove, document.getElementById(currentvid.substring(0, currentvid.length - 1)).nextSibling);
			}else{
				document.getElementById("playlistdetail").appendChild(vidMove);
			}
		}
	}	
	
	tempdiv.id = id;

	//get variables for new img
	var imgid = id + "1";
	var imgrealid = imgid.substring(0,imgid.lastIndexOf("_"));
	var imgsrc = "https://i.ytimg.com/vi/" + imgrealid + "/1.jpg";
	var imgwidth = "75px";
	var imgmouseout = new Function('mouseOutImage(this,"thumbnail");');
	var imgmouseover = new Function('mousOverImage(this,"'+imgrealid+'",2);');
	var imgonclick = new Function('loadVideo("'+imgid+'", \'0\');');
	var imgonclickdiv = 'loadVideo("'+imgid+'", \'0\');';
	var imgtitle = vimg.title;

	var newd = document.createElement("div");
		newd.className = "thumbwidget blah";
		newd.id = imgid;
		newd.style.backgroundImage="url("+imgsrc+")";
		newd.style.margin = '5px';
		newd.style.marginTop = '12px';
		newd.style.height = '56.25px';
		newd.style.width = '75px';
		newd.style.border = '3px solid black';
		
	newd.title = vimg.title;
	tempclass += "a";
	
	if(first == 0){
		document.getElementById("playlistthumb").appendChild(newd);
	}else{	
		if(showthumb == "0"){
			if(currentvid != ""){
				document.getElementById("playlistthumb").insertBefore(newd, document.getElementById(currentvid+"1").nextSibling);
			}else{
				document.getElementById("playlistthumb").appendChild(newd);
			}
		}else{
			if(currentvid != ""){
				document.getElementById("playlistthumb").insertBefore(newd, document.getElementById(currentvid).nextSibling);
			}else{
				document.getElementById("playlistthumb").appendChild(newd);
			}
		}
	}
	
	if(currentvid == "" || ((playerStatess == 5) || (playerStatess == 0) || (playerStatess == -1) || (justcleared == "1")) && first == "0"){
		if(!addedone){	
			addedone = true;
			loadVideo(imgid, '0');
			justcleared = "0";
		}
	}

	$('#'+newd.id).middleBoxButton("Play", imgonclickdiv);
	
	createSorts();
}

var created = false;
function createSorts() {
	if (created) { return; }
	$("#playlistthumb").sortable({
                containment: "#playlistthumb",
		placeholder: false
        });
	$("#playlistthumb").disableSelection();

        $("#playlistdetail").sortable({
                containment: "#playlistdetail",
        });
	$("#playlistdetail").disableSelection();
	created = true;
}

function thumbUpdate(){
	createSorts();
}

function detailUpdate(){
	createSorts();
}

function toDetails(){
	try {
                _gaq.push(['_trackEvent', 'Event', 'toDetails']);
        } catch(e) {

        }
	document.getElementById("thumbnailslink").setAttribute("class", "playlistlinks");
	document.getElementById("detailslink").setAttribute("class", "playlistlinksNow");

	document.getElementById("playlistdetail").style.display = "";
	document.getElementById("playlistthumb").style.display = "none";
	showthumb = "0";
	justswitch = "1";

	var currentviddetails = currentvid.substring(0, currentvid.length-1);
	currentvid = currentvid.substring(0, currentvid.length-1);
}

function toThumbnails(){
	try {
                _gaq.push(['_trackEvent', 'Event', 'toThumbnails']);
        } catch(e) {

        }
	document.getElementById("detailslink").setAttribute("class", "playlistlinks");
	document.getElementById("thumbnailslink").setAttribute("class", "playlistlinksNow");

	document.getElementById("playlistthumb").style.display = "";
	document.getElementById("playlistdetail").style.display = "none";
	showthumb = "1";
	justswitch = "1";

	var currentvidthumb = currentvid + "1";
	currentvid = currentvid+"1";
}

function playNext(){
	if(shuffle == "0"){
		try {
			loadVideo(document.getElementById(currentvid).nextSibling.id);
		} catch(e) {
			loadVideo(document.getElementById('playlistthumb').children[0].id);
		}
	}else{
		loadNextShuffle();	
	}
}

function resetshuffle(){
	shufflearray = [];
}

Array.prototype.contains = function (element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
};

//http://www.yvoschaap.com/
function mousOverImage(name,id,nr){
	if(name){
		imname = name;
	}

	imname.src = "http://img.youtube.com/vi/"+id+"/"+nr+".jpg";
	nr++;
	if(nr > 3){
		nr = 1;
	}
	timer =  setTimeout("mousOverImage(false,'"+id+"',"+nr+");",1000);
}

function mouseOutImage(name,border){
	if(name){
		imname = name;
	}if(timer){
		clearTimeout(timer);
	}
}

function loadCustom(type, value){
	insertVideos('relevance', 'descending', '1', type, value);
}

var inserted = false;
function insertVideos(order, sort, newsearch, type, value){
	inserted = true;
	try {
		_gaq.push(['_trackEvent', 'Event', 'Search', document.getElementById("searchbox").value+'']);
	} catch(e) {

	}
	document.getElementById("relevance").setAttribute("class", "sortLink");
	document.getElementById("published").setAttribute("class", "sortLink");
	document.getElementById("viewCount").setAttribute("class", "sortLink");
	document.getElementById("rating").setAttribute("class", "sortLink");
	document.getElementById(order).setAttribute("class", "sortLinkNow");
		
//	var alphaNumExp = /[a-z|A-Z|0-9]+/;
	if(document.getElementById("searchbox").value.length == 0 && newsearch == 1) {//match(alphaNumExp) && newsearch == 1){
		document.getElementById("youtubesearch").innerHTML = 'Please enter a valid search...';
	}else{			
		document.getElementById("youtubesearch").innerHTML = '<img src="images/loading.gif"/>';

		var script = document.createElement('script');
		script.setAttribute('id', 'jsonScript');
		script.setAttribute('type', 'text/javascript');
	
		//variables for search params -- order and search are params
		var searchterm = "";
		if(newsearch == 1){
			searchterm = document.getElementById("searchbox").value;
			lastsearch = searchterm;
		}else{
			searchterm = lastsearch;
		}
			
		var numresults = 50;
		
		if(newsearch == "1"){
			if(type == "author") {
				var search = {
					part: 'snippet',
					contentDetails: 'statistics',
					maxResults: 50,
					channelId: value,
					type: 'video',
					order: 'relevance'
				};
				lastsearchurl = search;
				var request = gapi.client.youtube.search.list(search);
				request.execute(function(response) {
					showVidsAgain(response);
				});
			} else {
				var search = {
					q: searchterm,
					type: 'video',
					contentDetails: 'statistics',
					part: 'snippet',
					maxResults: 50,
					order: 'relevance'
				};
				var request = gapi.client.youtube.search.list(search);
				lastsearchurl = search;
				request.execute(function(response) {
					showVidsAgain(response);
				});
			}
		} else {
			var search = lastsearchurl;
			search['order'] = order;
			var request = gapi.client.youtube.search.list(search);
			request.execute(function(response) {
				showVidsAgain(response);
			});
		}
	}
}

function showVidsAgain(data) {
	divbig = document.getElementById("youtubesearch");
		divbig.innerHTML = "";
	
	var entries = data.items;

	var ul = document.createElement('div');
		ul.setAttribute('id', 'youtubelist');
	if(entries.length > 0){
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];

			var div = formatForPlaylist(entry);
			var li = document.createElement('li');
			ul.appendChild(div);

			var divblock = document.createElement('div');
			divblock.className = "divblock";
			ul.appendChild(divblock);
		}
	}else{
		divbig.innerHTML = 'No Youtube videos found for your query';
	}
		divbig.appendChild(ul);
}

function getYTPold(){
	var usn = prompt("Username to get YouTube Playlists?");
	
	if(usn){
		if(usn != ""){
			var script = document.createElement('script');
			script.setAttribute('id', 'jsonScript');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', 'http://gdata.youtube.com/feeds/api/users/'+usn+'/playlists?v=3&callback=loadYTP&key='+'AI39si7N3V1dFNzfKac9NJFg64LcQUHoGBSviIxQvRY7kBPa0SB5aNhKjKNrhGBKT1oadfIVzXKVO_j8A5HHrV8jjHfJlWg7Fw');
			lastsearchurl = 'http://gdata.youtube.com/feeds/api/users/'+usn+'/playlists?v=3&callback=loadYTP&key='+'AI39si7N3V1dFNzfKac9NJFg64LcQUHoGBSviIxQvRY7kBPa0SB5aNhKjKNrhGBKT1oadfIVzXKVO_j8A5HHrV8jjHfJlWg7Fw';
		
			document.documentElement.firstChild.appendChild(script);
		}
	}
}

function loadYTP(data){
	divbig = document.getElementById("youtubesearch");
	divbig.innerHTML = "Click Playlist Name To Load Playlist";
	
	var start = data.indexOf("<title>")+7;
	while(data.indexOf("<title>",start) != -1){
		start = data.indexOf("<title>", start)+7;
		var newdiv = document.createElement("div");
		newdiv.innerHTML = data.substring(start,data.indexOf("</title>",start));
		newdiv.secretURL = data.substring(data.indexOf("<content type='application/atom+xml;type=feed' src=",start)+52,data.indexOf("/>",data.indexOf("<content type='application/atom+xml;type=feed' src=",start)+52)-1);
		newdiv.onclick = function() { fromYouTubePL(this); };
		newdiv.style.padding = "5px";
		newdiv.style.margin = "5px";
		newdiv.style.backgroundColor = "#339900";
		newdiv.style.cursor = "pointer";
		divbig.appendChild(newdiv);
	}
}

function fromYouTubePL(aelement){
	aelement = aelement.secretURL;
	var script = document.createElement('script');
	script.setAttribute('id', 'jsonScript');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', aelement+'&format=5&alt=json-in-script&callback=showVidsAgain&key='+'AI39si7N3V1dFNzfKac9NJFg64LcQUHoGBSviIxQvRY7kBPa0SB5aNhKjKNrhGBKT1oadfIVzXKVO_j8A5HHrV8jjHfJlWg7Fw');
	lastsearchurl = aelement+'&format=5&alt=json-in-script&callback=showVidsAgain&key='+'AI39si7N3V1dFNzfKac9NJFg64LcQUHoGBSviIxQvRY7kBPa0SB5aNhKjKNrhGBKT1oadfIVzXKVO_j8A5HHrV8jjHfJlWg7Fw';
	document.documentElement.firstChild.appendChild(script);
}

function addDescription(id){
	document.getElementById(id).className = "desdivmore";
	document.getElementById(id+"2").href = 'javascript:removeDescription("'+id+'")';
	document.getElementById(id+"2").innerHTML = "less";
}

function removeDescription(id){
	document.getElementById(id).className = "desdiv";
	document.getElementById(id+"2").href = 'javascript:addDescription("'+id+'")';
	document.getElementById(id+"2").innerHTML = "more";
}

function commaFormatted(amount){
	var delimiter = ","; // replace comma if desired
	var i = amount;
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	var n = "" + i;
	var a = [];
	while(n.length > 3)
	{
		var nn = n.substr(n.length-3);
		a.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	if(n.length > 0){
		a.unshift(n);
	}
	n = a.join(delimiter);
	amount = n; 
	amount = minus + amount;
	return amount;
}

function changecolors(div){
	var color = genHex();
	if(div == "all"){
		color = genHex();
		document.getElementById("playliststuff").style.backgroundColor = "#" + color;
		document.getElementById("playliststufftext").value = "#" + color;
		color = genHex();
		document.getElementById("videoplayer").style.backgroundColor = "#" + color;
		document.getElementById("videoplayertext").value = "#" + color;
		color = genHex();
		document.getElementById("leftside").style.backgroundColor = "#" + color;
		document.getElementById("leftsidetext").value = "#" + color;
		color = genHex();
		document.getElementById("header").style.backgroundColor = "#" + color;
		document.getElementById("headertext").value = "#" + color;
		color = genHex();
		document.getElementById("footer").style.backgroundColor = "#" + color;
		document.getElementById("footertext").value = "#" + color;
		color = genHex();
		document.body.style.backgroundColor = "#" + color;
		document.getElementById("bodytext").value = "#" + color;
	}else{
		if(div == "body"){
			color = genHex();
			document.body.style.backgroundColor = "#" + color;
			document.getElementById("bodytext").value = "#" + color;
		}else{
			color = genHex();
			document.getElementById(div).style.backgroundColor = "#" + color;
			document.getElementById(div+"text").value = "#" + color;
		}
	}
}

function changecolorsc(div){
	if(div == "bodytexta"){
		document.body.style.backgroundColor= document.getElementById(div).value;
	}else{
		document.getElementById(div.substring(0, div.length -5)).style.backgroundColor = document.getElementById(div).value;
	}
}

function genHex(){
	var colors = [];
	colors[0]="0";
	colors[1]="1";
	colors[2]="2";
	colors[3]="3";
	colors[4]="4";
	colors[5]="5";
	colors[5]="6";
	colors[6]="7";
	colors[7]="8";
	colors[8]="9";
	colors[9]="a";
	colors[10]="b";
	colors[11]="c";
	colors[12]="d";
	colors[13]="e";
	colors[14]="f";
	
	var digit = [];
	color="";
	for (var i=0;i<6;i++){
		digit[i]=colors[Math.round(Math.random()*14)];
		color = color+digit[i];
	}

	return color;
}

function saveplaylist(){
	var playlistname = document.getElementById("playlistsavename").value;
	var playlistpassword = document.getElementById("playlistsavepassword").value;
	var playlistdescription = document.getElementById("savetextarea").value;
	
	if(playlistname == "" || playlistpassword == "" || playlistdescription == ""){
		alert("Please fill in all the fields");
	}else{
		var query = "get.php?playlistname=" + escape(playlistname);
		var ajaxRequest = new XMLHttpRequest();
		ajaxRequest.onreadystatechange = function(){
				if(ajaxRequest.readyState == 4){
					var list = ajaxRequest.responseText;
					var listarr = list.split(",");
					if(list.length != 0){
						alert("Sorry, that playlist name already exists.  Please choose a new name");
					}else{
						list = [];

						var myplaylist = document.getElementById("playlistthumb");
						if(!myplaylist.firstChild){
							alert("Please do not save empty playlists!");
							closesave();
						}else{
							var playlistitem = myplaylist.firstChild;
						
							while(playlistitem.nextSibling){
								list.push(playlistitem.id);
								playlistitem = playlistitem.nextSibling;
							}		
							list.push(playlistitem.id);
						
							insertplaylist("insert.php?list="+list.toString()+"&playlistname="+playlistname+"&playlistpassword="+playlistpassword+"&playlistdescription="+playlistdescription);
							alert("Your playlist has been saved");
							closesave();
							document.getElementById("playlistsavename").value = "";
							document.getElementById("playlistsavepassword").value = "";
							document.getElementById("savetextarea").value = "";
						}
					}
				}
		};
		ajaxRequest.open("GET", query, true);
		ajaxRequest.send(null);
	}
}



function updateplaylist(){
	var playlistname = document.getElementById("playlistupdatename").value;
	var playlistpassword = document.getElementById("playlistupdatepassword").value;
	
	if(playlistname == "" || playlistpassword == ""){
		alert("Please fill in all the fields");
	}else{
		var list = [];

		var myplaylist = document.getElementById("playlistthumb");
		if(!myplaylist.firstChild){
			alert("Please do not save empty playlists!");
			closesave();
		}else{
			var playlistitem = myplaylist.firstChild;
			var count = 0;
			
			while(playlistitem.nextSibling){
				count++;
				list.push(playlistitem.id);
				playlistitem = playlistitem.nextSibling;
			}		
			list.push(playlistitem.id);
			
			if(count == 0){
				alert("Please do not save empty playlists!");
				closeload();
			}else{
		
				var query = "update.php?list="+list.toString()+"&playlistname="+playlistname+"&playlistpassword="+playlistpassword;
				var ajaxRequest = new XMLHttpRequest();
					ajaxRequest.onreadystatechange = function(){
							if(ajaxRequest.readyState == 4){
								//alert(ajaxRequest.responseText);
								//break up list by commas and send each to function get data and add to playlist
								var check = ajaxRequest.responseText;
								if(check == "1"){
									alert("Either no playlist with that name exists or you have the wrong password");
								}else{
									alert("Your playlist has been updated");
									closesave();
									document.getElementById("playlistupdatename").value = "";
									document.getElementById("playlistupdatepassword").value = "";
								}
								
							}
					};
					ajaxRequest.open("POST", query, true);
					ajaxRequest.send(null);
			}
		}
	}
}

function insertplaylist(query){
    xmlhttp=new XMLHttpRequest();
	xmlhttp.open("POST", query, true);
	xmlhttp.send(); 
}

function loadplaylist(){
	if(document.getElementById("playlistloadname").value == ""){
		alert("Please enter a playlist name");
	}else{
		loadplaylistname(document.getElementById('playlistloadname').value);
	}
}

function loadplaylistname(name) {
	if (!name) return;
	addedone = false;
	var query = "get.php?playlistname=" + escape(name);
	var ajaxRequest = new XMLHttpRequest();
		ajaxRequest.onreadystatechange = function() {
			if (ajaxRequest.readyState == 4) {
				var list = ajaxRequest.responseText;
				var listarr = list.split(",");
				if (list.length == 0) {
					alert("No playlist with that name exists");
				} else {
					closeload();
					document.getElementById('playlistloadname').value = '';
					clear();
					var ids = [];
					var first = true;
					for (var i = 0; i < listarr.length; i++) {
						var idd = listarr[i];
						idd = idd.substring(0, idd.lastIndexOf("_"));
						ids.push(idd);
						if (ids.length > 30) {
							loadfromdb(ids, first);
							//first = false;
							ids = [];
						}
					}
					loadfromdb(ids, first);
				}
			}
		};
		ajaxRequest.open("GET", query, true);
		ajaxRequest.send(null);
}
	
function loadfromdb(ids, first){
	var idStr = ids.join(",");

	var search = {
        	part: 'snippet',
		id: idStr
        };
        var request = gapi.client.youtube.videos.list(search);
        request.execute(function(response) {
	console.log(response);
                        justone(response);
        });
}

function formatForPlaylist(entry){
	var vidid;
	var thumb = entry.snippet.thumbnails.default.url;
	var vidAuthor = entry.snippet.channelTitle;
	var vidTitle = entry.snippet.title;
	var vidDurationMinutes = "";//"55";//"Math.floor(entry['media$group']['yt$duration'].seconds/60);
	var vidDurationSeconds = "";//20;//entry['media$group']['yt$duration'].seconds % 60;
		if(false && vidDurationSeconds < 10){
			vidDurationSeconds = "0" + vidDurationSeconds;
		}
	var vidDescription = entry.snippet.description;
	var vidDescriptionMore = "";
	var vidDescriptionIsMore = "0";
		if(vidDescription.length > 80){
			vidDescriptionMore = vidDescription.substring(80, vidDescription.length);
			vidDescription = vidDescription.substring(0,80) + "";
			vidDescriptionIsMore = "1";
		}
	var vidViewCount = "";
	try{
		vidViewCount = "";//100;//entry.yt$statistics.viewCount;
	}catch(err){
	}
	//vidViewCount = commaFormatted(vidViewCount);		 

	var div = document.createElement('div');
	var addbutton = document.createElement('img');
	var playbutton = document.createElement('img');
	var nextbutton = document.createElement('img');
	var vidicon = document.createElement('img');
	var textdiv = document.createElement('div');
	var graphicsdiv = document.createElement('div');
	var buttonsdiv = document.createElement('div');
	vidid = (entry.id && entry.id.videoId ? entry.id.videoId : entry.id) + "_" + numid;
		numid++;

	addbutton.src = '/images/add-icon.png';
	addbutton.className = 'removeIcon';
	addbutton.style.width = '25px';
	addbutton.title = "Add To Playlist";
	addbutton.onclick = new Function('addToPlaylist(\''+vidid+'\',"0");');

	nextbutton.src = '/images/next-icon.png';
	nextbutton.className = 'nextIcon';
	nextbutton.style.width = '25px';
	nextbutton.title = "Play Next";
	nextbutton.onclick = new Function('hitNextButtonFirst(\''+vidid+'\');');

	playbutton.src = '/images/play-icon.png';
	playbutton.className = 'playIcon';
	playbutton.style.width = '25px';
	playbutton.title = "Play Now";
	playbutton.onclick = new Function('hitPlayButtonFirst(\''+vidid+'\');');

	buttonsdiv.className = 'searchlistbuttons';
	buttonsdiv.appendChild(playbutton);
	buttonsdiv.appendChild(nextbutton);
	buttonsdiv.appendChild(addbutton);

	graphicsdiv.className = 'searchlistgraphics';
	graphicsdiv.appendChild(buttonsdiv);

	vidicon.className = "searchlistimg";
	vidicon.src = thumb;
	vidicon.title = vidTitle;
	vidicon.style.width = "90px";

	//vidicon.onmouseout = new Function('mouseOutImage(this,"thumbnail");');
	//vidicon.onmouseover = new Function('mousOverImage(this,\''+getVideoId(url)+'\',2);');

	graphicsdiv.appendChild(vidicon);

	div.id = vidid;
	div.className = 'playlistli';
	div.appendChild(graphicsdiv);

	textdiv.className = 'searchlisttext';
	var tempTitle = vidTitle;
		if(tempTitle.length > 42)
			tempTitle = tempTitle.substring(0, 42) + "...";

	var newInner = "<p class=\"desdivmore\"><b>" + tempTitle + "</b><br/>" + vidDescription;
	if(vidDescriptionIsMore == "1"){
		newInner = newInner + '<p class="desdiv" id="'+desdiv+'">' + vidDescriptionMore + "</p> " + "<a id=\'"+desdiv+"2\' href=\'javascript:addDescription(\""+desdiv+"\")\'>" + "more" + "</a>"
	}
	newInner = newInner + "<br /endofdescriptionaus>" + "by " + "<a href=\'javascript:loadCustom(\"author\",\"" + entry.snippet.channelId + "\")\'>" + vidAuthor + "</a>" + " | " + vidDurationMinutes + "" + vidDurationSeconds + " | " + vidViewCount + " " + "</p>";
	
	//ADD HERE TO GET RELATED VIDEOS LINK WORKING???
	//add to line above to add in related vidoes link //   + "<a href=\'javascript:loadCustom(\"related\",\"" + vidid + "\")\'>" + " Related Videos" + "</a>" 
	
	textdiv.innerHTML = newInner;
	desdiv += "b";
	
	div.appendChild(textdiv);
	return div;
}

function justone(data){
	var items = data.items;
	if (!items) return;
	divbig = document.getElementById("youtubesearch");
for (var i = 0; i < items.length; i++) {
	var entry = items[i];
	var ul = document.createElement('div');
	ul.setAttribute('id', 'youtubelist');

		var div = formatForPlaylist(entry);	
		var li = document.createElement('li');
		ul.appendChild(div);

		var divblock = document.createElement('div');
		divblock.className = "divblock";
		ul.appendChild(divblock);

	divbig.appendChild(ul);
	addToPlaylist(div.id, "0");
}
}

function switchtosave(){
	document.getElementById("updateplaylistdiv").style.display="none";
	document.getElementById("saveplaylistdiv").style.display="";
	document.getElementById("savetabbutton").style.height = "28px";
	document.getElementById("updatetabbutton").style.height = "25px";
}

function switchtoupdate(){
	document.getElementById("updateplaylistdiv").style.display="";
	document.getElementById("saveplaylistdiv").style.display="none";
	document.getElementById("savetabbutton").style.height = "25px";
	document.getElementById("updatetabbutton").style.height = "28px";
}

function closesave(){
	switchtosave();
	document.getElementById("updateplaylistdiv").style.display="none";
	document.getElementById("saveplaylistdiv").style.display="none";
	document.getElementById("savebigdiv").style.display="none";
	document.getElementById("savebody").style.display="none";
}

function opensave(){
	try {
                _gaq.push(['_trackEvent', 'Event', 'OpenSave']);
        } catch(e) {

        }
	document.getElementById("saveplaylistdiv").style.display="";
	document.getElementById("savebigdiv").style.display="";
	document.getElementById("savebody").style.display="";
	document.getElementById("updateplaylistdiv").style.display="none";
	jQuery('#playlistsavename').focus();
}

jQuery(window).resize(function() {
	if (window.innerWidth < 1280) {
		jQuery('#addiv').hide();
	} else {
		jQuery('#addiv').show();
	}
});

function closeload(){
	document.getElementById("loadplaylistdiv").style.display="none";
	document.getElementById("savebigdiv").style.display="none";
	document.getElementById("loadbody").style.display="none";
}

function openload(){
	try {
                _gaq.push(['_trackEvent', 'Event', 'OpenLoad']);
        } catch(e) {

        }
	document.getElementById("loadplaylistdiv").style.display="";
	document.getElementById("savebigdiv").style.display="";
	document.getElementById("loadbody").style.display="";
	jQuery('#playlistloadname').focus();
}
		
//Code from http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
	
