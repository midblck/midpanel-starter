import React from 'react';

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className='h-full'>{children}</main>;
}
