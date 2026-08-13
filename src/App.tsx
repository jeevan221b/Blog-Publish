import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Blog } from "@/pages/Blog";
import { Article } from "@/pages/Article";
import { CategoryPage } from "@/pages/CategoryPage";
import { NotFound } from "@/pages/NotFound";
import { AdminLogin } from "@/pages/admin/Login";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { PostEditor } from "@/pages/admin/PostEditor";
import { RequireAuth } from "@/components/RequireAuth";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/category/:category" element={<CategoryPage />} />
        <Route path="/blog/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/posts/new"
        element={
          <RequireAuth>
            <PostEditor />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/posts/:slug/edit"
        element={
          <RequireAuth>
            <PostEditor />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
