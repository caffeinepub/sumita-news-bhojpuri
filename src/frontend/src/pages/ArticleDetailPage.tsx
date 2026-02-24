import { useParams, useNavigate } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useGetArticleById } from "../hooks/useQueries";
import { getCategoryLabel, getCategoryColor } from "../utils/categories";
import { formatDateLong } from "../utils/dateFormat";

function ArticleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function ArticleDetailPage() {
  const { id } = useParams({ from: "/article/$id" });
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useGetArticleById(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <ArticleDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              लेख नहीं मिला
            </h1>
            <p className="text-muted-foreground mb-6">
              क्षमा करें, यह लेख उपलब्ध नहीं है या हटा दिया गया है।
            </p>
            <Button onClick={() => navigate({ to: "/" })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              होम पर जाएं
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryColor = getCategoryColor(article.category);
  const categoryLabel = getCategoryLabel(article.category);
  const imageUrl = article.imageId?.getDirectURL();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <article className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/" })}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            वापस जाएं
          </Button>

          <Badge
            variant="secondary"
            className="w-fit text-sm font-medium"
            style={{
              backgroundColor: `oklch(var(--${categoryColor}) / 0.15)`,
              color: `oklch(var(--${categoryColor}))`,
              border: `1px solid oklch(var(--${categoryColor}) / 0.3)`,
            }}
          >
            {categoryLabel}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground py-4 border-y">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{article.author.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time>{formatDateLong(article.publishDate)}</time>
            </div>
          </div>

          {imageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-card">
              <img
                src={imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>

          <div className="pt-8 border-t">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              और खबरें पढ़ें
            </Button>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
