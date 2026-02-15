"use client"
import { Breadcrumb } from 'antd';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <ProtectedRoute>
      <div>
        {/* <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} /> */}
        <p>Home page</p>
        {session && session.user && (
          <div className=" rounded">
            <h2>Welcome, {session.user.name || session.user.phone}!</h2>
            <p>Role: {session.user.role}</p>
            <p>Session expires in 30 minutes</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
