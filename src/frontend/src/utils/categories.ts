import { Category } from "../backend.d";

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.cinema]: "भोजपुरी सिनेमा",
  [Category.viralNews]: "वायरल खबर",
  [Category.politics]: "राजनीति",
  [Category.interview]: "इंटरव्यू",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.cinema]: "category-cinema",
  [Category.viralNews]: "category-viral",
  [Category.politics]: "category-politics",
  [Category.interview]: "category-interview",
};

export function getCategoryLabel(category: Category): string {
  return CATEGORY_LABELS[category] || category;
}

export function getCategoryColor(category: Category): string {
  return CATEGORY_COLORS[category] || "primary";
}
