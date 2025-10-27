import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import LandingHeader from "../../../components/public/landing-header/landing-header";
import Button from "../../../components/shared/small/landing-Button";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import getEnv from "../../../configs/config";
import { useCreatePaymentIntentMutation } from "../../../redux/apis/paymentApis";

const stripePromise = loadStripe(getEnv("STRIPE_PUBLISH_KEY"));

function CheckoutForm({ name, email, amount, onClose }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [payProcessing, setPayProcessing] = useState(false);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPayProcessing(true);
    try {
      const res = await createPaymentIntent({
        name,
        email,
        currency: "USD",
        amount,
        paymentType: "donation",
      }).unwrap();

      const { clientSecret } = res;
      const card = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { email } },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Thank you for your donation!");
        onClose();
        navigate("/blog");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Payment failed. Try again.");
    } finally {
      setPayProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111827",
                fontWeight: "500",
                fontFamily: "Inter, system-ui, sans-serif",
                "::placeholder": { color: "#6B7280", fontWeight: "400" },
              },
              invalid: { color: "#EF4444", iconColor: "#EF4444" },
            },
            hidePostalCode: true,
          }}
          className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <Button
          variant="outline"
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={payProcessing}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {payProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            `Donate $${amount}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function DonateUs() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const emailRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    terms: false,
    privacyPolicy: false,
  });
  const [errors, setErrors] = useState({});

  const donationInfo = {
    title: "Support Our Mission",
    description:
      "Your contribution helps us grow and make a bigger impact every day.",
    minAmount: 1,
    benefits: [
      "Keep the platform running",
      "Get exclusive updates",
      "Priority support",
      "Recognition on our website",
    ],
  };

  const handleCancel = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      terms: false,
      privacyPolicy: false,
    });
    setErrors({});
    toast.success("Form cleared");
  };

  const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Name is required";
      case "email":
        return !value
          ? "Email is required"
          : !validateEmail(value)
          ? "Enter a valid email address"
          : "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePayClick = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (key !== "terms" && key !== "privacyPolicy") {
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (!form.terms) newErrors.terms = "You must accept Terms & Conditions";
    if (!form.privacyPolicy)
      newErrors.privacyPolicy = "You must accept Privacy Policy";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    if (!amount || amount < donationInfo.minAmount)
      return toast.error(`Minimum donation is $${donationInfo.minAmount}`);

    setShowPaymentModal(true);
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col max-lg:py-20">
      <LandingHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* LEFT SECTION */}
          <motion.div
            className="lg:w-1/2 bg-white rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col justify-between relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-[#0b5c83]/10 text-[#0b5c83] rounded-full p-5 shadow-lg mb-5">
                <FontAwesomeIcon
                  icon={faHandHoldingDollar}
                  className="text-3xl"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {donationInfo.title}
              </h3>
              <p className="text-gray-600 mb-8">{donationInfo.description}</p>
              <ul className="space-y-3 text-left">
                {donationInfo.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-[#0b5c83] rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div variants={itemVariants} className="lg:flex-1">
            <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="mb-8 text-center lg:text-left">
                <h4 className="text-3xl font-bold text-gray-900 mb-2">
                  Make a Donation
                </h4>
                <p className="text-gray-600">
                  Enter your details to support our mission
                </p>
              </div>

              <form onSubmit={handlePayClick} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0b5c83] outline-none"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      ref={emailRef}
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0b5c83]"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Donation Amount */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Donation Amount ($)
                  </label>
                  <input
                    type="number"
                    min={donationInfo.minAmount}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0b5c83] outline-none"
                  />
                </div>

                {/* Terms */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      name="terms"
                      type="checkbox"
                      checked={form.terms}
                      onChange={handleChange}
                      className="accent-[#0b5c83]"
                    />
                    <span className="text-sm">
                      I agree to the{" "}
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        className="text-[#0b5c83] font-semibold hover:underline"
                      >
                        Terms & Conditions
                      </a>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-500 text-sm">{errors.terms}</p>
                  )}

                  <label className="flex items-center gap-2">
                    <input
                      name="privacyPolicy"
                      type="checkbox"
                      checked={form.privacyPolicy}
                      onChange={handleChange}
                      className="accent-[#0b5c83]"
                    />
                    <span className="text-sm">
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        className="text-[#0b5c83] font-semibold hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.privacyPolicy && (
                    <p className="text-red-500 text-sm">
                      {errors.privacyPolicy}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200"
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl transition-all duration-200 ${
                      form.email &&
                      validateEmail(form.email) &&
                      form.terms &&
                      form.privacyPolicy
                        ? "bg-[#0b5c83] text-white hover:opacity-90"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={
                      !(
                        form.email &&
                        validateEmail(form.email) &&
                        form.terms &&
                        form.privacyPolicy
                      )
                    }
                  >
                    Donate ${amount}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPaymentModal(false)}
            ></div>

            <motion.div
              className="bg-white rounded-3xl w-full max-w-md mx-auto relative z-10 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="bg-[#0b5c83] p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold">Complete Your Donation</h4>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-1 hover:bg-white/20 rounded-full"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/80 text-sm">
                  You’re almost there! Enter your card details to finish.
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Donation Amount
                    </p>
                    <p className="text-sm text-gray-500">One-time payment</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${amount}
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    name={form.name}
                    email={form.email}
                    amount={amount}
                    onClose={() => setShowPaymentModal(false)}
                  />
                </Elements>

                <p className="mt-6 text-xs text-gray-500 text-center">
                  Your payment is secure and encrypted. We never store your card
                  details.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
