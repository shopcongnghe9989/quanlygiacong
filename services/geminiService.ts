import { GoogleGenAI } from "@google/genai";
import { ProductionLog, Product, Employee } from "../types";

export const getProductionInsights = async (
  logs: ProductionLog[],
  products: Product[],
  employees: Employee[]
): Promise<string> => {
  // Always initialize with named parameter and use process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare data for context
  const context = {
    productionCount: logs.length,
    totalQuantity: logs.reduce((sum, log) => sum + log.quantity, 0),
    topProducts: products.map(p => ({
      name: p.name,
      count: logs.filter(l => l.productId === p.id).reduce((s, l) => s + l.quantity, 0)
    })).sort((a, b) => b.count - a.count).slice(0, 3),
    employeePerformance: employees.map(e => ({
      name: e.name,
      total: logs.filter(l => l.employeeId === e.id).reduce((s, l) => s + l.quantity, 0)
    })).sort((a, b) => b.total - a.total).slice(0, 3)
  };

  const prompt = `
    Dựa trên dữ liệu sản xuất gia công sau đây, hãy viết một bản tóm tắt ngắn gọn (3-4 câu) 
    về hiệu suất sản xuất trong ngày hôm nay. Hãy nêu bật các điểm sáng (nhân viên xuất sắc, 
    mặt hàng chủ lực) và đưa ra 1 lời khuyên quản lý.
    Dữ liệu: ${JSON.stringify(context)}
    Ngôn ngữ: Tiếng Việt, chuyên nghiệp, khích lệ.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Correctly accessing the text property from GenerateContentResponse
    return response.text || "Không thể tải phân tích thông minh vào lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lỗi phân tích từ AI.";
  }
};