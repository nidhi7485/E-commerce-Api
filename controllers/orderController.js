const getAllOrder = async (req, res) => {
  res.send('get all order')
}
const getSingleOrder = async (req, res) => {
  res.send('get single order')
}
const getCurrentUserOrder = async (req, res) => {
  res.send('get current user order')
}
const createOrder = async (req, res) => {
  res.send('create order')
}
const updateOrder = async (req, res) => {
  res.send('update order')
}

module.exports = {
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
}
