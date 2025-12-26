import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import MainLayout from '../MainLayout';
import AdminSideBar from "../../../components/admin/AdminSidebar";
import { Layout, Grid, Drawer, Button } from "antd";
import { PanelLeftClose, PanelLeftOpen, Menu, Heart } from "lucide-react";

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

function AdminMediLayout() {
    const location = useLocation();
    const screens = useBreakpoint();
    const isMobile = screens.md === false;

    const hideSiderRoutes = ["/admin-medis/profile", "/admin/profile"];

    const headerTitle = "Tes Kesehatan Mental - Medis"

    const [responsiveSidebar, setResponsiveSidebar] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const shouldHideSider = hideSiderRoutes.some(route => location.pathname.startsWith(route));

    return (
        <MainLayout
            title={headerTitle}
            startAction={isMobile ? (
                <Button
                    type="text"
                    icon={<Menu className="text-zinc-600" />}
                    onClick={() => setMobileDrawerOpen(true)}
                />
            ) : null}
        >
            {!isMobile &&!shouldHideSider && (
                <Sider
                    trigger={null}
                    width={260}
                    className="!bg-white !shadow-lg z-10 hidden md:block"
                    collapsible
                    collapsed={responsiveSidebar}
                    onCollapse={(val) => setResponsiveSidebar(val)}
                >
                    <div className="flex flex-col justify-between h-full pb-5">
                        <div className="flex flex-col gap-5 px-4 flex-1 overflow-y-auto py-4">
                            <AdminSideBar
                                responsiveSidebar={responsiveSidebar}
                            />
                        </div>
                        <div className={`flex items-center p-4 ${responsiveSidebar ? 'justify-center' : 'justify-end'} border-t border-gray-100`}>
                            <button
                                onClick={() => setResponsiveSidebar(!responsiveSidebar)}
                                className="flex items-center justify-center w-full rounded-lg py-2 text-gray-400 hover:text-[#70B748] hover:bg-green-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#70B748]/20"
                            >
                                {responsiveSidebar ? <PanelLeftOpen size={20} strokeWidth={2} /> : <div className="flex gap-x-2 items-center">
                                    <p>Hide Sidebar</p>
                                    <PanelLeftClose size={20} strokeWidth={2} />
                                </div>}
                            </button>
                        </div>
                    </div>
                </Sider>
            )}

            <Drawer
                placement="left"
                onClose={() => setMobileDrawerOpen(false)}
                open={mobileDrawerOpen}
                width={260}
                styles={{ body: { padding: 0 } }}
                closeIcon={null}
            >
                <div className="flex flex-col h-full py-4 px-4">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center gap-x-2">
                            <Heart className="fill-[#70B748] text-[#70B748] w-5 h-5 md:w-10 md:h-10 shrink-0" />
                            <div className="text-[#70B748] text-base md:text-lg lg:text-[24px] font-bold leading-tight">
                                {headerTitle}
                            </div>
                        </div>
                        <Button type="text" icon={<PanelLeftClose size={20} className="!text-gray-700" />} onClick={() => setMobileDrawerOpen(false)} />
                    </div>

                    <AdminSideBar
                        responsiveSidebar={false}
                    />
                </div>
            </Drawer>

            <Content className="h-full overflow-y-auto bg-gray-50 p-4 md:p-0">
                <Outlet />
            </Content>
        </MainLayout >
    )
}

export default AdminMediLayout