import React, { useState } from "react";
import Settings from "./Settings";
import AccountandSecurity from "./AccountandSecurity";

export default function SettingsContainer() {
  const [view, setView] = useState("settings");

  return (
    <>
      {view === "settings" && (
        <Settings onAccountSecurityClick={() => setView("account")} />
      )}
      {view === "account" && (
        <AccountandSecurity onBack={() => setView("settings")} />
      )}
    </>
  );
}
