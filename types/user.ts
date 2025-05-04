export interface User {
    userId: string;
    username: string;
    account: string;
    role: string;
    token: string;
    createTime: string;
    status: string;
    bio: string | null;
    followerCount: number;
    followingCount: number;
    passageCount: number;
    collection: [];
    possession: [];
}
