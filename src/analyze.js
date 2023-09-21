import { exec as _exec } from "child_process";
import { promisify } from 'util';

const exec = promisify(_exec)
export async function checkout(project,commit) {
    return  exec([`cd ${project.path}`,`git checkout ${commit}`,].join('&&'))
}


export default async function analyze(project, commit) {
    await checkout(project, 'master');
    await checkout(project, commit)
    const {stdout} = await exec(`~/work/analyze/scc/scc -f json ${project.src}`)
    const result = JSON.parse(stdout)
    const res = result.reduce((pre,cur)=>{
        return [pre[0]+cur.Count,pre[1]+cur.Lines]
    },[0,0])
    await checkout(project, 'master');
    return res
}


// result值
//  {
//     Name: 'JavaScript',
//     Bytes: 32364209,
//     CodeBytes: 0,
//     Lines: 858955,   代码行数
//     Code: 748857,    代码行数
//     Comment: 47206,   注释行数
//     Blank: 62892,    空格行数
//     Complexity: 74653,
//     Count: 4744,      文件数
//     WeightedComplexity: 0,
//     Files: []
//   },