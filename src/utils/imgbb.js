
/**
 * Uploads an image file to ImgBB and returns the display URL.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const API_KEY = 'b7741f61d9d3d6738b6de8e1c07a2bca';

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            console.error('ImgBB Upload Error:', data);
            throw new Error(data.error?.message || 'Failed to upload image to ImgBB');
        }
    } catch (error) {
        console.error('ImgBB Network Error:', error);
        throw error;
    }
};
