import { Config as PuckConfig, Data as PuckData } from "@puckeditor/core";

import Header, {
  HeaderProps,
} from "@/puck/config/components/header";
import Hero, {
  HeroProps,
} from "@/puck/config/components/hero";
import Customers, {
  CustomersProps,
} from "@/puck/config/components/customers";
import Testimonials, {
  TestimonialsProps,
} from "@/puck/config/components/testimonials";
import TwoColumn, {
  TwoColumnProps,
} from "@/puck/config/components/two-column";
import Bento, {
  BentoProps,
} from "@/puck/config/components/bento";
import FeatureCards, {
  FeatureCardsProps,
} from "@/puck/config/components/feature-cards";
import CardGrid, {
  CardGridProps,
} from "@/puck/config/components/card-grid";
import Stats, {
  StatsProps,
} from "@/puck/config/components/stats";
import ArticleCard, {
  ArticleCardProps,
} from "@/puck/config/components/article-card";
import Articles, {
  ArticlesProps,
} from "@/puck/config/components/articles";
import Faq, {
  FaqProps,
} from "@/puck/config/components/faq";
import Cta, {
  CtaProps,
} from "@/puck/config/components/cta";
import Pricing, {
  PricingProps,
} from "@/puck/config/components/pricing";
import ContactUs, {
  ContactUsProps,
} from "@/puck/config/components/contact-us";
import Footer, {
  FooterProps,
} from "@/puck/config/components/footer";
import KlevrField, {
  KlevrFieldProps,
} from "@/puck/config/components/klevr-field";
import KlevrList, {
  KlevrListProps,
} from "@/puck/config/components/klevr-list";
import BlockContainer, {
  BlockContainerProps,
} from "@/puck/config/components/block-container";
import Root from "@/puck/components/root";

export type Props = {
  ArticleCard: ArticleCardProps;
  Header: HeaderProps;
  Hero: HeroProps;
  Customers: CustomersProps;
  Testimonials: TestimonialsProps;
  Bento: BentoProps;
  FeatureCards: FeatureCardsProps;
  CardGrid: CardGridProps;
  TwoColumn: TwoColumnProps;
  Stats: StatsProps;
  Articles: ArticlesProps;
  Faq: FaqProps;
  Cta: CtaProps;
  Pricing: PricingProps;
  ContactUs: ContactUsProps;
  Footer: FooterProps;
  KlevrField: KlevrFieldProps;
  KlevrList: KlevrListProps;
  BlockContainer: BlockContainerProps;
};

export type Config = PuckConfig<Props>;

// We avoid the name config as next gets confused
export const conf: Config = {
  categories: {
    navigation: {
      components: ["Header", "Footer"],
    },
    introduction: {
      components: ["Hero"],
    },
    content: {
      components: [
        "Bento",
        "ArticleCard",
        "FeatureCards",
        "CardGrid",
        "TwoColumn",
        "Articles",
        "Faq",
        "Cta",
        "BlockContainer",
      ],
    },
    socialProof: {
      title: "Social Proof",
      components: ["Testimonials", "Stats", "Customers"],
    },
    business: {
      components: ["Pricing", "ContactUs"],
    },
    klevr: {
      title: "Klevr",
      components: ["KlevrField", "KlevrList"],
    },
  },
  components: {
    ArticleCard,
    Header,
    Hero,
    Customers,
    Testimonials,
    Bento,
    FeatureCards,
    CardGrid,
    TwoColumn,
    Stats,
    Articles,
    Faq,
    Cta,
    Pricing,
    ContactUs,
    Footer,
    KlevrField,
    KlevrList,
    BlockContainer,
  },
  root: Root,
};

export type Data = PuckData<Props>;

export { ErrorBoundary } from "@/puck/components/error-boundary";

export {
  EditorModeProvider,
  useIsEditorMode,
} from "@/puck/context/is-editor-mode-context";

export default conf;
