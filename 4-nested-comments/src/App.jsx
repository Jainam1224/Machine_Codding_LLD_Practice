import { useState } from "react";
import "./App.css";

const useCommentsTree = (initialComments) => {
  const [commentData, setCommentData] = useState(initialComments);

  const insertNode = (tree, parentId, content) => {
    return tree.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, content] };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: insertNode(comment.replies, parentId, content),
        };
      }
      return comment;
    });
  };

  const insertComment = (parentId, content) => {
    const newComment = {
      id: Date.now(),
      content,
      timestamp: new Date().toISOString(),
      replies: [],
    };

    if (parentId) {
      setCommentData((prevComments) =>
        insertNode(prevComments, parentId, newComment)
      );
    } else {
      setCommentData([...commentData, newComment]);
    }
  };

  const editNode = (tree, parentId, content) => {
    return tree.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, content, timestamp: new Date().toISOString() };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: editNode(comment.replies, parentId, content),
        };
      }
      return comment;
    });
  };

  const editComment = (parentId, content) => {
    setCommentData((prevComments) => editNode(prevComments, parentId, content));
  };

  const deleteNode = (tree, nodeId) => {
    return tree.reduce((acc, node) => {
      if (node.id === nodeId) {
        return acc;
      } else if (node.replies && node.replies.length > 0) {
        node.replies = deleteNode(node.replies, nodeId);
      }
      return [...acc, node];
    }, []);
  };

  const deleteComment = (parentCommentId) => {
    setCommentData((prevComments) => deleteNode(prevComments, parentCommentId));
  };

  return { commentData, insertComment, editComment, deleteComment };
};

const initialComments = [
  {
    id: 1,
    content: "This is the first comment",
    timestamp: "2024-06-16T10:00:00Z",
    replies: [
      {
        id: 2,
        content: "This is a reply to the first comment",
        timestamp: "2024-06-16T11:00:00Z",
        replies: [],
      },
      {
        id: 3,
        content: "This is another reply to the first comment",
        timestamp: "2024-06-16T12:00:00Z",
        replies: [],
      },
    ],
  },
  {
    id: 4,
    content: "This is the second comment",
    timestamp: "2024-06-16T09:00:00Z",
    replies: [
      {
        id: 5,
        content: "This is a reply to the second comment",
        timestamp: "2024-06-16T09:30:00Z",
        replies: [
          {
            id: 6,
            content: "This is a nested reply to the reply",
            timestamp: "2024-06-16T09:45:00Z",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 7,
    content: "This is the third comment",
    timestamp: "2024-06-16T08:00:00Z",
    replies: [],
  },
  {
    id: 8,
    content: "This is the fourth comment",
    timestamp: "2024-06-16T07:00:00Z",
    replies: [
      {
        id: 9,
        content: "This is a reply to the fourth comment",
        timestamp: "2024-06-16T07:30:00Z",
        replies: [],
      },
    ],
  },
  {
    id: 10,
    content: "This is the fifth comment",
    timestamp: "2024-06-16T06:00:00Z",
    replies: [],
  },
  {
    id: 11,
    content: "This is the sixth comment",
    timestamp: "2024-06-15T10:00:00Z",
    replies: [],
  },
  {
    id: 12,
    content: "This is the seventh comment",
    timestamp: "2024-06-15T09:00:00Z",
    replies: [],
  },
  {
    id: 13,
    content: "This is the eighth comment",
    timestamp: "2024-06-15T08:00:00Z",
    replies: [],
  },
  {
    id: 14,
    content: "This is the ninth comment",
    timestamp: "2024-06-15T07:00:00Z",
    replies: [],
  },
  {
    id: 15,
    content: "This is the tenth comment",
    timestamp: "2024-06-15T06:00:00Z",
    replies: [],
  },
];

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
  const { commentData, insertComment, editComment, deleteComment } =
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
      {commentData?.map((comment) => (
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
      <h1>Comment Tree</h1>
      <NestedComments comments={initialComments} />
    </div>
  );
}

export default App;
