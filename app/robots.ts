export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/conta", "/admin"] },
    sitemap: "https://simulafacil-felipe.spryhen2048.chatgpt.site/sitemap.xml",
  };
}
