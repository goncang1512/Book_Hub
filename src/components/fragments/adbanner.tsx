import React, { useEffect } from "react";

type AdBannerType = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
};

export default function Adbanner({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerType) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      data-ad-client={`ca-pub-4121473407235803`}
      data-ad-format={dataAdFormat}
      data-ad-slot={dataAdSlot}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
      style={{ display: "block" }}
    />
  );
}
