export interface Review {
    id: number;
    photocardId: number;
    memberId: number;
    nickname: string;
    rating: number; // 0 ~ 10
    content: string;
    createdAt: string;
}