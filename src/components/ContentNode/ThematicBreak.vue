<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2024 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->
<template>
  <hr class="thematic-break" />
</template>

<style scoped lang="scss">
@import 'docc-render/styles/_core.scss';

.thematic-break {
  @include space-out-between-siblings(var(--spacing-stacked-margin-xlarge));
  border-top-color: var(--color-grid, currentColor);
  border-top-style: solid;
  border-width: 1px 0 0 0;
}
</style>
