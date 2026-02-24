import { Button } from "@/components/ui/button";
import { Category } from "../backend.d";
import { getCategoryLabel } from "../utils/categories";

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { value: null, label: "सभी खबरें" },
    { value: Category.cinema, label: getCategoryLabel(Category.cinema) },
    { value: Category.viralNews, label: getCategoryLabel(Category.viralNews) },
    { value: Category.politics, label: getCategoryLabel(Category.politics) },
    { value: Category.interview, label: getCategoryLabel(Category.interview) },
  ];

  return (
    <nav className="w-full border-b bg-card">
      <div className="container">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.label}
              variant={selectedCategory === cat.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(cat.value)}
              className="whitespace-nowrap font-medium"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
