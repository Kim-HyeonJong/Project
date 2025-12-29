import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const MyPage = () => {

    const [member, setMember] = useState(null);
    const [address, setAddress] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyPageData = async () => {
            try {

                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [memberResp, addressResp] = await Promise.all([
                    axios.get("http://localhost:8080/api/mypage/profile", config),
                    axios.get("http://localhost:8080/api/address/", config)
                ]);


                const memberData = memberResp.data;
                const addressData = addressResp.data.address;
                setMember(memberData);
                setAddress(addressData);

            } catch (err) {
                console.error("마이페이지 데이터 불러오기 실패:", err);
            }
        }

        fetchMyPageData();
    }, [])


    return (
        <div className="container mt-4">
            <h2>마이페이지</h2>

            {/* 프로필 영역 */}
            <section className="mt-4">
                <h4>회원 정보</h4>
                {member && (
                    <>
                        <ul>
                            <li>아이디: {member.username}</li>
                            <li>닉네임: {member.nickname}</li>
                            <li>전화번호: {member.phone}</li>
                            <li>성별: {member.gender}</li>
                        </ul>

                    </>
                )}
                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/mypage/profile/edit")}
                >
                    프로필 수정
                </button>
                <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={() => navigate("/mypage/password/edit")}
                >
                    비밀번호 수정
                </button>
            </section>

            {/* 주소 영역 */}
            <section className="mt-4">
                <h4>배송지 정보</h4>
                {address && (
                    <>
                        <ul>
                            <li>수령인: {address.name}</li>
                            <li>우편번호: {address.zipcode}</li>
                            <li>주소: {address.addr}</li>
                            <li>상세주소: {address.addrDetail}</li>
                            <li>연락처: {address.phone}</li>
                        </ul>
                    </>
                )}
                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/mypage/address/edit")}
                >
                    주소 관리
                </button>
            </section>

            {/* 주문내역 영역 */}
            <section className="mt-4">
                <h4>주문 내역</h4>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/mypage/orders")}
                >
                    주문 내역 보기
                </button>
            </section>

        </div>
    );
}


export default MyPage