'use strict';

class BizError extends Error {
  constructor({ errorCode, errorReason, errorReasonSupplement }) {
    super(JSON.stringify({ errorCode, errorReason, errorReasonSupplement }));
    this.name = 'BizError';
    this.errorCode = errorCode;
    this.errorReason = errorReason;
    this.errorReasonSupplement = errorReasonSupplement;
  }
}

const errorInfoEnum = {
  data_exception: { errorCode: 'data_exception', errorReason: '数据异常' },
  workflow_not_found: { errorCode: 'work_flow_not_found', errorReason: '流程不存在' },
  task_not_found: { errorCode: 'task_not_found', errorReason: '任务不存在' },
  node_not_found: { errorCode: 'node_not_found', errorReason: '节点不存在' },
  line_not_found: { errorCode: 'line_not_found', errorReason: '线路不存在' },
  line_hook_error: { errorCode: 'line_hook_error', errorReason: '线路Hook异常' },
  purchase_order_not_found: { errorCode: 'purchase_order_not_found', errorReason: '采购单不存在' },
  workflow_not_found: { errorCode: 'workflow_not_found', errorReason: '流程不存在' },
};

module.exports = {
  BizError,
  errorInfoEnum,
};
