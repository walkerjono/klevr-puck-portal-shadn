import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const fieldTypes = [
  "text",
  "number",
  "password",
  "date",
  "file",
] as const;

export type FieldTypes = (typeof fieldTypes)[number];

export interface CompoundFieldProps {
  id?: string;
  name: string;
  label: string;
  type: FieldTypes;
}

export const CompoundField = (props: CompoundFieldProps) => {
  return (
    <Label className="grid w-full max-w-sm items-center gap-1">
      {props.label}
      <Input id={props.id} name={props.name} type={props.type} />
    </Label>
  );
};
