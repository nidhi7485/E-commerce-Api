const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')

const createReview = async (req, res) => {
  res.send('create review')
}
const getAllReview = async (req, res) => {
  res.send('get all review')
}
const getSingleReview = async (req, res) => {
  res.send('get single review')
}
const updateReview = async (req, res) => {
  res.send('update review')
}
const deleteReview = async (req, res) => {
  res.send('delete review')
}

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
}
