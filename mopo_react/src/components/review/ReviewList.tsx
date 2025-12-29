import {useEffect, useState} from "react"
import axios from "axios"
import {Rating} from "react-simple-star-rating"
import type {Review} from "../../types/review"

interface Props {
    photocardId: number
}

export default function ReviewList({photocardId}: Props) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const resp = await axios.get(
                    `http://localhost:8080/api/photocard/${photocardId}/reviews/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                )
                setReviews(resp.data.reviews)
            } catch (error) {
                console.error("리뷰 불러오기 실패:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [photocardId])

    if (loading) return <p>리뷰 불러오는 중...</p>

    if (reviews.length === 0) {
        return <p className="text-gray-500">아직 등록된 리뷰가 없습니다.</p>
    }

    return (
        <div className="space-y-6 mt-8">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold">{review.nickname}</span>
                        <span className="text-muted small">    {review.createdAt?.slice(0, 10)}  </span>
                    </div>
                    <Rating
                        readonly
                        allowFraction
                        initialValue={review.rating / 2}
                        size={22}
                    />

                    <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                        {review.content}
                    </p>
                </div>
            ))}
        </div>
    )
}
