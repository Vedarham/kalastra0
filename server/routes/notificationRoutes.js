import express from "express"

const router = express.Router();

router.get('/',getNotifications);
router.put('/read-all',markAllAsRead);
router.put('/:id/read',markAsRead);
router.delete('/:id',deleteNotification);

export default router;