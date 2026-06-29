import { ComponentConfig } from "@puckeditor/core";
import { KlevrList, type KlevrListProps } from "@/puck/config/components/klevr-list/klevr-list";
import { padding, paddingDefaults } from "@/puck/config/fields";

export type { KlevrListProps };

const conf: ComponentConfig<KlevrListProps> = {
  fields: {
    title: { type: "text" },
    dataSource: { type: "text" },
    entity: { type: "text" },
    metadataSource: { 
      type: "text",
      label: "Metadata Source"
    },
    columns: {
      type: "array",
      arrayFields: {
        key: { type: "text" },
        label: { type: "text" },
        template: {
          type: "select",
          options: [
            { label: "default", value: "default" },
            { label: "badge", value: "badge" },
            { label: "date", value: "date" },
          ],
        },
      },
      getItemSummary: (item: KlevrListProps["columns"][number], index = 0) =>
        item.label || `Column ${index + 1}`,
    },
    limit: { type: "number", min: 1 },
    useRecordFilter: {
      type: "radio",
      options: [
        { label: "false", value: false },
        { label: "true", value: true },
      ],
    },
    recordFilterField: { type: "text" },
    enablePagination: {
      type: "radio",
      options: [
        { label: "false", value: false },
        { label: "true", value: true },
      ],
    },
    rowsPerPage: { type: "number", min: 1 },
    enableSorting: {
      type: "radio",
      options: [
        { label: "false", value: false },
        { label: "true", value: true },
      ],
    },
    enableSearch: {
      type: "radio",
      options: [
        { label: "false", value: false },
        { label: "true", value: true },
      ],
    },
    enableColumnChooser: {
      type: "radio",
      options: [
        { label: "false", value: false },
        { label: "true", value: true },
      ],
    },
    enableFacetFilters: {
      type: "radio",
      options: [
        { label: "false", value: false },
        { label: "true", value: true },
      ],
    },
    facetFiltersLayout: {
      type: "select",
      options: [
        { label: "horizontal", value: "horizontal" },
        { label: "vertical", value: "vertical" },
      ],
    },
    padding,
  },
  defaultProps: {
    title: "Project table",
    dataSource: "/api/mock/projects",
    entity: "projects",
    metadataSource: "/api/mock/field-metadata",
    columns: [
      { key: "name", label: "Name", template: "default" },
      { key: "status", label: "Status", template: "badge" },
      { key: "progress", label: "Progress", template: "default" },
      { key: "start", label: "Start", template: "default" },
      { key: "end", label: "End", template: "default" },
    ],
    limit: 10,
    useRecordFilter: false,
    recordFilterField: "id",
    enablePagination: false,
    rowsPerPage: 10,
    enableSorting: true,
    enableSearch: true,
    enableColumnChooser: true,
    enableFacetFilters: true,
    facetFiltersLayout: "horizontal",
    padding: {
      ...paddingDefaults,
      top: "none",
      bottom: "none",
    },
  },
  render: KlevrList,
};

export default conf;
