import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <a className="brand" href="#home">{site.brand}</a>
        <p>© {new Date().getFullYear()} {site.name}</p>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
