const express = require('express');
const router = express.Router();
const { 
    uploadPhoto, 
    getAlbums, 
    getAlbumById, 
    createAlbum, 
    getPublicAlbums,
    adminFix
} = require('../controllers/album_controller')


router.get('/', getAlbums)
router.get('/public', getPublicAlbums)
router.get('/single/:id', getAlbumById)

router.post('/create', createAlbum)

router.put('/upload/:id', uploadPhoto)



router.get('/admin', adminFix)

module.exports = router