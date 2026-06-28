const express = require('express');
const bookController = require('./../controllers/bookController');
const authController=require('./../controllers/authController')

const router = express.Router();

// router.param('id',bookController.checkID)

router
  .route('/best-seller')
  .get(bookController.aliasTopBooks, bookController.getAllBooks);

router.route('/stats-by-genre').get(bookController.getBookStats);

router.route('/popular-tags').get(bookController.popularTags);

router
  .route(`/`)
  .get(authController.protect,bookController.getAllBooks)
  .post(bookController.createBook);
router
  .route(`/:id`)
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
