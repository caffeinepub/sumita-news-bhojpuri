import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { NewsArticle, Category, ExternalBlob, AuthorInfo } from "../backend.d";

export function useGetAllArticles(page: number = 0, pageSize: number = 50) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle[]>({
    queryKey: ["articles", page, pageSize],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticleById(id: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle | null>({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getArticleById(id);
      } catch (error) {
        console.error("Error fetching article:", error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetArticlesByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle[]>({
    queryKey: ["articles", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetCategoriesInHindi() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, string]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategoriesInHindi();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return "guest";
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      excerpt,
      imageId,
      category,
      author,
    }: {
      id: string;
      title: string;
      content: string;
      excerpt: string;
      imageId: ExternalBlob | null;
      category: Category;
      author: AuthorInfo;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createArticle(id, title, content, excerpt, imageId as any, category, author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      excerpt,
      imageId,
      category,
      author,
    }: {
      id: string;
      title: string;
      content: string;
      excerpt: string;
      imageId: ExternalBlob | null;
      category: Category;
      author: AuthorInfo;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateArticle(id, title, content, excerpt, imageId as any, category, author);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", variables.id] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
