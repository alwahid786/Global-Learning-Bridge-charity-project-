import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/shared/small/landing-Button.jsx";
import { Card, CardContent } from "../../../components/shared/small/card.jsx";
import LandingHeader from "../../../components/public/landing-header/landing-header.jsx";
import logo from "../../../assets/logo/Logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faHandsHelping,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Sponsor a Child",
      desc: "Help provide quality education and school essentials to underprivileged children across the world.",
      icon: faGraduationCap,
    },
    {
      title: "Volunteer & Teach",
      desc: "Join our community of mentors and educators who dedicate their time to empower young minds through learning.",
      icon: faHandsHelping,
    },
    {
      title: "Build Learning Centers",
      desc: "Contribute to building digital classrooms and community learning centers in remote areas.",
      icon: faSchool,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-10 mt-34">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
          {/* Left Logo Area */}
          <motion.img
            src={logo}
            alt="Global Learning Bridge Logo"
            className="w-64 h-64 object-contain"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* Right Text Area */}
          <motion.div
            className="text-center md:text-left md:w-1/2 space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-[rgb(11,92,131)]">
              Bridging Hearts Through Education
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>Global Learning Bridge</strong> is a non-profit initiative
              committed to connecting learners, teachers, and donors to make
              education accessible for all. Together, we can light the path to a
              brighter future.
            </p>
            <Button
              onClick={() => navigate("/become-member")}
              className="bg-[#1A5D1A] text-white font-semibold hover:bg-[#134913]"
            >
              Get Involved
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h3 className="text-3xl font-bold text-[rgb(11,92,131)] mb-3">
            How You Can Make a Difference
          </h3>
          <p className="text-gray-600">
            Every contribution brings hope and opportunity to children around
            the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 bg-white">
                <CardContent className="p-6 space-y-3 text-center">
                  <FontAwesomeIcon
                    icon={card.icon}
                    className="text-5xl text-[rgb(11,92,131)] mb-2"
                  />
                  <h4 className="text-xl font-semibold text-[rgb(11,92,131)]">
                    {card.title}
                  </h4>
                  <p className="text-gray-600">{card.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[rgb(11,92,131)] text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} Global Learning Bridge. All Rights
        Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
