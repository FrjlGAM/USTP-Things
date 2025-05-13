import React from "react";
import { useNavigate } from "react-router-dom";
import homeLogo from "../../assets/ustp thingS/Home.png";
import peopleIcon from "../../assets/ustp thingS/People.png";

type BlockedUsersProps = {
  onSettingsClick: () => void;
};

export default function BlockedUsers({ onSettingsClick }: BlockedUsersProps) {
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
            Blocked Users
          </span>
        </div>
      </div>
      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 140,
          paddingLeft: 24,
          paddingRight: 24,
          height: "100%",
        }}
      >
        <img
          src={peopleIcon}
          alt="Blocked Users"
          style={{ width: 60, height: 60, opacity: 0.5, display: "block", margin: "0 auto" }}
        />
        <div
          style={{
            color: "#F88379",
            fontWeight: 600,
            marginTop: 8,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          No blocked user yet
        </div>
      </div>
    </div>
  );
}
