import React, { useState } from "react";

const useCommentsTree = (initialComments) => {
  const [commentsData, setCommentsData] = useState(initialComments);

  const insertNode = (tree, parentCommentId, content) => {
    return tree.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...comment.replies, content],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: insertNode(comment.replies, parentCommentId, content),
        };
      }
      return comment;
    });
  };

  const insertComment = (parentCommentId, content) => {
    const newComment = {
      id: Date.now(),
      content,
      votes: 0,
      timestamp: new Date().toISOString(),
      replies: [],
    };

    //means adding any reply
    if (parentCommentId) {
      setCommentsData((prevComments) =>
        insertNode(prevComments, parentCommentId, newComment)
      );
    } else {
      setCommentsData((prevComments) => [newComment, ...prevComments]);
    }
  };

  const editNode = (tree, parentCommentId, content) => {
    return tree.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          content,
          timestamp: new Date().toISOString(),
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: editNode(comment.replies, parentCommentId, content),
        };
      }
      return comment;
    });
  };

  const editComment = (parentCommentId, content) => {
    setCommentsData((prevComments) =>
      editNode(prevComments, parentCommentId, content)
    );
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
    setCommentsData((prevComments) =>
      deleteNode(prevComments, parentCommentId)
    );
  };

  return { commentsData, insertComment, editComment, deleteComment };
};

export default useCommentsTree;
