// apps/web-service/hooks/useShortLink.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { linkService, LinkItem } from "@/services/linkService";

export function useShortLink() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function โหลดข้อมูล
  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await linkService.getLinks();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // โหลดข้อมูลอัตโนมัติเมื่อ mount
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Function สร้างลิงก์
  const createLink = async (url: string, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newLink = await linkService.createShortLink(url, title);
      // อัปเดต State หน้าเว็บทันทีโดยไม่ต้องยิง API get ใหม่ (Optimistic UI)
      setLinks((prev) => [newLink, ...prev]);
      return newLink;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function ลบลิงก์ (เผื่อใช้ในอนาคต)
  const deleteLink = (id: string) => {
      // Logic เรียก Service delete...
      setLinks((prev) => prev.filter(link => link.id !== id));
  }

  return { 
    links, 
    createLink, 
    deleteLink,
    isLoading, 
    error,
    refetch: fetchLinks // เผื่ออยากกดปุ่ม Refresh เอง
  };
}