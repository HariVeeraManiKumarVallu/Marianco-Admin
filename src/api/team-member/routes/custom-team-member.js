'use strict';

module.exports = {
  routes: [
    { method: 'GET', path: '/team-members', handler: 'team-member.find', config: { auth: false } },
    { method: 'GET', path: '/team-members/:id', handler: 'team-member.findOne', config: { auth: false } }
  ]
};