import { Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState<any[]>([]);

    const fetchCart = async () => {
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

            const cartResp = await axios.get(
                "http://localhost:8080/api/cart/",
                config
            );
            const cartList: any[] = cartResp.data ?? [];

            if (cartList.length === 0) {
                setItems([]);
                return;
            }

            const photocardRequests = cartList.map((c) =>
                axios.get(
                    `http://localhost:8080/api/photocard/showOne/${c.photocardId}`,
                    config
                )
            );

            const photocardResponses = await Promise.all(photocardRequests);

            const photocardMap: Record<number, any> = {};
            photocardResponses.forEach((resp) => {
                const p = resp.data;
                photocardMap[p.id] = p;
            });

            const merged = cartList.map((c) => ({
                ...c,
                photocard: photocardMap[c.photocardId],
                selected: true
            }));

            setItems(merged);
        } catch (e) {
            console.error("장바구니 조회 실패:", e);
            alert("장바구니를 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const changeQuantity = async (cartItem: any, delta: number) => {
        const newQty = cartItem.quantity + delta;
        if (newQty < 1) {
            alert("수량은 1 미만이 될 수 없습니다. 삭제기능을 이용해주십시오. ");
            return;
        }

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

            await axios.patch(
                `http://localhost:8080/api/cart/${cartItem.id}`,
                { quantity: newQty },
                config
            );

            await fetchCart();
        } catch (e) {
            console.error("수량 변경 실패:", e);
            alert("수량 변경에 실패했습니다.");
        }
    };

    const deleteItem = async (cartItemId: number) => {
        if (!window.confirm("해당 상품을 장바구니에서 삭제하시겠습니까?")) return;

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

            await axios.delete(
                `http://localhost:8080/api/cart/${cartItemId}`,
                config
            );

            await fetchCart();
        } catch (e) {
            console.error("장바구니 삭제 실패:", e);
            alert("장바구니 항목 삭제에 실패했습니다.");
        }
    };

    const clearCart = async () => {
        if (!window.confirm("장바구니를 전부 비우시겠습니까?")) return;

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

            await axios.delete("http://localhost:8080/api/cart/", config);
            await fetchCart();
        } catch (e) {
            console.error("장바구니 비우기 실패:", e);
            alert("장바구니 비우기에 실패했습니다.");
        }
    };

    // 항목 선택 체크박스
    const toggleSelect = (id: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    // 전체선택 / 해제
    const toggleSelectAll = (checked: boolean) => {
        setItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
    };

    // 선택된 항목들
    const selectedItems = items.filter((item) => item.selected);

    // 총 금액 계산 (선택된 것만)
    const totalAmount = selectedItems.reduce((sum, item) => {
        const price = item.photocard?.salePrice ?? 0;
        return sum + price * item.quantity;
    }, 0);

    // 주문서 페이지로 이동
    const goToCheckout = () => {
        if (selectedItems.length === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }


        navigate("/order/checkout", {
            state: {
                items: selectedItems
            }
        })
    }

    const deleteSelected = async () => {
        const selectedIds = items.filter(i => i.selected).map(i => i.id);

        if (selectedIds.length === 0) {
            alert("삭제할 상품을 선택해주세요.");
            return;
        }

        if (!window.confirm("선택한 상품들을 장바구니에서 삭제하시겠습니까?")) return;

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

            await Promise.all(
                selectedIds.map(id =>
                    axios.delete(`http://localhost:8080/api/cart/${id}`, config)
                )
            );

            await fetchCart();
        } catch (e) {
            console.error("선택 삭제 실패:", e);
            alert("선택한 상품 삭제에 실패했습니다.");
        }
    };



    return (
        <div className="container mt-4">
            <h2>장바구니</h2>

            {items.length === 0 ? (
                <p className="mt-3">장바구니에 담긴 상품이 없습니다.</p>
            ) : (
                <>
                    <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                        <tr>
                            <th style={{ width: "40px" }}>
                                <Form.Check
                                    type="checkbox"
                                    checked={
                                        items.length > 0 &&
                                        items.every((item) => item.selected)
                                    }
                                    onChange={(e) =>
                                        toggleSelectAll(e.target.checked)
                                    }
                                />
                            </th>
                            <th>ID</th>
                            <th>포토카드명</th>
                            <th>판매가</th>
                            <th>수량</th>
                            <th>상품금액</th>
                            <th>관리</th>
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
                                        <Form.Check
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() =>
                                                toggleSelect(item.id)
                                            }
                                        />
                                    </td>
                                    <td>{item.id}</td>
                                    <td>
                                        {photocard
                                            ? `${photocard.artistName} - ${photocard.name}`
                                            : `포토카드 #${item.photocardId}`}
                                    </td>
                                    <td>{price.toLocaleString()}원</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() =>
                                                    changeQuantity(item, -1)
                                                }
                                            >
                                                -
                                            </Button>
                                            <span>{item.quantity}</span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() =>
                                                    changeQuantity(item, +1)
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td>{amount.toLocaleString()}원</td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() =>
                                                deleteItem(item.id)
                                            }
                                        >
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={deleteSelected}
                            >
                                선택 삭제
                            </Button>

                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={clearCart}
                            >
                                장바구니 비우기
                            </Button>
                        </div>

                        <div className="text-end">
                            <div>총 상품금액: {totalAmount.toLocaleString()}원</div>
                            <Button
                                className="mt-2"
                                variant="primary"
                                size="sm"
                                onClick={goToCheckout}
                            >
                                주문서 작성하기
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;