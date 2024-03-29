<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2021-2023 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->

<template>
  <span class="badge" :class="{ [`badge-${variant}`]: variant }" role="presentation">
    <slot>{{ text ? $t(text) : '' }}</slot>
  </span>
</template>

<script>
const VARIANT_TEXT = {
  beta: 'aside-kind.beta',
  deprecated: 'aside-kind.deprecated',
};

export default {
  name: 'Badge',
  props: {
    variant: {
      type: String,
      default: () => '',
    },
  },

  computed: {
    /**
     * Returns text for pre-defined badge types, when there is no default slot.
     * @param variant
     * @return {'Deprecated' | 'Beta'}
     */
    text: ({ variant }) => VARIANT_TEXT[variant],
  },
};
</script>

<style lang="scss" scoped>
@import 'docc-render/styles/_core.scss';

@mixin badge-variation($color) {
  --badge-color: var(--color-badge-#{$color});
  --badge-dark-color: var(--color-badge-dark-#{$color});
}

.badge {
  @include badge-variation(default);

  @include font-styles(badge);
  display: inline-block;
  padding: 2px 4px;
  white-space: nowrap;
  border-radius: var(--badge-border-radius, 1px);
  border-style: var(--badge-border-style, none);
  border-width: var(--badge-border-width, 1px);
  margin: auto;
  margin-left: 5px;
  color: var(--colors-badge-text, var(--color-badge-text));
  background-color: var(--badge-color);
  @include prefers-dark {
    background-color: var(--badge-dark-color);
  }

  &-deprecated {
    @include badge-variation(deprecated);
  }

  &-beta {
    @include badge-variation(beta);
  }
}
</style>
