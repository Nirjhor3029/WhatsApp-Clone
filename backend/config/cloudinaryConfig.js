const multer = require('multer')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
// const dotenv = require('dotenv')
// dotenv.config()

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const uploadFileToCloudinary = (file) => {

    const isVideo = file.mimetype.startsWith('video');
    const options = {
        resource_type: isVideo ? 'video' : 'image',
        // folder: 'your_folder_name', // Optional: specify a folder in Cloudinary
    }

    return new Promise((resolve, reject) => {
        const uploader = isVideo
            ? cloudinary.uploader.upload_large
            : cloudinary.uploader.upload;

        uploader(file.path, options, (error, result) => {
            // Delete the local file after upload
            fs.unlink(file.path, (err) => {
                if (err) console.error("File delete failed:", err)
            });

            if (error) return reject(error)
            resolve(result)
        });
    });

    // return new Promise((resolve, reject) => {
    //     cloudinary.uploader.upload(filePath, {
    //         folder: folder,
    //     }, (error, result) => {
    //         // Delete the local file after upload
    //         fs.unlinkSync(filePath)
    //         if (error) {
    //             reject(error)
    //         } else {
    //             resolve(result)
    //         }
    //     })
    // })
}



// Export the configured Cloudinary instance
module.exports = cloudinary
