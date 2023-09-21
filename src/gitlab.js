import https from "https";

const JENKINS_TOKEN = 'xxxx'; // 去gitlab生成一下

export function queryLastCommitOfDay(projectId, since, until, cb) {
    let result = ''
    https.get({
        headers: {
            "PRIVATE-TOKEN": JENKINS_TOKEN
        },
        host: 'xxx',  // 你司的gitlab地址
        path: `/api/v4/projects/${projectId}/repository/commits?since=${since}&until=${until}&ref_name=master&per_page=500`,
    },(res)=>{
        res.on('data',data=>{
            result += data.toString()
        })
        res.on('end',(res)=>{
            const commits = JSON.parse(result)
            cb(null,commits)
        })
    }).on('error',err => {
        console.log(err)
        cb(err,null)
    })
}