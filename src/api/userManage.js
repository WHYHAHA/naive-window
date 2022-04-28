import request from '../utils/request'

const userApi = {
  userManageList: '/ms-tenant-consummer/user/{version}/getUserList',
  userDetail: '/ms-tenant-consummer/user/{version}/getUserByid',
  userRegister: '/ms-tenant-consummer/user/{version}/createUser',
  usersAll: '/ms-tenant-consummer/user/{version}/getUserList',
  updateUser: '/ms-tenant-consummer/user/{version}/updateUser',
  updateUserAvaliable: '/ms-tenant-consummer/user/{version}/updateUserAvaliable',

  departmentList: '/ms-tenant-consummer/dept/{version}/getSysDeptList',
  departmentAll: "/ms-tenant-consummer/dept/{version}/getDeptByTid",
  addDepartment: '/ms-tenant-consummer/dept/{version}/createDept',
  updateDepartment: '/ms-tenant-consummer/dept/{version}/updateDept',
  deleteDepartment: '/ms-tenant-consummer/dept/{version}/deleteDept',


  roleAll: '/ms-tenant-consummer/role/{version}/getRoleListByTid',
  addRole: '/ms-tenant-consummer/role/{version}/create',
  updateRole: '/ms-tenant-consummer/role/{version}/updateRole',
  deleteRole: '/ms-tenant-consummer/role/{version}/deleteRole',
  roleApps: '/ms-tenant-consummer/role/{version}/getAppListByRole',
  appMenu: '/ms-tenant-consummer/permission/{version}/getMenuList',
  appRules: '/ms-tenant-consummer/permission/{version}/getOperationList',
  addAppsList: '/ms-tenant-consummer/role/{version}/showAppListByRole',
  saveAddApps: '/ms-tenant-consummer/permission/{version}/givePermissonToApp',
  deleteApp: '/ms-tenant-consummer/permission/{version}/removeAppPermissonWithRole',
  savePermission: '/ms-tenant-consummer/permission/{version}/updatePermission',
  getDormAll: "/ms-masterdata-consummer/pmPigDorm/{version}/getFarmidAndDormList"
}

/* 用户开始 */
//获取用户列表 
export function getUserManageListApi(parameter) {
  return request({
    url: userApi.userManageList,
    method: 'get',
    params: parameter
  })
}
//获取全部用户
export function getUsersAllApi(parameter) {
  return request({
    url: userApi.usersAll,
    method: 'get',
    params: parameter
  })
}
//获取全部栋舍
export function getDormAllApi(parameter) {
  return request({
    url: userApi.getDormAll,
    method: 'get',
    params: parameter
  })
}


// 获取用户信息
export function getUserDetailApi(parameter) {
  return request({
    url: userApi.userDetail,
    method: 'get',
    params: parameter
  })
}

// 注册用户
export function userRegisterApi(data) {
  return request({
    url: userApi.userRegister,
    method: 'post',
    data: data
  })
}

// 修改用户信息
export function updateUserApi(data) {
  return request({
    url: userApi.updateUser,
    method: 'post',
    data: data
  })
}
// 修改用户 启用停用
export function updateUserAvaliableApi(data) {
  return request({
    url: userApi.updateUserAvaliable,
    method: 'post',
    data: data
  })
}


/* 用户结束 */



/* 部门分组开始 */

// 获取部门分组列表
export function getDepartmentListApi(parameter) {
  return request({
    url: userApi.departmentList,
    method: 'get',
    params: parameter
  })
}
// 获取所有上级
export function getDepartmentAllApi(parameter) {
  return request({
    url: userApi.departmentAll,
    method: 'get',
    params: parameter
  })
}
// 添加部门
export function postAddDepartmentApi(data) {
  return request({
    url: userApi.addDepartment,
    method: 'post',
    data: data
  })
}
// 修改部门
export function postUpdateDepartmentApi(data) {
  return request({
    url: userApi.updateDepartment,
    method: 'post',
    data: data
  })
}
// 删除部门
export function deleteDepartmentApi(data) {
  return request({
    url: userApi.deleteDepartment,
    method: 'delete',
    data: data
  })
}

/* 部门分组结束 */


/* 角色开始 */
// 获取角色列表
export function getRoleAllApi(parameter) {
  return request({
    url: userApi.roleAll,
    method: 'get',
    params: parameter
  })
}
// 添加角色
export function postAddRoleApi(data) {
  return request({
    url: userApi.addRole,
    method: 'post',
    data: data
  })
}
// 修改角色
export function postUpdateRoleApi(data) {
  return request({
    url: userApi.updateRole,
    method: 'post',
    data: data
  })
}
// 删除部门
export function deleteRoleApi(data) {
  return request({
    url: userApi.deleteRole,
    method: 'delete',
    data: data
  })
}

// 获取角色应用
export function getRoleAppsApi(parameter) {
  return request({
    url: userApi.roleApps,
    method: 'get',
    params: parameter
  })
}
// 获取应用对应菜单
export function getAppMenuApi(parameter) {
  return request({
    url: userApi.appMenu,
    method: 'get',
    params: parameter
  })
}

// 获取菜单对应权限
export function getAppRulesApi(parameter) {
  return request({
    url: userApi.appRules,
    method: 'get',
    params: parameter
  })
}

// 获取添加菜单时的列表
export function getAddAppsListApi(parameter) {
  return request({
    url: userApi.addAppsList,
    method: 'get',
    params: parameter
  })
}
// 对用户添加app
export function saveAddAppsApi(data) {
  return request({
    url: userApi.saveAddApps,
    method: 'post',
    data: data
  })
}
// 对用户删除单个app
export function deleteAppApi(data) {
  return request({
    url: userApi.deleteApp,
    method: 'delete',
    data: data
  })
}
// 保存权限
export function savePermissionApi(data) {
  return request({
    url: userApi.savePermission,
    method: 'post',
    data: data
  })
}
/* 角色结束 */
