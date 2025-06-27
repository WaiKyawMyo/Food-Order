import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Product from "./pages/Product";
import { useEffect } from "react";
import StaffRegister from "./pages/StaffRegister/StaffRegister";
import StaffCheck from "./pages/StaffCheck";
import CreateTable from "./pages/TablesCreate/CreateTable";
import CheckSignin from "./components/auth/CheckSignin";
import Menu from "./pages/Menu/Menu";
import Set_menu from "./pages/Menu/Set_menu";

export function ClearLocalStorageOnClose() {
  useEffect(() => {
    const handleUnload = () => {
      localStorage.clear();     // This will remove everything stored in localStorage
      // OR: localStorage.removeItem('yourPersistKey');
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return null; // This component just does side effects
}

export default function App() {
 

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Product><Home /></Product>} />

            {/* Others Page */}
            
            <Route path="/staffRegister" element={<Product><StaffCheck><StaffRegister /></StaffCheck></Product>} />
            <Route path="/add-table" element={<Product><CreateTable/></Product>} />

             <Route path="/menu" element={<Menu/>} />
             <Route path="/set-menu" element={< Set_menu />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
         
            
            

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<CheckSignin><SignIn /></CheckSignin> } />
          

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
