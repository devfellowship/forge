import { Download, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { AGENTS } from "@/data/skills";
import type { Scope } from "@/data/types";
import { copyText } from "@/lib/clipboard";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { AgentSelector } from "./AgentSelector";

interface InstallPanelProps {
  command: string;
  installable: boolean;
  agent: string;
  onAgentChange: (id: string) => void;
  scope: Scope;
  onScopeChange: (scope: Scope) => void;
}

const PanelLabel = ({ children }: { children: string }) => (
  <div className="mb-[9px] text-[11px] font-bold uppercase tracking-[.07em] text-[hsl(212_10%_54%)]">
    {children}
  </div>
);

export function InstallPanel({
  command,
  installable,
  agent,
  onAgentChange,
  scope,
  onScopeChange,
}: InstallPanelProps) {
  const agentLabel = AGENTS.find((a) => a.id === agent)?.label ?? "";

  const copy = (): void => {
    void copyText(command).then((ok) => {
      if (ok) toast.success("Copied install command");
      else toast.error("Couldn't copy to clipboard");
    });
  };

  if (!installable) {
    return (
      <Card className="p-[18px]">
        <PanelLabel>Install</PanelLabel>
        <div className="flex items-start gap-[10px] rounded-[9px] border border-[hsl(0_70%_50%/.25)] bg-[hsl(0_70%_50%/.08)] px-[12px] py-[10px] text-[12.5px] leading-[1.5] text-[hsl(0_75%_74%)]">
          <ShieldAlert className="mt-[1px] h-4 w-4 shrink-0" strokeWidth={2} />
          <span>
            This skill has an unrecognized identifier and can't be installed safely. The install
            command has been disabled.
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-[18px]">
      <PanelLabel>Install</PanelLabel>
      <CodeBlock command={command} size="sm" className="mb-[6px]" />
      <div className="mb-4 font-mono text-[11px] text-[hsl(212_9%_46%)]">
        # {agentLabel} · {scope}
      </div>

      <Button
        onClick={copy}
        icon={<Download className="h-[15px] w-[15px]" strokeWidth={2.2} />}
        className="mb-[18px] w-full"
      >
        Copy install command
      </Button>

      <PanelLabel>Target agent</PanelLabel>
      <div className="mb-4">
        <AgentSelector value={agent} onChange={onAgentChange} />
      </div>

      <PanelLabel>Scope</PanelLabel>
      <Select
        full
        options={[
          { id: "global", label: "Global" },
          { id: "project", label: "Project" },
        ]}
        value={scope}
        onChange={(id) => onScopeChange(id as Scope)}
      />
    </Card>
  );
}
