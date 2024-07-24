const checkAccess = (permission) => {
  return async (req, res, next) => {
    if (permission.roles.includes(req.user?.role)) return next()
    if (!permission?.owner)
      return res
        .status(401)
        .json({ success: false, message: 'Truy cập bị từ chối!' })
    const isOwner = await permission.owner(req)
    if (isOwner === true) return next()
    if (isOwner === false)
      return res
        .status(401)
        .json({ success: false, message: 'Truy cập bị từ chối!' })
    res
      .status(500)
      .json({
        success: false,
        message: 'Đã xảy ra sự cố! Hãy thử lại sau',
      })
  }
}

export default checkAccess;
