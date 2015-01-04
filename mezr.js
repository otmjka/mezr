/*!
 * mezr.js v0.1.0-beta
 * A lightweight JavaScript library for measuring the position, dimensions and offsets of DOM elements.
 * http://github.com/niklasramo/mezr.js
 * Copyright (c) 2015 Niklas Rämö
 * Released under the MIT license
 */

(function (win, undefined) {
  'use strict';

  var
  lib = 'mezr',
  doc = win.document,
  root = doc.documentElement,
  math = Math,
  abs = math.abs;

  /**
   * Expose public methods to global scope, namespaces using the library name.
   */
  win[lib] = {
    width: getWidth,
    height: getHeight,
    winWidth: getWinWidth,
    winHeight: getWinHeight,
    docWidth: getDocWidth,
    docHeight: getDocHeight,
    offset: getOffset,
    position: getPosition,
    offsetParent: getOffsetParent,
    place: getPlace
  };

  /**
   * Check the type of an object. Returns type of any object in lowercase letters.
   * If comparison type is provided the function will compare the type directly and returns a boolean.
   *
   * @private
   * @param {object} obj
   * @param {string} compareType 
   * @returns {string|boolean} Returns boolean if type is defined.
   */
  function typeOf(obj, compareType) {

    var type = typeof obj;
    type = type === 'object' ? ({}).toString.call(obj).split(' ')[1].replace(']', '').toLowerCase() : type;
    return compareType ? type === compareType : type;

  }

  /**
   * Customized parseFloat function which returns 0 instead of NaN.
   *
   * @private
   * @param {string|number} val
   * @returns {number}
   */
  function toFloat(val) {

    return parseFloat(val) || 0;

  }

  /**
   * Merge (deep) an array of objects into a new object.
   *
   * @private
   * @param {array} array
   * @returns {object}
   */
  function mergeObjects(array) {

    var
    obj = {},
    len = array.length,
    propName,
    propType,
    propVal,
    i;

    for (i = 0; i < len; i++) {
      for (propName in array[i]) {
        if (array[i].hasOwnProperty(propName)) {
          propVal = array[i][propName];
          propType = typeOf(propVal);
          obj[propName] = propType === 'object' ? mergeObjects([propVal]) :
                          propType === 'array'  ? propVal.slice() :
                                                  propVal;
        }
      }
    }

    return obj;

  }

  /**
   * Returns the computed value of an element's style property as a string.
   *
   * @private
   * @param {element} el
   * @param {string} style
   * @returns {string}
   */
  function getStyle(el, style) {

    return win.getComputedStyle(el, null).getPropertyValue(style);

  }

  /**
   * Calculates how much element a overlaps element b from each side.
   *
   * @private
   * @param {number} aWidth
   * @param {number} aHeight
   * @param {number} aOffsetLeft
   * @param {number} aOffsetTop
   * @param {number} bWidth
   * @param {number} bHeight
   * @param {number} bOffsetLeft
   * @param {number} bOffsetTop
   * @returns {object} .left .right .top .bottom
   */
  function calculateOverlap(aWidth, aHeight, aOffsetLeft, aOffsetTop, bWidth, bHeight, bOffsetLeft, bOffsetTop) {

    return {
      left: aOffsetLeft - bOffsetLeft,
      right: (bOffsetLeft + bWidth) - (aOffsetLeft + aWidth),
      top: aOffsetTop - bOffsetTop,
      bottom: (bOffsetTop + bHeight) - (aOffsetTop + aHeight)
    };

  }

  /**
   * Returns an element's northwest offset which in this case means the element's
   * offset in a state where the element's left and top CSS properties are set to 0.
   *
   * @private
   * @param {element} el
   * @returns {object} .left .top
   */
  function getNorthwestOffset(el) {

    var
    position = getStyle(el, 'position'),
    offset,
    left,
    right,
    top,
    bottom;

    if (position === 'relative') {

      /**
       * @todo: In Chrome having top or bottom values applied to relatively positioned root has no effect whatsoever.
       */

      offset = getOffset(el);
      left = getStyle(el, 'left');
      right = getStyle(el, 'right');
      top = getStyle(el, 'top');
      bottom = getStyle(el, 'bottom');

      if (left !== 'auto' || right !== 'auto') {
        offset.left -= left === 'auto' ? -toFloat(right) : toFloat(left);
      }

      if (top !== 'auto' || bottom !== 'auto') {
        offset.top -= top === 'auto' ? -toFloat(bottom) : toFloat(top);
      }

    } else if (position === 'static') {

      offset = getOffset(el);

    } else {

      offset = getOffset(getOffsetParent(el) || doc, 0, 1);

    }

    return offset;

  }

  /**
   * Returns the height or width of an element in pixels (with scrollbar size always included).
   * The function also accepts the window object (for obtaining the viewport dimensions) and
   * the document object (for obtaining the dimensions of the whole document) in place of element.
   * In those special cases the viewport scrollbar size is omitted by default from the return value
   * since more often than not one will want to know the viewport/document dimensions without the
   * viewport scrollbar.
   *
   * @private
   * @param {string} dimension - Accepts "width" or "height".
   * @param {element} el - Accepts any DOM element, the document object and the window object.
   * @param {boolean} [includePadding]
   * @param {boolean} [includeBorder]
   * @param {boolean} [includeMargin]
   * @param {boolean} [includeViewportScrollbar]
   * @returns {number}
   */
  function getDimension(dimension, el, includePadding, includeBorder, includeMargin, includeViewportScrollbar) {

    var
    ret,
    isHeight = dimension === 'height',
    dimensionCapitalized = isHeight ? 'Height' : 'Width',
    innerDimension = 'inner' + dimensionCapitalized,
    clientDimension = 'client' + dimensionCapitalized,
    scrollDimension = 'scroll' + dimensionCapitalized,
    sbSize,
    edgeA,
    edgeB;

    if (el.self === win.self) {

      ret = includeViewportScrollbar ? win[innerDimension] : root[clientDimension];

    }
    else if (el === doc) {

      if (includeViewportScrollbar) {
        sbSize = win[innerDimension] - root[clientDimension];
        ret = math.max(root[scrollDimension] + sbSize, doc.body[scrollDimension] + sbSize, win[innerDimension]);
      } else {
        ret = math.max(root[scrollDimension], doc.body[scrollDimension], root[clientDimension]);
      }

    }
    else {

      ret = el.getBoundingClientRect()[dimension];
      edgeA = isHeight ? 'top' : 'left';
      edgeB = isHeight ? 'bottom' : 'right';

      if (!includePadding) {
        ret -= toFloat(getStyle(el, 'padding-' + edgeA));
        ret -= toFloat(getStyle(el, 'padding-' + edgeB));
      }

      if (!includeBorder) {
        ret -= toFloat(getStyle(el, 'border-' + edgeA + '-width'));
        ret -= toFloat(getStyle(el, 'border-' + edgeB + '-width'));
      }

      if (includeMargin) {
        ret += toFloat(getStyle(el, 'margin-' + edgeA));
        ret += toFloat(getStyle(el, 'margin-' + edgeB));
      }

    }

    return ret;

  }

  /**
   * Returns the width of an element in pixels (with scrollbar width always included).
   * Accepts also the window object (for getting the viewport width) and the document object
   * (for getting the width of the whole document) in place of element. By default viewport
   * scrollbar width is excluded from window/document width, but setting the includeViewportScrollbar
   * flag to true will return window/document width with the viewport scrollbar.
   *
   * @public
   * @alias mezr.width
   * @param {element} el - Accepts any DOM element, the document object and the window object.
   * @param {boolean} [includePadding]
   * @param {boolean} [includeBorder]
   * @param {boolean} [includeMargin]
   * @param {boolean} [includeViewportScrollbar]
   * @returns {number}
   */
  function getWidth(el, includePadding, includeBorder, includeMargin, includeViewportScrollbar) {

    return getDimension('width', el, includePadding, includeBorder, includeMargin, includeViewportScrollbar);

  }

  /**
   * Returns the width of an element in pixels (with scrollbar width always included).
   * Accepts also the window object (for getting the viewport width) and the document object
   * (for getting the width of the whole document) in place of element. By default viewport
   * scrollbar width is excluded from window/document width, but setting the includeViewportScrollbar
   * flag to true will return window/document width with the viewport scrollbar.
   *
   * @public
   * @alias mezr.height
   * @param {element} el - Accepts any DOM element, the document object and the window object.
   * @param {boolean} [includePadding]
   * @param {boolean} [includeBorder]
   * @param {boolean} [includeMargin]
   * @param {boolean} [includeViewportScrollbar]
   * @returns {number}
   */
  function getHeight(el, includePadding, includeBorder, includeMargin, includeViewportScrollbar) {

    return getDimension('height', el, includePadding, includeBorder, includeMargin, includeViewportScrollbar);

  }

  /**
   * Shorthand function for getting the width of the viewport,
   * optionally with the viewport scrollbar size included.
   *
   * @public
   * @alias mezr.winWidth
   * @param {boolean} [includeScrollbar]
   * @returns {number}
   */
  function getWinWidth(includeScrollbar) {

    return getDimension('width', win, 0, 0, 0, includeScrollbar);

  }

  /**
   * Shorthand function for getting the height of the viewport,
   * optionally with the viewport scrollbar size included.
   *
   * @public
   * @alias mezr.winHeight
   * @param {boolean} [includeScrollbar]
   * @returns {number}
   */
  function getWinHeight(includeScrollbar) {

    return getDimension('height', win, 0, 0, 0, includeScrollbar);

  }

  /**
   * Shorthand function for getting the width of the document,
   * optionally with the viewport scrollbar size included.
   *
   * @public
   * @alias mezr.docWidth
   * @param {boolean} [includeScrollbar]
   * @returns {number}
   */
  function getDocWidth(includeScrollbar) {

    return getDimension('width', doc, 0, 0, 0, includeScrollbar);

  }

  /**
   * Shorthand function for getting the height of the document,
   * optionally with the viewport scrollbar size included.
   *
   * @public
   * @alias mezr.docHeight
   * @param {boolean} [includeScrollbar]
   * @returns {number}
   */
  function getDocHeight(includeScrollbar) {

    return getDimension('height', doc, 0, 0, 0, includeScrollbar);

  }

  /**
   * Returns the element's offset which in this case means the element's distance from
   * the northwest corner of the document.
   *
   * @public
   * @alias mezr.offset
   * @param {element} el
   * @param {boolean} [includePadding=false]
   * @param {boolean} [includeBorder=false]
   * @returns {object} .left .top
   */
  function getOffset(el, includePadding, includeBorder) {

    var
    offsetLeft = 0,
    offsetTop = 0,
    viewportScrollLeft = toFloat(win.pageXOffset),
    viewportScrollTop = toFloat(win.pageYOffset),
    gbcr;

    /**
     * For window we just need to get viewport's scroll distance.
     */
    if (el.self === win.self) {

      offsetLeft = viewportScrollLeft;
      offsetTop = viewportScrollTop;

    }

    /**
     * For all elements except the document and window we can use the combination 
     * of gbcr and viewport's scroll distance.
     */
    else if (el !== doc) {

      gbcr = el.getBoundingClientRect();
      offsetLeft += gbcr.left + viewportScrollLeft;
      offsetTop += gbcr.top + viewportScrollTop;

      /*
       * Include padding to the offset.
       */
      if (includePadding) {
        offsetLeft += toFloat(getStyle(el, 'padding-left'));
        offsetTop += toFloat(getStyle(el, 'padding-top'));
      }

      /**
       * Include border width to the offset.
       */
      if (includeBorder) {
        offsetLeft += toFloat(getStyle(el, 'border-left-width'));
        offsetTop += toFloat(getStyle(el, 'border-top-width'));
      }

    }

    return {
      left: offsetLeft,
      top: offsetTop
    };

  }

  /**
   * Returns the element's position which in this case means the element's
   * distance from it's offsetParent element.
   *
   * @public
   * @alias mezr.position
   * @param {element} el
   * @param {boolean} [includeParentPadding=false]
   * @param {boolean} [includeParentBorder=false]
   * @returns {object} .left .top
   */
  function getPosition(el, includeParentPadding, includeParentBorder) {

    var
    position = getOffset(el),
    parentOffset;

    if (el.self !== win.self && el !== doc && el !== root) {
      parentOffset = getOffset(getOffsetParent(el) || doc, includeParentPadding, includeParentBorder);
      position.left -= parentOffset.left;
      position.top -= parentOffset.top;
    }

    return position;

  }

  /**
   * Returns provided element's true offset parent. Accepts window and document objects
   * also. Document is the ground zero offset marker so it does not have an
   * offset parent, ergo it returns null. Window's offset parent is the document.
   *
   * @public
   * @alias mezr.offsetParent
   * @param {element} el
   * @returns {?element}
   */
  function getOffsetParent(el) {

    var
    body = doc.body,
    offsetParent = el === doc ? null : el.offsetParent || doc,
    pos = 'style' in el && getStyle(el, 'position');

    if (pos === 'fixed') {
      offsetParent = win;
    }
    else if (pos === 'absolute') {
      offsetParent = el === body ? root : offsetParent || doc;
      while (offsetParent && 'style' in offsetParent && getStyle(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent === body ? root : offsetParent.offsetParent || doc;
      }
    }

    return offsetParent;

  }

  /**
   * Get position (left and top props) of an element when positioned relative to another element.
   *
   * @public
   * @alias mezr.place
   * @param {element} el
   * @param {object} options
   * @returns {object}
   */
  function getPlace(el, options) {

    var
    o = getPlace._getOptions(el, options),
    collision = o.collision,
    e = getPlace._getElemData(el),
    t = getPlace._getElemData(o.of),
    c = getPlace._getElemData(o.within),
    ret = {
      overlap: null,
      element: e,
      target: t,
      container: c
    };

    /**
     * Add northwest offset data to element data.
     */
    e.northwestOffset = getNorthwestOffset(el);

    /**
     * Calculate element's new position (left/top coordinates).
     */
    ret.left = getPlace._getPosition(o.my[0] + o.at[0], t.width, t.offset.left, e.width, e.northwestOffset.left, o.offsetX);
    ret.top = getPlace._getPosition(o.my[1] + o.at[1], t.height, t.offset.top, e.height, e.northwestOffset.top, o.offsetY);

    /**
     * If container is defined, let's add overlap data and handle collisions.
     */
    if (c !== null) {
      ret.overlap = getPlace._getOverlap(ret, e, c);
      if (collision) {
        ret.left += getPlace._handleCollision(collision, ret.overlap);
        ret.top += getPlace._handleCollision(collision, ret.overlap, 1);
        ret.overlap = getPlace._getOverlap(ret, e, c);
      }
    }

    return ret;

  }

  /**
   * Merges default options with the instance options and also sanitizes the new options.
   *
   * @private
   * @param {element} el
   * @param {object} options
   * @returns {object}
   */
  getPlace._getOptions = function (el, options) {

    var
    defaults = getPlace.defaults,
    optName,
    optType,
    optVal;

    /**
     * Merge user options with default options.
     */
    options = mergeObjects(typeOf(options, 'object') ? [defaults, options] : [defaults]);

    for (optName in options) {

      optVal = options[optName];
      optType = typeOf(optVal);

      /** 
       * If option is declared as a function let's execute it right here.
       */
      if (optType === 'function') {
        options[optName] = optVal(el);
      }

      /**
       * Transform my and at positions into an array using the first character of the position's name.
       * For example, "center top" becomes ["c", "t"].
       */
      if (optName === 'my' || optName === 'at') {
        optVal = optVal.split(' ');
        optVal[0] = optVal[0].charAt(0);
        optVal[1] = optVal[1].charAt(0);
        options[optName] = optVal;
      }

      /**
       * Make sure offsets are numbers.
       */
      if (optName === 'offsetX' || optName === 'offsetY') {
        options[optName] = toFloat(optVal);
      }

      /**
       * Make sure collision is an object or null.
       */
      if (optName === 'collision' && optType !== 'object') {
        options[optName] = null;
      }

    }

    return options;

  };

  /**
   * Returns an object containing the provided element's width height and offset.
   * If element is an array we assume it's a coordinate and treat it a bit differently.
   *
   * @private
   * @param {element} el
   * @returns {object}
   */
  getPlace._getElemData = function (el) {

    var ret = el ? {element: el} : null;

    if (typeOf(el, 'array')) {
      ret.width = 0;
      ret.height = 0;
      ret.offset = getOffset(el[2] || win);
      ret.offset.left += el[0];
      ret.offset.top += el[1];
    }
    else if (el !== null) {
      ret.width = getWidth(el, 1, 1);
      ret.height = getHeight(el, 1, 1);
      ret.offset = getOffset(el);
    }

    return ret;

  };

  /**
   * Returns the horizontal or vertical base position of the element.
   *
   * @param {string} pos The position in the format elementX+targetX (e.g. "lr") or elementY+targetY (e.g. "tb").
   * @param {number} targetSize Target's width or height in pixels.
   * @param {number} targetOffset Target's left or top offset in pixels.
   * @param {number} elementSize Element's width or height in pixels.
   * @param {number} elementNorthwestOffset Element's left or top northwest offset in pixels.
   * @param {number} extraOffset Additional left or top offset in pixels.
   * @returns {number}
   */
  getPlace._getPosition = function (pos, targetSize, targetOffset, elementSize, elementNorthwestOffset, extraOffset) {

    var northwestPoint = targetOffset + extraOffset - elementNorthwestOffset;

    return pos === 'll' || pos === 'tt' ? northwestPoint :
           pos === 'lc' || pos === 'tc' ? northwestPoint + (targetSize / 2) :
           pos === 'lr' || pos === 'tb' ? northwestPoint + targetSize :
           pos === 'cl' || pos === 'ct' ? northwestPoint - (elementSize / 2) :
           pos === 'cr' || pos === 'cb' ? northwestPoint + targetSize - (elementSize / 2) :
           pos === 'rl' || pos === 'bt' ? northwestPoint - elementSize :
           pos === 'rc' || pos === 'bc' ? northwestPoint - elementSize + (targetSize / 2) :
           pos === 'rr' || pos === 'bb' ? northwestPoint - elementSize + targetSize :
                                          northwestPoint + (targetSize / 2) - (elementSize / 2);

  };

  /**
   * A helper function for getPlace function that calculates how much element overlaps the container.
   * Returns an object containing the amount of overlap for each side.
   *
   * @private
   * @param {object} position
   * @param {object} elementData
   * @param {object} containerData
   * @returns {object}
   */
  getPlace._getOverlap = function (position, elementData, containerData) {

    return calculateOverlap(
      elementData.width,
      elementData.height,
      position.left + elementData.northwestOffset.left,
      position.top + elementData.northwestOffset.top,
      containerData.width,
      containerData.height,
      containerData.offset.left,
      containerData.offset.top
    );

  };

  /**
   * Calculates the distance in pixels that the target element needs to be moved in order
   * to be aligned correctly if the target element overlaps with the container.
   *
   * @private
   * @param {object} collision
   * @param {object} elementOverlap
   * @param {boolean} vertical
   * @returns {number}
   */
  getPlace._handleCollision = function (collision, elementOverlap, vertical) {

    var
    ret = 0,
    push = 'push',
    forcePush = 'forcePush',
    side1 = vertical ? 'top' : 'left',
    side2 = vertical ? 'bottom' : 'right',
    side1Collision = collision[side1],
    side2Collision = collision[side2],
    side1Overlap = elementOverlap[side1],
    side2Overlap = elementOverlap[side2],
    sizeDifference = side1Overlap + side2Overlap;

    /** 
     * If pushing is needed from both sides.
     */
    if ((side1Collision === push || side1Collision === forcePush) && (side2Collision === push || side2Collision === forcePush) && (side1Overlap < 0 || side2Overlap < 0)) {

      /**
       * Do push correction from opposite sides with equal force.
       */
      if (side1Overlap < side2Overlap) {
        ret -= sizeDifference < 0 ? side1Overlap + abs(sizeDifference / 2) : side1Overlap;
      }
      if (side2Overlap < side1Overlap) {
        ret += sizeDifference < 0 ? side2Overlap + abs(sizeDifference / 2) : side2Overlap;
      }

      /**
       * Update overlap data.
       */
      side1Overlap += ret;
      side2Overlap -= ret;

      /**
       * Check if left/top side forced push correction is needed.
       */
      if (side1Collision === forcePush && side2Collision != forcePush && side1Overlap < 0) {
        ret -= side1Overlap;
      }

      /**
       * Check if right/top side forced push correction is needed.
       */
      if (side2Collision === forcePush && side1Collision != forcePush && side2Overlap < 0) {
        ret += side2Overlap;
      }

    }

    /**
     * Check if pushing is needed from left or top side only.
     */
    else if ((side1Collision === forcePush || side1Collision === push) && side1Overlap < 0) {
      ret -= side1Overlap;
    }

    /**
     * Check if pushing is needed from right or bottom side only.
     */
    else if ((side2Collision === forcePush || side2Collision === push) && side2Overlap < 0) {
      ret += side2Overlap;
    }

    return ret;

  };

  /**
   * Default options for getPlace.
   */
  getPlace.defaults = {
    my: 'left top',
    at: 'left top',
    of: win,
    within: null,
    offsetX: 0,
    offsetY: 0,
    collision: {
      left: 'none',
      right: 'none',
      top: 'none',
      bottom: 'none'
    }
  };

})(self);