import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'urbyn/issues',
    resource_type: 'image'
  });

  res.json({ url: result.secure_url, publicId: result.public_id });
};
