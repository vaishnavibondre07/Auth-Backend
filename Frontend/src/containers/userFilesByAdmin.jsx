import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserFilesByAdminQuery } from "../api/profileApi";
import FileViewerModal from "../components/profile/FileViewerModal";

const UserFilesByAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

  const {
    data,
    isLoading,
    error,
  } = useGetUserFilesByAdminQuery(id);

  const files = data?.data?.files || [];
  const totalFiles = data?.data?.count || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg font-semibold text-gray-600">
          Loading Files...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg font-semibold text-red-500">
          Failed to load files
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-5 md:p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                User Uploaded Files
              </h1>

              <p className="text-gray-500 mt-1">
                View all files uploaded by this user
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-semibold text-center">
                Total Files: {totalFiles}
              </div>

              <button
                onClick={() => navigate("/admin")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
              >
                Back
              </button>

            </div>

          </div>

        </div>

        {/* Empty State */}
        {files.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <div className="text-6xl">
              📁
            </div>

            <h2 className="text-2xl font-bold text-gray-700 mt-4">
              No Files Found
            </h2>

            <p className="text-gray-500 mt-2">
              This user has not uploaded any files yet.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {files.map((file) => (

              <div
                key={file._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >

                {/* Top */}
                <div className="p-5">

                  <div className="flex items-center justify-between">

                    <div className="text-4xl">

                      {file.fileType?.startsWith("image")
                        ? "🖼️"
                        : file.fileType?.includes("pdf")
                        ? "📄"
                        : "📁"}

                    </div>

                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">

                      {file.fileType?.split("/")[1] || "FILE"}

                    </span>

                  </div>

                  <h3 className="mt-4 font-semibold text-gray-800 break-words line-clamp-2">

                    {file.originalName}

                  </h3>

                  <p className="text-sm text-gray-500 mt-2 break-all">

                    {file.fileType}

                  </p>

                  <p className="text-sm text-gray-500 mt-3">

                    Uploaded on{" "}
                    {new Date(file.createdAt).toLocaleDateString()}

                  </p>

                </div>

                {/* Footer */}
                <div className="border-t p-4">

                  <button
                    onClick={() => setSelectedFile(file)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition"
                  >
                    View File
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {selectedFile && (

        <FileViewerModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />

      )}

    </div>
  );
};

export default React.memo(UserFilesByAdmin);



// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetUserFilesByAdminQuery } from "../api/profileApi";
// import FileViewerModal from "../components/profile/FileViewerModal";

// const UserFilesByAdmin = () => {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [selectedFile, setSelectedFile] = useState(null);

//   const {
//     data,
//     isLoading,
//     error,
//   } = useGetUserFilesByAdminQuery(id);

//   console.log("User Files Data:", data);
//   console.log("count", data?.data?.count);
//   console.log("files", data?.data?.files);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading Files...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         Failed to load files
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6">

//       <div className="max-w-6xl mx-auto">

//         <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

//           <div>
//             <h1 className="text-3xl font-bold">
//               User Files
//             </h1>

//             <p className="text-gray-500">
//               Total Files: {data?.data?.count || 0}
//             </p>
//           </div>

//           <button
//             onClick={() => navigate("/admin")}
//             className="bg-blue-600 text-white px-5 py-3 rounded-xl"
//           >
//             Back
//           </button>

//         </div>

//         {data?.data?.files?.length === 0 ? (

//           <div className="bg-white rounded-2xl p-10 text-center shadow">

//             <div className="text-5xl">
//               📁
//             </div>

//             <h2 className="text-xl font-semibold mt-3">
//               No Files Found
//             </h2>

//           </div>

//         ) : (

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

//             {data?.data?.files?.map((file) => (

//               <div
//                 key={file._id}
//                 className="bg-white rounded-2xl shadow p-4"
//               >

//                 <div className="text-4xl mb-3">

//                   {file.fileType?.startsWith("image")
//                     ? "🖼️"
//                     : file.fileType?.includes("pdf")
//                     ? "📄"
//                     : "📁"}

//                 </div>

//                 <h3 className="font-semibold break-words">
//                   {file.originalName}
//                 </h3>

//                 <p className="text-sm text-gray-500 mt-1">
//                   {file.fileType}
//                 </p>

//                 <p className="text-sm text-gray-500 mt-2">
//                   {new Date(file.createdAt).toLocaleDateString()}
//                 </p>

//                 <button
//                   onClick={() => setSelectedFile(file)}
//                   className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
//                 >
//                   View File
//                 </button>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//       {selectedFile && (

//         <FileViewerModal
//           file={selectedFile}
//           onClose={() => setSelectedFile(null)}
//         />

//       )}

//     </div>
//   );
// };

// export default React.memo(UserFilesByAdmin);