import logo from '../../assets/ustp-things-logo.png';

export default function Logo() {
  return (
    <div className="flex items-center">
      <img src={logo} alt="USTP Things Logo" className="w-16 h-10 object-contain" />
    </div>
  );
} 