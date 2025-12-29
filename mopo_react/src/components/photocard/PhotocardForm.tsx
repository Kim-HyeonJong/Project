import { useEffect, useState } from "react"
import type { PhotoCard } from "../../types/photocard"
import axios from "axios"
import { Button, Form, Row, Col } from "react-bootstrap"

type Props = {
    mode: "create" | "edit"
    initialData?: PhotoCard
    onSubmit: (data: Partial<PhotoCard>) => void
}

export default function PhotoCardForm({ mode, initialData, onSubmit }: Props) {

    const [form, setForm] = useState<Partial<PhotoCard>>({})
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [tempFileName, setTempFileName] = useState<string>("")

    useEffect(() => {
        if (initialData) {
            setForm(initialData)
        } else {
            setForm({
                limitedFlag: "N",
                messageFlag: "N",
                stock: 1,
                status: "판매중"
            })
        }
    }, [initialData])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    // 이미지 업로드
    const handleImageUpload = async () => {
        if (!imageFile) return alert("이미지를 선택하세요")

        const data = new FormData()
        data.append("file", imageFile)

        try {
            const resp = await axios.post("http://localhost:8080/api/photocard/image/upload-temp", data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data"
                    }
                })
            setImageUrl(resp.data.imageUrl)
            setTempFileName(resp.data.tempFileName)
            alert("이미지 업로드 완료")
        } catch (e) {
            console.error(e)
            alert("이미지 업로드 실패")
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        onSubmit({
            ...form,
            tempFileName:tempFileName
        })
    }

    return (
        <Form onSubmit={handleSubmit}>

            {/* 기본 정보 */}
            <h5 className="mb-4">기본 정보</h5>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>포토카드 이름</Form.Label>
                        <Form.Control
                            name="name"
                            placeholder="예: 아이유 셀카 포토카드"
                            value={form.name || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>아티스트명 / 그룹명</Form.Label>
                        <Form.Control
                            name="artistName"
                            placeholder="예: IU / BTS"
                            value={form.artistName || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>아티스트 타입</Form.Label>
                        <Form.Select
                            name="artistType"
                            value={form.artistType || ""}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            <option value="가수">가수</option>
                            <option value="배우">배우</option>
                            <option value="아이돌">아이돌</option>
                            <option value="개그맨">개그맨</option>
                            <option value="기타">기타</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>한정판 여부</Form.Label>
                        <Form.Select
                            name="limitedFlag"
                            value={form.limitedFlag || "N"}
                            onChange={handleChange}
                        >
                            <option value="N">일반</option>
                            <option value="Y">한정판</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <hr />

            {/* 🔹 유형 정보 */}
            <h5 className="mb-4">유형 정보</h5>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>사진 타입</Form.Label>
                        <Form.Control
                            name="photoType"
                            placeholder="셀카 / 전신 / 상반신 / 컨셉"
                            value={form.photoType || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>사인 타입</Form.Label>
                        <Form.Select
                            name="signType"
                            value={form.signType || ""}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            <option value="NONE">없음</option>
                            <option value="PRINT">인쇄 사인</option>
                            <option value="HAND">직접 사인</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>메세지 유무</Form.Label>
                        <Form.Select
                            name="messageFlag"
                            value={form.messageFlag || "N"}
                            onChange={handleChange}
                        >
                            <option value="N">없음</option>
                            <option value="Y">있음</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>이펙트 타입</Form.Label>
                        <Form.Control
                            name="effectType"
                            placeholder="홀로그램 / 프리즘 등"
                            value={form.effectType || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>코팅 타입</Form.Label>
                        <Form.Control
                            name="coatingType"
                            placeholder="무광 / 유광"
                            value={form.coatingType || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>사이즈 타입</Form.Label>
                        <Form.Control
                            name="sizeType"
                            placeholder="엽서형 / 포카형 / 미니"
                            value={form.sizeType || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <hr />

            {/* 크기 / 재질 */}
            <h5 className="mb-4">크기 / 재질</h5>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>가로(mm)</Form.Label>
                        <Form.Control
                            type="number"
                            name="widthMm"
                            value={form.widthMm || 0}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>세로(mm)</Form.Label>
                        <Form.Control
                            type="number"
                            name="heightMm"
                            value={form.heightMm || 0}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>두께(mm)</Form.Label>
                        <Form.Control
                            type="number"
                            name="thicknessMm"
                            value={form.thicknessMm || 0}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>재질</Form.Label>
                        <Form.Control
                            name="material"
                            placeholder="종이 / 플라스틱 / 필름"
                            value={form.material || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>코팅 재질</Form.Label>
                        <Form.Control
                            name="coatingMaterial"
                            placeholder="무광코팅 / 유광코팅"
                            value={form.coatingMaterial || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <hr />

            {/* 🔹 가격 / 재고 */}
            <h5 className="mb-4">가격 / 재고</h5>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>초기 발매가</Form.Label>
                        <Form.Control type="number" name="basePrice" value={form.basePrice || 0} onChange={handleChange}/>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>판매가</Form.Label>
                        <Form.Control type="number" name="salePrice" value={form.salePrice || 0} onChange={handleChange}/>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>재고 수량</Form.Label>
                        <Form.Control type="number" name="stock" value={form.stock || 0} onChange={handleChange}/>
                    </Form.Group>
                </Col>
            </Row>

            {/* 🔹 판매 상태 */}
            <Form.Group className="mb-4">
                <Form.Label>판매 상태</Form.Label>
                <Form.Select name="status" value={form.status || "판매중"} onChange={handleChange}>
                    <option value="판매중">판매중</option>
                    <option value="품절">품절</option>
                    <option value="비공개">비공개</option>
                </Form.Select>
            </Form.Group>

            {/* 🔹 품질 */}
            <h5 className="mb-3">품질 정보</h5>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-4">
                        <Form.Label>상태 등급</Form.Label>
                        <Form.Select
                            name="conditionGrade"
                            value={form.conditionGrade || ""}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            <option value="미개봉">미개봉</option>
                            <option value="A">A (매우 좋음)</option>
                            <option value="B">B (보통)</option>
                            <option value="C">C (사용감 있음)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-4">
                        <Form.Label>인쇄 품질</Form.Label>
                        <Form.Select
                            name="printQuality"
                            value={form.printQuality || ""}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            <option value="ORIGINAL">ORIGINAL (원본)</option>
                            <option value="REMASTER">REMASTER (리마스터)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* 🔹 이미지 업로드 */}
            <h5 className="mb-2">이미지 업로드</h5>

            <Form.Control type="file" onChange={(e) => {
                if (e.target.files) setImageFile(e.target.files[0])
            }}/>

            <Button className="mt-3 mb-4" type="button" onClick={handleImageUpload}>
                이미지 업로드
            </Button>

            {imageUrl && <img src={`http://localhost:8080${imageUrl}`} width={200} className="mb-3 d-block" />}

            <Button type="submit" className="w-100 mt-4">
                {mode === "create" ? "등록하기" : "수정하기"}
            </Button>

        </Form>
    )
}
