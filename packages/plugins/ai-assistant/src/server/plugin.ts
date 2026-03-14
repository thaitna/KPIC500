/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/server';
import AiAssistantActions from './actions';

export class AiAssistantPlugin extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.resourcer.define({
      name: 'ai-assistant',
      actions: {
        suggest: AiAssistantActions.suggest,
      },
    });
  }

  async install() {
    // TODO
  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default AiAssistantPlugin;
