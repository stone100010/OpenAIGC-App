import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '登录注册 - OpenAIGC',
  description: '登录或注册OpenAIGC账号',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {children}
    </div>
  );
}
