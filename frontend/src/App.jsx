import { Routes, Route } from 'react-router-dom';
import SideBar from "./admin/components/SideBar";
import AddProduct from "./admin/pages/AddProduct";
import ViewProducts from "./admin/pages/ViewProducts";
import Sales from "./admin/pages/Sales";
import SalesHistory from "./admin/pages/SalesHistory";
import DailyReports from "./admin/pages/DailyReports";
import MonthlyReports from "./admin/pages/MonthlyReports";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<SideBar />}>
            <Route index element={<ViewProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="view-products" element={<ViewProducts />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales-history" element={<SalesHistory />} />
            <Route path="report-daily" element={<DailyReports />} />
            <Route path="report-monthly" element={<MonthlyReports />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
