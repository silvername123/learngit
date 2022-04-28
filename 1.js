async function showAvatar() {
  //访问user.json
  let data1 = await fetch("/article/promise-chaining/user.json");
  // 请求回的数据进行json格式接受
  let data2 = await data1.json();
  //  获取到的data2数据为头像地址拼接后访问地址
  let getuser1 = await fetch(`https://api.github.com/users/${data2}`);
  //  返回的数据进行json格式接受
  let getuser2 = await getuser1.json();
  //  需要的数据已经请求完毕，则可以在页面进行渲染；
  let img = document.createElement("img");
  img.src = getuser2.url;
  img.className = "promise-avatar-example";
  // 添加 标签
  document.body.append(img);
  // 开始执行 setimeout 目的是能将 等待3秒
  await new Promise((res) => {
    setTimeout(res, 3000);
  });
  //上面等待3秒执行完才能进行remove操作
  img.remove();
  return getuser2;
}

async function loadjson1() {
  let data1 = await fetch("no-such-user.json");
  if (data1.status === 200) {
    return data1.json();
  } else {
    throw new Error(data1.status);
  }
}
loadjson1().catch(alert);

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = "HttpError";
    this.response = response;
  }
}
async function loadJson2(url) {
  let response = await fetch(url);
  if (response.status == 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}
async function demoGithubUser() {
  let name = prompt("Enter a name?", "iliakan");
  try {
    user = await loadJson(`https://api.github.com/users/${name}`);
  } catch (err) {
    if (err instanceof HttpError && err.response.status == 404) {
      alert("No such user, please reenter.");
    } else {
      throw err;
    }
  }
  alert(`Full name: ${user.name}.`);
  return user;
}

async function wait() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 10;
}
function f() {
  wait().then((value) => alert(value));
}
f();

// 写一个解构赋值语句使得：
// name 属性赋值给变量 name。
// years 属性赋值给变量 age。
// isAdmin 属性赋值给变量 isAdmin（如果属性缺失则取默认值 false）。
let user = {
  name: "John",
  years: 30,
};
let { name, years: age, isAdim = false } = user;
alert(name);
alert(age);
alert(isAdim);

let salaries = {
  John: 100,
  Pete: 300,
  Mary: 250,
};
const topSalary = (sar) => {
  if (sar === null) {
    return null;
  }
  let { a, b, c } = salaries;
  console.log(a, b, c);
  return sar;
};
