import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle } from "../backend.d";
import { getCategoryLabel, getCategoryColor } from "../utils/categories";
import { formatDate } from "../utils/dateFormat";
import { useNavigate } from "@tanstack/react-router";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const navigate = useNavigate();
  const categoryColor = getCategoryColor(article.category);
  const categoryLabel = getCategoryLabel(article.category);
  
  const imageUrl = article.image?.getDirectURL();

  const handleClick = () => {
    navigate({ to: `/article/${article.id}` });
  };

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden border-l-4 transition-all hover:shadow-card animate-fade-in"
      style={{
        borderLeftColor: `oklch(var(--${categoryColor}))`,
      }}
    >
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="space-y-2 pb-3">
        <Badge
          variant="secondary"
          className="w-fit text-xs font-medium"
          style={{
            backgroundColor: `oklch(var(--${categoryColor}) / 0.15)`,
            color: `oklch(var(--${categoryColor}))`,
            border: `1px solid oklch(var(--${categoryColor}) / 0.3)`,
          }}
        >
          {categoryLabel}
        </Badge>
        <h3 className="text-xl font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
          <span className="font-medium">{article.author.name}</span>
          <span>•</span>
          <time>{formatDate(article.publishDate)}</time>
        </div>
      </CardContent>
    </Card>
  );
}
