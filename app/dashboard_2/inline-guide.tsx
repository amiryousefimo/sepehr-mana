"use client";

import {useEffect, useId, useRef, useState} from "react";
import styles from "./dashboard.module.css";

const modeKey = "rasad-guide-mode";
function useGuideMode() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const sync = () => { try { setEnabled(localStorage.getItem(modeKey) === "1"); } catch {} };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(modeKey, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(modeKey, sync);
    };
  }, []);
  return [enabled, setEnabled] as const;
}

export function GuideModeButton() {
  const [enabled, setEnabled] = useGuideMode();
  return <button type="button" className={styles.modeToggle} aria-pressed={enabled} onClick={() => {
    setEnabled(!enabled);
    try { localStorage.setItem(modeKey, enabled ? "0" : "1"); window.dispatchEvent(new Event(modeKey)); } catch {}
  }}>{enabled ? "پنهان‌کردن راهنما" : "نیاز به راهنمایی دارم"}</button>;
}

export function InlineGuide({title, text}: {title: string; text: string}) {
  const [enabled] = useGuideMode();
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  return <>
    <button ref={trigger} type="button" className={styles.guideButton} hidden={!enabled} aria-label={'راهنما: ' + title}
      aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><span aria-hidden="true">؟</span></button>
    <dialog ref={dialog} className={styles.guideDialog} aria-labelledby={titleId} onClose={() => trigger.current?.focus()}>
      <h2 id={titleId}>{title}</h2>
      <p>{text}</p>
      <button type="button" className="button button--secondary" autoFocus onClick={() => dialog.current?.close()}>بستن</button>
    </dialog>
  </>;
}
