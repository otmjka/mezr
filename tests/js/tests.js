$(function () {

  /**
   * Cache elements used in testing.
   */
  var
  wrapper = document.getElementById('test-wrapper'),
  element = document.getElementById('test-element'),
  target = document.getElementById('test-target'),
  container = document.getElementById('test-container');

  /**
   * Define all positions of place method and their expected result.
   */
  var placePositions = [
    {name: 'left top left top', expected: {left: 10, top: 10}},
    {name: 'center top left top', expected: {left: 5, top: 10}},
    {name: 'right top left top', expected: {left: 0, top: 10}},
    {name: 'left center left top', expected: {left: 10, top: 5}},
    {name: 'center center left top', expected: {left: 5, top: 5}},
    {name: 'right center left top', expected: {left: 0, top: 5}},
    {name: 'left bottom left top', expected: {left: 10, top: 0}},
    {name: 'center bottom left top', expected: {left: 5, top: 0}},
    {name: 'right bottom left top', expected: {left: 0, top: 0}},
    {name: 'left top center top', expected: {left: 15, top: 10}},
    {name: 'center top center top', expected: {left: 10, top: 10}},
    {name: 'right top center top', expected: {left: 5, top: 10}},
    {name: 'left center center top', expected: {left: 15, top: 5}},
    {name: 'center center center top', expected: {left: 10, top: 5}},
    {name: 'right center center top', expected: {left: 5, top: 5}},
    {name: 'left bottom center top', expected: {left: 15, top: 0}},
    {name: 'center bottom center top', expected: {left: 10, top: 0}},
    {name: 'right bottom center top', expected: {left: 5, top: 0}},
    {name: 'left top right top', expected: {left: 20, top: 10}},
    {name: 'center top right top', expected: {left: 15, top: 10}},
    {name: 'right top right top', expected: {left: 10, top: 10}},
    {name: 'left center right top', expected: {left: 20, top: 5}},
    {name: 'center center right top', expected: {left: 15, top: 5}},
    {name: 'right center right top', expected: {left: 10, top: 5}},
    {name: 'left bottom right top', expected: {left: 20, top: 0}},
    {name: 'center bottom right top', expected: {left: 15, top: 0}},
    {name: 'right bottom right top', expected: {left: 10, top: 0}},
    {name: 'left top left center', expected: {left: 10, top: 15}},
    {name: 'center top left center', expected: {left: 5, top: 15}},
    {name: 'right top left center', expected: {left: 0, top: 15}},
    {name: 'left center left center', expected: {left: 10, top: 10}},
    {name: 'center center left center', expected: {left: 5, top: 10}},
    {name: 'right center left center', expected: {left: 0, top: 10}},
    {name: 'left bottom left center', expected: {left: 10, top: 5}},
    {name: 'center bottom left center', expected: {left: 5, top: 5}},
    {name: 'right bottom left center', expected: {left: 0, top: 5}},
    {name: 'left top center center', expected: {left: 15, top: 15}},
    {name: 'center top center center', expected: {left: 10, top: 15}},
    {name: 'right top center center', expected: {left: 5, top: 15}},
    {name: 'left center center center', expected: {left: 15, top: 10}},
    {name: 'center center center center', expected: {left: 10, top: 10}},
    {name: 'right center center center', expected: {left: 5, top: 10}},
    {name: 'left bottom center center', expected: {left: 15, top: 5}},
    {name: 'center bottom center center', expected: {left: 10, top: 5}},
    {name: 'right bottom center center', expected: {left: 5, top: 5}},
    {name: 'left top right center', expected: {left: 20, top: 15}},
    {name: 'center top right center', expected: {left: 15, top: 15}},
    {name: 'right top right center', expected: {left: 10, top: 15}},
    {name: 'left center right center', expected: {left: 20, top: 10}},
    {name: 'center center right center', expected: {left: 15, top: 10}},
    {name: 'right center right center', expected: {left: 10, top: 10}},
    {name: 'left bottom right center', expected: {left: 20, top: 5}},
    {name: 'center bottom right center', expected: {left: 15, top: 5}},
    {name: 'right bottom right center', expected: {left: 10, top: 5}},
    {name: 'left top left bottom', expected: {left: 10, top: 20}},
    {name: 'center top left bottom', expected: {left: 5, top: 20}},
    {name: 'right top left bottom', expected: {left: 0, top: 20}},
    {name: 'left center left bottom', expected: {left: 10, top: 15}},
    {name: 'center center left bottom', expected: {left: 5, top: 15}},
    {name: 'right center left bottom', expected: {left: 0, top: 15}},
    {name: 'left bottom left bottom', expected: {left: 10, top: 10}},
    {name: 'center bottom left bottom', expected: {left: 5, top: 10}},
    {name: 'right bottom left bottom', expected: {left: 0, top: 10}},
    {name: 'left top center bottom', expected: {left: 15, top: 20}},
    {name: 'center top center bottom', expected: {left: 10, top: 20}},
    {name: 'right top center bottom', expected: {left: 5, top: 20}},
    {name: 'left center center bottom', expected: {left: 15, top: 15}},
    {name: 'center center center bottom', expected: {left: 10, top: 15}},
    {name: 'right center center bottom', expected: {left: 5, top: 15}},
    {name: 'left bottom center bottom', expected: {left: 15, top: 10}},
    {name: 'center bottom center bottom', expected: {left: 10, top: 10}},
    {name: 'right bottom center bottom', expected: {left: 5, top: 10}},
    {name: 'left top right bottom', expected: {left: 20, top: 20}},
    {name: 'center top right bottom', expected: {left: 15, top: 20}},
    {name: 'right top right bottom', expected: {left: 10, top: 20}},
    {name: 'left center right bottom', expected: {left: 20, top: 15}},
    {name: 'center center right bottom', expected: {left: 15, top: 15}},
    {name: 'right center right bottom', expected: {left: 10, top: 15}},
    {name: 'left bottom right bottom', expected: {left: 20, top: 10}},
    {name: 'center bottom right bottom', expected: {left: 15, top: 10}},
    {name: 'right bottom right bottom', expected: {left: 10, top: 10}}
  ];

  QUnit.testStart(function () {

    wrapper.removeAttribute('style');
    element.removeAttribute('style');
    target.removeAttribute('style');
    container.removeAttribute('style');
    window.scrollTo(0, 0);

  });

  QUnit.module('width/height');

  QUnit.test('element - inner', function (assert) {

    assert.expect(2);

    var
    result = {},
    expected = {};

    element.style.width = '100px';
    element.style.height = '100px';
    element.style.margin = '10px';
    element.style.padding = '10px';
    element.style.border = '10px solid';
    element.style.overflow = 'scroll';

    element.style.boxSizing = 'content-box';
    result.height = mezr.height(element);
    result.width = mezr.width(element);
    expected.height = 100;
    expected.width = 100;
    assert.deepEqual(result, expected, 'content-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element);
    result.width = mezr.width(element);
    expected.height = 60;
    expected.width = 60;
    assert.deepEqual(result, expected, 'border-box');

  });

  QUnit.test('element - with padding', function (assert) {

    assert.expect(2);

    var
    result = {},
    expected = {};

    element.style.width = '100px';
    element.style.height = '100px';
    element.style.margin = '10px';
    element.style.padding = '10px';
    element.style.border = '10px solid';
    element.style.overflow = 'scroll';

    element.style.boxSizing = 'content-box';
    result.height = mezr.height(element, true);
    result.width = mezr.width(element, true);
    expected.height = 120;
    expected.width = 120;
    assert.deepEqual(result, expected, 'content-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, true);
    result.width = mezr.width(element, true);
    expected.height = 80;
    expected.width = 80;
    assert.deepEqual(result, expected, 'border-box');

  });

  QUnit.test('element - with border', function (assert) {

    assert.expect(2);

    var
    result = {},
    expected = {};

    element.style.width = '100px';
    element.style.height = '100px';
    element.style.margin = '10px';
    element.style.padding = '10px';
    element.style.border = '10px solid';
    element.style.overflow = 'scroll';

    element.style.boxSizing = 'content-box';
    result.height = mezr.height(element, false, true);
    result.width = mezr.width(element, false, true);
    expected.height = 120;
    expected.width = 120;
    assert.deepEqual(result, expected, 'content-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, false, true);
    result.width = mezr.width(element, false, true);
    expected.height = 80;
    expected.width = 80;
    assert.deepEqual(result, expected, 'border-box');

  });

  QUnit.test('element - with margin', function (assert) {

    assert.expect(2);

    var
    result = {},
    expected = {};

    element.style.width = '100px';
    element.style.height = '100px';
    element.style.margin = '10px';
    element.style.padding = '10px';
    element.style.border = '10px solid';
    element.style.overflow = 'scroll';

    element.style.boxSizing = 'content-box';
    result.height = mezr.height(element, false, false, true);
    result.width = mezr.width(element, false, false, true);
    expected.height = 120;
    expected.width = 120;
    assert.deepEqual(result, expected, 'content-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, false, false, true);
    result.width = mezr.width(element, false, false, true);
    expected.height = 80;
    expected.width = 80;
    assert.deepEqual(result, expected, 'border-box');

  });

  QUnit.test('element - margin and padding as percentage', function (assert) {

    assert.expect(3);

    var
    result = {},
    expected = {};

    wrapper.style.width = '1000px';
    wrapper.style.height = '1000px';

    element.style.width = '100px';
    element.style.height = '100px';
    element.style.padding = '10%';
    element.style.margin = '10%';
    element.style.border = '10px solid';
    element.style.overflow = 'scroll';

    element.style.boxSizing = 'content-box';
    result.height = mezr.height(element, true, true, true);
    result.width = mezr.width(element, true, true, true);
    expected.height = 520;
    expected.width = 520;
    assert.deepEqual(result, expected, 'content-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element, true, true, true);
    result.width = mezr.width(element, true, true, true);
    expected.height = 420;
    expected.width = 420;
    assert.deepEqual(result, expected, 'border-box');

    element.style.boxSizing = 'border-box';
    result.height = mezr.height(element);
    result.width = mezr.width(element);
    expected.height = 0;
    expected.width = 0;
    assert.deepEqual(result, expected, 'border-box');

  });

  QUnit.module('width/height - docWidth/docHeight');

  QUnit.test('document', function (assert) {

    assert.expect(4);

    element.style.position = 'absolute';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.width = '10000px';
    element.style.height = '10000px';
    element.style.padding = '0px';
    element.style.border = '0px solid';
    element.style.margin = '0px';
    element.style.boxSizing = 'border-box';

    var
    result = {},
    expected = {};

    expected.width = 10000;
    expected.height = 10000;

    result.width = mezr.width(document);
    result.height = mezr.height(document);
    assert.deepEqual(result, expected, 'width/height - without viewport scrollbar');

    result.width = mezr.docWidth();
    result.height = mezr.docHeight();
    assert.deepEqual(result, expected, 'docWidth/docHeight - without viewport scrollbar');

    expected.width = 10000 + window.innerWidth - document.documentElement.clientWidth;
    expected.height = 10000 + window.innerHeight - document.documentElement.clientHeight;

    result.width = mezr.width(document, false, false, false, true);
    result.height = mezr.height(document, false, false, false, true);
    assert.deepEqual(result, expected, 'width/height - with viewport scrollbar');

    result.width = mezr.docWidth(true);
    result.height = mezr.docHeight(true);
    assert.deepEqual(result, expected, 'docWidth/docHeight - with viewport scrollbar');

  });

  QUnit.module('width/height - winWidth/winHeight');

  QUnit.test('window', function (assert) {

    assert.expect(4);

    element.style.position = 'absolute';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.width = '10000px';
    element.style.height = '10000px';
    element.style.padding = '0px';
    element.style.border = '0px solid';
    element.style.margin = '0px';
    element.style.boxSizing = 'border-box';

    var
    result = {},
    expected = {};

    expected.width = document.documentElement.clientWidth;
    expected.height = document.documentElement.clientHeight;

    result.width = mezr.width(window);
    result.height = mezr.height(window);
    assert.deepEqual(result, expected, 'width/height - without viewport scrollbar');

    result.width = mezr.winWidth();
    result.height = mezr.winHeight();
    assert.deepEqual(result, expected, 'winWidth/winHeight - without viewport scrollbar');

    expected.width = window.innerWidth;
    expected.height = window.innerHeight;

    result.width = mezr.width(window, false, false, false, true);
    result.height = mezr.height(window, false, false, false, true);
    assert.deepEqual(result, expected, 'width/height - with viewport scrollbar');

    result.width = mezr.winWidth(true);
    result.height = mezr.winHeight(true);
    assert.deepEqual(result, expected, 'winWidth/winHeight - with viewport scrollbar');

  });

  QUnit.module('offsetParent');

  QUnit.module('offset');

  QUnit.test('default tests', function (assert) {

    assert.expect(18);

    var
    result = {},
    expected = {};

    wrapper.style.position = 'absolute';
    wrapper.style.width = '10000px';
    wrapper.style.height = '10000px';
    wrapper.style.left = '10px';
    wrapper.style.top = '10px';
    wrapper.style.margin = '10px';
    wrapper.style.border = '10px solid';
    wrapper.style.padding = '10px';

    element.style.width = '10px';
    element.style.height = '10px';
    element.style.left = '10px';
    element.style.top = '10px';
    element.style.margin = '10px';
    element.style.border = '10px solid';
    element.style.padding = '10px';

    /*
     * Document.
     */

    window.scrollTo(1000, 1000);

    result = mezr.offset(document);
    expected.left = 0;
    expected.top = 0;
    assert.deepEqual(result, expected, 'document');

    /*
     * Window.
     */

    window.scrollTo(1000, 1000);

    result = mezr.offset(window);
    expected.left = 1000;
    expected.top = 1000;
    assert.deepEqual(result, expected, 'window');

    /*
     * Element - Static positioning.
     */

    window.scrollTo(0, 0);
    element.style.position = 'static';

    result = mezr.offset(element);
    expected.left = 50;
    expected.top = 50;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, false, true);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, true, true);
    expected.left = 70;
    expected.top = 70;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

    /*
     * Element - Relative positioning.
     */

    window.scrollTo(0, 0);
    element.style.position = 'relative';

    result = mezr.offset(element);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 70;
    expected.top = 70;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, false, true);
    expected.left = 70;
    expected.top = 70;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, true, true);
    expected.left = 80;
    expected.top = 80;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

    /*
     * Element - Absolute positioning.
     */

    window.scrollTo(0, 0);
    element.style.position = 'absolute';

    result = mezr.offset(element);
    expected.left = 50;
    expected.top = 50;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, false, true);
    expected.left = 60;
    expected.top = 60;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, true, true);
    expected.left = 70;
    expected.top = 70;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

    /*
     * Element - Fixed positioning.
     */

    window.scrollTo(0, 0);
    element.style.position = 'fixed';

    result = mezr.offset(element);
    expected.left = 20;
    expected.top = 20;
    assert.deepEqual(result, expected, element.style.position + ' positioning - default');

    result = mezr.offset(element, true);
    expected.left = 30;
    expected.top = 30;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding');

    result = mezr.offset(element, false, true);
    expected.left = 30;
    expected.top = 30;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include border');

    result = mezr.offset(element, true, true);
    expected.left = 40;
    expected.top = 40;
    assert.deepEqual(result, expected, element.style.position + ' positioning - include padding and border');

  });

  QUnit.test('element - scroll test - absolute positioning', function (assert) {

    assert.expect(1);
    var
    result = {},
    expected = {};

    wrapper.style.position = 'absolute';
    wrapper.style.width = '10000px';
    wrapper.style.height = '10000px';
    wrapper.style.left = '0px';
    wrapper.style.top = '0px';
    wrapper.style.margin = '0px';
    wrapper.style.border = '0px solid';
    wrapper.style.padding = '0px';

    element.style.position = 'absolute';
    element.style.left = '';
    element.style.top = '';
    element.style.right = '0px';
    element.style.bottom = '0px';
    element.style.margin = '0px';
    element.style.padding = '0px';
    element.style.border = '0px solid';

    window.scrollTo(1000, 1000);

    result = mezr.offset(element);
    expected.left = 9990;
    expected.top = 9990;
    assert.deepEqual(result, expected);

  });

  QUnit.test('element - scroll test - fixed positioning', function (assert) {

    assert.expect(1);
    var
    result = {},
    expected = {};

    wrapper.style.position = 'absolute';
    wrapper.style.width = '10000px';
    wrapper.style.height = '10000px';
    wrapper.style.left = '1000px';
    wrapper.style.top = '1000px';
    wrapper.style.margin = '0px';
    wrapper.style.border = '0px solid';
    wrapper.style.padding = '0px';

    element.style.position = 'fixed';
    element.style.left = '2000px';
    element.style.top = '2000px';
    element.style.margin = '0px';
    element.style.padding = '0px';
    element.style.border = '0px solid';

    window.scrollTo(1000, 1000);

    result = mezr.offset(element);
    expected.left = 3000;
    expected.top = 3000;
    assert.deepEqual(result, expected);

  });

  QUnit.module('place');

  QUnit.test('positions', function (assert) {

    assert.expect(placePositions.length * 3);

    var 
    cssPositions = ['absolute', 'relative', 'fixed'],
    cssPosition;

    for (var i = 0; i < cssPositions.length; i++) {

      cssPosition = cssPositions[i];
      element.style.position = cssPosition;

      for (var ii = 0; ii < placePositions.length; ii++) {

        var 
        val = placePositions[ii],
        valPos = val.name.split(' '),
        my = valPos[0] + ' ' + valPos[1],
        at = valPos[2] + ' ' + valPos[3],
        resultData = mezr.place(element, {
          my: my,
          at: at,
          of: target
        }),
        result = {
          left: resultData.left,
          top: resultData.top
        },
        expected = val.expected,
        explanation = cssPosition + ' - my: ' + my + ' - at: ' + at;

        assert.deepEqual(result, expected, explanation);

      }

    }

  });

});