import Image from "next/image";
import { useRouter } from 'next/navigation';
import logo from "../../WAT.png";

interface HeaderProps {
  toggleTheme: () => void;
  user: any;
  signOut: any;
  authStatus: string;
}

export default function GreenHeader({ toggleTheme, user, signOut, authStatus }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <Image
              src={logo}
              alt="WAT Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-emerald-900">wat!?</span>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-emerald-100 transition-colors mr-2 text-emerald-700"
            aria-label="Switch to Tropical Mode"
          >
            {/* Sun Icon for Light Mode */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            {authStatus === 'authenticated' ? (
              <>
                <span className="text-sm text-emerald-800 font-medium hidden sm:inline">
                  {user?.signInDetails?.loginId}
                </span>
                <button
                  onClick={signOut}
                  className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors group flex items-center gap-2"
                >
                  <span>ログアウト</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  ログイン
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
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
