import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import {
  useIsCallerAdmin,
  useCreateArticle,
  useUpdateArticle,
  useGetArticleById,
} from "../hooks/useQueries";
import { Category, ExternalBlob } from "../backend.d";
import { getCategoryLabel } from "../utils/categories";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function AdminArticleForm() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const editId = params.id as string | undefined;
  const isEditMode = !!editId;

  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: existingArticle, isLoading: loadingArticle } = useGetArticleById(editId);
  const { identity } = useInternetIdentity();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageBlob, setExistingImageBlob] = useState<ExternalBlob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!checkingAdmin && !isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdmin, checkingAdmin, navigate]);

  useEffect(() => {
    if (isEditMode && existingArticle) {
      setTitle(existingArticle.title);
      setExcerpt(existingArticle.excerpt);
      setContent(existingArticle.content);
      setCategory(existingArticle.category);
      setAuthorName(existingArticle.author.name);
      setAuthorEmail(existingArticle.author.email);
      
      if (existingArticle.imageId) {
        setExistingImageBlob(existingArticle.imageId);
        setImagePreview(existingArticle.imageId.getDirectURL());
      }
    }
  }, [isEditMode, existingArticle]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setExistingImageBlob(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageBlob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !excerpt || !content || !category || !authorName || !authorEmail) {
      toast.error("कृपया सभी आवश्यक फ़ील्ड भरें");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageBlob: ExternalBlob | null = existingImageBlob;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const articleData = {
        id: isEditMode ? editId : `article-${Date.now()}`,
        title,
        content,
        excerpt,
        imageId: imageBlob,
        category: category as Category,
        author: {
          name: authorName,
          email: authorEmail,
        },
      };

      if (isEditMode) {
        await updateArticle.mutateAsync(articleData);
        toast.success("लेख सफलतापूर्वक अपडेट किया गया");
      } else {
        await createArticle.mutateAsync(articleData);
        toast.success("लेख सफलतापूर्वक बनाया गया");
      }

      navigate({ to: "/admin" });
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error(isEditMode ? "लेख अपडेट करने में त्रुटि" : "लेख बनाने में त्रुटि");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (checkingAdmin || (isEditMode && loadingArticle)) {
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
        <div className="max-w-3xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/admin" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            वापस जाएं
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-display">
                {isEditMode ? "लेख संपादित करें" : "नया लेख बनाएं"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? "मौजूदा लेख को अपडेट करें"
                  : "एक नया समाचार लेख प्रकाशित करें"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">शीर्षक *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="खबर का शीर्षक"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">सारांश *</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="खबर का संक्षिप्त सारांश (2-3 वाक्य)"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">पूरा लेख *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="पूरी खबर का विवरण लिखें..."
                    rows={12}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">श्रेणी *</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as Category)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="श्रेणी चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Category.cinema}>
                        {getCategoryLabel(Category.cinema)}
                      </SelectItem>
                      <SelectItem value={Category.viralNews}>
                        {getCategoryLabel(Category.viralNews)}
                      </SelectItem>
                      <SelectItem value={Category.politics}>
                        {getCategoryLabel(Category.politics)}
                      </SelectItem>
                      <SelectItem value={Category.interview}>
                        {getCategoryLabel(Category.interview)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="authorName">लेखक का नाम *</Label>
                    <Input
                      id="authorName"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="लेखक का नाम"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorEmail">लेखक का ईमेल *</Label>
                    <Input
                      id="authorEmail"
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>मुख्य चित्र</Label>
                  {imagePreview ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <Label
                        htmlFor="image"
                        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                      >
                        चित्र अपलोड करने के लिए क्लिक करें
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <Label>अपलोड प्रगति</Label>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploadProgress > 0 ? "अपलोड हो रहा है..." : "सहेजा जा रहा है..."}
                      </>
                    ) : isEditMode ? (
                      "अपडेट करें"
                    ) : (
                      "प्रकाशित करें"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: "/admin" })}
                    disabled={isSubmitting}
                  >
                    रद्द करें
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
