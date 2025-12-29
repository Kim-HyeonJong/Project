import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Form, Table} from "react-bootstrap";

const OrderCheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as { items?: any[] } | undefined;
    const items = state?.items ?? [];

    const [address, setAddress] = useState<any | null>(null);
    const [message, setMessage] = useState<string>("");
    const [member, setMember] = useState<any | null>(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // 1) 회원 프로필 가져오기 (수령인 이름/연락처용)
            const memberResp = await axios.get(
                "http://localhost:8080/api/mypage/profile",
                config
            );
            setMember(memberResp.data);

            // 2) 주소 가져오기
            const addrResp = await axios.get(
                "http://localhost:8080/api/address/",
                config
            );
            setAddress(addrResp.data.address);

        } catch (e) {
            console.error("주문서 데이터 불러오기 실패:", e);
            alert("주문서 정보를 불러오지 못했습니다.");
            navigate("/cart");
        }
    };


    useEffect(() => {
        if (!items.length) {
            alert("주문할 상품 정보가 없습니다.");
            navigate("/cart");
            return;
        }
        fetchData();
    }, []);

    const totalAmount = items.reduce((sum, item) => {
        const price = item.photocard?.salePrice ?? 0;
        return sum + price * item.quantity;
    }, 0);

    const goToPayment = () => {
        if (!address) {
            alert("배송지 정보를 불러오지 못했습니다.");
            return;
        }

        navigate("/order/payment", {
            state: {
                items,
                address,
                message,
                totalAmount
            }
        })
    }

    return (
        <div className="container mt-4">
            <h2>주문서 확인</h2>

            <Card className="mt-3">
                <Card.Header>주문 상품</Card.Header>
                <Card.Body>
                    <Table striped bordered hover size="sm">
                        <thead>
                        <tr>
                            <th>포토카드명</th>
                            <th>판매가</th>
                            <th>수량</th>
                            <th>상품금액</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => {
                            const photocard = item.photocard;
                            const price = photocard?.salePrice ?? 0;
                            const amount = price * item.quantity;

                            return (
                                <tr key={item.id}>
                                    <td>
                                        {photocard
                                            ? `${photocard.artistName} - ${photocard.name}`
                                            : `포토카드 #${item.photocardId}`}
                                    </td>
                                    <td>{price.toLocaleString()}원</td>
                                    <td>{item.quantity}</td>
                                    <td>{amount.toLocaleString()}원</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>

                    <div className="text-end mt-2">
                        <strong>
                            총 주문 금액: {totalAmount.toLocaleString()}원
                        </strong>
                    </div>
                </Card.Body>
            </Card>

            <Card className="mt-3">
                <Card.Header>배송지 정보</Card.Header>
                <Card.Body>
                    {member && address ? (
                        <>
                            <Form.Group className="mb-2">
                                <Form.Label>수령인 이름</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address.name ?? ""}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>수령인 연락처</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address.phone ?? ""}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>우편번호</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address.zipcode ?? ""}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>주소</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address.addr ?? ""}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>상세 주소</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address.addrDetail ?? ""}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>배송 메세지</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    placeholder="배송 메세지를 입력하세요. (선택)"
                                />
                            </Form.Group>
                        </>
                    ) : (
                        <p>배송지 정보를 불러오는 중입니다...</p>
                    )}
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/cart")}
                >
                    장바구니로 돌아가기
                </Button>

                <Button
                    variant="primary"
                    onClick={goToPayment}
                    disabled={!items.length || !address}
                >
                    결제 화면으로 이동
                </Button>
            </div>
        </div>
    )
}

export default OrderCheckoutPage;