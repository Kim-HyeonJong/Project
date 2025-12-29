import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Form} from "react-bootstrap";

const MyAddressEditPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        zipcode: "",
        addr: "",
        addrDetail: "",
        phone: ""
    })

    const [addressId, setAddressId] = useState<number | null>(null);

    const onChange =
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
            setForm(prev => ({
                ...prev,
                [name]: value
            }))
        }

    const onChangePhone =
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const onlyNum = e.target.value.replace(/[^0-9]/g, "");
            setForm(prev => ({...prev, phone: onlyNum}))
        }

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

                const resp = await axios.get("http://localhost:8080/api/address/", config)

                const address = resp.data.address ?? resp.data;
                if (address) {
                    setAddressId(address.id)
                    setForm({
                        name: address.name ?? "",
                        zipcode: address.zipcode !== undefined ? String(address.zipcode) : "",
                        addr: address.addr ?? "",
                        addrDetail: address.addrDetail ?? "",
                        phone: address.phone ?? ""
                    })
                }
            } catch (e) {
                console.error("주소 조회 실패: ", e);
            }
        }

        fetchAddress()
    }, [navigate]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const addressRequest = {
                name: form.name,
                zipcode: Number(form.zipcode),
                addr: form.addr,
                addrDetail: form.addrDetail,
                phone: form.phone,
            };

            if (addressId != null) {
                await axios.patch(
                    `http://localhost:8080/api/address/${addressId}`,
                    addressRequest,
                    config
                );
                alert("배송지 정보가 수정되었습니다.");
            } else {
                await axios.post(
                    "http://localhost:8080/api/address/",
                    addressRequest,
                    config
                );
                alert("배송지 정보가 등록되었습니다.");
            }

            navigate("/mypage");
        } catch (e) {
            console.error("주소 저장 실패:", e);
            alert("주소 저장에 실패했습니다.");
        }
    };


    return (
        <div className="container mt-4">
            <h2>배송지 관리</h2>

            <Form className="mt-3" onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>수령인 이름 (name)</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>우편번호 (zipcode)</Form.Label>
                    <Form.Control
                        type="text"
                        name="zipcode"
                        value={form.zipcode}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>주소 (address)</Form.Label>
                    <Form.Control
                        type="text"
                        name="addr"
                        value={form.addr}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>상세 주소 (addressDetail)</Form.Label>
                    <Form.Control
                        type="text"
                        name="addrDetail"
                        value={form.addrDetail}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>연락처 (phone)</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={onChangePhone}
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        {addressId != null ? "수정하기" : "등록하기"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/mypage")}
                    >
                        취소
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default MyAddressEditPage;