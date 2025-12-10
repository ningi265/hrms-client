import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './authcontext/authcontext';
import SubscriptionRequired from './components/SubscriptionRequired';
import LoadingSpinner from './components/LoadingSpinner'; // You need to create this

// Lazy load ALL pages
const Home = lazy(() => import('./pages'));
const LoginPage = lazy(() => import('./pages/login/login'));
const RegisterPage = lazy(() => import('./pages/register/register'));
const DashboardPage = lazy(() => import('./pages/dashboard/dashboard'));
const PurchaseOrdersPage = lazy(() => import('./pages/dashboard/purchase-orders/purchase-order'));
const NewRequisitionPage = lazy(() => import('./pages/dashboard/requisitions/requisitions'));
const VendorsPage = lazy(() => import('./pages/dashboard/vendors/vendors'));
const ManageRequisitionsPage = lazy(() => import('./pages/dashboard/requisitions/manage/manage'));
const RFQDetailsPage = lazy(() => import('./pages/dashboard/rfqs/view/view_rfqs'));
const CreateRFQPage = lazy(() => import('./pages/dashboard/rfqs/create/create'));
const AddVendorPage = lazy(() => import('./pages/dashboard/vendors/add/add'));
const VendorRFQsPage = lazy(() => import('./pages/dashboard/vendors/qoutes/qoutes'));
const SubmitQuotePage = lazy(() => import('./pages/dashboard/vendors/qoutes/submit/submit'));
const SelectVendorPage = lazy(() => import('./pages/dashboard/vendors/select/select'));
const VendorDashboard = lazy(() => import('./pages/vendor-dash/vendor-dashboard'));
const EmployeeDashboard = lazy(() => import('./pages/employee-dash/employee-dashboard'));
const VendorPODetailsPage = lazy(() => import('./pages/vendor-dash/purchase-orders/accept/accept'));
const TrackDeliveriesPage = lazy(() => import('./pages/dashboard/purchase-orders/confirm/confirm'));
const InvoicesPage = lazy(() => import('./pages/dashboard/invoice/invoice'));
const SubmitInvoicePage = lazy(() => import('./pages/vendor-dash/invoices/invoices'));
const PaymentPage = lazy(() => import('./pages/dashboard/invoice/pay/pay'));
const TravelRequestForm = lazy(() => import('./pages/employee-dash/travel'));
const SupervisorApprovalPage = lazy(() => import('./pages/dashboard/requisitions/travel'));
const FinalApproverDashboard = lazy(() => import('./pages/dashboard/requisitions/final'));
const FinanceProcessingDashboard = lazy(() => import('./pages/dashboard/requisitions/finance'));
const TravelReconciliation = lazy(() => import('./pages/dashboard/requisitions/recon'));
const TravelDashboard = lazy(() => import('./pages/dashboard/requisitions/manage/travel-dash'));
const InternationalTravelRequest = lazy(() => import('./pages/dashboard/requisitions/manage/international'));
const TravelExecutionReconciliation = lazy(() => import('./pages/dashboard/requisitions/manage/travel-exec-recon'));
const FinanceProcessing = lazy(() => import('./pages/dashboard/requisitions/manage/finance-travel'));
const FinanceReconciliationReview = lazy(() => import('./pages/dashboard/requisitions/manage/finance-recon-review'));
const FleetCoordinator = lazy(() => import('./pages/dashboard/requisitions/manage/fleet'));
const ProcurementDashboardWithSidebar = lazy(() => import('./pages/dashboard/dashboard'));
const FoodBudgetPlanner = lazy(() => import('./pages/FoodBudgetPlanner'));
const ResetPassword = lazy(() => import('./pages/login/ResetPassword'));
const ForgotPassword = lazy(() => import('./pages/login/ForgotPassword'));
const TermsOfService = lazy(() => import('./pages/login/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/login/PrivacyPolicy'));
const UserProfilePage = lazy(() => import('./pages/User/user'));
const VendorRegistration = lazy(() => import('./pages/vendor-dash/registration/registration'));
const EmployeesPage = lazy(() => import('./pages/dashboard/employee/employee'));
const DepartmentsPage = lazy(() => import('./pages/dashboard/departments/departments'));
const VendorApprovalPage = lazy(() => import('./pages/dashboard/vendors/registration'));
const VendorManagementDashboard = lazy(() => import('./pages/vendor-dash/registration/registrationManagement'));
const EmployeeRequisitionManagement = lazy(() => import('./pages/employee-dash/requisition/requistionManagement'));
const DriverDashboard = lazy(() => import('./pages/driver-dash/driver-dashboard'));
const EmployeeDetailPage = lazy(() => import('./pages/dashboard/employee/view-details'));
const EditEmployeePage = lazy(() => import('./pages/dashboard/employee/edit'));
const EmployeePerformancePage = lazy(() => import('./pages/dashboard/employee/performance'));
const GenerateReportPage = lazy(() => import('./pages/dashboard/employee/report'));
const ManageAccessPage = lazy(() => import('./pages/dashboard/employee/access'));
const DepartmentDetailPage = lazy(() => import('./pages/dashboard/departments/view-details.'));
const DepartmentEditPage = lazy(() => import('./pages/dashboard/departments/edit'));
const DepartmentPerformancePage = lazy(() => import('./pages/dashboard/departments/perfomance'));
const CompleteRegistration = lazy(() => import('./pages/dashboard/employee/complete-registration'));
const TripManagementDashboard = lazy(() => import('./pages/driver-dash/trip-management'));
const VehicleManagementDashboard = lazy(() => import('./pages/driver-dash/vehicle-management'));
const FinancialReconciliationDashboard = lazy(() => import('./pages/driver-dash/reconciliation'));
const BudgetOverviewDashboard = lazy(() => import('./pages/dashboard/finance/budget'));
const ApprovalWorkflow = lazy(() => import('./pages/dashboard/finance/budgeting'));
const BudgetAllocationPage = lazy(() => import('./pages/dashboard/finance/allocate'));
const InvoicePaymentPage = lazy(() => import('./pages/dashboard/finance/invoice'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/analytics'));
const ReportsPage = lazy(() => import('./pages/dashboard/reports'));
const BetaInvitationPage = lazy(() => import('./pages/waiting-list'));
const DemoPage = lazy(() => import('./pages/demo'));
const BillingPage = lazy(() => import('./pages/billing'));
const BillingManagement = lazy(() => import('./pages/billing-management'));
const TrialStatus = lazy(() => import('./components/TrialStatus'));
const Tenders = lazy(() => import('./pages/vendor-dash/tenders/tenders'));
const CreateTendersPage = lazy(() => import('./pages/dashboard/tenders/tenders'));
const VendorBidPortal = lazy(() => import('./pages/vendor-dash/tenders/bid'));
const VendorDetailsPage = lazy(() => import("./pages/dashboard/vendors/vendor-details"));

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/beta" element={<BetaInvitationPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/billing/manage" element={<BillingManagement />} />
              <Route path="/driver-dash" element={<DriverDashboard />} />
              <Route path="/trip-management" element={<TripManagementDashboard />} />
              <Route path="/vehicle-management" element={<VehicleManagementDashboard />} />
              <Route path="/driver-reconciliation" element={<FinancialReconciliationDashboard />} />
              <Route path="/complete-registration" element={<CompleteRegistration />} />
              <Route path="/bid-portal" element={<VendorBidPortal />} />
              
              {/* Protected Routes with Subscription Check */}
              <Route element={<SubscriptionRequired />}>
                <Route path="/vendors/:id" element={<VendorDetailsPage />} />
                <Route path="/dash/new" element={<ProcurementDashboardWithSidebar />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tenders" element={<CreateTendersPage />} />
                <Route path="/purchase" element={<PurchaseOrdersPage />} />
                <Route path="/rfqs/create" element={<CreateRFQPage />} />
                <Route path="/rfqs/view" element={<RFQDetailsPage />} />
                <Route path="/vendors/add" element={<AddVendorPage />} />
                <Route path="/vendors/select" element={<SelectVendorPage />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/invoices/pay" element={<PaymentPage />} />
                <Route path="/invoices/manage" element={<InvoicesPage />} />
                <Route path="/travel/recon/finance/review" element={<FinanceReconciliationReview />} />
                <Route path="/travel/fleet/cordinator" element={<FleetCoordinator />} />
                <Route path="/travel/recon/finance/processing" element={<FinanceProcessing />} />
                <Route path="/travel/manage" element={<SupervisorApprovalPage />} />
                <Route path="/travel/manage/final" element={<FinalApproverDashboard />} />
                <Route path="/travel/manage/finance" element={<FinanceProcessingDashboard />} />
                <Route path="/track-deliveries" element={<TrackDeliveriesPage />} />
                <Route path="/requisitions/manage" element={<ManageRequisitionsPage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/food" element={<FoodBudgetPlanner />} />
                <Route path="/budget" element={<BudgetOverviewDashboard />} />
                <Route path="/budgeting" element={<ApprovalWorkflow />} />
                <Route path="/budget-allocation" element={<BudgetAllocationPage />} />
                <Route path="/invoice-payment" element={<InvoicePaymentPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                
                {/* Employee Management Routes */}
                <Route path="/dashboard/employees" element={<EmployeesPage />} />
                <Route path="/dashboard/employees/:id" element={<EmployeeDetailPage />} />
                <Route path="/dashboard/employees/:id/edit" element={<EditEmployeePage />} />
                <Route path="/dashboard/employees/:id/performance" element={<EmployeePerformancePage />} />
                <Route path="/dashboard/employees/:id/report" element={<GenerateReportPage />} />
                <Route path="/dashboard/employees/:id/access" element={<ManageAccessPage />} />
                <Route path="/dashboard/departments/:id" element={<DepartmentDetailPage />} />
                <Route path="/dashboard/departments/:id/edit" element={<DepartmentEditPage />} />
                <Route path="/dashboard/departments/:id/performance" element={<DepartmentPerformancePage />} />
                
                {/* Legacy employee routes */}
                <Route path="/employee" element={<EmployeesPage />} />
                <Route path="/employee-details" element={<EmployeeDetailPage />} />
                <Route path="/edit-employee" element={<EditEmployeePage />} />
                <Route path="/employee-performance" element={<EmployeePerformancePage />} />
                <Route path="/employee-report" element={<GenerateReportPage />} />
                <Route path="/employee-access" element={<ManageAccessPage />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/pending/registration" element={<VendorApprovalPage />} />
                
                {/* Employee Routes */}
                <Route path="/employee-dash" element={<EmployeeDashboard />} />
                <Route path="/requisitions" element={<NewRequisitionPage />} />
                <Route path="/travel/manage/dash" element={<TravelDashboard />} />
                <Route path="/international-travel" element={<InternationalTravelRequest />} />
                <Route path="/travel/recon" element={<TravelExecutionReconciliation />} />
                <Route path="/travel/manage/recon" element={<TravelReconciliation />} />
                <Route path="/local-travel" element={<TravelRequestForm />} />
                <Route path="/requisition-management" element={<EmployeeRequisitionManagement />} />
                
                {/* Vendor Routes */}
                <Route path="/vendor-dash" element={<VendorDashboard />} />
                <Route path="/vendors/qoutes" element={<VendorRFQsPage />} />
                <Route path="/vendors/qoutes/submit" element={<SubmitQuotePage />} />
                <Route path="/invoices/submit" element={<SubmitInvoicePage />} />
                <Route path="/vendor-purchase-order" element={<VendorPODetailsPage />} />
                <Route path="/vendor-registration" element={<VendorRegistration />} />
                <Route path="/vendor-registration-management" element={<VendorManagementDashboard />} />
                <Route path="/tenders" element={<Tenders />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>      
      </AuthProvider>  
    </div> 
  );
}

export default App;