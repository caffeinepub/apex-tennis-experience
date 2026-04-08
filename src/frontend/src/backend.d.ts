import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MatchStats {
    status: MatchStatus;
    player: string;
    score: string;
    setScores: Array<string>;
    opponent: string;
}
export interface Tip {
    id: bigint;
    question: string;
    answer: string;
}
export interface TrainingDrill {
    id: bigint;
    duration: bigint;
    difficulty: DrillDifficulty;
    name: string;
    description: string;
    category: string;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    publishedAt: bigint;
    author: string;
    imageUrl: string;
    excerpt: string;
    category: string;
}
export interface Racket {
    id: bigint;
    weight: number;
    inStock: boolean;
    balance: string;
    name: string;
    description: string;
    imageUrl?: string;
    category: string;
    power: bigint;
    price: number;
}
export interface UserProfile {
    name: string;
}
export enum DrillDifficulty {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum MatchStatus {
    live = "live",
    completed = "completed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRacket(racket: Racket): Promise<void>;
    deleteRacket(id: bigint): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllDrills(): Promise<Array<TrainingDrill>>;
    getAllMatches(): Promise<Array<MatchStats>>;
    getAllRackets(): Promise<Array<Racket>>;
    getAllTips(): Promise<Array<Tip>>;
    getBlogPost(id: bigint): Promise<BlogPost>;
    getBlogPostsByCategory(category: string): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedMatches(): Promise<Array<MatchStats>>;
    getCurrentMatches(): Promise<Array<MatchStats>>;
    getDrill(id: bigint): Promise<TrainingDrill>;
    getDrillsByDifficulty(difficulty: DrillDifficulty): Promise<Array<TrainingDrill>>;
    getRacket(id: bigint): Promise<Racket>;
    getRandomTip(): Promise<Tip>;
    getTip(id: bigint): Promise<Tip>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedData(): Promise<void>;
    updateRacket(racket: Racket): Promise<void>;
}
