import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../api";

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link"],
  ["clean"],
];

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [reactions, setReactions] = useState([]);
  const [reactionTypes, setReactionTypes] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPost();
    loadComments();
    loadReactions();
    loadReactionTypes();
    loadCategories();
    if (token) loadCurrentUser();
    // eslint-disable-next-line
  }, []);

  async function loadPost() {
    try {
      const res = await api.get("/posts/" + id);
      setPost(res.data);
      setEditTitle(res.data.title);
      setEditContent(res.data.content);
      setEditCategoryId(res.data.category_id);
    } catch (err) {
      setError("Post not found");
    }
    setLoading(false);
  }

  async function loadComments() {
    try {
      const res = await api.get("/posts/" + id + "/comments");
      setComments(res.data);
    } catch (err) { /* no comments yet */ }
  }

  async function loadReactions() {
    try {
      const res = await api.get("/posts/" + id + "/reaction");
      setReactions(res.data);
    } catch (err) { /* no reactions yet */ }
  }

  async function loadReactionTypes() {
    try {
      const res = await api.get("/reaction-types");
      setReactionTypes(res.data);
    } catch (err) { /* no types */ }
  }

  async function loadCategories() {
    try {
      const res = await api.get("/categories/");
      setCategories(res.data);
    } catch (err) { /* ignore */ }
  }

  async function loadCurrentUser() {
    try {
      const res = await api.get("/auth/me");
      setCurrentUser(res.data);
    } catch (err) {
      localStorage.removeItem("token");
    }
  }

  // --- Reactions ---
  async function handleReaction(typeId) {
    if (!token) return;
    try {
      const myReaction = reactions.find((r) => r.user_id === currentUser?.id);
      if (myReaction && myReaction.reaction_type_id === typeId) {
        await api.delete("/posts/" + id + "/reaction");
      } else {
        await api.post("/posts/" + id + "/reaction", { reaction_type_id: typeId });
      }
      loadReactions();
    } catch (err) {
      setError("Reaction failed");
    }
  }

  // --- Edit Post ---
  async function handleUpdatePost(e) {
    e.preventDefault();
    try {
      await api.put("/posts/" + id, {
        title: editTitle, content: editContent, category_id: parseInt(editCategoryId),
      });
      setEditing(false);
      loadPost();
    } catch (err) {
      setError("Update failed");
    }
  }

  async function handleDeletePost() {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete("/posts/" + id);
      navigate("/");
    } catch (err) {
      setError("Delete failed");
    }
  }

  // --- Comments ---
  async function handleAddComment(e) {
    e.preventDefault();
    if (!token) { setError("Login to comment"); return; }
    if (!newComment.trim()) return;
    try {
      await api.post("/posts/" + id + "/comments", { content: newComment });
      setNewComment("");
      loadComments();
    } catch (err) {
      setError("Comment failed");
    }
  }

  async function handleUpdateComment(commentId) {
    try {
      await api.put("/comments/" + commentId, { content: editCommentText });
      setEditingCommentId(null);
      loadComments();
    } catch (err) {
      setError("Update failed");
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await api.delete("/comments/" + commentId);
      loadComments();
    } catch (err) {
      setError("Delete failed");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  function getReactionCount(typeId) {
    return reactions.filter((r) => r.reaction_type_id === typeId).length;
  }

  function isMyReaction(typeId) {
    return reactions.some((r) => r.user_id === currentUser?.id && r.reaction_type_id === typeId);
  }

  const isAdmin = currentUser?.role_name === "admin";
  const reactionEmojis = { like: "\u{1F44D}", love: "\u2764\uFE0F", sad: "\u{1F622}", angry: "\u{1F621}" };

  if (loading) return <p className="loading">Loading post...</p>;
  if (error && !post) return <p className="error-msg">{error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="post-detail">
      {error && <p className="error-msg">{error}</p>}

      {editing ? (
        <form onSubmit={handleUpdatePost} className="edit-form">
          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <select value={editCategoryId} onChange={(e) => setEditCategoryId(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="editor-wrapper">
            <ReactQuill
              theme="snow" value={editContent} onChange={setEditContent}
              modules={{ toolbar: toolbarOptions }}
            />
          </div>
          <div className="edit-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h1>{post.title}</h1>
          <p className="post-meta">
            by {post.author_name} &middot; {formatDate(post.created_at)}
            &middot; {post.reading_time} min read &middot; {post.category_name}
          </p>

          {isAdmin && (
            <div className="admin-actions">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDeletePost} className="btn-danger">Delete</button>
            </div>
          )}

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </>
      )}

      {/* Reactions */}
      <div className="reactions">
        {reactionTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleReaction(type.id)}
            className={"reaction-btn" + (isMyReaction(type.id) ? " active" : "")}
            disabled={!token}
          >
            {reactionEmojis[type.name] || type.name} {getReactionCount(type.id)}
          </button>
        ))}
      </div>

      {/* Comments */}
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>

        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            placeholder={token ? "Write a comment..." : "Login to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!token}
          />
          <button type="submit" disabled={!token}>Post Comment</button>
        </form>

        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            {editingCommentId === comment.id ? (
              <div className="comment-edit">
                <textarea value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} />
                <button onClick={() => handleUpdateComment(comment.id)}>Save</button>
                <button onClick={() => setEditingCommentId(null)} className="btn-secondary">Cancel</button>
              </div>
            ) : (
              <>
                <p className="comment-meta">
                  <strong>{comment.commenter_name || "User " + comment.created_by}</strong>
                  &middot; {formatDate(comment.created_at)}
                </p>
                <p>{comment.content}</p>
                {(comment.created_by === currentUser?.id || isAdmin) && (
                  <div className="comment-actions">
                    {comment.created_by === currentUser?.id && (
                      <button onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.content); }}>
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDeleteComment(comment.id)} className="btn-danger">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetail;
