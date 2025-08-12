import { useState } from "react";
import "./App.css";
import data from "./data.json";
import useCommentsTree from "./useCommentsTree";

const Comment = ({
  comment = {},
  onSubmitComment = () => {},
  onEditComment = () => {},
  onDeleteComment = () => {},
}) => {
  const [expand, setExpand] = useState(false);
  const [reply, setReply] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedContent(comment.content); // Reset edited content to current comment content
  };

  const handleChange = (e) => {
    if (editMode) {
      setEditedContent(e.target.value);
    } else setReply(e.target.value);
  };

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const handleReplySubmit = () => {
    if (reply) {
      onSubmitComment(comment.id, reply);
      setReply("");
    }
  };

  const handleEditSubmit = () => {
    onEditComment(comment.id, editedContent);
    setEditMode(false);
  };

  const handleDelete = () => {
    onDeleteComment(comment.id);
  };

  return (
    <div className="comment">
      {!editMode ? (
        <>
          <p className="comment-content">{comment.content}</p>
          <p className="comment-info">Votes: {comment.votes}</p>
          <p className="comment-info">
            {new Date(comment.timestamp).toLocaleString()}
          </p>
        </>
      ) : (
        <div className="add-comment">
          <textarea
            value={editedContent}
            onChange={handleChange}
            rows={3}
            cols={50}
            className="comment-textarea"
          />
          <button onClick={handleEditSubmit} className="comment-button">
            Save Edit
          </button>
          <button onClick={toggleEditMode} className="comment-button">
            Cancel Edit
          </button>
        </div>
      )}

      <div className="comment-actions">
        <button onClick={toggleExpand} className="comment-button">
          {expand ? "Hide Replies" : "Reply"}
        </button>
        <button className="comment-button" onClick={toggleEditMode}>
          Edit
        </button>
        <button className="comment-button" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {expand && (
        <>
          <InputComment
            value={reply}
            handleChange={handleChange}
            handleSubmit={handleReplySubmit}
          />
          {comment?.replies?.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onSubmitComment={onSubmitComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </>
      )}
    </div>
  );
};

function InputComment({ value, handleChange, handleSubmit }) {
  return (
    <div className="add-comment">
      <textarea
        value={value}
        onChange={handleChange}
        rows={3}
        cols={50}
        className="comment-textarea"
        placeholder="Add a new comment..."
      />
      <button onClick={handleSubmit} className="comment-button">
        Add Comment
      </button>
    </div>
  );
}

const NestedComments = ({ comments }) => {
  const [comment, setComment] = useState("");
  const { commentsData, insertComment, editComment, deleteComment } =
    useCommentsTree(comments);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment) {
      handleReply(null, comment);
      setComment("");
    }
  };

  const handleReply = (commentId, content) => {
    insertComment(commentId, content);
  };

  const handleEdit = (commentId, content) => {
    editComment(commentId, content);
  };

  const handleDelete = (commentId) => {
    deleteComment(commentId);
  };

  return (
    <div>
      <InputComment
        value={comment}
        handleChange={handleCommentChange}
        handleSubmit={handleSubmit}
      />
      {commentsData.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onSubmitComment={handleReply}
          onEditComment={handleEdit}
          onDeleteComment={handleDelete}
        />
      ))}
    </div>
  );
};

function App() {
  return (
    <div>
      <h1>Nested Comments</h1>
      <NestedComments comments={data} />
    </div>
  );
}

export default App;
