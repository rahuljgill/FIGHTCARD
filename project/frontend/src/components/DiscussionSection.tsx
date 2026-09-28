import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  currentUserVerified: boolean;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  onCommentPosted: () => void;
}

function CommentRow({
  comment,
  fightId,
  currentUsername,
  currentUserVerified,
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

    if (!currentUserVerified) {
      setReplyError("Please verify your email address before replying.");
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
        <div className="px-3 py-3 font-body sm:px-4 sm:py-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm">
                <span className="font-semibold uppercase text-purple">
                  {comment.username}
                </span>

                <span className="ml-2 text-[10px] text-text sm:text-xs">
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
                      className="rounded-sm bg-purple px-3 py-1.5 text-[10px] uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-xs"
                    >
                      {editLoading ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={editLoading}
                      className="rounded-sm border border-purple/30 px-3 py-1.5 text-[10px] uppercase tracking-widest text-text transition-colors hover:border-purple hover:text-white disabled:opacity-50 sm:px-4 sm:text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  {editError && (
                    <p className="mt-2 text-sm text-red-400">{editError}</p>
                  )}
                </div>
              ) : (
                <p className="mt-1 wrap-break-word text-sm text-white">
                  {comment.message}
                </p>
              )}
            </div>

            {/* Reply */}
            {!editing && currentUserVerified && (
              <button
                type="button"
                onClick={() => {
                  setReplyError("");
                  setReplyingTo(isReplying ? null : comment.id);
                }}
                className="flex shrink-0 items-center gap-1 text-xs text-purple transition-opacity hover:opacity-80 sm:text-sm"
              >
                <MessageCircle size={13} className="sm:h-3.5 sm:w-3.5" />
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
                className="flex items-center gap-1 text-[10px] text-text transition-colors hover:text-purple disabled:opacity-50 sm:text-xs"
              >
                <Pencil size={12} className="sm:h-3.25 sm:w-3.25" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeleteError("");
                  setShowDeleteModal(true);
                }}
                disabled={deleteLoading}
                className="flex items-center gap-1 text-[10px] text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
              >
                <Trash2 size={12} className="sm:h-3.25 sm:w-3.25" />
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
          <div className="ml-5 border-l border-purple px-3 pb-3 sm:ml-8 sm:px-4 sm:pb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write a reply..."
                disabled={replyLoading}
                className="min-w-0 flex-1 rounded-sm border border-purple/30 bg-transparent px-3 py-2 text-sm text-white placeholder:text-text focus:border-purple focus:outline-none disabled:opacity-50"
                autoFocus
              />

              <button
                type="button"
                onClick={handleReplySubmit}
                disabled={replyLoading || !replyMessage.trim()}
                className="w-full rounded-sm bg-purple px-5 py-2 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
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
          <div className="ml-5 border-l border-purple/80 sm:ml-8">
            {comment.replies.map((reply) => (
              <CommentRow
                key={reply.id}
                comment={reply}
                fightId={fightId}
                currentUsername={currentUsername}
                currentUserVerified={currentUserVerified}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 sm:px-4">
          <div className="w-full max-w-md rounded-md border border-purple/40 bg-[#0a0d1c] p-4 shadow-2xl sm:p-6">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-base uppercase tracking-widest text-purple sm:text-lg">
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
                className="shrink-0 text-text transition-colors hover:text-white disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comment preview */}
            <div className="mt-4 rounded-sm border border-purple/20 bg-background px-3 py-3 sm:mt-5 sm:px-4">
              <p className="text-xs font-semibold uppercase text-purple">
                {comment.username}
              </p>

              <p className="mt-1 wrap-break-word text-sm text-white">
                {comment.message}
              </p>
            </div>

            {/* Modal buttons */}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="w-full rounded-sm border border-purple/30 px-5 py-2 text-xs uppercase tracking-widest text-text transition-colors hover:border-purple hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-red-500 px-5 py-2 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
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
  const currentUserVerified = user?.email_verified === true;

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

    if (!currentUserVerified) {
      setPostError("Please verify your email address before posting.");
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
    <div className="mx-auto mt-8 max-w-6xl px-3 font-body sm:mt-10 sm:px-6">
      {/* Header */}
      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex items-center gap-2">
          <img src={discussionIcon} alt="" className="h-5 w-5 sm:h-6 sm:w-6" />

          <h2 className="font-heading text-base uppercase tracking-widest text-purple sm:text-lg">
            Discussion
          </h2>
        </div>

        {readOnly && (
          <span className="text-[10px] leading-relaxed tracking-widest text-red-400 sm:text-sm">
            Comments have been closed as the fight is over!
          </span>
        )}
      </div>

      {/* Comments + input container */}
      <div className="overflow-hidden rounded-md border border-purple/30 bg-[#0a0d1c]">
        {/* Scrollable comments list */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple/40 hover:scrollbar-thumb-purple/60">
          {loading ? (
            <div className="px-3 py-5 text-center text-sm text-text sm:px-4 sm:py-6">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="px-3 py-5 text-center text-sm text-text sm:px-4 sm:py-6">
              No comments yet.
            </div>
          ) : (
            comments.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                fightId={fightId}
                currentUsername={currentUsername}
                currentUserVerified={currentUserVerified}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onCommentPosted={refreshComments}
              />
            ))
          )}
        </div>

        {/* New comment input */}
        {!readOnly && (
          <div className="border-t border-purple/20 px-3 py-3 sm:px-4 sm:py-4">
            {user && !currentUserVerified ? (
              <div className="text-center">
                <p className="font-heading text-sm uppercase tracking-widest text-red-400">
                  Email Verification Required
                </p>

                <p className="mt-2 text-sm text-text">
                  Please verify your email address before joining the
                  discussion.
                </p>

                <Link
                  to="/settings"
                  className="mt-3 inline-block text-sm font-semibold text-purple underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  Go to My Settings
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setPostError("");
                    }}
                    placeholder="Write a message..."
                    disabled={postLoading}
                    className="min-w-0 flex-1 rounded-sm border border-purple/30 bg-transparent px-3 py-2 text-sm text-white placeholder:text-text focus:border-purple focus:outline-none disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={handlePost}
                    disabled={postLoading || !message.trim()}
                    className="w-full rounded-sm bg-purple px-6 py-2 text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
                  >
                    {postLoading ? "Posting..." : "Post"}
                  </button>
                </div>

                {postError && (
                  <p className="mt-2 text-sm text-red-400">{postError}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscussionSection;
