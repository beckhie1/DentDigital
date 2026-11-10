"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getConsent } from "@/components/shell/ConsentBanner";
import { getVisitorId } from "@/lib/visitor-id";

/**
 * Loads the Meta pixel and fires PageView — only after the visitor has chosen
 * "Godta alle" in the consent banner (GDPR). No consent → no pixel.
 * Sends `external_id` (advanced matching) so browser events are matchable and
 * pair with the same id on the Conversions API.
 */
export default function MetaPixel({ pixelId }: { pixelId: string }) {
  const [allowed, setAllowed] = useState(false);
  const [xid, setXid] = useState("");

  useEffect(() => {
    const check = () => {
      const ok = getConsent() === "all";
      setAllowed(ok);
      if (ok) setXid(getVisitorId());
    };
    check();
    window.addEventListener("dentdigital-consent", check);
    return () => window.removeEventListener("dentdigital-consent", check);
  }, []);

  if (!allowed) return null;

  const initArgs = xid ? `'${pixelId}', { external_id: '${xid}' }` : `'${pixelId}'`;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${initArgs});
fbq('track', 'PageView');`}
    </Script>
  );
}
