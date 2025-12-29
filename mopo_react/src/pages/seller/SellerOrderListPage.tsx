import { useEffect, useState } from "react"
import axios from "axios"
import { Card, Table } from "react-bootstrap"
import type {SellerOrder} from "../../types/SellerOrder"


const SellerOrderListPage = () => {
//   const navigate = useNavigate()

    const [orders, setOrders] = useState<SellerOrder[]>([])

    useEffect(() => {
        const fetchSellerOrders = async () => {
            try {
                const token = localStorage.getItem("token")

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

                const resp = await axios.get(
                    "http://localhost:8080/api/order/seller",
                    config
                )

                setOrders(resp.data.data)

            } catch (e) {
                console.error("판매 내역 조회 실패:", e)
                alert("판매 내역을 불러오지 못했습니다.")
            }
        }

        fetchSellerOrders()
    }, [])

    return (
        <div className="container mt-4">
            <h2>판매 주문 내역</h2>

            {orders.length === 0 ? (
                <div className="mt-3">아직 판매 내역이 없습니다.</div>
            ) : (
                <Card className="mt-3">
                    <Card.Body>
                        <Table striped bordered hover responsive
                               style={{ tableLayout: "fixed" }}
                               className="align-middle text-center"
                        >
                            <thead>
                            <tr>
                                <th style={{ width: "90px" }}>이미지</th>
                                <th style={{ width: "200px" }}>포토카드</th>
                                <th style={{ width: "70px" }}>수량</th>
                                <th style={{ width: "120px" }}>가격</th>
                                <th style={{ width: "120px" }}>금액</th>
                                <th style={{ width: "220px" }}>주문번호</th>
                                <th style={{ width: "120px" }}>상태</th>
                                <th style={{ width: "120px" }}>수령인</th>
                                <th style={{ width: "150px" }}>연락처</th>
                                <th style={{ width: "350px" }}>주소</th>
                                <th style={{ width: "140px" }}>주문일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map(order => (
                                <tr key={order.orderItemId}>
                                    <td>
                                        <img
                                            src={`http://localhost:8080${order.imageUrl}`}
                                            alt={order.photocardName}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover",
                                                borderRadius: "6px"
                                            }}
                                        />
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.photocardName}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.quantity}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.price.toLocaleString()}원</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.amount.toLocaleString()}원</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.orderNumber}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.status}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.receiverName}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{order.receiverPhone}</td>
                                    <td style={{
                                        maxWidth: "350px",
                                        whiteSpace: "normal",
                                        wordBreak: "break-word"
                                    }}>
                                        {order.zipcode} {order.address} {order.addressDetail}
                                    </td>

                                    <td style={{ whiteSpace: "nowrap" }}>{order.createdAt?.slice(0, 10)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </div>
    )
}

export default SellerOrderListPage
