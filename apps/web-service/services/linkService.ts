// apps/web-service/services/link.service.ts

export interface LinkItem {
    id: string;
    originalUrl: string; 
    shortCode: string;
    title?: string;
    createdAt: string;
    clicks: number;
    lastClick?: string | null; // null ถ้ายังไม่เคยคลิก
  }
  
  // ชี้ไปที่ Go Backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  
  export const linkService = {
    // 1. ดึงข้อมูลทั้งหมด
    getLinks: async (): Promise<LinkItem[]> => {
      const res = await fetch(`${API_BASE_URL}/api/urls`);
      if (!res.ok) throw new Error("Failed to fetch links");
      
      const data = await res.json();
      
      // แปลง Snake Case (Go) -> Camel Case (JS) ที่นี่เลย Component จะได้ไม่ต้องทำเอง
      return data.map((item: any) => ({
        id: item.id,
        originalUrl: item.original_url,
        shortCode: item.short_code,
        title: item.title,
        createdAt: item.created_at,
        clicks: item.clicks || 0, // ใช้ข้อมูลจาก backend
        lastClick: item.last_click || null, // null ถ้ายังไม่เคยคลิก
      }));
    },
  
    // 2. สร้างลิงก์ใหม่
    createShortLink: async (originalUrl: string, title?: string): Promise<LinkItem> => {
      const res = await fetch(`${API_BASE_URL}/api/urls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: originalUrl, title }),
      });
  
      if (!res.ok) throw new Error("Failed to create link");
      
      const newLinkData = await res.json();
      
      // แปลงข้อมูลขากลับทันที
      return {
          id: newLinkData.id,
          originalUrl: newLinkData.original_url,
          shortCode: newLinkData.short_code,
          title: title,
          createdAt: newLinkData.created_at || new Date().toISOString(),
          clicks: newLinkData.clicks || 0,
          lastClick: newLinkData.last_click || null, // null ถ้ายังไม่เคยคลิก
      };
    },
  };