<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2021-2024 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->

<template>
  <p class="title"><slot /></p>
</template>

<script>
export default { name: 'Title' };
</script>

<style scoped lang="scss">
@import 'docc-render/styles/_core.scss';

.title {
  color: var(--colors-text, var(--color-text));
  font-size: rem(14px);
  margin-right: 0.5rem;
  text-rendering: optimizeLegibility;
}
</style>
