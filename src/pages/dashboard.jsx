import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import WelcomeBar from "../components/WelcomeBar";
import SwapRequests from "../components/SwapRequests";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-content max-w-4xl mx-auto px-4 pt-6 md:pl-[270px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <WelcomeBar />
        </div>

        <SwapRequests />
      </div>

      <button
        className="fab-add-request"
        onClick={() => navigate("/add-request")}
      >
        +
      </button>
    </div>
  );
};

export default DashboardPage;
