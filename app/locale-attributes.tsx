"use client";

import {useEffect} from "react";

// Sets lang and dir on <html> for the current locale.
// Runs immediately so there is no visible flash on English pages.
export function LocaleAttributes({locale, dir}: {locale: string; dir: string}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
