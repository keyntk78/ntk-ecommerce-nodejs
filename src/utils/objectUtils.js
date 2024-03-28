const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds)
}

const convertToObjectDbMongodb = (id) => Types.ObjectId(id)

//['a', 'b'] => {a:1, b:1}
const getSelectData = (select = []) => {
  return select.reduce((obj, key) => {
    obj[key] = 1
    return obj
  }, {})
}
//['a', 'b'] => {a:0, b:0}
const unGetSelectData = (select = []) => {
  return select.reduce((obj, key) => {
    obj[key] = 0
    return obj
  }, {})
}

const removeUnderfinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      delete obj[key]
    }
  })

  return obj
}
const updateNestedObjectPaser = (obj) => {
  const final = {}
  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      const result = updateNestedObjectPaser(obj[key])
      Object.keys(result).forEach((a) => {
        final[`${key}.${a}`] = result[a]
      })
    } else {
      final[`${key}`] = obj[key]
    }
  })
  console.log(final)
  return final
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUnderfinedObject,
  updateNestedObjectPaser,
  convertToObjectDbMongodb
}
