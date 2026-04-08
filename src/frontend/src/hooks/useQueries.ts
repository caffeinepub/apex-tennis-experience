import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BlogPost,
  MatchStats,
  Racket,
  Tip,
  TrainingDrill,
} from "../backend.d";
import { useActor } from "./useActor";

export function useRackets() {
  const { actor, isFetching } = useActor();
  return useQuery<Racket[]>({
    queryKey: ["rackets"],
    queryFn: async () => {
      if (!actor) return [];
      const rackets = await actor.getAllRackets();
      if (rackets.length === 0) {
        await actor.seedData();
        return actor.getAllRackets();
      }
      return rackets;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRacket(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Racket>({
    queryKey: ["racket", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getRacket(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllBlogPosts();
      if (posts.length === 0) {
        await actor.seedData();
        return actor.getAllBlogPosts();
      }
      return posts;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlogPost(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost>({
    queryKey: ["blogPost", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlogPostsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllBlogPosts();
      return actor.getBlogPostsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrainingDrills() {
  const { actor, isFetching } = useActor();
  return useQuery<TrainingDrill[]>({
    queryKey: ["drills"],
    queryFn: async () => {
      if (!actor) return [];
      const drills = await actor.getAllDrills();
      if (drills.length === 0) {
        await actor.seedData();
        return actor.getAllDrills();
      }
      return drills;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCurrentMatches() {
  const { actor, isFetching } = useActor();
  return useQuery<MatchStats[]>({
    queryKey: ["currentMatches"],
    queryFn: async () => {
      if (!actor) return [];
      const matches = await actor.getCurrentMatches();
      if (matches.length === 0) {
        await actor.seedData();
        return actor.getCurrentMatches();
      }
      return matches;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useTips() {
  const { actor, isFetching } = useActor();
  return useQuery<Tip[]>({
    queryKey: ["tips"],
    queryFn: async () => {
      if (!actor) return [];
      const tips = await actor.getAllTips();
      if (tips.length === 0) {
        await actor.seedData();
        return actor.getAllTips();
      }
      return tips;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRandomTip() {
  const { actor } = useActor();
  return useQuery<Tip>({
    queryKey: ["randomTip"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getRandomTip();
    },
    enabled: false, // Manual trigger only
  });
}

export function useIsAdmin() {
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

export function useCreateRacket() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (racket: Racket) => {
      if (!actor) throw new Error("No actor");
      return actor.createRacket(racket);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rackets"] }),
  });
}

export function useUpdateRacket() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (racket: Racket) => {
      if (!actor) throw new Error("No actor");
      return actor.updateRacket(racket);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rackets"] }),
  });
}

export function useDeleteRacket() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteRacket(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rackets"] }),
  });
}
