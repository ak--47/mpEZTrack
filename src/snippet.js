//eztrack snippet
(function () {    
    mpEZTrack = mpEZTrack || function () {
      (mpEZTrack.init = mpEZTrack.init || []).push(arguments);
    };
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
	s.defer = true;	
    s.src = 'http://localhost:3000/eztrack.min.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
