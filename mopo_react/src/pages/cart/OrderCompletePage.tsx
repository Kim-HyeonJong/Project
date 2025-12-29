import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "react-bootstrap";

const OrderCompletePage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as { totalAmount?: number } | undefined;

    const [items, setItems] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(state?.totalAmount ?? 0);

    useEffect(() => {
        const fetchOrderItems = async () => {
            if (!orderId) {
                alert("주문 번호가 없습니다.");
                navigate("/");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const resp = await axios.get(
                    `http://localhost:8080/api/order/showOne/${orderId}`,
                    config
                );

                const data = resp.data;
                const list: any[] = data.data ?? [];

                setItems(list);

                if (!state?.totalAmount) {
                    const sum = list.reduce((acc, item) => acc + (item.amount ?? 0), 0);
                    setTotalAmount(sum);
                }
            } catch (e) {
                console.error(e);
                alert("주문 정보를 불러오지 못했습니다.");
            }
        };

        fetchOrderItems();
    }, []);

    return (
        <div className="container mt-4">
            <h2>주문이 완료되었습니다.</h2>
            <p className="mt-2">구매해 주셔서 감사합니다.</p>

            <Card className="mt-3">
                <Card.Body>
                    <div>주문번호: <strong>{orderId}</strong></div>
                </Card.Body>
            </Card>

            <Card className="mt-3">
                <Card.Header>주문 상품 목록</Card.Header>
                <Card.Body>
                    <Table striped bordered hover size="sm">
                        <thead>
                        <tr>
                            <th>포토카드명</th>
                            <th>수량</th>
                            <th>금액</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.photocardName ?? `포토카드 #${item.photocardId}`}</td>
                                <td>{item.quantity}</td>
                                <td>{(item.amount ?? 0).toLocaleString()}원</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card className="mt-3">
                <Card.Body>
                    <div>
                        총 결제 금액: <strong>{totalAmount.toLocaleString()}원</strong>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default OrderCompletePage;
