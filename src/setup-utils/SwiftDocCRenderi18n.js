/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2023 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

import VueI18n from 'vue-i18n';
import * as lang from 'theme/lang/index';

export default function createi18nInstance(config = lang) {
  const { defaultLocale, messages, dateTimeFormats = {} } = config;

  const i18n = new VueI18n({
    dateTimeFormats,
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    messages,
  });

  return i18n;
}
