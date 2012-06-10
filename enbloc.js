Video = function(video) {
  this.video = $(video);
};

Video.prototype = {
  play: function() {
    this.video[0].play();
  },

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

EnBloc = function(video) {
  this.video = new Video(video);
};

EnBloc.prototype = {
  captions: function() {
    for (var caption = 0; caption < arguments.length; caption++) {
      this.initialize(arguments[caption]);
    };
  },

  initialize: function(options) {
    var start = this.setNumericOptions(options.start);
    var end = this.setNumericOptions(options.end);

    var fadeIn = this.setSeconds(options.fadeIn);
    var fadeOut = this.setSeconds(options.fadeOut);

    var element = options.element;
    var position = (options.position || "footer");
    var name = options.name;

    this.caption = new EnBlocCaption(name,
                              this.video,
                              element,
                              position,
                              start,
                              end,
                              fadeIn,
                              fadeOut);

    this.build();
  },

  setNumericOptions: function(option) {
    return (option || 0);
  },

  setSeconds: function(option) {
    return this.setNumericOptions(option * 1000);
  },

  build: function() {
    this.caption.insert();
  },

  play: function() {
    this.video.play();
  }
};

EnBlocCaption = function(name, video, element, position, start, end, fadeIn, fadeOut) {
  this.name = name;

  this.video = video;
  this.element = element;
  this.position = position;

  this.start = start;
  this.end = end;

  this.fadeIn = fadeIn;
  this.fadeOut = fadeOut;

  this.initialize();
};

EnBlocCaption.prototype = {
  initialize: function() {
    this.caption = $(this.append($(document.body)));
    this.elementDOM = $(this.element);

    // TODO: Mitigate this proceduralness.
    this.setCaptionStyles();
    this.bindWithTime();
  },

  append: function(documentBody) {
    var captionDiv = "<div class=" + this.name + "></div>";
    documentBody.append(captionDiv);

    return ("." + this.name);
  },

  setCaptionStyles: function() {
    this.isHTML() ? this.setDivStyles() : this.setTextStyles(); 
  },

  isHTML: function(element) {
    return this.elementDOM.length ? true : false;
  },

  setDivStyles: function() {
    var self = this;

    this.caption.css('top', function()  { return self.setTop();  });
    this.caption.css('left', function() { return self.setLeft(); });
  },

  setTextStyles: function() {
    var position = {'z-index': 5000, 'position': 'absolute', 'width': '250px'};
    var text = {'font-size': '30px', 'color': '#eee'};

    this.caption.css(position);
    this.caption.css(text);
  },

  setTop: function() {
    return this.position === this.full ? this.video.top() : this.video.lowerThirdHeight();
  },

  setLeft: function() {
    return this.position === this.full ? this.video.left() : this.video.left();
  },

  bindWithTime: function() {
    var self = this;

    this.video.video.on('timeupdate', function() {
      // TODO: show() and hide() are idempotent, so this is coincidental.
      // Should only be called for unique round numbers because 'timeupdate'
      // doesn't necessarily get fired on 1, 2, 3 etc.
      self.showOrHide(Math.round(this.currentTime));
    });
  },

  showOrHide: function(currentTime) {
    if (currentTime === this.start) 
    {
      this.caption.show(this.fadeIn);
    } 
    else if (currentTime == this.end) 
    {
      this.caption.hide(this.fadeOut);
    }
  },

  insert: function() {
    var element = this.HTMLOrText(this.element);
    this.caption.html(element);

    this.caption.hide();
  },

  HTMLOrText: function(element) {
    return this.isHTML(element) ? this.elementDOM : element;
  }
};
