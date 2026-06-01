export default class ApiResponse {
  static success(
    res,
    data = null,
    message = "Success"
  ) {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  static created(
    res,
    data = null,
    message = "Created"
  ) {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }

  static deleted(
    res,
    message = "Deleted"
  ) {
    return res.status(200).json({
      success: true,
      message
    });
  }
}