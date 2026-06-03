import React from "react";

const FileViewerModal = ({
  file,
  onClose,
}) => {

  console.log("FileViewerModal Rendered with file:", file);

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-5 py-4">

          <h2 className="font-semibold text-gray-800 truncate">

            {file.public_id
              ?.split("/")
              ?.pop()}

          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        {/* CONTENT */}
        <div className="h-[80vh] overflow-auto bg-gray-100 flex items-center justify-center">

          {/* IMAGE */}
          {file.fileType?.startsWith(
            "image"
          ) && (

            <img
              src={file.url}
              alt=""
              className="max-w-full max-h-full object-contain"
            />

          )}

          {/* PDF */}
          {file.fileType?.includes(
            "pdf"
          ) && (

            <embed
              src={file.url}
              title="PDF Viewer"
              className="w-full h-full"
            />

          )}

          {/* OTHER FILES */}
          {!file.fileType?.startsWith(
            "image"
          ) &&
            !file.fileType?.includes(
              "pdf"
            ) && (

              <div className="text-center p-10">

                <div className="text-6xl">
                  📁
                </div>

                <p className="mt-4 text-gray-600">
                  Preview not available for this file type
                </p>

                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl"
                >
                  Open File
                </a>

              </div>

            )}

        </div>

      </div>

    </div>
  );
};

export default React.memo(
  FileViewerModal
);