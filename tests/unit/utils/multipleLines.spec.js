/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2021 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

import { displaysMultipleLines } from '@/utils/multipleLines';

const lineHeight = 25;

window.getComputedStyle = jest.fn().mockReturnValue({
  lineHeight: `${lineHeight}px`,
});

describe('displaysMultipleLines', () => {
  it('returns false if element\'s height value is lower than the doble of its lineheight value', () => {
    const notMultilineElement = { offsetHeight: lineHeight };
    const notMultilineVueElement = { $el: { offsetHeight: lineHeight } };

    expect(displaysMultipleLines(notMultilineElement)).toBe(false);
    expect(displaysMultipleLines(notMultilineVueElement)).toBe(false);
  });

  it('returns true if element\'s height value is the doble or more than the doble of its lineheight value', () => {
    const multilineElement = { offsetHeight: lineHeight * 2 };
    const multilineVueElement = { $el: { offsetHeight: lineHeight * 2 } };

    expect(displaysMultipleLines(multilineElement)).toBe(true);
    expect(displaysMultipleLines(multilineVueElement)).toBe(true);
  });

  it('calculates internal height without paddings or borders heights if they exist', () => {
    const paddingBottom = 30;
    const paddingTop = 30;
    const borderTopWidth = 2;
    const borderBottomWidth = 2;
    const sumOfExtraHeights = paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
    const heightOfSingleLineWithExtraHeights = lineHeight + sumOfExtraHeights;

    window.getComputedStyle = jest.fn().mockReturnValue({
      lineHeight: `${lineHeight}px`,
      paddingTop: `${paddingTop}px`,
      paddingBottom: `${paddingBottom}px`,
      borderTopWidth: `${borderTopWidth}px`,
      borderBottomWidth: `${borderBottomWidth}px`,
    });

    const multilineElement = { offsetHeight: heightOfSingleLineWithExtraHeights };
    const multilineVueElement = { $el: { offsetHeight: heightOfSingleLineWithExtraHeights } };

    expect(displaysMultipleLines(multilineElement)).toBe(false);
    expect(displaysMultipleLines(multilineVueElement)).toBe(false);
  });

  it('returns false if element\'s height value is 0', () => {
    const notHeightElement = { offsetHeight: 0 };
    const notHeightVueElement = { $el: { offsetHeight: 0 } };

    expect(displaysMultipleLines(notHeightElement)).toBe(false);
    expect(displaysMultipleLines(notHeightVueElement)).toBe(false);
  });

  it('does not error out if element is null', () => {
    const element = null;

    expect(displaysMultipleLines(element)).toBe(false);
  });
});
