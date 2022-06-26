import Head from "next/head";
import { getDomain } from "../common/config";

type Props = {
  title: string;
  description?: string;
};

const defaultDescription =
  "You are working hard, and you have a passion for what you do. Wouldn’t it be nice to get some appreciation and even Flow tokens for your project? FlowTea was designed for amazing people who are building awesome projects and for awesome people, who appreciate amazing projects.";

export default function MetaTags({ title, description }: Props) {
  const domain = getDomain();
  if (!description) {
    description = defaultDescription;
  }

  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      <title>{title}</title>

      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={domain} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* TODO: add thumbnails */}
      <meta property="og:image" content="/thumbnail.png" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={domain} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="/thumbnail.png" />
    </Head>
  );
}
