import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Loader from "./components/shared/small/Loader";
import GlobalAPILoader from "./components/shared/small/GlobalLoaderApi";

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

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Suspense fallback={<Loader />}>
          <Routes>
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
          </Routes>
        </Suspense>
      </BrowserRouter>
      <GlobalAPILoader />
    </>
  );
}

export default App;
