import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import Loader from "./components/shared/small/Loader";
import GlobalAPILoader from "./components/shared/small/GlobalLoaderApi";
import { useGetMyProfileQuery } from "./redux/apis/authApis";
import { useGetNotificationsQuery } from "./redux/apis/notificationsApis";
import { userExist, userNotExist } from "./redux/slices/authSlice";
import {
  noUnReadNotifications,
  unReadNotifications,
  setNotifications,
  addNotification,
} from "./redux/slices/notificationsSlice";
import { SOCKET } from "./utils/socket";
import toast from "react-hot-toast";
const LandingPage = lazy(() => import("./pages/public/landing/Landing"));
const BecomeMember = lazy(() =>
  import("./pages/public/become-member/Become-Member")
);
const DonateUs = lazy(() => import("./pages/public/donate-us/Donate-us"));
const TermsAndConditions = lazy(() =>
  import("./pages/public/terms-and-policy/termsAndConditions")
);
const PrivacyPolicy = lazy(() =>
  import("./pages/public/terms-and-policy/Privacy-Policy")
);
const ThankYouPage = lazy(() =>
  import("./pages/public/terms-and-policy/thank-you")
);
const Blog = lazy(() => import("./pages/public/blog/Blog"));
const AdminDashboard = lazy(() => import("./pages/admin/index"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const Donations = lazy(() => import("./pages/admin/donations/Donations"));
const Members = lazy(() => import("./pages/admin/members/members"));
const AdminBlogs = lazy(() => import("./pages/admin/blogs/Blogs"));
const Notification = lazy(() =>
  import("./pages/admin/notification/Notification")
);
const Users = lazy(() => import("./pages/admin/users/Users"));
const Archieved = lazy(() => import("./pages/admin/archieved/Archieved"));
const ArchievedActions = lazy(() =>
  import("./pages/admin/archieved/actions.archieved")
);
const ArchievedInvoices = lazy(() =>
  import("./pages/admin/archieved/Invoices.Archieved")
);
const Settings = lazy(() => import("./pages/admin/settings/Settings"));
const AdminLogin = lazy(() => import("./pages/admin/adminLogin/AdminLogin"));
const AdminResetPassword = lazy(() =>
  import("./pages/admin/adminLogin/AdminResetPassword")
);
const CompaniesResponseTime = lazy(() =>
  import("./pages/admin/Companies-Avg-Response/companies-response-time")
);

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, isSuccess, isError, isLoading } = useGetMyProfileQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !isSuccess,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (!isSuccess || !data?.data) return;
    dispatch(userExist(data.data));

    if (notifications?.data?.length > 0) {
      dispatch(unReadNotifications(notifications.unReadCount));
      dispatch(setNotifications(notifications.data));
    } else {
      dispatch(noUnReadNotifications());
    }
  }, [isSuccess, data?.data, notifications?.data]);

  useEffect(() => {
    if (isError) {
      dispatch(userNotExist());
      dispatch(noUnReadNotifications());
    }
  }, [isError]);

  useEffect(() => {
    if (!user?._id) return;
    SOCKET.auth = { userId: user?._id };
    SOCKET.connect();
    const handleNotification = (data) => {
      toast.success(data?.message || "New Notification", { duration: 5000 });
      dispatch(addNotification(data));
    };

    SOCKET.on("connect", () => {
      console.log("Connected to server with userId:", user._id);
    });

    SOCKET.on("notification:insert", handleNotification);

    return () => {
      SOCKET.off("notification:insert", handleNotification);
      SOCKET.off("connect");
      SOCKET.disconnect();
    };
  }, [user?._id, dispatch]);

  if (isLoading) return <Loader />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<Loader />}>
        {isSuccess || isError ? (
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/become-member" element={<BecomeMember />} />
            <Route path="/donate-us" element={<DonateUs />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/blog" element={<Blog />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/blog" replace />
                  )
                ) : (
                  <AdminLogin />
                )
              }
            />
            <Route
              path="/reset-password/:token"
              element={<AdminResetPassword />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} redirect="/">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="donations" element={<Donations />} />
              <Route path="notification" element={<Notification />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:pageId" element={<Users />} />
              <Route path="archieved" element={<Archieved />} />
              <Route path="archieved/actions" element={<ArchievedActions />} />
              <Route
                path="archieved/invoices"
                element={<ArchievedInvoices />}
              />
              <Route path="settings" element={<Settings />} />
              <Route
                path="companies-response-time"
                element={<CompaniesResponseTime />}
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Loader />
        )}
      </Suspense>
      <GlobalAPILoader />
    </BrowserRouter>
  );
}
export default App;
