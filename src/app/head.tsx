export default function Head() {
  return (
    <>
      {/* Prevent Google Translate */}
      <meta name="google" content="notranslate" />

      {/* PWA manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Theme color */}
      <meta name="theme-color" content="#0070f3" />

      {/* iOS support */}
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
    </>
  );
}
