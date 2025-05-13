import React, { useState } from "react";
import homeLogo from "../../assets/ustp thingS/Home.png";
import { useNavigate } from "react-router-dom";


// Props for navigation back to settings
export type PrivacySettingsProps = {
  onSettingsClick: () => void;
};

export default function PrivacySettings({ onSettingsClick }: PrivacySettingsProps) {
  const [profilePrivate, setProfilePrivate] = useState(false);
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
            Privacy Settings
          </span>
        </div>
      </div>
      {/* Main content */}
      <div style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24 }}>
        <div
          style={{
            borderRadius: 4,
            background: "#FFE9E9",
            marginBottom: 24,
            padding: 0,
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              fontFamily: "inherit",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "#222" }}>My Profile</div>
              <div style={{ color: "#888", fontSize: 15, marginTop: 2 }}>
                Enable the option to hide your Follower and Following list from other USTP Things users
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={profilePrivate}
                onChange={() => setProfilePrivate((v) => !v)}
                style={{ display: "none" }}
              />
              <span
                style={{
                  width: 40,
                  height: 22,
                  background: profilePrivate ? "#F88379" : "#ccc",
                  borderRadius: 22,
                  position: "relative",
                  transition: "background 0.2s",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: profilePrivate ? 20 : 2,
                    top: 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px #0002",
                    transition: "left 0.2s",
                  }}
                />
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
