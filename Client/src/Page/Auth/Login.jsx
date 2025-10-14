import React from "react";
import Language from "@/Components/Language/Language";
import { useLanguage } from '@/Context/LanguageContext';
const Login = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen">
      {/* Welcome Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center min-h-[40vh] md:h-[100vh] bg-[var(--six)] p-6 md:p-10">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
          {t('welcomeMessage')}
        </h1>
        <p className="text-white text-center mb-6 md:mb-10">
          {t('loginSubtitle')}
        </p>
        <Language/>
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 min-h-[60vh] md:h-[100vh] bg-[var(--two)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-[var(--six)] p-6 md:p-10 rounded-2xl w-full">
            <h1 className="text-xl md:text-2xl font-bold text-white text-center">
              {t('loginTitle')}
            </h1>
            <p className="text-white text-center mb-6 md:mb-10">
              {t('loginSubtitle')}
            </p>
            <form action="" className="flex flex-col gap-4">
              <input
                type="text"
                placeholder={t('username')}
                className="border text-white bg-transparent border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--two)]"
              />
              <input
                type="password"
                placeholder={t('password')}
                className="border text-white bg-transparent border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--two)]"
              />
              <button type="submit" className="bg-[var(--two)] text-[var(--six)] rounded-md p-2 md:p-3 font-bold cursor-pointer hover:opacity-90 transition-opacity">
                {t('login')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
