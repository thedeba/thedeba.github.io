"use client";

import { useEffect } from "react";

// Google Analytics integration
export default function Analytics() {
  useEffect(() => {
    // Add your Google Analytics ID here
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

    if (GA_MEASUREMENT_ID && typeof window !== "undefined") {
      // Load Google Analytics script
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
      `;
      document.head.appendChild(script2);
    }
  }, []);

  return null;
}

