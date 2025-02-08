import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import config from '../config'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
})

export const sendImageToCloudinary = (
    imageName: string,
    path: string,
): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imageName.trim() },
            function (error, result) {
                if (error) {
                    reject(error)
                }
                resolve(result as UploadApiResponse)
            },
        )
    })
}

const storage = new CloudinaryStorage({
    cloudinary,
})

export const upload = multer({ storage: storage })
