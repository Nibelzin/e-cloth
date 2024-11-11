import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";
import { FaChartSimple } from "react-icons/fa6";
import { HiShoppingBag, HiUser } from "react-icons/hi2";

const AdminLayout = () => {
    return (
        <>
            <AdminHeader />
            <div className="flex-1 flex flex-row">
                <div className="w-80 bg-white border-r mt-16 p-4">
                    <a className="flex gap-2 items-center p-2 hover:bg-neutral-100 transition-colors rounded-sm">
                        <FaChartSimple />
                        <p className="">Dashboard</p>
                    </a>
                    <hr className="my-4" />
                    <a className="flex gap-2 items-center p-2 hover:bg-neutral-100 transition-colors rounded-sm">
                        <HiUser />
                        <p className="">Usuarios</p>
                    </a>
                    <a className="flex gap-2 items-center p-2 hover:bg-neutral-100 transition-colors rounded-sm">
                        <HiShoppingBag />
                        <p className="">Produtos</p>
                    </a>
                </div>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default AdminLayout;