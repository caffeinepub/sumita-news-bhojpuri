import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useGetAllArticles, useIsCallerAdmin, useDeleteArticle } from "../hooks/useQueries";
import { getCategoryLabel, getCategoryColor } from "../utils/categories";
import { formatDate } from "../utils/dateFormat";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: articles, isLoading: loadingArticles } = useGetAllArticles(0, 100);
  const deleteArticle = useDeleteArticle();

  useEffect(() => {
    if (!checkingAdmin && !isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdmin, checkingAdmin, navigate]);

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast.success(`लेख "${title}" सफलतापूर्वक हटाया गया`);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("लेख हटाने में त्रुटि");
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                एडमिन पैनल
              </h1>
              <p className="text-muted-foreground mt-1">
                सभी लेख प्रबंधित करें
              </p>
            </div>
            <Button onClick={() => navigate({ to: "/admin/create" })}>
              <Plus className="mr-2 h-4 w-4" />
              नया लेख
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>सभी लेख</CardTitle>
              <CardDescription>
                प्रकाशित लेखों की सूची देखें और प्रबंधित करें
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingArticles ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : articles && articles.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>शीर्षक</TableHead>
                        <TableHead>श्रेणी</TableHead>
                        <TableHead>लेखक</TableHead>
                        <TableHead>तारीख</TableHead>
                        <TableHead className="text-right">क्रियाएं</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => {
                        const categoryColor = getCategoryColor(article.category);
                        const categoryLabel = getCategoryLabel(article.category);
                        
                        return (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium max-w-xs truncate">
                              {article.title}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{
                                  backgroundColor: `oklch(var(--${categoryColor}) / 0.15)`,
                                  color: `oklch(var(--${categoryColor}))`,
                                  border: `1px solid oklch(var(--${categoryColor}) / 0.3)`,
                                }}
                              >
                                {categoryLabel}
                              </Badge>
                            </TableCell>
                            <TableCell>{article.author.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(article.publishDate)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    navigate({ to: `/admin/edit/${article.id}` })
                                  }
                                  title="संपादित करें"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      title="हटाएं"
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        क्या आप निश्चित हैं?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        यह क्रिया पूर्ववत नहीं की जा सकती। यह लेख
                                        स्थायी रूप से हटा दिया जाएगा।
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>रद्द करें</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDelete(article.id, article.title)
                                        }
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        हटाएं
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    अभी तक कोई लेख नहीं है
                  </p>
                  <Button
                    onClick={() => navigate({ to: "/admin/create" })}
                    className="mt-4"
                  >
                    पहला लेख बनाएं
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
