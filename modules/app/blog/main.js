boot.def('app/blog/main', [], function(exports) {
  var me = {};

  me.open = function () {
    boot.load('core', 'ui/window' , function (core, Window) {
      var target = new Window ({
				title: 'Contact: Morten Olsen',
				resizable: false,
				border: true,
				html: core.ml(function () {/**
					<div class="main" style="padding: 30px">
						loading
					</div>
				**/})
			});
			target.show();
      boot.fetch('get', '/api/blog').then(function (posts) {
        var el = target.el.querySelector('.main');
        el.innerHTML = '';
        for (var i = 0; i < posts.length; i++) {
          var child = document.createElement('div');
          child.innerHTML = core.ml(function () {/**
  					<div>
  					  <h2></h2>
  					</div>
  				**/})
          child.querySelector('h2').innerHTML = posts[i].title;
          el.appendChild(child);
        }
      });
    });
  }

  return me;
});
