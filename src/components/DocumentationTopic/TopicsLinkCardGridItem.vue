<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2022 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->

<template>
  <Card
    class="reference-card-grid-item"
    :url="item.url"
    :image="imageReferences.card"
    :title="item.title"
    floating-style
    :size="cardSize"
    :link-text="compact ? '' : $t(linkText)"
  >
    <template v-if="!imageReferences.card" #cover="{ classes }">
      <div :class="classes" class="reference-card-grid-item__image">
        <TopicTypeIcon
          :type="item.role"
          :image-override="references[imageReferences.icon]"
          class="reference-card-grid-item__icon"
        />
      </div>
    </template>
    <ContentNode v-if="!compact" :content="item.abstract" />
  </Card>
</template>

<script>
import Card from 'docc-render/components/Card.vue';
import TopicTypeIcon from 'docc-render/components/TopicTypeIcon.vue';
import { TopicRole } from 'docc-render/constants/roles';
import CardSize from 'docc-render/constants/CardSize';
import referencesProvider from 'docc-render/mixins/referencesProvider';

export const ROLE_LINK_TEXT = {
  [TopicRole.article]: 'documentation.card.read-article',
  [TopicRole.overview]: 'documentation.card.start-tutorial',
  [TopicRole.collection]: 'documentation.card.view-api',
  [TopicRole.symbol]: 'documentation.card.view-symbol',
  [TopicRole.sampleCode]: 'documentation.card.view-sample-code',
};

export default {
  name: 'TopicsLinkCardGridItem',
  components: {
    TopicTypeIcon,
    Card,
    ContentNode: () => import('docc-render/components/ContentNode.vue'),
  },
  mixins: [referencesProvider],
  props: {
    item: {
      type: Object,
      required: true,
    },
    compact: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    imageReferences: ({ item }) => (item.images || []).reduce((all, current) => {
      // eslint-disable-next-line no-param-reassign
      all[current.type] = current.identifier;
      return all;
    }, { icon: null, card: null }),
    linkText: ({ item }) => (ROLE_LINK_TEXT[item.role] || 'documentation.card.learn-more'),
    cardSize: ({ compact }) => (compact ? undefined : CardSize.large),
  },
};
</script>

<style scoped lang='scss'>
@import 'docc-render/styles/_core.scss';

.reference-card-grid-item {
  // ensures card covers are always a 16/9 aspect ratio
  --card-cover-height: auto;

  &.card.large {
    --card-cover-height: auto;
    // .large and .small cards have min/max sizes
    min-width: 0;
    max-width: none;
  }

  :deep(.card-cover) {
    aspect-ratio: 16/9;
  }

  :deep(.card-cover-wrap) {
    border: 1px solid var(--color-link-block-card-border);
  }

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    background-color: var(--color-fill-gray-quaternary);
  }

  &__icon {
    margin: 0;
    display: flex;
    justify-content: center;

    :deep(.icon-inline) {
      flex: 1 1 auto;
    }
  }
}
</style>
