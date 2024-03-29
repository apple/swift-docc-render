<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2022-2024 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->

<template>
  <div
    :class="['documentation-hero', {
      'documentation-hero--disabled': !enhanceBackground,
    }]"
    :style="styles"
  >
    <div class="icon">
      <TopicTypeIcon
        v-if="enhanceBackground"
        :type="type"
        :image-override="iconOverride"
        key="first" class="background-icon first-icon" with-colors
      />
    </div>
    <div class="documentation-hero__above-content">
      <slot name="above-content" />
    </div>
    <div
      class="documentation-hero__content"
      :class="{ 'short-hero': shortHero,
        'extra-bottom-padding': shouldShowLanguageSwitcher,
        'minimized-hero': enableMinimized }">
      <slot />
    </div>
  </div>
</template>

<script>

import TopicTypeIcon from 'docc-render/components/TopicTypeIcon.vue';
import { TopicTypes, TopicTypeAliases } from 'docc-render/constants/TopicTypes';
import { HeroColorsMap, HeroColors } from 'docc-render/constants/HeroColors';
import { TopicRole } from 'docc-render/constants/roles';
import { StandardColors } from 'docc-render/constants/StandardColors';

export default {
  name: 'DocumentationHero',
  components: { TopicTypeIcon },
  props: {
    role: {
      type: String,
      required: true,
    },
    enhanceBackground: {
      type: Boolean,
      required: true,
    },
    enableMinimized: {
      type: Boolean,
      default: false,
    },
    shortHero: {
      type: Boolean,
      required: true,
    },
    shouldShowLanguageSwitcher: {
      type: Boolean,
      required: true,
    },
    iconOverride: {
      type: Object,
      required: false,
    },
    standardColorIdentifier: {
      type: String,
      required: false,
      validator: v => Object.prototype.hasOwnProperty.call(StandardColors, v),
    },
  },
  computed: {
    // get the alias, if any, and fallback to the `teal` color
    color: ({ type }) => HeroColorsMap[TopicTypeAliases[type] || type] || HeroColors.teal,
    styles: ({ color, standardColorIdentifier }) => ({
      // use the color or fallback to the gray secondary, if not defined.
      '--accent-color': `var(--color-documentation-intro-accent, var(--color-type-icon-${color}))`,
      // if a `standardColor` is provided, first try the more specific variant,
      // falling back to the generic color variant.
      '--standard-accent-color': standardColorIdentifier && `var(--color-standard-${standardColorIdentifier}-documentation-intro-fill, var(--color-standard-${standardColorIdentifier}))`,
    }),
    // This mapping is necessary to help create a consistent mapping for the
    // following kinds of things, which are represented as different strings
    // depending on if the data comes from RenderJSON for a page or the
    // navigator.
    type: ({ role }) => {
      switch (role) {
      case TopicRole.collection:
        // map role: "collection" to type: "module"
        return TopicTypes.module;
      case TopicRole.collectionGroup:
        // map role: "collectionGroup" to type: "collection"
        return TopicTypes.collection;
      default:
        return role;
      }
    },
  },
};
</script>

<style scoped lang='scss'>
@import 'docc-render/styles/_core.scss';

// if the page has a `standard` color, it must be used
$doc-hero-gradient-background: var(
    --standard-accent-color,
    // then fallback to a theme-settings color
    var(--color-documentation-intro-fill, var(--color-fill-tertiary))
) !default;
$doc-hero-overlay-background: transparent !default;
$doc-hero-icon-opacity: 0.15 !default;
$doc-hero-icon-dark-opacity: 0.15 !default;
$doc-hero-text-color: var(--color-documentation-intro-figure, var(--color-figure-gray)) !default;
$doc-hero-icon-color: var(
    --color-documentation-intro-accent,
    var(--color-figure-gray-secondary)
) !default;
$doc-hero-icon-effect: normal !default;
$doc-hero-icon-dark-effect: normal !default;
$doc-hero-icon-spacing: 25px;
$doc-hero-icon-vertical-spacing: 10px;
$doc-hero-icon-dimension: 250px;

.documentation-hero {
  color: $doc-hero-text-color;
  overflow: hidden;
  text-align: left;
  position: relative;
  // extra offset applied when OnThisPage component is rendered
  padding-right: var(--doc-hero-right-offset);

  // gradient
  &:before {
    content: '';
    background: $doc-hero-gradient-background;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  // overlay
  &:after {
    background: $doc-hero-overlay-background;
    opacity: 0.85;
    width: 100%;
    position: absolute;
    content: '';
    height: 100%;
    left: 0;
    top: 0;

    @include prefers-dark {
      opacity: 0.55;
    }
  }

  .icon {
    position: absolute;
    margin-top: $doc-hero-icon-vertical-spacing;
    margin-right: $doc-hero-icon-spacing;
    right: 0;
    width: $doc-hero-icon-dimension;
    // create icon box with spacing in hero section
    height: calc(100% - #{$doc-hero-icon-vertical-spacing * 2});
    box-sizing: border-box;

    @include breakpoint(small) {
      display: none;
    }
  }

  .background-icon {
    color: $doc-hero-icon-color;
    display: block;
    width: $doc-hero-icon-dimension;
    height: auto;
    opacity: $doc-hero-icon-opacity;
    mix-blend-mode: $doc-hero-icon-effect;
    position: absolute;
    // center in icon box
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    max-height: 100%;

    :deep(svg), :deep(img) {
      width: 100%;
      height: 100%;
    }

    @include prefers-dark {
      mix-blend-mode: $doc-hero-icon-dark-effect;
      opacity: $doc-hero-icon-dark-opacity;
    }
  }

  &__content:not(.minimized-hero) {
    padding-top: rem(40px);
    padding-bottom: rem(40px);
    position: relative;
    z-index: 1;
    @include dynamic-content-container;
  }

  .minimized-hero {
    padding: 1.3em 1.4em;
    position: relative;
    z-index: 1;
  }

  &__above-content {
    position: relative;
    z-index: 1;
  }
}

.documentation-hero--disabled {
  background: none;
  color: var(--colors-text, var(--color-text));

  &:before {
    content: none;
  }

  &:after {
    content: none;
  }
}

.short-hero {
  // apply extra top and bottom padding for pages with short hero section
  padding-top: rem(60px);
  padding-bottom: rem(60px);
}

.extra-bottom-padding {
  // apply extra bottom padding when shouldShowLanguageSwitcher
  padding-bottom: rem(65px);
}
</style>
