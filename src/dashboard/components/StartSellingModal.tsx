import React from "react";
import ustpLogo from "../../assets/ustp-things-logo.png";
import xIcon from "../../assets/ustp thingS/X button.png";

type Props = {
  open: boolean;
  onClose: () => void;
  onStartSelling: () => void;
};

const StartSellingModal: React.FC<Props> = ({ open, onClose, onStartSelling }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center border-2 border-[#F88379]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-2xl text-[#F88379] hover:text-red-400"
          onClick={onClose}
        >
          <img src={xIcon} alt="Close" className="w-8 h-8" />
        </button>
        <img src={ustpLogo} alt="USTP Things" className="w-32 mb-4" />
        <h2 className="text-2xl font-bold text-[#F88379] mb-2 text-center">
          Start Your Selling Journey
        </h2>
        <p className="text-center text-[#F88379] mb-8">
          Showcase your products, attract buyers, and boost your sales!
        </p>
        <button
          className="bg-[#F88379] text-white font-semibold px-8 py-2 rounded-full shadow hover:bg-[#f88379cc] transition"
          onClick={onStartSelling}
        >
          Start Selling
        </button>
      </div>
    </div>
  );
};

export default StartSellingModal;
