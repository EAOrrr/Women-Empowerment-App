// 定时任务脚本
const cron = require('node-cron') // 引入定时任务模块
const { sequelize } = require('./db') // 引入数据库连接

// 每天午夜清理数据库中没有引用的图片
cron.schedule('0 2 * * *', async () => {
  try {
    // 清理没有引用的图片的逻辑
    const result = await sequelize.query('DELETE FROM images WHERE reference_id IS NULL');
    console.log(`Removed ${result.rowCount} unused images.`);
  } catch (err) {
    console.error('Error during scheduled image cleanup:', err);
  }
})
