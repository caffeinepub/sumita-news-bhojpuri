import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CategoryFilter } from "../components/CategoryFilter";
import { NewsCard } from "../components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllArticles, useGetArticlesByCategory } from "../hooks/useQueries";
import { Category } from "../backend.d";

function NewsCardSkeleton() {
  return (
    <div className="space-y-3 border rounded-lg p-4">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const allArticlesQuery = useGetAllArticles(0, 50);
  const categoryArticlesQuery = useGetArticlesByCategory(selectedCategory);
  
  const { data: articles, isLoading } = selectedCategory 
    ? categoryArticlesQuery 
    : allArticlesQuery;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="flex-1 container py-8">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-2xl font-display font-bold text-muted-foreground mb-2">
              कोई खबर नहीं मिली
            </p>
            <p className="text-muted-foreground">
              {selectedCategory 
                ? "इस श्रेणी में अभी तक कोई खबर नहीं है।" 
                : "अभी तक कोई खबर प्रकाशित नहीं की गई है।"}
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
