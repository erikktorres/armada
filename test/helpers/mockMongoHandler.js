/*
== BSD2 LICENSE ==
Copyright (c) 2014, Tidepool Project

This program is free software; you can redistribute it and/or modify it under
the terms of the associated License, which is identical to the BSD 2-Clause
License as published by the Open Source Initiative at opensource.org.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the License for more details.

You should have received a copy of the License along with this program; if
not, you can obtain one from Tidepool Project at tidepool.org.
== BSD2 LICENSE ==
 */

'use strict';

var log;
var settings;

/*
  Handler CRUD opertaions via Mongo instance,
  takes testing config that allows the hadler to follow
  different paths.

  1) settings.throwErrors will throw errors so we can test that path
  2) settings.returnNone will return nothing so we can test nothing found
  3) other wise we just return dummy data

*/
var mockMongoHandler = function(testingConfig) {

  log = require('../../lib/log.js')('mockMongoHandler.js');
  settings = testingConfig;

  return {
    status : handleStatus,
    createGroup : handleCreateGroup,
    findGroupsMemberOf : handleFindGroupsMemberOf,
    addUserToGroup : handleAddUserToGroup,
    removeUserFromGroup : handleRemoveUserFromGroup,
    findGroup : handleFindGroup
  };

};

function handleStatus(callback){

  var dependencyStatus = { running: false, deps: { up: [], down: [] } };

  if (settings.throwErrors){
    dependencyStatus.deps.down = ['mongo'];
  }

  dependencyStatus.running = (dependencyStatus.deps.down.length === 0);
  dependencyStatus.statuscode = dependencyStatus.running ? 200 : 500;

  return callback(null,dependencyStatus);
}

function resolveCallbackValues(callback,data){

  if (settings.throwErrors){
    return callback(new Error('fake error'),null);
  }else if (settings.returnNone){
    //if expecting an array return empty array
    if( Object.prototype.toString.call( data ) === '[object Array]' ) {
      return callback(null,[]);
    }
    return callback(null,'');
  }

  return callback(null,data);
}

function handleFindGroup (groupId,callback) {
  log.debug('Find group[%j]', groupId);

  var foundGroup =
  {
    id: groupId,
    members: ['88665','5555','334555']
  };

  return resolveCallbackValues(callback,foundGroup);
}

function handleCreateGroup (group,callback) {
  log.debug('Create in mongo group[%j]', group);

  return resolveCallbackValues(callback,77777777777);
}

function handleFindGroupsMemberOf(userId,callback) {
  log.debug('Finding groups member of userid[%s]', userId);

  var memberGroups = [{
    id: '65587876679870098',
    members: [userId,'5555']
  },
  {
    id: '87987987987897987987',
    members: ['3343',userId]
  }];

  return resolveCallbackValues(callback,memberGroups);
}

function handleAddUserToGroup(groupId, userId, callback) {
  log.debug('Adding user[%s] to group[%s]', userId, groupId);

  var addUserToGroups =
  {
    id: '65587876679870098',
    members: ['88665','5555',userId]
  };

  return resolveCallbackValues(callback,addUserToGroups);
}

function handleRemoveUserFromGroup(groupId, userId,callback){
  log.debug('Removing user[%s] from group[%s]', userId, groupId);

  var removeFromGroups = {
    id: '65587876679870098',
    members: ['88665','5555']
  };

  return resolveCallbackValues(callback,removeFromGroups);
}


module.exports = mockMongoHandler;
