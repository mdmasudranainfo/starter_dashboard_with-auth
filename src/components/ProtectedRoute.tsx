'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

import { Spin } from 'antd';
import { ClientPageRoot } from 'next/dist/client/components/client-page';


interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

//   console.log(session, status);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  // The middleware handles the protection, so here we just render the children
  // This avoids hydration issues by ensuring consistent render between server and client
  return <>{children}</>;
}