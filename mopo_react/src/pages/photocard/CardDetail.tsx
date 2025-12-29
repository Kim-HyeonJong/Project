import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import type {PhotoCard} from "../../types/photocard"
import ReviewForm from "../../components/review/ReviewForm";
import ReviewList from "../../components/review/ReviewList"
import {useAuthGuard} from "../../hooks/useAuthGuard"
import {Badge, Button, Card, Col, Collapse, Container, Form, ListGroup, Row} from "react-bootstrap";

export default function CardDetail() {
    const {id} = useParams()
    const [card, setCard] = useState<PhotoCard | null>(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const {requireLogin} = useAuthGuard()
    useEffect(() => {
        const fetchCard = async () => {
            try {
                const resp = await axios.get(`http://localhost:8080/api/photocard/showOne/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                setCard(resp.data)

                // 조회 수 증가
                await axios.patch(`http://localhost:8080/api/photocard/${id}/view`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        fetchCard()
    }, [id])

    const handleAddToCart = async () => {
        if (card.stock === 0) {
            alert("품절된 상품입니다")
            return
        }

        try {
            await axios.post(
                "http://localhost:8080/api/cart/",
                {
                    photocardId: card.id,
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            alert("장바구니에 추가되었습니다")
        } catch (e) {
            console.error(e)
            alert("장바구니 추가 실패")
        }
    }

    const increase = () => {
        if (card && quantity < card.stock) {
            setQuantity(prev => prev + 1)
        }
    }

    const decrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    if (loading) return <div>로딩중...</div>
    if (!card) return <div>존재하지 않는 카드입니다</div>

    return (
        <Container className="my-5">

            {/* ================= 상품 기본 정보 ================= */}
            <Card className="p-4 mb-4 shadow-sm">
                <Row>
                    {/* 이미지 영역 (임시) */}
                    <Col md={4} className="text-center">
                        {card.imageUrl ? (
                            <img
                                src={`http://localhost:8080${card.imageUrl}`}
                                alt="포토카드 이미지"
                                style={{
                                    width: "100%",
                                    height: "300px",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    background: "#fff"
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "300px",
                                    background: "#f1f1f1",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "8px"
                                }}
                            >
                                이미지 준비 중
                            </div>
                        )}
                    </Col>

                    {/* 기본 정보 */}
                    <Col md={8}>
                        <h2 className="mb-3">{card.name}</h2>
                        <h4 className="text-danger mb-3">
                            {card.salePrice?.toLocaleString()} 원
                        </h4>

                        <div className="mb-2">
                            <Badge bg="secondary" className="me-2">
                                {card.status}
                            </Badge>
                            {card.limitedFlag === "Y" && (
                                <Badge bg="warning" text="dark">
                                    한정판
                                </Badge>
                            )}
                        </div>

                        <ListGroup variant="flush" className="mb-3">
                            <ListGroup.Item>
                                재고 : <strong>{card.stock}</strong>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                조회수 : <strong>{card.viewCount}</strong>
                            </ListGroup.Item>
                        </ListGroup>

                        <div className="d-flex align-items-center gap-2 mb-3">

                            <Button
                                variant="outline-secondary"
                                onClick={decrease}
                                disabled={quantity <= 1}
                            >
                                -
                            </Button>

                            <Form.Control
                                style={{width: "70px", textAlign: "center"}}
                                value={quantity}
                                readOnly
                            />

                            <Button
                                variant="outline-secondary"
                                onClick={increase}
                                disabled={quantity >= card.stock}
                            >
                                +
                            </Button>

                        </div>

                        {card.stock === 0 && (
                            <p className="text-danger fw-bold">품절된 상품입니다</p>
                        )}

                        <p className="mt-3 fw-bold">
                            총 금액: {(card.salePrice * quantity).toLocaleString()}원
                        </p>

                        <Button
                            variant="dark"
                            size="lg"
                            disabled={card.stock === 0}
                            onClick={() => requireLogin(handleAddToCart)}

                        >
                            장바구니 담기
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* ================= 상세정보 접기/펼치기 ================= */}
            <Card className="mb-5 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">제품 상세 정보</h5>
                    <Button
                        variant="outline-dark"
                        onClick={() => setOpen(!open)}
                        aria-controls="detail-collapse"
                        aria-expanded={open}
                    >
                        {open ? "닫기 ▲" : "펼치기 ▼"}
                    </Button>
                </Card.Header>

                <Collapse in={open}>
                    <div id="detail-collapse">
                        <Card.Body>
                            <ListGroup variant="flush">

                                <ListGroup.Item>
                                    <b>Artist</b> : {card.artistName} ({card.artistType})
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>크기</b> : {card.widthMm} x {card.heightMm} mm / 두께 {card.thicknessMm}mm
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>재질</b> : {card.material}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>코팅</b> : {card.coatingType} ({card.coatingMaterial})
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>포토 타입</b> : {card.photoType}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>사인</b> : {card.signType}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>효과</b> : {card.effectType}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>사이즈</b> : {card.sizeType}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>상태 등급</b> : {card.conditionGrade}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>프린팅 품질</b> : {card.printQuality}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <b>등록일</b> : {new Date(card.createdAt).toLocaleDateString()}
                                </ListGroup.Item>

                            </ListGroup>
                        </Card.Body>
                    </div>
                </Collapse>
            </Card>

            {/* ================= 리뷰 영역 ================= */}
            <Card className="shadow-sm p-4">
                {card && <ReviewForm
                    photocardId={card.id}
                    onSuccess={() => setRefresh(prev => prev + 1)}
                />}
                {card && <ReviewList key={refresh} photocardId={card.id}/>}
            </Card>

        </Container>
    )
}
