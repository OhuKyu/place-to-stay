const tryCatch = (controller) => {
    return async (req, res) => {
      try {
        await controller(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: 'Đã có lỗi xảy ra! Xin vui lòng thử lại sau',
        });
      }
    };
  };
  
  export default tryCatch;