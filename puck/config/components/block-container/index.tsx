import { ComponentConfig } from "@puckeditor/core";
import { padding, paddingDefaults } from "@/puck/config/fields";
import { BlockContainer, type BlockContainerProps } from "./block-container";

export type { BlockContainerProps };

const conf: ComponentConfig<BlockContainerProps> = {
  fields: {
    heading: {
      type: "text",
      contentEditable: true,
    },
    columns: {
      type: "radio",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "6", value: "6" },
      ],
    },
    height: {
      type: "select",
      options: [
        { label: "auto", value: "auto" },
        { label: "small", value: "small" },
        { label: "medium", value: "medium" },
        { label: "large", value: "large" },
      ],
    },
    margin: {
      type: "object",
      objectFields: {
        top: {
          type: "select",
          options: [
            { label: "none", value: "none" },
            { label: "small", value: "small" },
            { label: "medium", value: "medium" },
            { label: "large", value: "large" },
          ],
        },
        bottom: {
          type: "select",
          options: [
            { label: "none", value: "none" },
            { label: "small", value: "small" },
            { label: "medium", value: "medium" },
            { label: "large", value: "large" },
          ],
        },
      },
    },
    blocks: {
      type: "slot",
      allow: [
        "ArticleCard",
        "Articles",
        "Bento",
        "CardGrid",
        "ContactUs",
        "Cta",
        "Customers",
        "Faq",
        "FeatureCards",
        "Hero",
        "KlevrField",
        "KlevrList",
        "Pricing",
        "Stats",
        "Testimonials",
        "TwoColumn",
      ],
    },
    padding,
  },
  defaultProps: {
    heading: "",
    columns: "2",
    height: "auto",
    margin: {
      top: "none",
      bottom: "none",
    },
    blocks: [],
    padding: {
      ...paddingDefaults,
      top: "none",
      bottom: "none",
    },
  },
  render: BlockContainer,
};

export default conf;
