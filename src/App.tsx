import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Blog } from "@/pages/Blog";
import { Article } from "@/pages/Article";
import { CategoryPage } from "@/pages/CategoryPage";
import { TagPage } from "@/pages/TagPage";
import { NotFound } from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/category/:category" element={<CategoryPage />} />
        <Route path="/blog/tag/:tag" element={<TagPage />} />
        <Route path="/blog/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
