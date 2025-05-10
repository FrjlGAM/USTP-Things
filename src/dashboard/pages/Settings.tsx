import React from "react";
import ustpLogo from "../../assets/ustp-things-logo.png";

export default function Settings() {
  return (
    <div style={{ minHeight: "100vh", background: "#E9E8FC" }}>
      {/* Top bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "3px solid #e0e0e0",
          boxShadow: "0 2px 4px #0001",
          padding: "0 0 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "18px 0 18px 24px",
            gap: 16,
          }}
        >
          <img
            src={ustpLogo}
            alt="USTP Things Logo"
            style={{ width: 56, height: 56, marginRight: 16 }}
          />
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#F48C8C",
              fontFamily: "inherit",
            }}
          >
            Settings
          </span>
        </div>
      </div>
      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px 0 16px" }}>
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
              padding: "10px 60px",
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
