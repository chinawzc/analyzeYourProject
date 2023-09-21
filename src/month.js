import moment from 'moment';

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const getMonthEnd = (num) => moment().add( 0 - num, 'M').endOf('month');
const getPreDay = (day) => day.subtract(10, "days"); // 防止多天没有commit，给个10天兜底

const dayTime = months.map(item => getMonthEnd(item).toISOString());



const dayTimes = dayTime.map(item => {
    return {
        month: moment(item).format('YY年MM月'),
        sinceTime: getPreDay(moment(item)).toISOString(),
        untilTime: item,
    }
});

export default dayTimes;

// 获取时间节点 用来获取commit