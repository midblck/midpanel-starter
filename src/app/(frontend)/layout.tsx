import React from 'react';
import '../globals.css'; // Global styles only for frontend routes

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='h-full'>{children}</main>;
}
