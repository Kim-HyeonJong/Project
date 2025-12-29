import {Button, Card, Form} from "react-bootstrap";
import axios from "axios";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const OrderPaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as {
        items: any[];
        address: any;
        message: string;
        totalAmount: number;
    };

    const { items, address, message, totalAmount } = state;

    const [cardNumber, setCardNumber] = useState("");
    const [cardCompany, setCardCompany] = useState("");

    const handlePayment = async () => {
        if (!cardNumber || !cardCompany) {
            alert("카드 정보를 입력해주세요.");
            return;
        }

        if (!window.confirm("결제를 진행하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // 주문 DTO 변환
            const orderRequest = {
                status: "결제완료",
                totalAmount,
                receiverName: address.name ?? "",
                receiverPhone: address.phone ?? "",
                zipcode: address?.zipcode ?? "",
                addr: address?.addr ?? "",
                addrDetail: address?.addrDetail ?? "",
                message,
                items: items.map((item) => ({
                    photocardId: item.photocardId,
                    sellerId: item.photocard.sellerId,
                    quantity: item.quantity,
                    price: item.photocard.salePrice,
                    amount: item.photocard.salePrice * item.quantity
                }))
            };

            // 서버로 주문 생성 요청
            const resp = await axios.post(
                "http://localhost:8080/api/order/submit",
                orderRequest,
                config
            );

            const createdOrder = resp.data.data;
            console.log(createdOrder)

            alert("결제가 완료되었습니다.");

            // 재고 수량을 결제 한 수량만큼 줄여줘야함.
            for (const item of createdOrder.items) {
                await axios.patch(
                    `http://localhost:8080/api/photocard/${item.photocardId}/stock`,
                    null, // body 없음
                    {
                        params: { quantity: item.quantity }, // query string으로 전달
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            
            // 장바구니 비우기
            await axios.delete("http://localhost:8080/api/cart/", config);
            navigate(`/order/complete/${createdOrder.id}`, {
                state: {
                    totalAmount,
                    cardCompany
                }
            });

        } catch (e) {
            console.error(e);
            alert("결제 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>결제 화면</h2>

            <Card className="mt-3">
                <Card.Header>카드 정보 입력</Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>카드 번호</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="1234-5678-0000-0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>카드사</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="비자 / 마스터 / 신한 / 국민 등"
                            value={cardCompany}
                            onChange={(e) => setCardCompany(e.target.value)}
                        />
                    </Form.Group>
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-between mt-3">
                <Button
                    variant="outline-secondary"
                    onClick={() =>
                        navigate("/order/checkout", { state: { items, addressId, message, totalAmount } })
                    }
                >
                    이전 단계
                </Button>

                <Button variant="primary" onClick={handlePayment}>
                    결제하기
                </Button>
            </div>
        </div>
    );
};

export default OrderPaymentPage;