import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Button, Card, Collapse} from "react-bootstrap";

interface OrderItem {
    id: number;
    orderId: number;
    photocardId: number;
    sellerId: number;
    quantity: number;
    price: number;
    amount: number;
    photocardName: string;
    imageUrl: string;
}

interface Order {
    id: number | null;
    memberId: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    receiverName: string;
    receiverPhone: string;
    zipcode: string;
    addr: string;
    addrDetail: string;
    message: string;
    createdAt: string;
    items: OrderItem[];
}

const MyOrderListPage = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [openOrderId, setOpenOrderId] = useState<number | null>(null);

    // 접기/자세히 보기 토글
    const toggleOrder = (orderId: number | null) => {
        if (orderId === null) return;
        setOpenOrderId(prev => (prev === orderId ? null : orderId));
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

                const resp = await axios.get(
                    "http://localhost:8080/api/order/member",
                    config
                )

                const ordersData: Order[] = resp.data.data;

                setOrders(ordersData);
            } catch (e) {
                console.error("주문 내역 조회 실패:", e);
                alert("주문 내역을 불러오지 못했습니다.");
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="container mt-4">
            <h2>주문 내역</h2>

            {orders.length === 0 ? (
                <div className="mt-3">
                    아직 주문 내역이 없습니다.
                </div>
            ) : (
                <div className="mt-3">
                    {orders.map(order => (
                        <Card className="mb-3" key={order.id}>
                            <Card.Body>
                                {/* 주문 기본 정보 + 배송 정보 */}
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div><strong>주문번호: </strong> {order.orderNumber}</div>
                                        <div>
                                            <strong>주문일자: </strong>{" "}
                                            {order.createdAt}
                                        </div>
                                        <div><strong>상태: </strong> {order.status}</div>
                                        <div>
                                            <strong>총 결제금액: </strong>{" "}
                                            {order.totalAmount.toLocaleString()}원
                                        </div>

                                        <hr className="my-2"/>

                                        <div><strong>수령인:</strong> {order.receiverName}</div>
                                        <div><strong>연락처:</strong> {order.receiverPhone}</div>
                                        <div>
                                            <strong>주소:</strong> {order.zipcode} {order.addr} {order.addrDetail}
                                        </div>
                                        {order.message && (
                                            <div>
                                                <strong>요청사항:</strong> {order.message}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => toggleOrder(order.id)}
                                        >
                                            {openOrderId === order.id ? "접기" : "자세히 보기"}
                                        </Button>
                                    </div>
                                </div>

                                {/* 접기/펼치기 영역: 주문 상품 목록 */}
                                <Collapse in={openOrderId === order.id}>
                                    <div className="mt-3">
                                        <h6>주문 상품</h6>
                                        <table className="table table-sm">
                                            <thead>
                                            <tr>
                                                <th>포토카드</th>
                                                <th>수량</th>
                                                <th>가격</th>
                                                <th>금액</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {order.items?.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.photocardName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.price.toLocaleString()}원</td>
                                                    <td>{item.amount.toLocaleString()}원</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Collapse>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

        </div>
    )
}

export default MyOrderListPage;
