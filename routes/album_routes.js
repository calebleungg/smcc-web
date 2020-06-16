const express = require('express');
const router = express.Router();
const { 
    uploadPhoto, 
    getAlbums, 
    getAlbumById, 
    createAlbum, 
    getPublicAlbums,
    adminFix,
    deleteAlbumById,
    deletePhotoById
} = require('../controllers/album_controller')
const { isAdmin } = require('../utils/common_utilities')


router.get('/', getAlbums)
router.get('/public', getPublicAlbums)
router.get('/single/:id', getAlbumById)

router.post('/create', isAdmin, createAlbum)

router.put('/upload/:id', isAdmin, uploadPhoto)

router.delete('/delete/:id', isAdmin, deleteAlbumById)
router.delete('/photo/:id', isAdmin, deletePhotoById )



// router.get('/admin', adminFix)

module.exports = router