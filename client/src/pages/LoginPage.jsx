export default function LoginPage() {
  const startGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="mx-auto max-w-3xl brutal-card bg-white p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-ink bg-butter text-4xl font-black shadow-brutal">U</div>
      <h2 className="mt-6 text-5xl font-black">Login to Urbyn</h2>
      <p className="mt-3 text-lg text-slate-600">Reporting an issue requires authentication. Sign in with Google to file reports, upvote, verify fixes, and access your profile.</p>
      <button onClick={startGoogle} className="brutal-btn mt-8 bg-mint px-6 py-4 text-xl">Continue with Google</button>
    </div>
  );
}
