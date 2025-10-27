import { Navigate } from "react-router-dom";
import Loader from "../components/shared/small/Loader";

const ProtectedRoute = ({
  children,
  user,
  allowedRoles,
  redirect = "/login",
}) => {
  if (user === undefined) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to={redirect} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirect} replace />;
  }

  // Step 4: Authorized access
  return children;
};

export default ProtectedRoute;
