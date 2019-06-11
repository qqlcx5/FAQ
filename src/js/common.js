import {
  Message
} from 'element-ui';

let $msg = (text, type) => {
  Message({
    type: type,
    message: text,
    showClose: true
  });
};

let $formatDateTime = (date, type = 'time') => {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  var h = date.getHours();
  h = h < 10 ? '0' + h : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  var second = date.getSeconds();
  second = second < 10 ? '0' + second : second;
  if (type === 'date') {
    return y + '-' + m + '-' + d;
  }

  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

// 获取指定月份的天数
let $getDateCount = (date = new Date(), lately = 0) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1 - lately;
  let d = new Date(year, month, 0);
  return d.getDate();
};

//根据自然月的天数，计算最近月份的天数
let $getLatelyTotalDays = (date, lately) => {
  let totalDays = 0;
  for (let i = 0; i < lately; i++) {
    totalDays += $getDateCount(date, i);
  }
  return totalDays;
};
// 判断树结构中是否已存在名称
let $isRepeatNode = (treeData = [], name) => {
  if (!Array.isArray(treeData)) return console.error('treeData必须是一个数组');
  return treeData.some(item => {
    return item.data.name === name ? true : false;
  });
};

//深拷贝
let $deepClone = obj => {
  let result = typeof obj.splice === 'function' ? [] : {};
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        //如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
        result[key] = $deepClone(obj[key]);
      } else {
        //如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
        result[key] = obj[key];
      }
    }
    return result;
  }
  return obj;
};
let $checkRangeTime = (startTime, endTime) => {
  //把字符串格式转换为日期类
  let startTimeNew = new Date(Date.parse(startTime));
  let endTimeNew = new Date(Date.parse(endTime));
  if (endTimeNew >= startTimeNew) {
    return true;
  }
  return false;
};

let $debounce = function (method, delay = 2000) {
  let timer = null;

  return () => {
    method;
    clearTimeout(timer);
    timer = setTimeout(method, delay);
  }
}
let $escape2Html = (str) => {
  if (!str) return;
  var arrEntities = {
    lt: "<",
    gt: ">",
    nbsp: " ",
    amp: "&",
    quot: '"'
  };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
}

let $submitForm = function (_self, _form) {
  let self = _self,
    form = _form;
  return new Promise(function (resolve) {
    self.$refs[form].validate(valid => {
      if (valid) resolve();
    });
  });
}

let $multipleSelection = function (ids) { //表格多选框
  this.multipleSelection = ids.map(({
    id
  }) => {
    return {
      id
    };
  });
}
let $getBase64 = function getBase64(file) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = function () {
      imgResult = reader.result;
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(imgResult);
    };
  });
}

export {
  $msg,
  $formatDateTime,
  $getDateCount,
  $getLatelyTotalDays,
  $isRepeatNode,
  $deepClone,
  $checkRangeTime,
  $escape2Html,
  $debounce,
  $submitForm,
  $getBase64
};