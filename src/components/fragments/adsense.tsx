import React from "react";
import Script from "next/script";

type AdSenseType = {
  pId?: string;
};

export default function AdSense({ pId }: AdSenseType) {
  return (
    <Script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      strategy="afterInteractive"
    />
  );
}
