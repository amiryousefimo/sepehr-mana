"use client";

import {ElderlyCareSurveyAdmin, type SurveyRecord} from "@/components/admin/elderly-care-survey-admin";

export type {SurveyRecord};

export function ElderlyCareSurveyTab({records}: {records: SurveyRecord[]}) {
  return <ElderlyCareSurveyAdmin records={records} />;
}
