import React from "react";
import Script from "next/script";

export default function AdSense() {
  return (
    <Script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4121473407235803`}
      strategy="afterInteractive"
    />
  );
}
