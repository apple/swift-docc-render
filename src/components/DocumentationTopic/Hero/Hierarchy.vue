<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2021-2024 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->

<template>
  <NavMenuItems
    :aria-label="$t('documentation.nav.breadcrumbs')"
    :class="{ 'has-badge': hasBadge }"
    class="hierarchy"
  >
     <HierarchyItem
      v-if="root"
      :key="root.title"
      class="root-hierarchy"
      :url="addQueryParamsToUrl(root.url)"
    >
      {{ root.title }}
    </HierarchyItem>
    <HierarchyItem
      v-for="topic in collapsibleItems"
      :key="topic.title"
      isCollapsed
      :url="addQueryParamsToUrl(topic.url)"
    >
      {{ topic.title }}
    </HierarchyItem>
    <HierarchyCollapsedItems
      v-if="collapsibleItems.length"
      :topics="collapsibleItems"
    />
    <HierarchyItem
      v-for="topic in nonCollapsibleItems"
      :key="topic.title"
      :url="addQueryParamsToUrl(topic.url)"
    >
      {{ topic.title }}
    </HierarchyItem>
    <HierarchyItem v-if="!smallViewport">
      {{ currentTopicTitle }}
      <template #tags>
        <Badge v-if="isSymbolDeprecated" variant="deprecated" />
        <Badge v-else-if="isSymbolBeta" variant="beta" />
        <Badge
          v-for="badge in currentTopicTags"
          :key="`${badge.type}-${badge.text}`"
          :variant="badge.type"
        >
          {{ badge.text }}
        </Badge>
      </template>
    </HierarchyItem>
  </NavMenuItems>
</template>

<script>
import { buildUrl } from 'docc-render/utils/url-helper';
import NavMenuItems from 'docc-render/components/NavMenuItems.vue';
import Badge from 'docc-render/components/Badge.vue';
import referencesProvider from 'docc-render/mixins/referencesProvider';
import { BreakpointAttributes } from 'docc-render/utils/breakpoints';
import HierarchyCollapsedItems from './HierarchyCollapsedItems.vue';
import HierarchyItem from './HierarchyItem.vue';

/**
 * Generates a list of links, that collapse into a dropdown,
 * if under specific screen sizes or reach a limit.
 *
 * The first link is the Technology link, which is not counted towards the max limit.
 * The last item is not a link, it only shows the current page you are on.
 *
 * @example
 * technology / link_1 / link_2 / link_3 / current_item - beyond 1200
 * technology / [...] / link_1 / link_2 / link_3 / current_item - beyond 1200 + more than 3 links
 * technology / [...] / link_2 / link_3 / current_item - 1000-1200, 3 or more links
 * technology / [...] / link_3 / current_item - 735-1000, 3 or more links
 * [...] / current_item - <= 735 - technology is also pushed to collapsable items
 *
 * In cases where we have tags, like Deprecated or Beta, the max-items is reduced by 1
 * technology / link_2 / link_3 / current_item [Beta] - beyond 1200 with 2 links
 * technology / [...] / link_2 / link_3 / current_item [Beta] - beyond 1200 + more than 2 links
 * technology / [...] / link_2 / current_item [Beta] - 1000-1200, 2 or more links
 * technology / [...] / current_item [Beta] - 735-1000, 2 or more links
 * [...] / current_item - <= 735 - technology is also pushed to collapsable items
 */

// The max number of link items that will initially be visible and uncollapsed w/o
// any user interaction, after the first technology link. If there are more items,
// they will be collapsed into a menu that users need to interact with to see.
const MaxVisibleLinks = 3;

const firstItemSlice = 1;

export default {
  name: 'Hierarchy',
  components: {
    Badge,
    NavMenuItems,
    HierarchyCollapsedItems,
    HierarchyItem,
  },
  constants: {
    MaxVisibleLinks,
  },
  inject: ['store'],
  mixins: [referencesProvider],
  props: {
    isSymbolDeprecated: Boolean,
    isSymbolBeta: Boolean,
    currentTopicTitle: {
      type: String,
      required: true,
    },
    parentTopics: {
      type: Array,
      default: () => [],
    },
    currentTopicTags: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    windowWidth: ({ store }) => store.state.contentWidth,
    root: ({ parentTopics }) => parentTopics[0],
    smallViewport: ({ windowWidth }) => (windowWidth < BreakpointAttributes.default.small.maxWidth),
    /**
     * Figure out how many items we can show, after the collapsed items,
     * based on the content width
     */
    linksAfterCollapse: ({ windowWidth, smallViewport, hasBadge }) => {
      const extraItemsToRemove = hasBadge ? 1 : 0;
      // never show more than the `MaxVisibleLinks`
      if (windowWidth > 1200) return MaxVisibleLinks - extraItemsToRemove;
      if (windowWidth > 1000) return MaxVisibleLinks - 1 - extraItemsToRemove;
      if (!smallViewport) return MaxVisibleLinks - 2 - extraItemsToRemove;
      return 0;
    },
    collapsibleItems: ({
      smallViewport, parentTopics, linksAfterCollapse, currentTopicTitle, $route,
    }) => {
      // if there are links, slice all except those, otherwise get all but the root
      const collapsibleItems = linksAfterCollapse
        ? parentTopics.slice(firstItemSlice, -linksAfterCollapse)
        : parentTopics.slice(firstItemSlice);
      if (smallViewport) {
        collapsibleItems.push({
          title: currentTopicTitle,
          url: $route.path,
        });
      }
      return collapsibleItems;
    },
    nonCollapsibleItems: ({ parentTopics, linksAfterCollapse }) => (
      // if there are links to show, slice them out, otherwise return none
      linksAfterCollapse ? parentTopics.slice(firstItemSlice).slice(-linksAfterCollapse) : []
    ),
    hasBadge: ({ isSymbolDeprecated, isSymbolBeta, currentTopicTags }) => (
      isSymbolDeprecated || isSymbolBeta || currentTopicTags.length
    ),
  },
  methods: {
    addQueryParamsToUrl(url) {
      return buildUrl(url, this.$route.query);
    },
  },
};
</script>
<style scoped lang="scss">
@import 'docc-render/styles/_core.scss';

.hierarchy {
  @include font-styles(body-reduced);
  justify-content: flex-start;
  align-items: center;
  margin: 0 0 rem(20px) 0;
  min-width: 0;
  @include nav-in-breakpoint() {
    margin: 0;
  }

  // make sure the root-hierarchy has a limit as well
  .root-hierarchy .item {
    @include truncate(10rem);
  }
}

// Applies colors to any link inside the nav
:deep(a.nav-menu-link) {
  color: inherit;
  @include underline-text;
}
</style>
