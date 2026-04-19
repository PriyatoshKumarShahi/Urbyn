import logo from '../assets/logo.png';
export default function LoginPage() {
  const startGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="mx-auto max-w-3xl brutal-card bg-white p-8 text-center">
      <img
                    src={logo}
                    alt="Urbyn Logo"
                    className="h-20 w-48 rounded-[18px] mx-auto items-center justify-center  p-1"
                  />
      <h2 className="mt-6 text-5xl font-black">Login to Urbyn</h2>
      <p className="mt-3 text-lg text-slate-600">Reporting an issue requires authentication. Sign in with Google to file reports, upvote, verify fixes, and access your profile.</p>
      <button onClick={startGoogle} className="brutal-btn mt-8 bg-mint px-6 py-4 text-xl">Continue with Google</button>
    </div>
  );
}
