import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages';
import LoginPage from './pages/login/login';
import { AuthProvider } from './authcontext/authcontext';
import RegisterPage from './pages/register/register';
import DashboardPage from './pages/dashboard/dashboard';
import PurchaseOrdersPage from './pages/dashboard/purchase-orders/purchase-order';
import NewRequisitionPage from './pages/dashboard/requisitions/requisitions';
import RFQsPage from './pages/dashboard/rfqs/rfqs';
import VendorsPage from './pages/dashboard/vendors/vendors';
import ManageRequisitionsPage from './pages/dashboard/requisitions/manage/manage';
import RFQDetailsPage from './pages/dashboard/rfqs/view/view_rfqs';
import CreateRFQPage from './pages/dashboard/rfqs/create/create';
import AddVendorPage from './pages/dashboard/vendors/add/add';
import VendorRFQsPage from './pages/dashboard/vendors/qoutes/qoutes';
import SubmitQuotePage from './pages/dashboard/vendors/qoutes/submit/submit';
import SelectVendorPage from './pages/dashboard/vendors/select/select';
import VendorDashboard from './pages/vendor-dash/vendor-dashboard';
import EmployeeDashboard from './pages/employee-dash/employee-dashboard';
import VendorPODetailsPage from './pages/vendor-dash/purchase-orders/accept/accept';
import TrackDeliveriesPage from './pages/dashboard/purchase-orders/confirm/confirm';
import InvoicesPage from './pages/dashboard/invoice/invoice';
import SubmitInvoicePage from './pages/vendor-dash/invoices/invoices';
import VendorInvoiceSubmissionPage from './pages/vendor-dash/invoices/invoices';
import InvoiceManagement from './pages/dashboard/invoice/manage/manage';
import PaymentPage from './pages/dashboard/invoice/pay/pay';



function App() {
  return (
    <div>
      <AuthProvider>
      
      <BrowserRouter>
        <Routes>
          <Route path="/hrms-client" element={<Home />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/purchase" element={<PurchaseOrdersPage/>} />
          <Route path="/requisitions" element={<NewRequisitionPage/>} />
          <Route path="/rfqs" element={<RFQsPage/>}/>
          <Route path="/rfqs/view" element={<RFQDetailsPage/>}/>
          <Route path="/rfqs/create" element={<CreateRFQPage/>}/>
          <Route path="/vendors" element={<VendorsPage/>}/>
          <Route path="/vendors/qoutes" element={<VendorRFQsPage/>}/>
          <Route path="/vendors/qoutes/submit" element={<SubmitQuotePage/>}/>
          <Route path="/vendors/add" element={<AddVendorPage/>}/>
          <Route path="/vendors/select" element={<SelectVendorPage/>}/>
          <Route path="/requisitions/manage" element={<ManageRequisitionsPage/>} />

          <Route path="/vendor-dash" element={<VendorDashboard/>}/>
          <Route path="/invoices" element={<InvoicesPage/>}/>
          <Route path="/invoices/pay" element={<PaymentPage/>}/>
          <Route path="/invoices/manage" element={<InvoicesPage/>}/>
          <Route path="/invoices/submit" element={<VendorInvoiceSubmissionPage/>}/>
          <Route path="/employee-dash" element={<EmployeeDashboard/>}/>
          <Route path="/track-deliveries" element={<TrackDeliveriesPage/>}/>

          <Route path="/vendor-purchase-order" element={<VendorPODetailsPage/>}/>
        </Routes>
      </BrowserRouter>
      
      </AuthProvider>
      
    </div> 
  );
}

export default App;
