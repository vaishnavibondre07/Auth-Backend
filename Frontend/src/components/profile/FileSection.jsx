import React from "react";

const FileSection = ({
  files,
  loading,
  onUpload,
  onDelete,
  onView,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mt-6 sm:mt-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            My Files
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Upload and manage your files. You can view or delete your files anytime.
          </p>
        </div>

        <div className="w-full sm:w-auto">

          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={onUpload}
          />

          <label
            htmlFor="fileUpload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition font-medium min-h-[44px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0-12l-4 4m4-4l4 4"
              />
            </svg>

            Upload File
          </label>

        </div>

      </div>

      {/* FILE LIST */}
      <div className="mt-6">

        {loading ? (

          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

        ) : files?.length === 0 ? (

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center">

            <div className="text-5xl">
              📁
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No files uploaded yet
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Upload your first file to manage it here.
            </p>

          </div>

        ) : (

          <>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-50 border border-gray-200">

                    <th className="text-left px-4 py-3 text-gray-700 font-semibold">
                      File
                    </th>

                    <th className="text-left px-4 py-3 text-gray-700 font-semibold">
                      Uploaded
                    </th>

                    <th className="text-left px-4 py-3 text-gray-700 font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {files?.map((file) => (

                    <tr
                      key={file._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">

                            {file.fileType?.startsWith("image")
                              ? "🖼️"
                              : file.fileType?.includes("pdf")
                              ? "📄"
                              : "📁"}

                          </div>

                          <div>

                            <p className="font-medium text-gray-800">
                              {file.originalName ||
                                file.public_id?.split("/").pop()}
                            </p>

                            <p className="text-xs text-gray-500">
                              {file.fileType}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() => onView(file)}
                            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => onDelete(file._id)}
                            className="border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-4">

              {files?.map((file) => (

                <div
                  key={file._id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm"
                >

                  <div className="flex gap-3">

                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">

                      {file.fileType?.startsWith("image")
                        ? "🖼️"
                        : file.fileType?.includes("pdf")
                        ? "📄"
                        : "📁"}

                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="font-semibold text-gray-800 break-words">
                        {file.originalName ||
                          file.public_id?.split("/").pop()}
                      </p>

                      <p className="text-sm text-gray-500 break-all">
                        {file.fileType}
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        Uploaded:{" "}
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">

                    <button
                      onClick={() => onView(file)}
                      className="bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onDelete(file._id)}
                      className="border border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default React.memo(FileSection);

