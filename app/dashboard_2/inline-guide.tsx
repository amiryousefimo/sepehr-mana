"use client";

import {useId, useRef} from "react";
import styles from "./dashboard.module.css";

export function InlineGuide({title, text}: {title: string; text: string}) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  return <>
    <button ref={trigger} type="button" className={styles.guideButton} aria-label={'راهنما: ' + title}
      aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><span aria-hidden="true">؟</span></button>
    <dialog ref={dialog} className={styles.guideDialog} aria-labelledby={titleId} onClose={() => trigger.current?.focus()}>
      <h2 id={titleId}>{title}</h2>
      <p>{text}</p>
      <button type="button" className="button button--secondary" autoFocus onClick={() => dialog.current?.close()}>بستن</button>
    </dialog>
  </>;
}
