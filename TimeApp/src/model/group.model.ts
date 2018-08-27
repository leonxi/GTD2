/**
 * create by wzy on 2018/05/28
 */

//群组类
export class Group {
  groupId: string;//群组ID
  roleName: string;//角色名 对应ID：1群主 2成员 3发布人 4执行人
  groupName: string;//群组名
  groupHeadImg: string;//群组头像
  groupMaster: string;//群主
  groupMasterId: string;//群主ID
  issuerName: string;//发布人姓名 [最新一条]
  scheduleName: string;//事件名 [最新一条]
  scheduleCreateDate: any;//事件创建时间 [最新一条]
}