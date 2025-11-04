'use client';

import ErrorComponent from 'next/error';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <ErrorComponent statusCode={404} />
      </body>
    </html>
  );
}
