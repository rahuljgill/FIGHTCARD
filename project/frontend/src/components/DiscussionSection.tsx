import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { comments } from "../data/comments";
import discussionIcon from "../assets/discussion.svg";

function CommentRow({ comment }: { comment: (typeof comments)[number] }) {
  return (
    <div className="flex items-start gap-3 border-t border-purple/20 px-4 py-4 font-body first:border-t-0">
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold uppercase text-purple">
            {comment.username}
          </span>
          <span className="ml-2 text-xs text-text">• {comment.timeAgo}</span>
        </p>
        <p className="mt-1 text-sm text-white">{comment.message}</p>
      </div>

      <button className="flex flex-shrink-0 items-center gap-1 text-sm text-purple hover:opacity-80">
        <MessageCircle size={14} />
        Reply
      </button>
    </div>
  );
}

function DiscussionSection({ readOnly = false }: { readOnly?: boolean }) {
  const [message, setMessage] = useState("");

  const handlePost = () => {
    if (!message.trim()) return;
    // no backend yet — just clear the input for now
    setMessage("");
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
          {comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))}
        </div>

        {/* Message input — hidden entirely when read-only */}
        {!readOnly && (
          <div className="flex items-center gap-3 border-t border-purple/20 px-4 py-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 rounded-sm border border-purple/30 bg-transparent px-3 py-2 text-sm text-white placeholder:text-text focus:border-purple focus:outline-none"
            />
            <button
              onClick={handlePost}
              className="rounded-sm bg-purple px-6 py-2 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscussionSection;
