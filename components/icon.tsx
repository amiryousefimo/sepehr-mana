import {
  Activity,
  Blocks,
  BrainCircuit,
  ChartNoAxesCombined,
  CodeXml,
  DatabaseZap,
  GraduationCap,
  Layers3,
  Network,
  RefreshCw,
  ShieldCheck,
  Workflow
} from "lucide-react";
import type {IconName} from "@/lib/content";

const icons = {
  brain: BrainCircuit,
  code: CodeXml,
  database: DatabaseZap,
  workflow: Workflow,
  network: Network,
  graduation: GraduationCap,
  layers: Layers3,
  chart: ChartNoAxesCombined,
  shield: ShieldCheck,
  pulse: Activity,
  blocks: Blocks,
  refresh: RefreshCw
};

export function FeatureIcon({name}: {name: IconName}) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" strokeWidth={1.6} />;
}
