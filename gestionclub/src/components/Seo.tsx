import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  image?: string;
}

const SITE_NAME = "Impulse Club";
const DEFAULT_IMAGE = "https://placehold.co/1200x630/0a0f1e/00c6ff?text=Impulse+Club";

export default function Seo({ title, description, image = DEFAULT_IMAGE }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", SITE_NAME);
  }, [title, description, image]);

  return null;
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}