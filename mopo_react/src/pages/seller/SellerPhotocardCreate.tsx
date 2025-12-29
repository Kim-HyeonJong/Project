import { useNavigate } from "react-router-dom"
import PhotoCardForm from "../../components/photocard/PhotocardForm"
import axios from "axios"

export default function SellerProductCreate() {

    const navigate = useNavigate()

    const handleCreate = async (data: any) => {
        try {
            const resp = await axios.post("http://localhost:8080/api/photocard/write", data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

            if (resp.data.result === "success") {
                alert("등록 완료")
                navigate("/seller/photocards")
            }

        } catch (e) {
            console.error(e)
            alert("등록 실패")
        }
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">포토카드 등록</h2>

            <PhotoCardForm
                mode="create"
                onSubmit={handleCreate}
            />
        </div>
    )
}