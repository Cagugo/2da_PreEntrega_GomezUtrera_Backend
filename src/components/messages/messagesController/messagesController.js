const MessagesServices = require('../messagesServices/messagesServices');

class MessagesController {
  addUserMessage = async (req, res, next) => {
    const payload = req.body;
    return await MessagesServices.addUserMessage(payload, res);
  };
  getAllMessages = async (req, res, next) => {
    return await MessagesServices.getAllMessages(res);
  };
  deleteUserMessage = async (req, res, next) => {
    const { mid } = req.params;
    return await MessagesServices.deleteUserMessage(mid, res, req);
  };
}
module.exports = new MessagesController();
