import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CommentItem, { CommentType } from "./CommentItem";
import EmojiPicker from "../create/EmojiPicker";

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  type: string;
}
interface PostType {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  fullContent?: string;
  date: string;
  time: string;
  mediaList?: { url: string; type: string }[];
  likes: number;
  comments: number; // Tổng số comment (có thể dùng để hiển thị ban đầu)
  shares: number;
  file?: UploadedFile;
  commentData?: CommentType[]; // Mảng dữ liệu comment thực tế
}

interface DetailPostModalProps {
  post: PostType;
  isOpen: boolean; // State để kiểm soát modal mở hay đóng
  onClose: () => void;
  currentUserAvatar: string; // Avatar của người dùng hiện tại để hiển thị ở ô comment
}

const DetailPostModal: React.FC<DetailPostModalProps> = ({
  post,
  isOpen,
  onClose,
  currentUserAvatar,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // State cho viewmore content
  const [newComment, setNewComment] = useState(""); // State cho input comment mới
  const [comments, setComments] = useState<CommentType[]>(
    post.commentData || []
  );

  // --- Thêm state để lưu ID của comment đang được reply ---
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
    null
  );

  const [isLiked, setIsLiked] = useState(false); // Cần logic để đồng bộ với state gốc hoặc fetch lại
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isShared, setIsShared] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.shares);
  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  //   ref  cho input new comment
  const commentInputRef = useRef<HTMLInputElement>(null);
  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  //   Handle reply comment
  const handleReply = (authorName: string, commentId: string) => {
    const nameWithoutSpaces = authorName.replace(/\s+/g, "");
    setNewComment(`@${nameWithoutSpaces} `);
    setReplyingToCommentId(commentId);
    focusCommentInput();
  };

  // Reset state khi modal đóng/mở hoặc post thay đổi
  useEffect(() => {
    if (isOpen) {
      setComments(post.commentData || []);
      setIsExpanded(false);
      setNewComment("");
      setReplyingToCommentId(null);
      setShowEmojiPicker(false);
      setLikesCount(post.likes);
      setSharesCount(post.shares);
      // setIsLiked(...) // Lấy trạng thái like thực tế
      // setIsShared(...) // Lấy trạng thái share thực tế
    }
  }, [isOpen, post]);

  // Đóng EmojiPicker khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiSelect = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
  };

  // Các hàm xử lý sự kiện cho like, share, comment
  const handlePostLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    // TODO: Gọi API like/unlike post
  };

  const handlePostShare = () => {
    setIsShared(!isShared);
    setSharesCount(isShared ? sharesCount - 1 : sharesCount + 1);
    // TODO: Gọi API share/unshare post
  };

  const addReplyToComment = (
    commentsArray: CommentType[],
    parentId: string,
    newReply: CommentType
  ): CommentType[] => {
    return commentsArray.map((comment) => {
      // Nếu tìm thấy comment cha ở cấp hiện tại
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply], // Thêm vào mảng replies (tạo mới nếu chưa có)
        };
      }
      // Nếu comment hiện tại có replies, tìm kiếm đệ quy trong đó
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, newReply), // Gọi đệ quy
        };
      }
      return comment;
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const newCommentData: CommentType = {
      id: `new-${Date.now()}`, // ID tạm thời
      author: {
        id: "currentUser",
        name: "Phan Giang đây",
        avatar: currentUserAvatar,
      }, // Thay bằng thông tin người dùng hiện tại
      text: newComment,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    };

    // TODO: Gọi API để gửi comment lên server
    console.log(
      "Submitting comment/reply:",
      newCommentData,
      "Replying to:",
      replyingToCommentId
    );

    if (replyingToCommentId) {
      const updatedComments = addReplyToComment(
        comments,
        replyingToCommentId,
        newCommentData
      );
      setComments(updatedComments);
    } else {
      setComments((prevComments) => [...prevComments, newCommentData]);
    }
    // Cập nhật UI (có thể đợi response từ API để chắc chắn)
    setNewComment("");
    setReplyingToCommentId(null);
    setShowEmojiPicker(false);
  };

  // Các hàm helper copy từ Post component (nếu chưa export)
  const getFileIcon = (fileType: string): string => {
    // Nên dùng fileType thay vì url để tránh lỗi
    if (fileType.includes("pdf")) return "/images/files/pdf-icon.png";
    if (fileType.includes("doc") || fileType.includes("docx"))
      return "/images/files/docx-icon.png";
    return "/images/files/file-icon.png";
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Media Viewer state (nếu muốn mở media từ modal)
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // show media
  const openMediaViewer = (index: number) => {
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
  };
  const closeMediaViewer = () => {
    setShowMediaViewer(false);
  };
  const gotoPreviousMedia = () => {
    setCurrentMediaIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };
  const gotoNextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      Math.min((post.mediaList?.length || 0) - 1, prevIndex + 1)
    );
  };
  const limitedMediaList = post.mediaList?.slice(0, 4);
  const hasMoreMedia = (post.mediaList?.length || 0) > 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Đóng modal khi click vào backdrop
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Ngăn click bên trong modal đóng modal
          >
            {/* Modal Header */}
            <div className="flex items-center p-4 border-b dark:border-gray-700">
              <h2 className="flex-1 text-center text-lg font-semibold text-gray-900 dark:text-gray-200 ">
                Post of {post.author.name}
              </h2>
              <button
                onClick={onClose}
                className=" text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <Link
                    href={`/profile/${post.author.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-10 h-10 relative rounded-full overflow-hidden border dark:border-gray-700">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="ml-2">
                    <Link href={`/profile/${post.author.id}`}>
                      <span className="font-medium text-gray-900 block dark:text-gray-300">
                        {post.author.name}
                      </span>
                    </Link>
                    <span className="text-gray-500 text-sm dark:text-gray-400">
                      {post.date} {post.time}
                    </span>
                  </div>
                </div>
                {/* Nút options (...) có thể thêm lại nếu cần */}
                {/* <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  //   onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                  <i className="fas fa-ellipsis-h"></i>
                </button> */}
              </div>

              {/* Post Content Text */}
              <div className="mb-3">
                <p className="text-gray-800 dark:text-gray-300">
                  {post.content === ""
                    ? post.fullContent
                    : isExpanded
                    ? post.fullContent || post.content
                    : post.content}
                  {post.content !== "" && post.fullContent && !isExpanded && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-primary hover:text-opacity-90 ml-1 text-sm font-medium"
                    >
                      Read more
                    </button>
                  )}
                </p>
              </div>

              {/* Post Media */}
              {post.mediaList && post.mediaList.length > 0 && (
                <div
                  className={`grid gap-2 mb-3 ${
                    post.mediaList.length === 1
                      ? "grid-cols-1"
                      : post.mediaList.length === 2
                      ? "grid-cols-2"
                      : post.mediaList.length === 3
                      ? "grid-cols-3 grid-rows-2"
                      : "grid-cols-2"
                  }`}
                >
                  {limitedMediaList?.map((media, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden cursor-pointer rounded-md border dark:border-gray-600 ${
                        (post.mediaList?.length || 0) === 3
                          ? index === 0
                            ? "col-span-2 row-span-2 aspect-[16/9]"
                            : "aspect-[16/9]"
                          : "aspect-[16/9]"
                      }`}
                      onClick={() => openMediaViewer(index)} // Option: Mở viewer từ modal
                    >
                      <div
                        className={`${
                          hasMoreMedia && index === 3 ? " opacity-30" : ""
                        }`}
                      >
                        {media.type === "image" ? (
                          <Image
                            src={media.url}
                            alt={`Post media ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : media.type === "video" ? (
                          <video
                            src={media.url}
                            controls
                            className="w-full h-full object-cover"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </div>
                      {hasMoreMedia && index === 3 && (
                        <div className="absolute inset-0 flex items-center justify-center text-black dark:text-white text-2xl font-bold bg-black bg-opacity-30">
                          + {(post.mediaList?.length || 0) - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Post File */}
              {post.file && (
                <div
                  className="mt-3 border dark:border-gray-600 rounded-md shadow-sm p-3 w-full flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => window.open(post.file?.url, "_blank")}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={getFileIcon(post.file.type)}
                      alt="File"
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-gray-200">
                      {post.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(post.file.size)}
                    </p>
                  </div>
                </div>
              )}

              {/* Post Actions (Like, Comment Count, Share) - Đơn giản hóa trong modal */}
              <div className="flex justify-between items-center pt-3 mt-3 border-t dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                <button
                  onClick={handlePostLike}
                  className={`flex items-center space-x-1 hover:text-opacity-80 ${
                    isLiked
                      ? "text-primary dark:text-pink-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <i className={`${isLiked ? "fas" : "far"} fa-thumbs-up`}></i>
                  <span>
                    {likesCount} {isLiked ? "Liked" : "Like"}
                  </span>
                </button>

                <button
                  onClick={focusCommentInput}
                  className="flex items-center space-x-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <i className="far fa-comment-alt"></i>
                  <span>{comments.length} Comments</span>
                </button>

                <button
                  onClick={handlePostShare}
                  className={`flex items-center space-x-1 hover:text-opacity-80 ${
                    isShared
                      ? "text-primary dark:text-pink-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <i className="fas fa-share"></i>
                  <span>
                    {sharesCount} {isShared ? "Shared" : "Share"}
                  </span>
                </button>
              </div>

              {/* === Phần hiển thị Comments === */}
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem
                      onReply={handleReply}
                      key={comment.id}
                      comment={comment}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
            {/* End Scrollable Content Area */}
            {/* === Phần nhập Comment === */}
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <form
                onSubmit={handleAddComment}
                className="flex items-center space-x-2"
              >
                {/* Avatar người dùng hiện tại */}
                <div className="w-8 h-8 relative rounded-full overflow-hidden flex-shrink-0 border dark:border-gray-600">
                  <Image
                    src={currentUserAvatar || "/images/default-avatar.png"} // Provide a fallback avatar
                    alt="Your avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Input */}
                <div className="flex-grow relative">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full border border-gray-300 rounded-full py-2 px-4 pr-16 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:placeholder-gray-400"
                  />
                  {/* Action of comment */}
                  {/* Emoji Icon */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      ref={emojiButtonRef} // Gán ref
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      type="button"
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <i
                        className={`far fa-smile ${
                          showEmojiPicker ? "text-primary" : ""
                        }`}
                      ></i>
                    </button>
                    <button
                      type="submit"
                      className="text-primary disabled:text-gray-400 disabled:cursor-not-allowed p-1 rounded-full hover:text-primary dark:hover:text-gray-500 "
                      disabled={newComment.trim() === ""}
                    >
                      <i className="fas fa-paper-plane  "></i>
                      {/* Send icon */}
                    </button>
                  </div>
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-full right-0 mb-2 z-20"
                    >
                      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    </div>
                  )}
                </div>
              </form>
            </div>
            {showMediaViewer && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
                <button
                  onClick={closeMediaViewer}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
                >
                  <i className="fas fa-times text-2xl"></i>
                </button>
                {currentMediaIndex > 0 && (
                  <button
                    onClick={gotoPreviousMedia}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-100"
                  >
                    <i className="fas fa-chevron-left text-2xl"></i>
                  </button>
                )}
                {currentMediaIndex < (post.mediaList?.length || 0) - 1 && (
                  <button
                    onClick={gotoNextMedia}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-100"
                  >
                    <i className="fas fa-chevron-right text-2xl"></i>
                  </button>
                )}
                <div className="relative w-4/5 h-4/5">
                  {post.mediaList && post.mediaList[currentMediaIndex] ? (
                    post.mediaList[currentMediaIndex].type === "image" ? (
                      <Image
                        src={post.mediaList[currentMediaIndex].url}
                        alt="Post media"
                        fill
                        className="object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <video
                        src={post.mediaList[currentMediaIndex].url}
                        controls
                        className="w-full h-full object-contain"
                        style={{ objectFit: "contain" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <p>No media to display</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailPostModal;
