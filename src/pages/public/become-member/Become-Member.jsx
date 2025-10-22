import React, { useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import LandingHeader from "../../../components/public/landing-header/landing-header";
import Button from "../../../components/shared/small/landing-Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useCreateMemberMutation } from "../../../redux/apis/membersApis";

export default function BecomeMember() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    terms: false,
    privacyPolicy: false,
  });

  const [errors, setErrors] = useState({});
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const [createMember] = useCreateMemberMutation();

  const plan = {
    name: "Premium Membership",
    price: 100,
    currency: "USD",
    description:
      "Unlock exclusive features and join a growing network of professionals.",
    benefits: [
      "Full dashboard access",
      "Priority claim approvals",
      "Automated monthly invoices",
      "Dedicated support team",
      "Early access to new features",
      "Member-only resources",
    ],
  };

  // Validation Functions
  const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const validatePhone = (v) => /^[0-9]{10,15}$/.test(v);

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
      case "phone":
        return !value
          ? "Phone number is required"
          : !validatePhone(value)
          ? "Enter a valid phone number"
          : "";
      case "password":
        return value.length < 6 ? "Password must be at least 6 characters" : "";
      case "confirmPassword":
        return value !== form.password ? "Passwords do not match" : "";
      case "gender":
        return !value ? "Please select your gender" : "";
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

  const handleCancel = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      terms: false,
      privacyPolicy: false,
    });
    setErrors({});
    toast.success("Form cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields at once before submission
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

    try {
      const res = await createMember(form).unwrap();
      toast.success(res.message);
      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        terms: false,
        privacyPolicy: false,
      });
      setErrors({});
      navigate("/blog");
    } catch (err) {
      toast.error(err.data.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#0b5c83]/5 to-[#0b5c83]/10 flex flex-col">
      <LandingHeader />

      <div className="flex-1 flex items-center justify-center mt-10 px-4 py-10">
        <Motion.div
          className="w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
            {/* LEFT CARD */}
            <Motion.div variants={itemVariants} className="lg:w-1/3">
              <div className="h-full bg-white rounded-2xl shadow-xl border border-[#0b5c83]/20 p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="text-5xl font-extrabold text-gray-900 mb-2">
                    ${plan.price}
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    No hidden fees · Cancel anytime
                  </p>
                  <ul className="space-y-2">
                    {plan.benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <span className="text-[#0b5c83] font-bold">✔</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Motion.div>

            {/* RIGHT FORM */}
            <Motion.div variants={itemVariants} className="lg:flex-1">
              <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Start Your Journey
                </h4>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
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
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Email Address
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

                  {/* Row 2: Phone + Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0b5c83]"
                        placeholder="03XXXXXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0b5c83]"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Password + Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0b5c83]"
                        placeholder="********"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Confirm Password
                      </label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0b5c83]"
                        placeholder="********"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms & Privacy */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <input
                        name="terms"
                        type="checkbox"
                        checked={form.terms}
                        onChange={handleChange}
                        className="mt-1 accent-[#0b5c83]"
                      />
                      <label className="text-sm">
                        I agree to the{" "}
                        <a
                          href="/terms-and-conditions"
                          target="_blank"
                          className="text-[#0b5c83] font-semibold hover:underline"
                        >
                          Terms & Conditions
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-sm">{errors.terms}</p>
                    )}

                    <div className="flex items-start gap-2">
                      <input
                        name="privacyPolicy"
                        type="checkbox"
                        checked={form.privacyPolicy}
                        onChange={handleChange}
                        className="mt-1 accent-[#0b5c83]"
                      />
                      <label className="text-sm">
                        I agree to the{" "}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          className="text-[#0b5c83] font-semibold hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {errors.privacyPolicy && (
                      <p className="text-red-500 text-sm">
                        {errors.privacyPolicy}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                    >
                      Clear Form
                    </Button>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-4 font-bold rounded-xl bg-[#0b5c83] text-white hover:bg-[#0b5c83]/90 transition"
                    >
                      Become Member
                    </Button>
                  </div>
                </form>
              </div>
            </Motion.div>
          </div>
        </Motion.div>
      </div>
    </div>
  );
}
