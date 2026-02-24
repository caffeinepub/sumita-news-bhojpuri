import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface NewsArticle {
    id: string;
    title: string;
    content: string;
    publishDate: Time;
    author: AuthorInfo;
    excerpt: string;
    category: Category;
    imageId?: ExternalBlob;
}
export interface AuthorInfo {
    name: string;
    email: string;
}
export enum Category {
    interview = "interview",
    cinema = "cinema",
    viralNews = "viralNews",
    politics = "politics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(id: string, title: string, content: string, excerpt: string, imageId: ExternalBlob | null, category: Category, author: AuthorInfo): Promise<void>;
    deleteArticle(id: string): Promise<void>;
    getAllArticles(page: bigint, pageSize: bigint): Promise<Array<NewsArticle>>;
    getArticleById(id: string): Promise<NewsArticle>;
    getArticlesByCategory(category: Category): Promise<Array<NewsArticle>>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<string>>;
    getCategoriesInHindi(): Promise<Array<[string, string]>>;
    isCallerAdmin(): Promise<boolean>;
    updateArticle(id: string, title: string, content: string, excerpt: string, imageId: ExternalBlob | null, category: Category, author: AuthorInfo): Promise<void>;
}
