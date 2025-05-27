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
import TravelRequestForm from './pages/employee-dash/travel';
import SupervisorApprovalPage from './pages/dashboard/requisitions/travel';
import FinalApproverDashboard from './pages/dashboard/requisitions/final';
import FinanceProcessingDashboard from './pages/dashboard/requisitions/finance';
import TravelReconciliation from './pages/dashboard/requisitions/recon';
import TravelDashboard from './pages/dashboard/requisitions/manage/travel-dash';
import InternationalTravelRequest from './pages/dashboard/requisitions/manage/international';
import TravelExecutionReconciliation from './pages/dashboard/requisitions/manage/travel-exec-recon';
import FinanceProcessing from './pages/dashboard/requisitions/manage/finance-travel';
import FinanceReconciliationReview from './pages/dashboard/requisitions/manage/finance-recon-review';
import FleetCoordinator from './pages/dashboard/requisitions/manage/fleet';
import ProcurementDashboardWithSidebar from './pages/dashboard/dashboard';
import FoodBudgetPlanner from './pages/FoodBudgetPlanner';
import ResetPassword from './pages/login/ResetPassword';
import ForgotPassword from './pages/login/ForgotPassword';
import TermsOfService from './pages/login/TermsOfService';
import PrivacyPolicy from './pages/login/PrivacyPolicy';
import UserProfilePage from './pages/User/user';
import VendorRegistration from './pages/vendor-dash/registration/registration';
import EmployeesPage from './pages/dashboard/employee/employee';
import DepartmentsPage from './pages/dashboard/departments/departments';
import VendorApprovalPage from './pages/dashboard/vendors/registration';



function App() {
  return (
    <div>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/*Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
           <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
           {/*PO,Finance and Admin Routes */}
          <Route path="/dash/new" element={<ProcurementDashboardWithSidebar/>}/>
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/purchase" element={<PurchaseOrdersPage/>} />
          <Route path="/rfqs/create" element={<CreateRFQPage/>}/>
          <Route path="/rfqs/view" element={<RFQDetailsPage/>}/>
          <Route path="/vendors/add" element={<AddVendorPage/>}/>
          <Route path="/vendors/select" element={<SelectVendorPage/>}/>
          <Route path="/invoices" element={<InvoicesPage/>}/>
          <Route path="/invoices/pay" element={<PaymentPage/>}/>
          <Route path="/invoices/manage" element={<InvoicesPage/>}/>
          <Route path="/travel/recon/finance/review" element={<FinanceReconciliationReview/>}/>
          <Route path="/travel/fleet/cordinator" element={<FleetCoordinator/>}/>
          <Route path="/travel/recon/finance/processing" element={<FinanceProcessing/>}/>
          <Route path="/travel/manage" element={<SupervisorApprovalPage/>}/>
          <Route path="/travel/manage/final" element={<FinalApproverDashboard/>}/>
          <Route path="/travel/manage/finance" element={<FinanceProcessingDashboard/>}/>
          <Route path="/track-deliveries" element={<TrackDeliveriesPage/>}/>
          <Route path="/requisitions/manage" element={<ManageRequisitionsPage/>} />
          <Route path="/vendors" element={<VendorsPage/>}/>
          <Route path="/food" element={<FoodBudgetPlanner/>}/>
          <Route path="/employee" element={<EmployeesPage/>}/>
          <Route path="/departments" element={<DepartmentsPage/>}/>
              <Route path="/pending/registration" element={<VendorApprovalPage/>}/>

   
           {/*Employee Routes */}
          <Route path="/employee-dash" element={<EmployeeDashboard/>}/>
          <Route path="/requisitions" element={<NewRequisitionPage/>} />
          <Route path="/travel/manage/dash" element={<TravelDashboard/>}/>
          <Route path="/international-travel" element={<InternationalTravelRequest/>}/>
          <Route path="/travel/recon" element={<TravelExecutionReconciliation/>}/>
          <Route path="/travel/manage/recon" element={<TravelReconciliation/>}/>
          <Route path="/local-travel" element={<TravelRequestForm/>}/>
          
          
          {/*Vendor Routes */}
          <Route path="/vendor-dash" element={<VendorDashboard/>}/>
          <Route path="/vendors/qoutes" element={<VendorRFQsPage/>}/>
          <Route path="/vendors/qoutes/submit" element={<SubmitQuotePage/>}/>
          <Route path="/invoices/submit" element={<VendorInvoiceSubmissionPage/>}/>
          <Route path="/vendor-purchase-order" element={<VendorPODetailsPage/>}/>
           <Route path="/vendor-registration" element={<VendorRegistration/>}/>
       
        </Routes>
      </BrowserRouter>      
      </AuthProvider>  
    </div> 
  );
}

export default App;
