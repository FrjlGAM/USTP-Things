import React from "react";
import { useNavigate } from "react-router-dom";
import homeLogo from "../../assets/ustp thingS/Home.png";
// import { useNavigate } from "react-router-dom"; // Uncomment if you want to use navigate(-1)

type AccountandSecurityProps = {
  onSettingsClick: () => void;
};

export default function AccountandSecurity({ onSettingsClick }: AccountandSecurityProps) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          height: 72,
          paddingLeft: 55,
          paddingRight: 24,
          gap: 18,
          borderBottom: "1px solid #ccc",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.04)",
        }}
      >
        <img
          src={homeLogo}
          alt="Home Icon"
          className="h-7 w-auto"
          style={{ cursor: "pointer" }}
          onClick={() => navigate('/dashboard')}
        />
        <div style={{
          width: 2,
          height: 36,
          background: "#F48C8C",
          marginLeft: 18,
          marginRight: 18,
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="text-3xl font-bold"
            style={{ color: "#F88379", opacity: 0.63, cursor: "pointer" }}
            onClick={onSettingsClick}
          >
            Settings
          </span>
          <span
            className="text-3xl font-bold"
            style={{ color: "#F88379", opacity: 0.63 }}
          >
            &gt;
          </span>
          <span className="text-3xl font-bold" style={{ color: "#F88379" }}>
            Account & Security
          </span>
        </div>
      </div>
      {/* Main content */}
      <div style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24 }}>
        {/* Account Section */}
        <div
          style={{
            color: "#7A8A8D",
            fontWeight: 700,
            marginBottom: 8,
            fontSize: 18,
            fontFamily: "inherit",
          }}
        >
          Account
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
            My Profile <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
            Username <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
            Phone <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
            Email <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
            Change Password <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
      </div>
      {/* No visible back button */}
    </div>
  );
}
