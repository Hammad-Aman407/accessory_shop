import React, { useContext } from 'react'
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBSidebarFooter
} from 'cdbreact';
import { StoreContext } from '../../context/StoreContext'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const SideBar = () => {

    const navigate = useNavigate();

    const { setToken } = useContext(StoreContext);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        setToken("");
        navigate('/', { replace: true });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'auto' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#000">

                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large text-white"></i>}>
                    <a
                        href="#"
                        className="text-decoration-none text-white fw-bold"
                    >
                        Admin Panel
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>

                        <NavLink to="/admin/add-product" className="text-decoration-none">
                            <CDBSidebarMenuItem icon="plus-circle">
                                Add Product
                            </CDBSidebarMenuItem>
                        </NavLink>

                        <NavLink to="/admin/view-products" className="text-decoration-none">
                            <CDBSidebarMenuItem icon="boxes">
                                View Products
                            </CDBSidebarMenuItem>
                        </NavLink>

                        <NavLink to="/admin/sales" className="text-decoration-none">
                            <CDBSidebarMenuItem icon="shopping-cart">
                                Sales
                            </CDBSidebarMenuItem>
                        </NavLink>

                        <NavLink to="/admin/sales-history" className="text-decoration-none">
                            <CDBSidebarMenuItem icon="history">
                                Sales History
                            </CDBSidebarMenuItem>
                        </NavLink>

                        <NavLink to="/admin/report-daily" className="text-decoration-none">
                            <CDBSidebarMenuItem icon="chart-line">
                                Daily Report
                            </CDBSidebarMenuItem>
                        </NavLink>

                        <NavLink to="/admin/report-monthly" className="text-decoration-none">
                            <CDBSidebarMenuItem icon="chart-bar">
                                Monthly Report
                            </CDBSidebarMenuItem>
                        </NavLink>

                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter>
                    <CDBSidebarMenu>
                        <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <CDBSidebarMenuItem icon="sign-out-alt">
                                Logout
                            </CDBSidebarMenuItem>
                        </div>
                    </CDBSidebarMenu>
                </CDBSidebarFooter>

            </CDBSidebar>

            <div style={{ width: "100%", overflowY: "auto", overflowX: "auto" }}>
                <Outlet />
            </div>
        </div>

    );
};

export default SideBar;