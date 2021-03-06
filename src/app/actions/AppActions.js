var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Api = require('../utils/Api');

var AppActions = {

  getInfo: function() {
    Api.get('/info', null, AppConstants.GET_INFO);
  }
};

module.exports = AppActions;