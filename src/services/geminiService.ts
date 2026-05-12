import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const consultProductAI = async (message: string, history: { role: 'user' | 'model', text: string }[], products: Product[]) => {
  const model = "gemini-3-flash-preview";
  
  const productContext = products.map(p => `- ${p.name}: ${p.price.toLocaleString()} VNĐ. Danh mục: ${p.category}. Mô tả: ${p.description}`).join('\n');

  const systemInstruction = `
    Bạn là LUNA DREAM AI - chuyên viên tư vấn trang sức bạc Stellar cao cấp của cửa hàng LUNA DREAM.
    Nhiệm vụ của bạn là tư vấn cho khách hàng về các sản phẩm trang sức bạc liên quan đến mặt trăng, ngôi sao và các hành tinh.
    Gương mặt đại diện cho sự tinh tế, huyền bí và sang trọng.
    
    Hãy sử dụng danh sách sản phẩm sau đây để tư vấn:
    ${productContext}
    
    Quy tắc ứng xử:
    1. Ngôn ngữ: Tiếng Việt, lịch thiệp, gọi khách hàng là "Nàng" hoặc "Quý khách".
    2. Nếu khách hàng hỏi về sản phẩm không có trong danh sách, hãy khéo léo giới thiệu các sản phẩm tương tự đang có.
    3. Trả lời ngắn gọn, súc tích và có tính thẩm mỹ cao (sử dụng icon lấp lánh, trăng sao).
    4. Khuyến khích khách hàng tìm kiếm thêm bằng thanh tìm kiếm nếu cần.
    5. Luôn giữ tinh thần "Stellar Jewelry" - lấp lánh như những vì sao.
  `;

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction,
    },
    // We can't directly pass history in create in this SDK version as per skill, 
    // it says sendMessage accepts message. But Skill says:
    // history is managed by appending to contents in generateContent, but for chat:
    // "starts a chat and sends a message"
    // Actually, searching for history in skill: doesn't show standard way to pass initial history to ai.chats.create.
    // Wait, the skill says:
    // const chat = ai.chats.create({ model, config: { systemInstruction } });
    // let response = await chat.sendMessage({ message: "Hello" });
  });

  // To maintain history, we might need to manually handle it if the SDK doesn't support initial history in chats.create easily.
  // Actually, I'll just use generateContent with full history for simplicity and reliability if chat object is limited.
  // BUT the skill shows chat.sendMessage. 
  // Let's use simple iterative sendMessage if we want a stateful chat, or generateContent for one-off with history.
  
  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
      systemInstruction,
    }
  });

  return response.text || "Xin lỗi Nàng, LUNA DREAM đang lạc giữa những vì sao. Nàng vui lòng thử lại sau nhé! ✨";
};
