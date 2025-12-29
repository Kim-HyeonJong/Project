import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PhotoCardForm from "../../components/photocard/PhotocardForm"
import axios from "axios"
import type { PhotoCard } from "../../types/photocard"

export default function SellerPhotocardEdit() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [card, setCard] = useState<PhotoCard | null>(null)

    useEffect(() => {
        axios.get(`http://localhost:8080/api/photocard/showOne/${id}`)
            .then(res => setCard(res.data))
            .catch(err => console.error(err))
    }, [id])

    const handleUpdate = async (data: any) => {
        try {
            const resp = await axios.patch(`http://localhost:8080/api/photocard/`, data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

            if (resp.data.result === "success") {
                alert("수정 완료")
                navigate("/seller/photocards")
            }
        } catch (e) {
            console.error(e)
            alert("수정 실패")
        }
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">포토카드 수정</h2>

            {card && (
                <PhotoCardForm
                    mode="edit"
                    initialData={card}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    )
}