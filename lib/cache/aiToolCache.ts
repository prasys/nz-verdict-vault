
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresIn: number;
}

export class AIToolCache {
    private static instance: AIToolCache;
    private cache: Map<string, CacheEntry<unknown>> = new Map();

    private constructor() { }

    static getInstance(): AIToolCache {
        if (!AIToolCache.instance) {
            AIToolCache.instance = new AIToolCache();
        }
        return AIToolCache.instance;
    }

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > entry.expiresIn) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    set<T>(key: string, data: T, expiresIn: number = 3600000): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresIn
        });
    }

    clear(): void {
        this.cache.clear();
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    getSize(): number {
        return this.cache.size;
    }
} 