import type { ComponentConfig, Config } from "@puckeditor/core";
import BlockContainer from "./components/puck/BlockContainer";
import CardGrid from "./components/puck/CardGrid";
import ChoiceControl from "./components/puck/ChoiceControl";
import CurrencyControl from "./components/puck/CurrencyControl";
import DataTableBlock from "./components/puck/DataTableBlock";
import DatepickerControl from "./components/puck/DatepickerControl";
import DecimalControl from "./components/puck/DecimalControl";
import EmailControl from "./components/puck/EmailControl";
import FileControl from "./components/puck/FileControl";
import HeadingBlock from "./components/puck/HeadingBlock";
import HeroBanner from "./components/puck/HeroBanner";
import KlevrFieldControl from "./components/puck/KlevrFieldControl";
import MultipleLinesControl from "./components/puck/MultipleLinesControl";
import RichTextSection from "./components/puck/RichTextSection";
import SingleLineControl from "./components/puck/SingleLineControl";
import StatsPanel from "./components/puck/StatsPanel";
import TextAreaControl from "./components/puck/TextAreaControl";
import UrlControl from "./components/puck/UrlControl";
import WholeNumberControl from "./components/puck/WholeNumberControl";
import YesNoControl from "./components/puck/YesNoControl";
import { LayoutProps, WithLayout, withLayout } from "./components/puck/layout";

const defaultThemeClass =
  process.env.NEXT_PUBLIC_KLEVR_DEFAULT_THEME === "gov"
    ? "theme-gov"
    : "theme-default";

type Props = {
  HeadingBlock: WithLayout<{
    title: string;
    level?: "1" | "2" | "3" | "4" | "5" | "6";
    align?: "left" | "center" | "right";
    size?: "s" | "m" | "l" | "xl";
    useRecordTitle?: boolean;
    recordField?: string;
    recordTitlePrefix?: string;
  }>;
  HeroBanner: WithLayout<{
    title: string;
    subtitle: string;
    backgroundImage?: string;
  }>;
  CardGrid: WithLayout<{
    title: string;
    cards: { title: string; description: string; image?: string }[];
    columns?: number;
    displayColumns?: {
      key: "title" | "description" | "image";
      label: string;
    }[];
  }>;
  DataTableBlock: WithLayout<{
    title: string;
    dataSource: string;
    columns: { key: string; label: string }[];
    limit?: number;
    useRecordFilter?: boolean;
    recordFilterField?: string;
  }>;
  StatsPanel: WithLayout<{
    title: string;
    dataSource: string;
    orientation?: "horizontal" | "vertical";
  }>;
  RichTextSection: WithLayout<{
    title: string;
    content: string;
  }>;
  BlockContainer: WithLayout<{
    title?: string;
    mode: "flex" | "grid";
    gap: number;
    columns?: number;
    items: any;
  }>;
  SingleLineControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
    helperText?: string;
  }>;
  MultipleLinesControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
    required?: boolean;
    helperText?: string;
  }>;
  WholeNumberControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    required?: boolean;
    helperText?: string;
  }>;
  ChoiceControl: WithLayout<{
    label: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
    dataSource?: string;
    displayField?: string;
    valueField?: string;
    resultTemplate?: string;
    multiple?: boolean;
    defaultValue?: string;
    defaultValues?: string[];
    required?: boolean;
    helperText?: string;
  }>;
  KlevrFieldControl: WithLayout<{
    metadataSource: string;
    entity: string;
    fieldKey: string;
    label?: string;
    helperText?: string;
    placeholder?: string;
  }>;
  YesNoControl: WithLayout<{
    label: string;
    defaultValue?: boolean;
    helperText?: string;
  }>;
  DecimalControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    decimalPlaces?: number;
    required?: boolean;
    helperText?: string;
  }>;
  CurrencyControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: number;
    currencySymbol?: string;
    min?: number;
    max?: number;
    required?: boolean;
    helperText?: string;
  }>;
  DatepickerControl: WithLayout<{
    label: string;
    mode?: "date" | "datetime";
    defaultValue?: string;
    required?: boolean;
    helperText?: string;
  }>;
  EmailControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
    helperText?: string;
  }>;
  UrlControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
    helperText?: string;
  }>;
  TextAreaControl: WithLayout<{
    label: string;
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
    maxLength?: number;
    required?: boolean;
    helperText?: string;
  }>;
  FileControl: WithLayout<{
    label: string;
    accept?: string;
    multiple?: boolean;
    maxFileSizeMb?: number;
    required?: boolean;
    helperText?: string;
  }>;
};

const headingConfig: ComponentConfig<Props["HeadingBlock"]> = {
  fields: {
    title: { type: "text" },
    level: {
      type: "select",
      options: [
        { label: "H1", value: "1" },
        { label: "H2", value: "2" },
        { label: "H3", value: "3" },
        { label: "H4", value: "4" },
        { label: "H5", value: "5" },
        { label: "H6", value: "6" },
      ],
    },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    size: {
      type: "select",
      options: [
        { label: "Small", value: "s" },
        { label: "Medium", value: "m" },
        { label: "Large", value: "l" },
        { label: "XL", value: "xl" },
      ],
    },
    useRecordTitle: {
      type: "radio",
      options: [
        { label: "false", value: false },
        { label: "true", value: true },
      ],
    },
    recordField: { type: "text" },
    recordTitlePrefix: { type: "text" },
  },
  defaultProps: {
    title: "Heading",
    level: "1",
    align: "left",
    size: "l",
    useRecordTitle: false,
    recordField: "name",
    recordTitlePrefix: "",
    layout: {
      padding: "64px",
      height: "",
      grow: false,
      spanCol: 1,
      spanRow: 1,
    } as LayoutProps,
  },
  render: ({
    title,
    level,
    align,
    size,
    useRecordTitle,
    recordField,
    recordTitlePrefix,
  }) => (
    <HeadingBlock
      title={title}
      level={level}
      align={align}
      size={size}
      useRecordTitle={useRecordTitle}
      recordField={recordField}
      recordTitlePrefix={recordTitlePrefix}
    />
  ),
};

const blockContainerConfig: ComponentConfig<Props["BlockContainer"]> = {
  fields: {
    title: { type: "text" },
    mode: {
      type: "select",
      options: [
        { label: "Flex", value: "flex" },
        { label: "Grid", value: "grid" },
      ],
    },
    gap: { type: "number", min: 0 },
    columns: { type: "number", min: 1, max: 4 },
    items: { type: "slot" },
  },
  resolveFields: (data, { fields }) => {
    if (data.props.mode === "flex") {
      return {
        ...fields,
        columns: undefined,
      } as any;
    }

    return fields;
  },
  defaultProps: {
    title: "Block Container",
    mode: "grid",
    gap: 16,
    columns: 2,
    items: [],
  },
  render: ({ title, mode, gap, columns, items }) => (
    <BlockContainer
      title={title}
      mode={mode}
      gap={gap}
      columns={columns}
      items={items}
    />
  ),
};

export const config: Config<Props> = {
  root: {
    render: ({ children }) => (
      <div
        className={`klevr-content-theme ${defaultThemeClass} content-wrapper`}
      >
        {children}
      </div>
    ),
  },
  categories: {
    controls: {
      title: "Klevr Controls",
      components: ["KlevrFieldControl"],
    },
    components: {
      title: "Klevr Components",
      components: ["DataTableBlock"],
    },
    blocks: {
      title: "Klevr Blocks",
      components: ["HeroBanner", "CardGrid", "BlockContainer", "StatsPanel"],
    },
    generics: {
      title: "Generic Controls",
      components: [
        "HeadingBlock",
        "RichTextSection",
        "SingleLineControl",
        "MultipleLinesControl",
        "TextAreaControl",
        "WholeNumberControl",
        "DecimalControl",
        "CurrencyControl",
        "ChoiceControl",
        "KlevrFieldControl",
        "YesNoControl",
        "DatepickerControl",
        "EmailControl",
        "UrlControl",
        "FileControl",
      ],
    },
  },
  components: {
    StatsPanel: withLayout({
      fields: {
        title: { type: "text" },
        dataSource: { type: "text" },
        orientation: {
          type: "select",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
        },
      },
      defaultProps: {
        title: "Key metrics",
        dataSource: "/api/mock/programs",
        orientation: "horizontal",
      },
      render: ({ title, dataSource, orientation }) => (
        <StatsPanel
          title={title}
          dataSource={dataSource}
          layout={orientation}
        />
      ),
    }),
    DataTableBlock: withLayout({
      fields: {
        title: { type: "text" },
        dataSource: { type: "text" },
        columns: {
          type: "array",
          arrayFields: {
            key: { type: "text" },
            label: { type: "text" },
          },
        },
        limit: { type: "number" },
        useRecordFilter: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        recordFilterField: { type: "text" },
      },
      defaultProps: {
        title: "Project table",
        dataSource: "/api/mock/projects",
        columns: [
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
        ],
        limit: 10,
        useRecordFilter: false,
        recordFilterField: "id",
      },
      render: ({
        title,
        dataSource,
        columns,
        limit,
        useRecordFilter,
        recordFilterField,
      }) => (
        <DataTableBlock
          title={title}
          dataSource={dataSource}
          columns={columns}
          limit={limit}
          useRecordFilter={useRecordFilter}
          recordFilterField={recordFilterField}
        />
      ),
    }),
    CardGrid: withLayout({
      fields: {
        title: { type: "text" },
        cards: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            image: { type: "text" },
          },
        },
        columns: { type: "number" },
        displayColumns: {
          type: "array",
          arrayFields: {
            key: { type: "text" },
            label: { type: "text" },
          },
        },
      },
      defaultProps: {
        title: "Featured cards",
        cards: [
          {
            title: "Card one",
            description: "A short card description.",
          },
          {
            title: "Card two",
            description: "Another short description.",
          },
          {
            title: "Card three",
            description: "Useful supporting content.",
          },
        ],
        columns: 3,
        displayColumns: [
          { key: "image", label: "Image" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description" },
        ],
      },
      render: ({ title, cards, columns, displayColumns }) => (
        <CardGrid
          title={title}
          cards={cards}
          columns={columns}
          displayColumns={displayColumns}
        />
      ),
    }),
    RichTextSection: withLayout({
      fields: {
        title: { type: "text" },
        content: { type: "textarea" },
      },
      defaultProps: {
        title: "Section title",
        content: "<p>Write rich text content here.</p>",
      },
      render: ({ title, content }) => (
        <RichTextSection title={title} content={content} />
      ),
    }),
    HeroBanner: withLayout({
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        backgroundImage: { type: "text" },
      },
      defaultProps: {
        title: "Welcome to Klevr",
        subtitle: "A manual Puck build with theme-aware rendered content.",
      },
      render: ({ title, subtitle, backgroundImage }) => (
        <HeroBanner
          title={title}
          subtitle={subtitle}
          backgroundImage={backgroundImage}
        />
      ),
    }),
    HeadingBlock: withLayout(headingConfig),
    BlockContainer: withLayout(blockContainerConfig),
    SingleLineControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "text" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Single line",
        placeholder: "Enter text",
        defaultValue: "",
        required: false,
        helperText: "",
      },
      render: ({ label, placeholder, defaultValue, required, helperText }) => (
        <SingleLineControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    MultipleLinesControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "textarea" },
        rows: { type: "number", min: 2, max: 12 },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Multiple lines",
        placeholder: "Enter details",
        defaultValue: "",
        rows: 4,
        required: false,
        helperText: "",
      },
      render: ({
        label,
        placeholder,
        defaultValue,
        rows,
        required,
        helperText,
      }) => (
        <MultipleLinesControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={rows}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    WholeNumberControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "number" },
        min: { type: "number" },
        max: { type: "number" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Whole number",
        placeholder: "Enter a number",
        defaultValue: 0,
        required: false,
        helperText: "",
      },
      render: ({
        label,
        placeholder,
        defaultValue,
        min,
        max,
        required,
        helperText,
      }) => (
        <WholeNumberControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          min={min}
          max={max}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    ChoiceControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        multiple: {
          type: "radio",
          options: [
            { label: "Single", value: false },
            { label: "Multiple", value: true },
          ],
        },
        dataSource: { type: "text" },
        displayField: { type: "text" },
        valueField: { type: "text" },
        resultTemplate: { type: "textarea" },
        options: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            value: { type: "text" },
          },
        },
        defaultValue: { type: "text" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Choice",
        placeholder: "Select an option",
        multiple: false,
        dataSource: "",
        displayField: "",
        valueField: "",
        resultTemplate: "",
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
          { label: "Option C", value: "c" },
        ],
        defaultValue: "",
        required: false,
        helperText: "",
      },
      render: ({
        label,
        placeholder,
        multiple,
        dataSource,
        displayField,
        valueField,
        resultTemplate,
        options,
        defaultValue,
        required,
        helperText,
      }) => (
        <ChoiceControl
          label={label}
          placeholder={placeholder}
          multiple={multiple}
          dataSource={dataSource}
          displayField={displayField}
          valueField={valueField}
          resultTemplate={resultTemplate}
          options={options}
          defaultValue={defaultValue}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    KlevrFieldControl: withLayout({
      fields: {
        metadataSource: { type: "text" },
        entity: { type: "text" },
        fieldKey: { type: "text" },
        label: { type: "text" },
        placeholder: { type: "text" },
        helperText: { type: "text" },
      },
      defaultProps: {
        metadataSource: "/api/mock/field-metadata",
        entity: "customers",
        fieldKey: "status",
        label: "",
        placeholder: "",
        helperText: "",
      },
      render: ({
        metadataSource,
        entity,
        fieldKey,
        label,
        helperText,
        placeholder,
      }) => (
        <KlevrFieldControl
          metadataSource={metadataSource}
          entity={entity}
          fieldKey={fieldKey}
          label={label}
          helperText={helperText}
          placeholder={placeholder}
        />
      ),
    }),
    YesNoControl: withLayout({
      fields: {
        label: { type: "text" },
        defaultValue: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Yes/No",
        defaultValue: false,
        helperText: "",
      },
      render: ({ label, defaultValue, helperText }) => (
        <YesNoControl
          label={label}
          defaultValue={defaultValue}
          helperText={helperText}
        />
      ),
    }),
    DecimalControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "number" },
        min: { type: "number" },
        max: { type: "number" },
        decimalPlaces: { type: "number", min: 0, max: 10 },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Decimal",
        placeholder: "0.00",
        defaultValue: 0,
        decimalPlaces: 2,
        required: false,
        helperText: "",
      },
      render: ({
        label,
        placeholder,
        defaultValue,
        min,
        max,
        decimalPlaces,
        required,
        helperText,
      }) => (
        <DecimalControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          min={min}
          max={max}
          decimalPlaces={decimalPlaces}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    CurrencyControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "number" },
        currencySymbol: { type: "text" },
        min: { type: "number" },
        max: { type: "number" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Currency",
        placeholder: "0.00",
        defaultValue: 0,
        currencySymbol: "$",
        required: false,
        helperText: "",
      },
      render: ({
        label,
        placeholder,
        defaultValue,
        currencySymbol,
        min,
        max,
        required,
        helperText,
      }) => (
        <CurrencyControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          currencySymbol={currencySymbol}
          min={min}
          max={max}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    DatepickerControl: withLayout({
      fields: {
        label: { type: "text" },
        mode: {
          type: "select",
          options: [
            { label: "Date only", value: "date" },
            { label: "Date & time", value: "datetime" },
          ],
        },
        defaultValue: { type: "text" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Date",
        mode: "date",
        defaultValue: "",
        required: false,
        helperText: "",
      },
      render: ({ label, mode, defaultValue, required, helperText }) => (
        <DatepickerControl
          label={label}
          mode={mode}
          defaultValue={defaultValue}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    EmailControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "text" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Email",
        placeholder: "name@example.com",
        defaultValue: "",
        required: false,
        helperText: "",
      },
      render: ({ label, placeholder, defaultValue, required, helperText }) => (
        <EmailControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    UrlControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "text" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "URL",
        placeholder: "https://",
        defaultValue: "",
        required: false,
        helperText: "",
      },
      render: ({ label, placeholder, defaultValue, required, helperText }) => (
        <UrlControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    TextAreaControl: withLayout({
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        defaultValue: { type: "textarea" },
        rows: { type: "number", min: 3, max: 20 },
        maxLength: { type: "number" },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "Text area",
        placeholder: "Enter text",
        defaultValue: "",
        rows: 6,
        required: false,
        helperText: "",
      },
      render: ({
        label,
        placeholder,
        defaultValue,
        rows,
        maxLength,
        required,
        helperText,
      }) => (
        <TextAreaControl
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={rows}
          maxLength={maxLength}
          required={required}
          helperText={helperText}
        />
      ),
    }),
    FileControl: withLayout({
      fields: {
        label: { type: "text" },
        accept: { type: "text" },
        multiple: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        maxFileSizeMb: { type: "number", min: 1 },
        required: {
          type: "radio",
          options: [
            { label: "false", value: false },
            { label: "true", value: true },
          ],
        },
        helperText: { type: "text" },
      },
      defaultProps: {
        label: "File upload",
        accept: "",
        multiple: false,
        maxFileSizeMb: 10,
        required: false,
        helperText: "",
      },
      render: ({
        label,
        accept,
        multiple,
        maxFileSizeMb,
        required,
        helperText,
      }) => (
        <FileControl
          label={label}
          accept={accept}
          multiple={multiple}
          maxFileSizeMb={maxFileSizeMb}
          required={required}
          helperText={helperText}
        />
      ),
    }),
  },
};

export default config;
