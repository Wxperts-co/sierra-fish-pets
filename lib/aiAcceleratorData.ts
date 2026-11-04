import othersAcc from "@/data/ai-accelerator/othersAcc.json";
import servicesAcc from "@/data/ai-accelerator/servicesAcc.json";
import arrivalAcc from "@/data/ai-accelerator/arrivalAcc.json";
import blogsAcc from "@/data/ai-accelerator/blogsAcc.json";
import sierraeduAcc from "@/data/ai-accelerator/sierraeduAcc.json";

export interface AcceleratorPageData {
  page?: string;
  semanticKeynotes?: Record<string, string>;
  nerTags?: Record<string, string[] | string>;
  frontLoadedAeoDirectAnswerSnippet?: {
    title?: string;
    content?: string;
  };
}

export const ALL_ACCELERATOR_DATA: Record<string, AcceleratorPageData> = {
  ...(othersAcc as Record<string, AcceleratorPageData>),
  ...(servicesAcc as Record<string, AcceleratorPageData>),
  ...(arrivalAcc as Record<string, AcceleratorPageData>),
  ...(blogsAcc as Record<string, AcceleratorPageData>),
  ...(sierraeduAcc as Record<string, AcceleratorPageData>),
};

