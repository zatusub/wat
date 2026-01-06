import Image from "next/image";
import { useRouter } from 'next/navigation';
import logoDark from "../../WAT-d.png";

interface HeaderProps {
  toggleTheme: () => void;
  user: any;
  signOut: any;
  authStatus: string;
}

export default function TropicalHeader({ toggleTheme, user, signOut, authStatus }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d1117]/80 border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <Image
              src={logoDark}
              alt="WAT Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">wat!?</span>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[#21262d] transition-colors mr-2 text-gray-400 hover:text-white"
            aria-label="Switch to Green Mode"
          >
            {/* Moon Icon for Dark Mode */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            {authStatus === 'authenticated' ? (
              <>
                <span className="text-sm text-gray-400 font-medium hidden sm:inline">
                  {user?.signInDetails?.loginId}
                </span>
                <button
                  onClick={signOut}
                  className="bg-[#21262d] text-white border border-[#30363d] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#30363d] transition-colors group flex items-center gap-2"
                >
                  <span>ログアウト</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  ログイン
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-[#f472b6] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#ec4899] transition-colors shadow-lg shadow-pink-500/20"
                >
                  登録
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
