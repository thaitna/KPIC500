/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Context } from '@nocobase/actions';
// Môi trường server của NocoBase đã có sẵn node-fetch
const fetch = require('node-fetch');

// Địa chỉ API của dịch vụ Ollama bạn đã cài đặt ở Bước 1
const OLLAMA_API_ENDPOINT = 'http://localhost:11434/api/chat';
const MODEL_NAME = 'vistral:7b-chat'; // Sử dụng model Vistral

export default class AiAssistantActions {
  static async suggest(ctx: Context, next: () => Promise<any>) {
    // Lấy mô tả công việc từ body của request
    const { taskDescription } = ctx.request.body as { taskDescription?: string };

    if (!taskDescription || typeof taskDescription !== 'string') {
      ctx.throw(400, 'taskDescription is required');
    }

    // Chuẩn bị câu lệnh (prompt) cho AI
    const prompt = `
      Phân tích mô tả công việc sau đây và trả về một đối tượng JSON với các trường:
      - "skills": một mảng các kỹ năng chính cần thiết (ví dụ: ["React", "Node.js", "PostgreSQL"]).
      - "keywords": một mảng các từ khóa quan trọng của công việc (ví dụ: ["payment gateway", "invoice generation"]).

      Mô tả công việc: "${taskDescription}"

      Lưu ý: Chỉ trả về duy nhất đối tượng JSON, không giải thích gì thêm.
    `;

    try {
      // Gọi đến API của Ollama
      const response = await fetch(OLLAMA_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
          format: 'json', // Yêu cầu Ollama trả về định dạng JSON để đảm bảo tính nhất quán
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API request failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      // Ollama với format=json sẽ trả về nội dung JSON trong result.message.content
      const aiContent = JSON.parse(result.message.content);

      // Trả kết quả phân tích về cho client
      ctx.body = aiContent;
    } catch (error) {
      console.error('Error calling AI service:', error);
      ctx.throw(500, 'Failed to get suggestion from AI service');
    }

    await next();
  }
}
