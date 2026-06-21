import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page, selectedCategory]);

  async function loadCategories() {
    try {
      const res = await api.get("/categories/");
      setCategories(res.data);
    } catch (err) {
      console.log("Error loading categories");
    }
  }

  async function loadPosts() {
    setLoading(true);
    setError("");
    try {
      let url = "/posts/?page=" + page + "&limit=10";
      if (selectedCategory) url += "&category_id=" + selectedCategory;
      if (searchQuery.trim()) url += "&q=" + searchQuery;
      const res = await api.get(url);
      setPosts(res.data.posts);
      setTotalPages(res.data.pages);
    } catch (err) {
      setError("Failed to load posts. Is the backend running?");
    }
    setLoading(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    loadPosts();
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  return (
    <div className="home">
      <h2>All Posts</h2>

      <div className="filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="loading">Loading posts...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && posts.length === 0 && <p>No posts found.</p>}

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={"/posts/" + post.id}>
              <h3>{post.title}</h3>
            </Link>
            <p className="post-meta">
              by {post.author_name} &middot; {formatDate(post.created_at)}
              &middot; {post.reading_time} min read
              &middot; {post.category_name}
            </p>
            <p className="post-stats">
              {post.comment_count} comments &middot; {post.reaction_count} reactions
            </p>
            <div
              className="post-preview"
              dangerouslySetInnerHTML={{
                __html: post.content.substring(0, 200) + "..."
              }}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
