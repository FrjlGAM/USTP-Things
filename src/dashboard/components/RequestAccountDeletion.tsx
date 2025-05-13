import React from "react";

type RequestAccountDeletionProps = {
  onClose: () => void;
};

const RequestAccountDeletion: React.FC<RequestAccountDeletionProps> = ({ onClose }) => (
  <div>
    <div>Request Account Deletion Modal</div>
    <button onClick={onClose}>Close</button>
  </div>
);

export default RequestAccountDeletion;
