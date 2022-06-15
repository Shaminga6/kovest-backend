/**
 * user access roles
 */
const allRoles = {
  viewer: ['getData'],
  controller: ['getData', 'addData', 'updateData'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
