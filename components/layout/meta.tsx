import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import { useSettings } from "./settings";
export type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
};

const Meta = ({ title, description, image = null }: MetaProps) => {
  const { query } = useRouter();
  const settings = useSettings();

  const base = process.env.DEPLOY_URL || "http://localhost.com:3000";
  const path = query.filename === "home" ? "" : `/${query.filename}`;
  const url = `${base}${path}`;

  const titleString = title
    ? `${settings.siteTitle}: ${title}`
    : settings.siteTitle;

  const imageString = image || settings.sitePoster || null;
  const descriptionString = description || settings.siteDescription || null;
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{titleString}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      {descriptionString && (
        <meta property="og:description" content={descriptionString} />
      )}
      {imageString && <meta property="og:image" content={image} />}

      {/* Twitter*/}
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      {descriptionString && (
        <>
          <meta property="twitter:card" content={descriptionString} />
          <meta property="twitter:description" content={descriptionString} />
        </>
      )}
      {imageString && <meta property="twitter:image" content={image} />}
    </Head>
  );
};

export default Meta;
