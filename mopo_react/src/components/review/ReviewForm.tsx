import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { Rating } from "react-simple-star-rating"
import { useAuthGuard } from "../../hooks/useAuthGuard"
import axios from "axios"

interface Props {
    photocardId: number
    onSuccess?: () => void
}

export default function ReviewForm({ photocardId, onSuccess }: Props) {

    const [rating, setRating] = useState(0)
    const [content, setContent] = useState("")
    const { requireLogin } = useAuthGuard()

    const handleSubmit = async (e: React.FormEvent) => {
        if (rating === 0 || content.trim() === "") {
            alert("별점과 리뷰를 모두 입력하세요")
            return
        }

        try {
            await axios.post(
                `http://localhost:8080/api/photocard/${photocardId}/reviews/`,
                {
                    rating,
                    content
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            setRating(0)
            setContent("")
            onSuccess?.() // 리뷰 등록 성공시 onSuccess호출로 인해 reviewlist 갱신
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Form onSubmit={(e) => {
            e.preventDefault()
            requireLogin(() => handleSubmit(e))
        }} className="mt-5 mb-3">

            <h5 className="mb-3 fw-bold">리뷰 작성</h5>

            <div className="mb-3 d-flex align-items-center">
                <Rating
                    onClick={(rate) => setRating(rate*2)}
                    allowFraction
                    iconsCount={5}
                    size={30}
                />
            </div>

            <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="리뷰를 입력하세요"
            />

            <Button type="submit" className="mt-3">
                리뷰 등록
            </Button>
        </Form>
    )
}
