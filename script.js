function utf8_encode ( str_data ) {	// Encodes an ISO-8859-1 string to UTF-8
	//
	// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)

	str_data = str_data.replace(/\r\n/g,"\n");
	var utftext = "";

	for (var n = 0; n < str_data.length; n++) {
		var c = str_data.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}

	return utftext;
}

function md5 ( str ) {	// Calculate the md5 hash of a string
	//
	// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// + namespaced by: Michael White (http://crestidg.com)

	var RotateLeft = function(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		};

	var AddUnsigned = function(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		};

	var F = function(x,y,z) { return (x & y) | ((~x) & z); };
	var G = function(x,y,z) { return (x & z) | (y & (~z)); };
	var H = function(x,y,z) { return (x ^ y ^ z); };
	var I = function(x,y,z) { return (y ^ (x | (~z))); };

	var FF = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

	var GG = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

	var HH = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

	var II = function(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

	var ConvertToWordArray = function(str) {
			var lWordCount;
			var lMessageLength = str.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		};

	var WordToHex = function(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		};

	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;

	str = this.utf8_encode(str);
	x = ConvertToWordArray(str);
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}

	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

	return temp.toLowerCase();
}

//slider javascript
/*! rangeslider.js - v2.0.2 | (c) 2015 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
! function(a) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function(a) {
  "use strict";

  function b() {
    var a = document.createElement("input");
    return a.setAttribute("type", "range"), "text" !== a.type
  }

  function c(a, b) {
    var c = Array.prototype.slice.call(arguments, 2);
    return setTimeout(function() {
      return a.apply(null, c)
    }, b)
  }

  function d(a, b) {
    return b = b || 100,
      function() {
        if (!a.debouncing) {
          var c = Array.prototype.slice.apply(arguments);
          a.lastReturnVal = a.apply(window, c), a.debouncing = !0
        }
        return clearTimeout(a.debounceTimeout), a.debounceTimeout = setTimeout(function() {
          a.debouncing = !1
        }, b), a.lastReturnVal
      }
  }

  function e(a) {
    return a && (0 === a.offsetWidth || 0 === a.offsetHeight || a.open === !1)
  }

  function f(a) {
    for (var b = [], c = a.parentNode; e(c);) b.push(c), c = c.parentNode;
    return b
  }

  function g(a, b) {
    function c(a) {
      "undefined" != typeof a.open && (a.open = a.open ? !1 : !0)
    }
    var d = f(a),
      e = d.length,
      g = [],
      h = a[b];
    if (e) {
      for (var i = 0; e > i; i++) g[i] = d[i].style.cssText, d[i].style.display = "block", d[i].style.height = "0", d[i].style.overflow = "hidden", d[i].style.visibility = "hidden", c(d[i]);
      h = a[b];
      for (var j = 0; e > j; j++) d[j].style.cssText = g[j], c(d[j])
    }
    return h
  }

  function h(a, b) {
    var c = parseFloat(a);
    return Number.isNaN(c) ? b : c
  }

  function i(a) {
    return a.charAt(0).toUpperCase() + a.substr(1)
  }

  function j(b, e) {
    if (this.$window = a(window), this.$document = a(document), this.$element = a(b), this.options = a.extend({}, n, e), this.polyfill = this.options.polyfill, this.orientation = this.$element[0].getAttribute("data-orientation") || this.options.orientation, this.onInit = this.options.onInit, this.onSlide = this.options.onSlide, this.onSlideEnd = this.options.onSlideEnd, this.DIMENSION = o.orientation[this.orientation].dimension, this.DIRECTION = o.orientation[this.orientation].direction, this.DIRECTION_STYLE = o.orientation[this.orientation].directionStyle, this.COORDINATE = o.orientation[this.orientation].coordinate, this.polyfill && m) return !1;
    this.identifier = "js-" + k + "-" + l++, this.startEvent = this.options.startEvent.join("." + this.identifier + " ") + "." + this.identifier, this.moveEvent = this.options.moveEvent.join("." + this.identifier + " ") + "." + this.identifier, this.endEvent = this.options.endEvent.join("." + this.identifier + " ") + "." + this.identifier, this.toFixed = (this.step + "").replace(".", "").length - 1, this.$fill = a('<div class="' + this.options.fillClass + '" />'), this.$handle = a('<div class="' + this.options.handleClass + '" />'), this.$range = a('<div class="' + this.options.rangeClass + " " + this.options[this.orientation + "Class"] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle), this.$element.css({
      position: "absolute",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: "0"
    }), this.handleDown = a.proxy(this.handleDown, this), this.handleMove = a.proxy(this.handleMove, this), this.handleEnd = a.proxy(this.handleEnd, this), this.init();
    var f = this;
    this.$window.on("resize." + this.identifier, d(function() {
      c(function() {
        f.update()
      }, 300)
    }, 20)), this.$document.on(this.startEvent, "#" + this.identifier + ":not(." + this.options.disabledClass + ")", this.handleDown), this.$element.on("change." + this.identifier, function(a, b) {
      if (!b || b.origin !== f.identifier) {
        var c = a.target.value,
          d = f.getPositionFromValue(c);
        f.setPosition(d)
      }
    })
  }
  Number.isNaN = Number.isNaN || function(a) {
    return "number" == typeof a && a !== a
  };
  var k = "rangeslider",
    l = 0,
    m = b(),
    n = {
      polyfill: !0,
      orientation: "horizontal",
      rangeClass: "rangeslider",
      disabledClass: "rangeslider--disabled",
      horizontalClass: "rangeslider--horizontal",
      verticalClass: "rangeslider--vertical",
      fillClass: "rangeslider__fill",
      handleClass: "rangeslider__handle",
      startEvent: ["mousedown", "touchstart", "pointerdown"],
      moveEvent: ["mousemove", "touchmove", "pointermove"],
      endEvent: ["mouseup", "touchend", "pointerup"]
    },
    o = {
      orientation: {
        horizontal: {
          dimension: "width",
          direction: "left",
          directionStyle: "left",
          coordinate: "x"
        },
        vertical: {
          dimension: "height",
          direction: "top",
          directionStyle: "bottom",
          coordinate: "y"
        }
      }
    };
  j.prototype.init = function() {
    this.update(!0, !1), this.$element[0].value = this.value, this.onInit && "function" == typeof this.onInit && this.onInit()
  }, j.prototype.update = function(a, b) {
    a = a || !1, a && (this.min = h(this.$element[0].getAttribute("min"), 0), this.max = h(this.$element[0].getAttribute("max"), 100), this.value = h(this.$element[0].value, this.min + (this.max - this.min) / 2), this.step = h(this.$element[0].getAttribute("step"), 1)), this.handleDimension = g(this.$handle[0], "offset" + i(this.DIMENSION)), this.rangeDimension = g(this.$range[0], "offset" + i(this.DIMENSION)), this.maxHandlePos = this.rangeDimension - this.handleDimension, this.grabPos = this.handleDimension / 2, this.position = this.getPositionFromValue(this.value), this.$element[0].disabled ? this.$range.addClass(this.options.disabledClass) : this.$range.removeClass(this.options.disabledClass), this.setPosition(this.position, b)
  }, j.prototype.handleDown = function(a) {
    if (a.preventDefault(), this.$document.on(this.moveEvent, this.handleMove), this.$document.on(this.endEvent, this.handleEnd), !((" " + a.target.className + " ").replace(/[\n\t]/g, " ").indexOf(this.options.handleClass) > -1)) {
      var b = this.getRelativePosition(a),
        c = this.$range[0].getBoundingClientRect()[this.DIRECTION],
        d = this.getPositionFromNode(this.$handle[0]) - c,
        e = "vertical" === this.orientation ? this.maxHandlePos - (b - this.grabPos) : b - this.grabPos;
      this.setPosition(e), b >= d && b < d + this.handleDimension && (this.grabPos = b - d)
    }
  }, j.prototype.handleMove = function(a) {
    a.preventDefault();
    var b = this.getRelativePosition(a),
      c = "vertical" === this.orientation ? this.maxHandlePos - (b - this.grabPos) : b - this.grabPos;
    this.setPosition(c)
  }, j.prototype.handleEnd = function(a) {
    a.preventDefault(), this.$document.off(this.moveEvent, this.handleMove), this.$document.off(this.endEvent, this.handleEnd), this.$element.trigger("change", {
      origin: this.identifier
    }), this.onSlideEnd && "function" == typeof this.onSlideEnd && this.onSlideEnd(this.position, this.value)
  }, j.prototype.cap = function(a, b, c) {
    return b > a ? b : a > c ? c : a
  }, j.prototype.setPosition = function(a, b) {
    var c, d;
    void 0 === b && (b = !0), c = this.getValueFromPosition(this.cap(a, 0, this.maxHandlePos)), d = this.getPositionFromValue(c), this.$fill[0].style[this.DIMENSION] = d + this.grabPos + "px", this.$handle[0].style[this.DIRECTION_STYLE] = d + "px", this.setValue(c), this.position = d, this.value = c, b && this.onSlide && "function" == typeof this.onSlide && this.onSlide(d, c)
  }, j.prototype.getPositionFromNode = function(a) {
    for (var b = 0; null !== a;) b += a.offsetLeft, a = a.offsetParent;
    return b
  }, j.prototype.getRelativePosition = function(a) {
    var b = i(this.COORDINATE),
      c = this.$range[0].getBoundingClientRect()[this.DIRECTION],
      d = 0;
    return "undefined" != typeof a["page" + b] ? d = a["client" + b] : "undefined" != typeof a.originalEvent["client" + b] ? d = a.originalEvent["client" + b] : a.originalEvent.touches && a.originalEvent.touches[0] && "undefined" != typeof a.originalEvent.touches[0]["client" + b] ? d = a.originalEvent.touches[0]["client" + b] : a.currentPoint && "undefined" != typeof a.currentPoint[this.COORDINATE] && (d = a.currentPoint[this.COORDINATE]), d - c
  }, j.prototype.getPositionFromValue = function(a) {
    var b, c;
    return b = (a - this.min) / (this.max - this.min), c = Number.isNaN(b) ? 0 : b * this.maxHandlePos
  }, j.prototype.getValueFromPosition = function(a) {
    var b, c;
    return b = a / (this.maxHandlePos || 1), c = this.step * Math.round(b * (this.max - this.min) / this.step) + this.min, Number(c.toFixed(this.toFixed))
  }, j.prototype.setValue = function(a) {
    a !== this.value && this.$element.val(a).trigger("input", {
      origin: this.identifier
    })
  }, j.prototype.destroy = function() {
    this.$document.off("." + this.identifier), this.$window.off("." + this.identifier), this.$element.off("." + this.identifier).removeAttr("style").removeData("plugin_" + k), this.$range && this.$range.length && this.$range[0].parentNode.removeChild(this.$range[0])
  }, a.fn[k] = function(b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return this.each(function() {
      var d = a(this),
        e = d.data("plugin_" + k);
      e || d.data("plugin_" + k, e = new j(this, b)), "string" == typeof b && e[b].apply(e, c)
    })
  }
});

//custom slider javascript
var $element = $('input[type="range"]');
var $handle;

$element
  .rangeslider({
    polyfill: false,
    onInit: function() {
      $handle = $('.rangeslider__handle', this.$range);
      updateHandle($handle[0], this.value);
    },
    onSlideEnd: function() {
      var hash = md5($('#passwordWall input').val().toLowerCase());
      $.get('https://taptap.kz/secretforalice/change.php?new='+this.value+'&hash='+hash)
    }
  })
  .on('input', function() {
    updateHandle($handle[0], this.value);
  });

var checkMD5 = function(password) {
  if (md5(password.toLowerCase()).substr(3,8) === 'da2074cb') {
    $.get('https://taptap.kz/secretforalice/current.php?hash=' + md5(password.toLowerCase()), function(resp) {
      $element.val(resp).change();
      $('#passwordWall input').blur();
      $('#passwordWall').css('top', '-400px');
    })
  }
}

function updateHandle(el, val) {
  el.textContent = " " + Number(val).toFixed(2) + "% ";
}
