export interface PhotoCard {
    id: number

    // 아티스트 / 판매자 정보
    artistName: string
    artistType: string
    sellerId: number

    // 기본 정보
    name: string
    limitedFlag: "Y" | "N"
    status: string
    deletedFlag: "Y" | "N"

    // 유형 관련
    photoType: string
    signType: string
    messageFlag: "Y" | "N"
    effectType: string
    coatingType: string
    sizeType: string

    // 크기
    widthMm: number
    heightMm: number
    thicknessMm: number

    // 재질
    material: string
    coatingMaterial: string | null

    // 품질
    conditionGrade: string
    printQuality: string

    // 가격
    basePrice: number
    salePrice: number

    // 재고 / 조회수
    stock: number
    viewCount: number

    // 날짜
    createdAt: string
    updatedAt: string | null

    imageUrl: string
}
