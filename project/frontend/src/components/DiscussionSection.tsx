import { useEffect, useState } from "react";

import { MessageCircle, Pencil, Trash2, X } from "lucide-react";

import discussionIcon from "../assets/discussion.svg";

import api from "../api/client";
import { useCurrentUser } from "../api/useCurrentUser";

interface Comment {
  id: number;
  username: string;
  timeAgo: string;
  message: string;
  replies: Comment[];
}

interface CommentRowProps {
  comment: Comment;
  fightId: string;
  currentUsername: string | null;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  onCommentPosted: () => void;
}

function CommentRow({
  comment,
  fightId,
  currentUsername,
  replyingTo,
  setReplyingTo,
  onCommentPosted,
}: CommentRowProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(comment.message);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isReplying = replyingTo === comment.id;
  const isOwner = currentUsername === comment.username;

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) return;

    if (!currentUsername) {
      setReplyError("Please log in to post a reply.");
      return;
    }

    try {
      setReplyLoading(true);
      setReplyError("");

      await api.post(`/api/fights/${fightId}/comments`, {
        body: replyMessage.trim(),
        parent_id: comment.id,
      });

      setReplyMessage("");
      setReplyingTo(null);
      onCommentPosted();
    } catch (error) {
      console.error("Error posting reply:", error);
      setReplyError("Failed to post reply.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editMessage.trim()) return;

    try {
      setEditLoading(true);
      setEditError("");

      await api.put(`/api/comments/${comment.id}`, {
        body: editMessage.trim(),
      });

      setEditing(false);
      onCommentPosted();
    } catch (error) {
      console.error("Error editing comment:", error);
      setEditError("Failed to edit comment.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");

      await api.delete(`/api/comments/${comment.id}`);

      setShowDeleteModal(false);
      onCommentPosted();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setDeleteError("Failed to delete comment.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMessage(comment.message);
    setEditError("");
    setEditing(false);
  };

  return (
    <>
      <div className="border-t border-purple/20 first:border-t-0">
        {/* Comment */}
        <div className="px-4 py-4 font-body">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold uppercase text-purple">
                  {comment.username}
                </span>

                <span className="ml-2 text-xs text-text">
                  • {comment.timeAgo}
                </span>
              </p>

              {/* Comment message / edit input */}
              {editing ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    disabled={editLoading}
                    autoFocus
                    className="w-full rounded-sm border border-purple/30 bg-transparent px-3 py-2 text-sm text-white placeholder:text-text focus:border-purple focus:outline-none disabled:opacity-50"
                  />

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleEdit}
                      disabled={editLoading || !editMessage.trim()}
                      className="rounded-sm bg-purple px-4 py-1.5 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {editLoading ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={editLoading}
                      className="rounded-sm border border-purple/30 px-4 py-1.5 text-xs uppercase tracking-widest text-text transition-colors hover:border-purple hover:text-white disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>

                  {editError && (
                    <p className="mt-2 text-sm text-red-400">{editError}</p>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-sm text-white">{comment.message}</p>
              )}
            </div>

            {/* Reply */}
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setReplyError("");
                  setReplyingTo(isReplying ? null : comment.id);
                }}
                className="flex flex-shrink-0 items-center gap-1 text-sm text-purple transition-opacity hover:opacity-80"
              >
                <MessageCircle size={14} />

                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}
          </div>

          {/* Edit / Delete */}
          {isOwner && !editing && (
            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditMessage(comment.message);
                  setEditError("");
                  setEditing(true);
                }}
                disabled={deleteLoading}
                className="flex items-center gap-1 text-xs text-text transition-colors hover:text-purple disabled:opacity-50"
              >
                <Pencil size={13} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeleteError("");
                  setShowDeleteModal(true);
                }}
                disabled={deleteLoading}
                className="flex items-center gap-1 text-xs text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={13} />

                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}

          {deleteError && (
            <p className="mt-2 text-right text-sm text-red-400">
              {deleteError}
            </p>
          )}
        </div>

        {/* Reply input */}
        {isReplying && (
          <div className="ml-8 border-l border-purple px-4 pb-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write a reply..."
                disabled={replyLoading}
                className="flex-1 rounded-sm border border-purple/30 bg-transparent px-3 py-2 text-sm text-white placeholder:text-text focus:border-purple focus:outline-none disabled:opacity-50"
                autoFocus
              />

              <button
                type="button"
                onClick={handleReplySubmit}
                disabled={replyLoading || !replyMessage.trim()}
                className="rounded-sm bg-purple px-5 py-2 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {replyLoading ? "Posting..." : "Reply"}
              </button>
            </div>

            {replyError && (
              <p className="mt-2 text-sm text-red-400">{replyError}</p>
            )}
          </div>
        )}

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="ml-8 border-l border-purple/80">
            {comment.replies.map((reply) => (
              <CommentRow
                key={reply.id}
                comment={reply}
                fightId={fightId}
                currentUsername={currentUsername}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onCommentPosted={onCommentPosted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-md border border-purple/40 bg-[#0a0d1c] p-6 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading text-lg uppercase tracking-widest text-purple">
                  Delete Comment
                </h3>

                <p className="mt-2 text-sm text-text">
                  Are you sure you want to delete this comment?
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="text-text transition-colors hover:text-white disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comment preview */}
            <div className="mt-5 rounded-sm border border-purple/20 bg-[#050711] px-4 py-3">
              <p className="text-xs font-semibold uppercase text-purple">
                {comment.username}
              </p>

              <p className="mt-1 text-sm text-white">{comment.message}</p>
            </div>

            {/* Modal buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="rounded-sm border border-purple/30 px-5 py-2 text-sm uppercase tracking-widest text-text transition-colors hover:border-purple hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center gap-2 rounded-sm bg-red-500 px-5 py-2 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} />

                {deleteLoading ? "Deleting..." : "Delete Comment"}
              </button>
            </div>

            {deleteError && (
              <p className="mt-3 text-right text-sm text-red-400">
                {deleteError}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function DiscussionSection({
  fightId,
  readOnly = false,
}: {
  fightId: string;
  readOnly?: boolean;
}) {
  const { data: user } = useCurrentUser();

  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");

  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const currentUsername = user?.name ?? null;

  useEffect(() => {
    let cancelled = false;

    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/fights/${fightId}/comments`);

        if (!cancelled) {
          setComments(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);

        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      cancelled = true;
    };
  }, [fightId]);

  const refreshComments = async () => {
    try {
      const response = await api.get(`/api/fights/${fightId}/comments`);

      setComments(response.data);
    } catch (error) {
      console.error("Error refreshing comments:", error);
    }
  };

  const handlePost = async () => {
    if (!message.trim()) return;

    if (!user) {
      setPostError("Please log in to post a message.");
      return;
    }

    try {
      setPostLoading(true);
      setPostError("");

      await api.post(`/api/fights/${fightId}/comments`, {
        body: message.trim(),
        parent_id: null,
      });

      setMessage("");

      await refreshComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      setPostError("Failed to post comment.");
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-6xl px-6 font-body">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={discussionIcon} alt="" className="h-6 w-6" />

          <h2 className="font-heading text-lg uppercase tracking-widest text-purple">
            Discussion
          </h2>
        </div>

        {readOnly && (
          <span className="text-sm tracking-widest text-red-400">
            Comments have been closed as the fight is over!
          </span>
        )}
      </div>

      {/* Comments + input container */}
      <div className="overflow-hidden rounded-md border border-purple/30 bg-[#0a0d1c]">
        {/* Scrollable comments list */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple/40 hover:scrollbar-thumb-purple/60">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-text">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text">
              No comments yet.
            </div>
          ) : (
            comments.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                fightId={fightId}
                currentUsername={currentUsername}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onCommentPosted={refreshComments}
              />
            ))
          )}
        </div>

        {/* New comment input */}
        {!readOnly && (
          <div className="border-t border-purple/20 px-4 py-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setPostError("");
                }}
                placeholder="Write a message..."
                disabled={postLoading}
                className="flex-1 rounded-sm border border-purple/30 bg-transparent px-3 py-2 text-sm text-white placeholder:text-text focus:border-purple focus:outline-none disabled:opacity-50"
              />

              <button
                type="button"
                onClick={handlePost}
                disabled={postLoading || !message.trim()}
                className="rounded-sm bg-purple px-6 py-2 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {postLoading ? "Posting..." : "Post"}
              </button>
            </div>

            {postError && (
              <p className="mt-2 text-sm text-red-400">{postError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscussionSection;
