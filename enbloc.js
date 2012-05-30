Video = function(video) {
	this.video = video;
};

Video.prototype {
	height: function() {
		return this.video.height();
	},

	width: function() {
		return this.video.width();
	},
	
	top: function() {
		return this.video.left();
	},
	
	right: function() {
		return this.video.right();
	},

	bottom: function() {
		return this.video.bottom();
	},

	left: function() {
		return this.video.left();
	},

	lowerThirdHeight: function() {
		return (2 * this.height()) / 3;
	},

	lowerThirdWidth: function() {
		return this.width();
	},

	lowerThirdCaptionHeight: function() {
		return (this.height() - this.lowerThird()) / 2;
	},

	lowerThirdCaptionWidth: function() {
		return this.width() / 2;
	}
};

Caption = function(element, video) {
	this.element = element;
	this.video = video;
	this.initialize();
};

Caption.prototype {
	initialize: function() {}
}

EnBlocPopcorn = function(video, element, html, start, end) {
	this.popcorn = Popcorn(video)
	this.caption = new Caption(element, html);

	this.start = start;
	this.end = end;
};

EnBlocPopcorn.prototype {
	bindCaptionWithTime: function() {
		var self = this;
		this.popcorn.listen('timeupdate', function() { self.showOrHideElement(); });
	},

	showOrHideElement: function() {
		if (this.currentTime() === this.start) {
			element.html(html);
		} else {
			element.empty();
		}

	}
};

EnBloc = function(video) {
	this.video = new Video(video);
};

EnBloc.prototype {
	caption: function() {
		for (var caption in arguments) {
			this.initialize(caption);
		};
	},

	initialize: function(options) {
		this.start = this.setNumericOptions(options.start);
		this.end = this.setNumericOptions(options.end);

		this.fadeIn = this.setNumericOptions(options.fadeIn);
		this.fadeOut = this.setNumericOptions(options.fadeOut);

		this.enBlocPopcorn = new EnBlocPopcorn(this.video.video, this.start, this.end, this.fadeIn, this.fadeOut);
		this.enBlocPopcorn.bindCaptionWithTime();

		this.position = options.position || "footer";
		this.element = this.textOrHTML(options.element);
	},

	setNumericOptions: function(option) {
		option || 0;
	},

	textOrHTML: function(element) {
		if ($(element).length) {
			element.hide(); // don't think this is a good place to put this.
			return element.html();
		} else {
			return element.text();
		}
	}
};