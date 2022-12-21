import './App.css';
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import NotFoundPage from "./shift/NotFoundPage";
import {useEffect, useState} from "react";
import ShiftPage from "./shift/index"
import LoginPage from "./shift/LoginPage";
import Admin from "./shift/adminPage/index";
import AdminTitle from "./shift/adminPage/component/TitleAdmin";
import AdminAbout from "./shift/adminPage/component/AboutAdmin";
import WhyUsAdmin from "./shift/adminPage/component/WhyUsAdmin";
import GalleryAdmin from "./shift/adminPage/component/GalleryAdmin";
import OurTeamAdmin from "./shift/adminPage/component/OurTeamAdmin";
import CoursesAdmin from "./shift/adminPage/component/CoursesAdmin";
import AddressAdmin from "./shift/adminPage/component/AddressAdmin";
import UsersAdmin from "./studyCenter/component/UsersAdmin";
import SeeGallery from "./shift/component/Gallery/allGallery/index";
import SelectAdmin from "./shift/adminPage/selectAdmin";
import StudyCenter from "./studyCenter";
import DeleteUserAdmin from "./studyCenter/component/DeleteUserAdmin";
import IncomeAdmin from "./studyCenter/component/IncomeAdmin";
import RegisterUserPage from "./shift/registerUserPage";
import SuccessUserPage from "./shift/succesUserPage";
import SelectAdminPage from "./studyCenter/component/SelectAdminPage";
import User from "./shift/UserPage/User";
import UserPage from "./shift/UserPage";
import LessonPage from "./shift/UserPage/LessonPage";
import Lesson from "./shift/UserPage/LessonPage/Lesson";
import LessonPageAdmin from "./studyCenter/component/Lessonpage";
import CertificatePage from "./shift/CertificatePage";
import Certificate from "./studyCenter/component/Certificate/Certificate";
import Room from "./studyCenter/component/Room";

import instance from "./shift/utils/instance";
import ExpenseAdmin from "./studyCenter/component/ExpenseAdmin";


function App() {
    const [shift, setShift] = useState(null);
    const {pathname} = useLocation();
    let navigate = useNavigate();

    const [isSuper, setIsSuper] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const blockedPages = [
        {url: "/admin", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/admin/title", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/admin/about", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/admin/whyus", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/admin/courses", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/admin/gallery", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/admin/ourteam", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/admin/address", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/selectadmin", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/selectadmin/studycenter", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/selectadmin/users", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/selectadmin/certificate", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/selectadmin/delete/users", roles: ["ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/mentor", roles: ["ROLE_MENTOR", "ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/lesson", roles: ["ROLE_MENTOR", "ROLE_ADMIN", "ROLE_SUPERADMIN"]},
        {url: "/selectadmin/income", roles: ["ROLE_SUPERADMIN"]},
        {url: "/selectadmin/expense", roles: ["ROLE_SUPERADMIN"]},
    ]

    useEffect(() => {
        getMe();
        getShift();
        pathAdmin();
    }, [pathname])


    function isBlockedPage() {
        let a = false;
        blockedPages.map((item) => {
            if (item.url === pathname.toLocaleLowerCase()) {
                a = true;
            }
        })
        return a;
    }

    function hasRole(roles) {
        let a = false;
        let currentPage = blockedPages.filter(item => item.url === pathname.toLocaleLowerCase())[0]

        currentPage.roles.map(item => {
            if (item === roles.roleName) {
                a = true;
            }
        })
        return a;
    }

    function getShift() {
        instance.get("/shift").then(res => {
            setShift(res.data)
        })
    }

    async function getMe() {
        let token = localStorage.getItem("token");

        if (token !== null) {
            const items = JSON.parse(localStorage.getItem('role'));
            await instance.get("/user/me").then(res => {
                // res.data.roles

                items.filter(role => role.roleName === "ROLE_SUPERADMIN").length > 0 ?
                    setIsSuper(true) : setIsSuper(false)

                if (isBlockedPage()) {
                    items?.map(item => {
                        if (hasRole(item)) {
                        } else {
                            navigate("/404")
                        }
                    })
                }
            })
        }
    }

    function pathAdmin() {
        if (pathname.toLocaleLowerCase().startsWith("/admin") ||
            pathname.toLocaleLowerCase().startsWith("/selectadmin")
            || pathname.toLocaleLowerCase().startsWith("/mentor")
            || pathname.toLocaleLowerCase().startsWith("/selectrole")) {
            if (!localStorage.getItem("token")
                || localStorage.getItem("token").length < 100) {
                navigate("/404")
            }
        }
    }


    return (

        <div>
            <Routes>
                <Route path={"/"} element={<ShiftPage/>}/>
                <Route path={"/404"} element={<NotFoundPage/>}/>
                <Route path={"*"} element={<NotFoundPage/>}/>
                <Route path={"/login"} element={<LoginPage/>}/>
                <Route path={"/registerUser"} element={<RegisterUserPage/>}/>
                <Route path={"/successUser"} element={<SuccessUserPage/>}/>
                <Route path={"/Mentor"} element={<StudyCenter/>}/>
                <Route path={"/selectRole"} element={<SelectAdminPage/>}/>
                <Route path={"/gallery"} element={<SeeGallery gallery={shift?.galleries} getShift={getShift}/>}/>
                <Route path={"/selectAdmin"} element={<SelectAdmin isSuper={isSuper}/>}>
                    <Route path={"/selectAdmin/studyCenter"} element={<StudyCenter isSuper={isSuper}/>}/>
                    <Route path={"/selectAdmin/users"} element={<UsersAdmin isSuper={isSuper}/>}/>
                    <Route path={"/selectAdmin/lesson"} element={<LessonPageAdmin/>}/>
                    <Route path={"/selectAdmin/certificate"} element={<Certificate/>}/>
                    <Route path={"/selectAdmin/rooms"} element={<Room/>}/>
                    <Route path={"/selectAdmin/delete/users"} element={<DeleteUserAdmin/>}/>
                    <Route path={"/selectAdmin/income"} element={<IncomeAdmin/>}/>
                    <Route path={"/selectAdmin/expense"} element={<ExpenseAdmin/>}/>
                </Route>
                <Route path={"/admin"} element={<Admin/>}>
                    <Route path={"/admin/title"} element={<AdminTitle title={shift?.title} getShift={getShift}/>}/>
                    <Route path={"/admin/about"} element={<AdminAbout about={shift?.about} getShift={getShift}/>}/>
                    <Route path={"/admin/whyUs"} element={<WhyUsAdmin whyUses={shift?.whyUses} getShift={getShift}/>}/>
                    <Route path={"/admin/courses"}
                           element={<CoursesAdmin courses={shift?.courses} getShift={getShift}/>}/>
                    <Route path={"/admin/gallery"}
                           element={<GalleryAdmin gallery={shift?.galleries} getShift={getShift}/>}/>
                    <Route path={"/admin/ourTeam"}
                           element={<OurTeamAdmin ourTeams={shift?.ourTeams} getShift={getShift}/>}/>
                    <Route path={"/admin/address"}
                           element={<AddressAdmin address={shift?.address} followUses={shift?.followUses}
                                                  getShift={getShift}/>}/>
                </Route>

                <Route path={"/userPage"} element={<UserPage/>}>
                    <Route path={"/userPage/user"} element={<User/>}/>
                </Route>
                <Route path={"/userPage/lessons"} element={<LessonPage/>}>
                    <Route path={"/userPage/lessons/:id"} element={<Lesson/>}/>
                </Route>
                <Route
                    path={"/checkCertificateQr/:id"}
                    element={
                        <CertificatePage/>
                    }
                />

            </Routes>
        </div>
    );
}


export default App;
