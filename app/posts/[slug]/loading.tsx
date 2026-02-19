const PostLoading = () => {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div
        className="
          size-8 animate-spin rounded-full border-4 border-gray-200
          border-t-gray-800
          dark:border-gray-700 dark:border-t-gray-200
        "
      />
    </div>
  );
};

export default PostLoading;
