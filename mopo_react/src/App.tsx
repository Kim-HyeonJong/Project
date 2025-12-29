import './App.css'
import "bootswatch/dist/lux/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import MainLayout from './layouts/MainLayout'

import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import SellerRoute from './routes/SellerRoute'

// photocard page
import CardList from './pages/photocard/CardList'
import CardDetail from './pages/photocard/CardDetail'

// login, register page
import Login from './pages/user/IndexPage.tsx'
import Signup from './pages/user/RegisterPage'

// user mypage
import MyPage from "./pages/mypage/MyPage";
import MyProfileEditPage from "./pages/mypage/MyProfileEditPage";
import MyAddressEditPage from "./pages/mypage/MyAddressEditPage";
import MyPasswordEditPage from "./pages/mypage/MyPasswordEditPage";
import MyOrderListPage from "./pages/mypage/MyOrderListPage";

// seller page
import SellerOrderList from './pages/seller/SellerOrderListPage'
import SellerPhotocardManage from './pages/seller/SellerPhotocardManage'
import SellerPhotocardCreate from './pages/seller/SellerPhotocardCreate'
import SellerPhotocardEdit from './pages/seller/SellerPhotocardEdit'

// notice page
import NoticeListPage from "./pages/notice/NoticeListPage";
import NoticeDetailPage from "./pages/notice/NoticeDetailPage";
import NoticeWritePage from "./pages/notice/NoticeWritePage";
import NoticeUpdatePage from "./pages/notice/NoticeUpdatePage";

// admin page
import AdminMainPage from "./pages/admin/AdminMainPage.tsx";
import AdminMemberListPage from "./pages/admin/AdminMemberListPage.tsx";
import AdminPhotocardDetailPage from "./pages/admin/AdminPhotocardDetailPage.tsx";
import AdminPhotocardListPage from "./pages/admin/AdminPhotocardListPage.tsx";
import CartPage from "./pages/cart/CartPage.tsx";
import OrderCheckoutPage from "./pages/cart/OrderCheckoutPage.tsx";
import OrderPaymentPage from "./pages/cart/OrderPaymentPage.tsx";
import OrderCompletePage from "./pages/cart/OrderCompletePage.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                {/* 기본 레이아웃 */}
                <Route element={<MainLayout/>}>
                    <Route path="/" element={<CardList/>}/>
                    {/*<Route path="/cards" element={<CardList />} />*/}
                    <Route path="/card/:id" element={<CardDetail/>}/>

                    {/* 로그인 / 회원가입 */}
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>

                    {/* 공지사항 */}
                    <Route path={"/notices"} element={<NoticeListPage/>}/>
                    <Route path={"/notice/:id"} element={<NoticeDetailPage/>}/>

                    {/* 로그인 필요 페이지 */}
                    <Route element={<ProtectedRoute/>}>
                        {/* 회원 마이페이지 */}
                        <Route path="/mypage">
                            <Route index element={<MyPage/>}/>
                            <Route path="profile/edit" element={<MyProfileEditPage/>}/>
                            <Route path="password/edit" element={<MyPasswordEditPage/>}/>
                            <Route path="address/edit" element={<MyAddressEditPage/>}/>
                            <Route path="orders" element={<MyOrderListPage/>}/>
                        </Route>

                        {/* 회원 장바구니 */}
                        <Route path="/cart" element={<CartPage/>}/>
                        <Route path="/order">
                            <Route path="checkout" element={<OrderCheckoutPage/>}/>
                            <Route path="payment" element={<OrderPaymentPage/>}/>
                            <Route path="complete/:orderId" element={<OrderCompletePage/>}/>
                        </Route>
                    </Route>

                    {/* 셀러만 */}
                    <Route element={<SellerRoute/>}>
                        {/* 주문 내역 */}
                        <Route path="/seller/orders" element={<SellerOrderList/>}/>

                        {/* 상품 관리(등록, 수정, 재고, 삭제) */}
                        <Route path="/seller/photocards" element={<SellerPhotocardManage/>}/>
                        <Route path="/seller/photocard/new" element={<SellerPhotocardCreate/>}/>
                        <Route path="/seller/photocard/edit/:id" element={<SellerPhotocardEdit/>}/>
                    </Route>

                    {/* 관리자만 */}
                    <Route element={<AdminRoute/>}>
                        {/* 공지사항 등록/수정 */}
                        <Route path={"/admin/notice/new"} element={<NoticeWritePage/>}/>
                        <Route path={"/admin/notice/:id/edit"} element={<NoticeUpdatePage/>}/>

                        {/* 관리자 페이지 */}
                        <Route path={"/admin"} element={<AdminMainPage/>}/>
                        <Route path={"/admin/members"} element={<AdminMemberListPage/>}/>
                        <Route path={"/admin/photocards"} element={<AdminPhotocardListPage/>}/>
                        <Route path={"/admin/photocard/:id"} element={<AdminPhotocardDetailPage/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
