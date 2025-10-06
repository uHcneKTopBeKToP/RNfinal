export const uploadPhotoToCloudinary = async (base64Photo: string) => {
  const CLOUD_NAME = 'dkonrofjr';
  const UPLOAD_PRESET = 'violations_folder';

  const data = new FormData();
  data.append('file', `data:image/jpeg;base64,${base64Photo}`);
  data.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    return json.secure_url; // вернёт URL загруженной картинки
  } catch (error) {
    console.log('Cloudinary upload error:', error);
    return null;
  }
};
