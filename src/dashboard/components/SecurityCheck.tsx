import React from "react";
import ustpLogo from "../../assets/ustp-things-logo.png";
import closeIcon from "../../assets/ustp thingS/X button.png";

interface SecurityCheckProps {
  open: boolean;
  onClose: () => void;
  onVerify: () => void;
}

const SecurityCheck: React.FC<SecurityCheckProps> = ({ open, onClose, onVerify }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(180, 180, 255, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          padding: "32px 32px 32px 32px",
          minWidth: 420,
          maxWidth: "90vw",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          <img src={closeIcon} alt="Close" style={{ width: 32, height: 32 }} />
        </button>
        {/* Logo */}
        <img src={ustpLogo} alt="USTP Things" style={{ width: 90, marginBottom: 8 }} />
        {/* Title */}
        <div
          style={{
            color: "#F88379",
            fontWeight: 700,
            fontSize: 28,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Security Check
        </div>
        {/* Description */}
        <div
          style={{
            color: "#F88379",
            fontSize: 15,
            marginBottom: 32,
            textAlign: "center",
            maxWidth: 350,
          }}
        >
          To protect your account security, please verify your identity with one of the methods below.
        </div>
        <button
          onClick={onVerify}
          style={{
            border: "2px solid #F88379",
            color: "#F88379",
            background: "transparent",
            fontWeight: 600,
            fontSize: 18,
            borderRadius: 6,
            padding: "8px 64px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          Verify by Password
        </button>
      </div>
    </div>
  );
};

export default SecurityCheck;
