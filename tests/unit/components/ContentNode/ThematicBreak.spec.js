/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2024 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/
import { shallowMount } from '@vue/test-utils';
import ThematicBreak from 'docc-render/components/ContentNode/ThematicBreak.vue';

describe('ThematicBreak', () => {
  it('renders an <hr> element', () => {
    const wrapper = shallowMount(ThematicBreak);
    const hr = wrapper.find('hr');
    expect(hr.exists()).toBe(true);
    expect(hr.classes('thematic-break')).toBe(true);
  });
});
