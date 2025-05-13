import React from "react";
import ustpLogo from "../../assets/ustp-things-logo.png";

export default function Settings() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Settings Header */}
      <div
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          height: 72,
          paddingLeft: 24,
          paddingRight: 24,
          gap: 18,
          borderBottom: "1px solid #ccc",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.04)",
        }}
      >
        <img
          src={ustpLogo}
          alt="USTP Things Logo"
          className="h-14 w-auto"
        />
        <div style={{
          width: 2,
          height: 36,
          background: "#F48C8C",
          marginLeft: 18,
          marginRight: 18,
        }} />
        <h1 className="text-3xl font-bold" style={{ color: "#F88379" }}>
          Settings
        </h1>
      </div>
      {/* Main content */}
      <div style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24 }}>
        {/* My Account */}
        <div
          style={{
            color: "#7A8A8D",
            fontWeight: 700,
            marginBottom: 8,
            fontSize: 18,
            fontFamily: "inherit",
          }}
        >
          My Account
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 24,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Account & Security <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        {/* Settings */}
        <div
          style={{
            color: "#7A8A8D",
            fontWeight: 700,
            marginBottom: 8,
            fontSize: 18,
            fontFamily: "inherit",
          }}
        >
          Settings
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Privacy Settings <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 24,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Blocked Users <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        {/* Support */}
        <div
          style={{
            color: "#7A8A8D",
            fontWeight: 700,
            marginBottom: 8,
            fontSize: 18,
            fontFamily: "inherit",
          }}
        >
          Support
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Community Rules <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 64,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Request Account Deletion <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        {/* Logout */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <button
            style={{
              border: "2px solid #F48C8C",
              color: "#F48C8C",
              fontWeight: 600,
              fontSize: 18,
              borderRadius: 6,
              padding: "10px 100px",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
