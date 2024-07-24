const tryCatch = (controller) => {
  return async (req, res) => {
    try {
      await controller(req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra sự cố! Hãy thử lại sau',
      })
    }
  }
}

export default tryCatch
