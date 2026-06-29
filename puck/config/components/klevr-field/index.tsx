import { ComponentConfig } from "@puckeditor/core";
import { KlevrField, type KlevrFieldProps } from "@/puck/config/components/klevr-field/klevr-field";
import { padding, paddingDefaults } from "@/puck/config/fields";
import fieldMetadata from "@/mock-data/field-metadata.json";

export type { KlevrFieldProps };

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldShape = {
  type: "select";
  options?: SelectOption[];
};

type FieldMetadataMap = Record<string, Record<string, unknown>>;

const metadata = fieldMetadata as FieldMetadataMap;

function toSelectOptions(values: string[]): SelectOption[] {
  return values.map((value) => ({
    label: value,
    value,
  }));
}

function getEntityOptions(): SelectOption[] {
  return toSelectOptions(Object.keys(metadata));
}

function getFieldOptions(entity: string): SelectOption[] {
  const entityMetadata = metadata[entity] ?? {};
  return toSelectOptions(Object.keys(entityMetadata));
}

const entityOptions = getEntityOptions();
const defaultEntity = entityOptions[0]?.value ?? "";
const defaultFieldKey = getFieldOptions(defaultEntity)[0]?.value ?? "";

function isSelectField(field: unknown): field is SelectFieldShape {
  return !!field && typeof field === "object" && (field as { type?: string }).type === "select";
}

const conf: ComponentConfig<KlevrFieldProps> = {
  fields: {
    metadataSource: { type: "text" },
    entity: {
      type: "select",
      options: entityOptions,
    },
    fieldKey: {
      type: "select",
      options: getFieldOptions(defaultEntity),
    },
    label: { type: "text" },
    placeholder: { type: "text" },
    helperText: { type: "text" },
    padding,
  },
  defaultProps: {
    metadataSource: "/api/mock/field-metadata",
    entity: defaultEntity,
    fieldKey: defaultFieldKey,
    label: "",
    placeholder: "",
    helperText: "",
    padding: {
      ...paddingDefaults,
      top: "none",
      bottom: "none",
    },
  },
  resolveFields: (data, params) => {
    const selectedEntity = data.props.entity || defaultEntity;
    const nextFields = { ...params.fields };

    if (isSelectField(nextFields.entity)) {
      nextFields.entity = {
        ...nextFields.entity,
        options: entityOptions,
      };
    }

    if (isSelectField(nextFields.fieldKey)) {
      nextFields.fieldKey = {
        ...nextFields.fieldKey,
        options: getFieldOptions(selectedEntity),
      };
    }

    return nextFields as typeof params.fields;
  },
  render: KlevrField,
};

export default conf;
