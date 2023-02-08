'use strict';
const Service = require('egg').Service;
const { tableEnum, articlePublishStatusEnum } = require("../constant/constant");
const _ = require("lodash");
const path = require("path");

// TODO: 封装一下
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");
const fs = require("fs"),
    fsPromises = require("fs").promises,
    unlink = fsPromises.unlink,
    rename = fsPromises.rename,
    util = require("util"),
    exists = util.promisify(fs.exists);

class WorkflowService extends Service {

  /**
   * 创建流程审批
   */
  async createWorkflowTask() {
    const { actionData } = this.ctx.request.body.appData;
    const { jianghuKnex } = this.app;
    const { group, formItemList, taskUserList } = actionData;
    const { userId, username } = this.ctx.userInfo;
    
    let workflow = await jianghuKnex(tableEnum.workflow, this.ctx).where({workflowId: '6D7HV6Twfer_xtmbqUsDO'}).first();
    if(!workflow) {
      throw new BizError(errorInfoEnum.workflow_not_found);
    }
    const workflowPersonList = JSON.parse(workflow.workflowConfig).nodeList
    const workflowConfigCustom = workflowPersonList.filter(item=> item.id.includes('userTask-'));
    workflowConfigCustom.forEach(item => {
      item.assignValue = taskUserList;
    })
    actionData.workflowConfigCustom = JSON.stringify({nodeListOfUserTaskNode: workflowConfigCustom});
    actionData.workflowId = workflow.workflowId;
    actionData.taskTitle = `[${group}]${username}`;
    actionData.workflowForm = formItemList;
    const formData = {};
    formItemList.forEach(item => {
      formData[item.statement] = item.answer;
    })
    actionData.workflowFormData = formData;
    await this.ctx.service.task.createTask()
  }
  /**
   * 获取节点审批历史
   * @returns 
   */
  async getTaskHistory() {
    const { taskId } = this.ctx.request.body.appData.actionData;
    const { jianghuKnex } = this.app;

    const taskInfo = await jianghuKnex(tableEnum.task, this.ctx).where({taskId}).first();
    const taskHistoryList = await jianghuKnex(tableEnum.task_history).where({taskId: taskInfo.taskId}).orderBy('id', 'asc').select();
    // const userList = await jianghuKnex(tableEnum._view01_user).whereIn('userId', taskInfo.taskViewUserList.split(',')).select();
    // taskInfo.workflowConfig = JSON.parse(taskInfo.workflowConfig);
    // return this.ctx.service.task.getTaskHistoryConfigList(taskInfo.workflowConfig, taskHistoryList, userList);
    const lineTypeList = taskInfo.taskLineTypeList;
    return {taskHistoryList, lineTypeList};
  }
}
module.exports = WorkflowService;
