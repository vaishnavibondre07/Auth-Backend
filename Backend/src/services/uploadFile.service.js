import cloudinary from "../config/cloudinary.js";

export const uploadFile = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "auth-app",
        resource_type: "auto", // important
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        console.log(result);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(buffer);
  });
};


// import cloudinary from "../config/cloudinary.js"

// export const uploadFile = (buffer) => {

//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//             {folder : "auth-app"},
//             (error, result) => {
//                 if(error) reject(error);

//                 console.log(result);
                
//                 resolve({
//                     url: result.secure_url,
//                     public_id: result.public_id,
//                 })
//             }

//         ).end(buffer)
//     });
// };