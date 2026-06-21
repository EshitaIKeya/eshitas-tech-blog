import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../api";

// Toolbar options for the rich text editor
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link"],
  ["clean"],
];

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Title is required"); return; }
    if (!content.trim() || content === "<p><br></p>") { setError("Content is required"); return; }
    if (!categoryId) { setError("Please select a category"); return; }

    setLoading(true);
    try {
      await api.post("/posts/", {
        title: title.trim(),
        content: content,
        category_id: parseInt(categoryId),
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create post");
    }
    setLoading(false);
  }

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="post-title-input"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="category-select"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <div className="editor-wrapper">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={{ toolbar: toolbarOptions }}
            placeholder="Write your post here..."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
