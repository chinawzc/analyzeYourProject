import analyze from "./analyze.js";
import projects from "./config.js";
import { promisify } from "util";
import { queryLastCommitOfDay } from "./gitlab.js";
import areas from './month.js';


const queryCommit = promisify(queryLastCommitOfDay);

// 获取当月最后一次提交的代码行数、文件数
async function calcMonthEndCommit(time, project) {
    const commits = await queryCommit(project.id, time.startTime, time.endTime);
    const endCommit = commits[0]; // 给定一个范围取最后一次commit，避免最后那几天没有commit的情况
    const endRes = await analyze(project, endCommit.id);

    const commit = {
        month: time.month,
        fileCount: endRes[0],
        codeLines: endRes[1],
    }
    return commit;
}

// 计算最近12个月的代码变化
async function getInfo(project, projectName) {
    let arr = [];
    for (let index = 0; index < areas.length; index++) {
        const item = areas[index];
        const res = await calcMonthEndCommit(item, project);
        arr = [...arr, res];
        const len = arr.length;
        if(len > 1) {
            const next = arr[len - 1]; // 下一月
            const pre = arr[len - 2]; // 前一月
            arr[len - 2].addCount = pre.fileCount - next.fileCount;  // 前一月增加的代码文件数
            arr[len - 2].addLines = pre.codeLines - next.codeLines;  // 前一月增加的代码行数
            console.log(`${projectName}：`, `${pre.month} 新增代码行数为：${arr[len - 2].addLines}，新增文件数为：${arr[len - 2].addCount}`);
        }
    }
    return arr;
}

// 循环 project
async function getProject() {
    for (let project in projects) {
        const pro = await getInfo(projects[project], project);
        console.log(`${project}最近12个月代码情况：`, pro.slice(0, pro.length - 1).reverse().map(item => JSON.stringify(item)))
    }
}

getProject();
