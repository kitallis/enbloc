Video = function(video) {
  this.video = $(video);
};

Video.prototype = {
  height: function() {
    return this.video.height();
  },

  width: function() {
    return this.video.width();
  },

  top: function() {
    return this.video.position().top;
  },

  right: function() {
    return this.video.position().right;
  },

  bottom: function() {
    return this.video.position().bottom;
  },

  left: function() {
    return this.video.position().left;
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

EnBlocPopcorn = function(popcorn, caption) {
  this.popcorn = popcorn;
  this.caption = caption;
};

EnBlocPopcorn.prototype = {
  bindCaptionWithTime: function() {
    var self = this;
    this.popcorn.on('timeupdate', function() {
      // TODO: show() and hide() are idempotent, so this is coincidental.
      // Should only be called for unique round numbers because 'timeupdate'
      // doesn't necessarily get fired on 1, 2, 3 etc.
      self.caption.showOrHide(Math.round(this.currentTime()));
    });
  }
};

EnBloc = function(video) {
  this.video = new Video(video);
  this.popcorn = new Popcorn(video);
};

EnBloc.prototype = {
  caption: function() {
    for (var caption = 0; caption < arguments.length; caption++) {
      this.initialize(arguments[caption]);
    };
  },

  initialize: function(options) {
    var start = this.setNumericOptions(options.start);
    var end = this.setNumericOptions(options.end);

    var fadeIn = this.setNumericOptions(options.fadeIn);
    var fadeOut = this.setNumericOptions(options.fadeOut);

    var element = options.element;
    var position = (options.position || "footer");
    var captionClass = options.caption;

    var caption = new Caption(this.video,
                              element,
                              position,
                              captionClass,
                              start,
                              end,
                              fadeIn,
                              fadeOut);
    var enBlocPopcorn = new EnBlocPopcorn(this.popcorn, caption);
    enBlocPopcorn.bindCaptionWithTime();
  },

  setNumericOptions: function(option) {
    return (option || 0);
  },

  play: function() {
    this.popcorn.play();
  }
};

Caption = function(video, element, position, captionClass, start, end, fadeIn, fadeOut) {
  this.video = video;
  this.element = element;
  this.position = position;
  this.captionClass = captionClass;

  this.start = start;
  this.end = end;

  this.fadeIn = fadeIn;
  this.fadeOut = fadeOut;

  this.initialize();
};

Caption.prototype = {
  initialize: function() {
    var documentBody = $(document.body);
    this.enBlocCaption = this.append(documentBody);
    console.log(this.enBlocCaption);

    // Caption positions.
    this.footer = "footer"
    this.full = "full"

    // TODO: Make less procedural.
    // This has too much dependence on prior behavior.
    // Can be delegated to a Caption.Element class.
    this.setEnBlocCaptionStyles();
    this.insertElement();
  },

  append: function(documentBody) {
    var captionDiv = "<div class=" + this.captionClass + "></div>";
    documentBody.append(captionDiv);

    return $("." + this.captionClass);
  },

  setEnBlocCaptionStyles: function() {
    var self = this;

    this.enBlocCaption.css('top', function() { return self.setTop(); });
    //this.enBlocCaption.css('left', function() { return self.setLeft(); });

    if (!this.isHTML(this.element)) {
      this.enBlocCaption.css('background', 'green');
      this.enBlocCaption.css('z-index', 5000);
      this.enBlocCaption.css('position', 'absolute');
      this.enBlocCaption.css('color', '#eee');
      this.enBlocCaption.css('width', '250px');
    }
  },

  setTop: function() {
    return this.position === this.full ? this.video.top() : this.video.lowerThirdHeight();
  },

  setLeft: function() {
    return this.position === this.full ? this.video.left() : this.video.left();
  },

  insertElement: function() {
    var element = this.HTMLOrText(this.element);
    this.enBlocCaption.html(element);

    this.enBlocCaption.hide();
  },

  HTMLOrText: function(element) {
    return this.isHTML(element) ? $(element).html() : element;
  },

  isHTML: function(element) {
    return $(element).length ? true : false;
  },

  // TODO: See EnBlocPopcorn 'timeupdate' event.
  showOrHide: function(currentTime) {
    if (currentTime === this.start) {
      this.enBlocCaption.show();
    } else if (currentTime == this.end) {
      this.enBlocCaption.hide();
    }
  }
};
